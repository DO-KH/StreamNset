// /lib/authOptions.ts
import { NextAuthOptions } from "next-auth";
import type { JWT } from "next-auth/jwt";
import GoogleProvider from "next-auth/providers/google";

interface ExtendedToken extends JWT {
  accessToken: string;
  refreshToken: string;
  accessTokenExpires: number;
  error?: string;
}

async function refreshAccessToken(token: ExtendedToken): Promise<ExtendedToken> {
  try {
    const response = await fetch("https://oauth2.googleapis.com/token", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        client_id: process.env.GOOGLE_CLIENT_ID!,
        client_secret: process.env.GOOGLE_CLIENT_SECRET!,
        grant_type: "refresh_token",
        refresh_token: token.refreshToken!,
      }),
    });

    const refreshedTokens = await response.json();

    if (!response.ok) throw refreshedTokens;

    return {
      ...token,
      accessToken: refreshedTokens.access_token,
      accessTokenExpires: Date.now() + refreshedTokens.expires_in * 1000,
      refreshToken: refreshedTokens.refresh_token ?? token.refreshToken, // 일부 provider는 refresh_token을 재발급하지 않음
    };
  } catch (error) {
    console.error("Error refreshing access token", error);
    return { ...token, error: "RefreshAccessTokenError" };
  }
}

interface GoogleOAuthAccount {
  access_token: string;
  refresh_token: string;
  expires_in: number;
  id_token?: string;
  provider?: string;
}



export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      authorization: {
        url: "https://accounts.google.com/o/oauth2/auth",
        params: {
          scope: "openid email profile https://www.googleapis.com/auth/youtube.readonly",
          access_type: "offline", // refresh_token 요청
          response_type: "code",
          prompt: "consent", // 항상 refresh_token을 받기 위해 필요
        },
      },
    }),
  ],

  callbacks: {
    async jwt({ token, account }) {
      const googleAccount = account as unknown as GoogleOAuthAccount
      const extendedToken = token as ExtendedToken
      // 초기 로그인 시
      if (account) {
        return {
          accessToken: googleAccount.access_token,
          accessTokenExpires: Date.now() + googleAccount.expires_in * 1000,
          refreshToken: googleAccount.refresh_token,
          user: token.user,
        } satisfies ExtendedToken
      }

      // accessToken 아직 유효하다면 그대로 유지
      if (Date.now() < (token.accessTokenExpires as number)) {
        return extendedToken;
      }

      // accessToken 만료 → refresh
      return await refreshAccessToken(extendedToken);
    },

    async session({ session, token }) {
      session.accessToken = token.accessToken as string;
      session.error = token.error as string;
      return session;
    },
  },
};
