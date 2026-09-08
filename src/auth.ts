import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import type {} from "@auth/core/jwt";
import { headers } from "next/headers";

import { authConfig } from "@/auth.config";
import {
  checkLoginRateLimit,
  clearLoginRateLimit,
} from "@/lib/auth/login-rate-limit";
import { verifyUserCredentials } from "@/modules/identity";
import type { Role } from "@/modules/identity";

declare module "next-auth" {
  interface User {
    role: Role;
  }
  interface Session {
    user: {
      id: string;
      email: string;
      name: string;
      role: Role;
    };
  }
}

declare module "@auth/core/jwt" {
  interface JWT {
    id: string;
    role: Role;
  }
}

async function clientIp(): Promise<string> {
  try {
    const h = await headers();
    const forwarded = h.get("x-forwarded-for");
    if (forwarded) return forwarded.split(",")[0]?.trim() || "unknown";
    return h.get("x-real-ip")?.trim() || "unknown";
  } catch {
    return "unknown";
  }
}

function assertAuthSecret() {
  if (
    process.env.NODE_ENV === "production" &&
    !process.env.AUTH_SECRET?.trim()
  ) {
    throw new Error(
      "AUTH_SECRET is required in production. Set a strong secret before starting the admin.",
    );
  }
}

export const { handlers, auth, signIn, signOut } = NextAuth({
  ...authConfig,
  providers: [
    Credentials({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        assertAuthSecret();
        const email = credentials?.email;
        const password = credentials?.password;
        if (typeof email !== "string" || typeof password !== "string") {
          return null;
        }
        if (password.length < 8) return null;

        const ip = await clientIp();
        const limited = checkLoginRateLimit(email, ip);
        if (!limited.ok) {
          return null;
        }

        const user = await verifyUserCredentials(email, password);
        if (!user) return null;

        clearLoginRateLimit(email, ip);
        return {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
        };
      },
    }),
  ],
  secret: process.env.AUTH_SECRET,
});
