import NextAuth from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      name?: string | null;
      firstName?: string | null;
      lastName?: string | null;
      email?: string | null;
      image?: string | null;
      role?: any;
      roleId?: string;
      permissions?: string[];
      roleFarsiTitle?: string;
    };
  }

  interface User {
    id: string;
    role?: string;
    roleId?: string;
    permissions?: string[];
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id?: string;
    role?: string;
    roleId?: string;
    permissions?: string[];
  }
}
