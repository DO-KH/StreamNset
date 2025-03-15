import { DefaultSession, DefaultUser } from "next-auth";

declare module "next-auth" {
  interface Session extends DefaultSession {
    accessToken: string; // ✅ 확실하게 `accessToken`이 존재한다고 지정
    idToken?: string;
  }

  interface User extends DefaultUser {
    accessToken?: string;
  }

  interface Account {
    access_token?: string;
  }
}