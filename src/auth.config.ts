import type { NextAuthConfig } from "next-auth";

const SESSION_MAX_AGE_SEC = 8 * 60 * 60; // 8 hours

export const authConfig = {
  providers: [],
  pages: {
    signIn: "/admin/login",
  },
  session: {
    strategy: "jwt",
    maxAge: SESSION_MAX_AGE_SEC,
  },
  // HttpOnly + SameSite=Lax + Secure in production via Auth.js defaults
  useSecureCookies: process.env.NODE_ENV === "production",
  callbacks: {
    authorized({ auth, request }) {
      const { pathname } = request.nextUrl;
      if (pathname.startsWith("/admin/login")) return true;
      if (pathname.startsWith("/admin")) return !!auth?.user;
      return true;
    },
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id!;
        if ("role" in user && user.role) {
          token.role = user.role as never;
        }
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.role = token.role as never;
      }
      return session;
    },
  },
  trustHost: true,
  secret: process.env.AUTH_SECRET,
} satisfies NextAuthConfig;
