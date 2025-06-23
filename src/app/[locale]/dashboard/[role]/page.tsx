import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { redirect } from "@/i18n/navigation";
import { getServerSession } from "next-auth";
import { unauthorized } from "next/navigation";
import React from "react";

const Role = async ({ params }: { params: Promise<{ role: string }> }) => {
  const sessio = await getServerSession(authOptions);

  const role = (await params).role;

  if (role !== "unauthorized" && sessio?.user.role !== role) {
    redirect({
      href: "/dashboard/unauthorized",
      // TODO: change locale
      locale: "fa",
    });
  }
  return <div>{role}</div>;
};

export default Role;
