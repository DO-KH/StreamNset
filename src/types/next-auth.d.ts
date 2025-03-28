import { DefaultSession, DefaultUser } from "next-auth";

declare module "next-auth" {
  interface Session extends DefaultSession {
    accessToken: string;
    idToken?: string;
  }

  interface User extends DefaultUser {
    accessToken?: string;
  }

  interface Account {
    access_token?: string;
  }
}