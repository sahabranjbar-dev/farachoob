import NextAuth, { AuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import bcrypt from "bcrypt";
import { prisma } from "@/lib/prisma";

export const authOptions: AuthOptions = {
  adapter: PrismaAdapter(prisma),
  session: {
    strategy: "jwt",
  },
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;

        // دریافت یوزر به همراه رول‌ها (include رول‌ها)
        const user = await prisma.user.findUnique({
          where: { email: credentials.email },
          include: {
            roles: {
              include: {
                role: true,
              },
            },
          },
        });
        if (!user) return null;

        // چک کردن رمز عبور
        const isValid = await bcrypt.compare(
          credentials.password,
          user.password
        );
        if (!isValid) return null;

        // استخراج آرایه رول‌ها (نام نقش‌ها)
        const roles = user.roles.map((userRole) => userRole.role.name);

        return {
          id: user.id.toString(),
          name: user.name,
          email: user.email,
          roles, // آرایه رول‌ها
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      // وقتی لاگین می‌کنه، user موجوده و اطلاعات رو توکن می‌ریزیم
      if (user) {
        token.id = user.id;
        token.roles = user.roles;
      }
      return token;
    },
    async session({ session, token }) {
      if (token && session.user) {
        session.user.id = token.id;
        session.user.roles = token.roles;
      }
      return session;
    },
  },
  pages: {
    signIn: "/auth/login",
    signOut: "/auth/login",
    error: "/auth/login",
  },
  secret: process.env.NEXTAUTH_SECRET,
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
