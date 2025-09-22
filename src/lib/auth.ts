import { PrismaAdapter } from "@next-auth/prisma-adapter";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { AuthOptions, DefaultSession, User } from "next-auth";
import { JWT } from "next-auth/jwt";
import prisma from "./prisma";

// JWT سفارشی
interface JWTWithRole extends JWT {
  id: string;
  role?: any;
  roleId?: string;
  permissions?: string[];
  image?: string | null;
  firstName?: string;
  lastName?: string;
  mobile?: string;
  biography?: string;
}

// Session سفارشی
interface SessionWithRole extends DefaultSession {
  user: DefaultSession["user"] & {
    id?: string;
    role?: any;
    roleId?: string;
    permissions?: string[];
    image?: string | null;
    firstName?: string | null;
    lastName?: string | null;
    mobile?: string;
    biography?: string;
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
      async authorize(credentials): Promise<User | null> {
        if (!credentials?.email || !credentials?.password) return null;

        const userFromDb = await prisma.user.findUnique({
          where: { email: credentials.email },
          select: {
            id: true,
            email: true,
            firstName: true,
            lastName: true,
            birthDate: true,
            image: true,
            isActive: true,
            password: true,
            roleId: true,
            mobile: true,
            location: true,
            biography: true,
            role: {
              select: {
                id: true,
                englishTitle: true,
                farsiTitle: true,
                permissions: { select: { permissionId: true } },
              },
            },
          },
        });

        if (!userFromDb || !userFromDb.password || !userFromDb.role)
          return null;

        const isValid = await bcrypt.compare(
          credentials.password,
          userFromDb.password
        );
        if (!isValid) return null;

        // 👇 گمراه کردن TypeScript: cast به User
        return {
          ...userFromDb,
          firstName: userFromDb.firstName,
          lastName: userFromDb.lastName,
          image: userFromDb.image,
          id: userFromDb.id,
          isActive: userFromDb.isActive,
          birthDate: userFromDb.birthDate,
          role: userFromDb.role, // کل آبجکت رول
          roleId: userFromDb.role.id,
          mobile: userFromDb.mobile,
          location: userFromDb.location,
          biography: userFromDb.biography,
          permissions: userFromDb.role.permissions.map((p) => p.permissionId),
        } as unknown as User;
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        const u = user as any;
        token.id = u.id;
        token.role = u.role; // کل آبجکت
        token.roleId = u.roleId;
        token.permissions = u.permissions;
        token.image = u.image;
        token.firstName = u.firstName;
        token.lastName = u.lastName;
        token.mobile = u.mobile;
        token.biography = u.biography;
        token.location = u.location;
        token.birthDate = u.birthDate;
      }
      return token as JWTWithRole;
    },
    async session({ session, token }) {
      const t = token as JWTWithRole;
      if (session.user) {
        session.user.id = t.id;
        session.user.role = t.role;
        session.user.roleId = t.roleId;
        session.user.permissions = t.permissions ?? [];
        session.user.image = t.image ?? null;
        session.user.firstName = t.firstName ?? null;
        session.user.lastName = t.lastName ?? null;
        session.user.mobile = t.mobile ?? "";
        session.user.location = t.location ?? "";
        session.user.biography = t.biography ?? "";
        session.user.birthDate = t.birthDate ?? "";
        session.user.name = `${t.firstName ?? ""} ${t.lastName ?? ""}`.trim();
      }
      return session as SessionWithRole;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
};
