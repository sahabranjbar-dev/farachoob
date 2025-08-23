// src/lib/auth.ts
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { prisma } from "./prisma";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcrypt";
import { AuthOptions, DefaultSession } from "next-auth";
import { JWT } from "next-auth/jwt";

// JWT با فیلدهای اختیاری
interface JWTWithRole extends JWT {
  id: string;
  role?: string;
  roleId?: string;
  permissions?: string[];
  image?: string;
}

// Session سفارشی با فیلدهای اختیاری
interface SessionWithRole extends DefaultSession {
  user: DefaultSession["user"] & {
    id?: string;
    role?: string;
    roleId?: string;
    permissions?: string[];
    image?: string | null;
  };
}

export const authOptions: AuthOptions = {
  adapter: PrismaAdapter(prisma),
  session: { strategy: "jwt", maxAge: 15 * 60 },
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;

        const user = await prisma.user.findUnique({
          where: { email: credentials.email },
          include: { role: { include: { permissions: true } } },
        });

        if (!user || !user.password || !user.role) return null;

        const isValid = await bcrypt.compare(
          credentials.password,
          user.password
        );
        if (!isValid) return null;

        return {
          id: user.id,
          email: user.email,
          image: user.image || null,
          role: user.role.englishTitle || "",
          roleId: user.role.id || "",
          permissions: user.role.permissions?.map((p) => p.permissionId) || [],
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = user.role;
        token.roleId = user.roleId;
        token.permissions = user.permissions;
        token.image = user.image;
      }
      return token;
    },
    async session({ session, token }): Promise<SessionWithRole> {
      if (session.user) {
        session.user.id = token.id || "";
        session.user.role = token.role;
        session.user.roleId = token.roleId;
        session.user.permissions = token.permissions ?? [];
      }
      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
};
