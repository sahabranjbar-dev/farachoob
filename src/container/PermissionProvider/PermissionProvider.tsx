import { PermissionKey } from "@/constants/MENU_CONFIG";
import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";
import React, { PropsWithChildren } from "react";
import PermissionProviderContext from "./context/PermissionProviderContext";
import { notFound } from "next/navigation";
import prisma from "@/lib/prisma";

interface Props {
  moduleName: string;
}

export type UserPermissions = {
  hasCreate: boolean;
  hasEdit: boolean;
  hasView: boolean;
  hasDelete: boolean;
  hasExport: boolean;
};

const PermissionProvider = async ({
  moduleName,
  children,
}: PropsWithChildren<Props>) => {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      console.warn("⚠️ No session found in PermissionProvider");
      return notFound();
    }

    const permissions = await prisma.permission.findMany();

    const userPermissions = session.user.permissions;

    const filteredPermissions = permissions.filter((permission) =>
      userPermissions?.includes(permission.id)
    );

    const permissionKeys = filteredPermissions.map(
      (item) => item.permissionKey
    );

    let base: UserPermissions = {
      hasCreate: false,
      hasDelete: false,
      hasEdit: false,
      hasView: false,
      hasExport: false,
    };

    for (let index = 0; index < permissionKeys.length; index++) {
      const element = permissionKeys[index];
      if (element.toLowerCase() === `view_${moduleName}`) {
        base.hasView = true;
      } else if (element.toLowerCase() === `create_${moduleName}`) {
        base.hasCreate = true;
      } else if (element.toLowerCase() === `edit_${moduleName}`) {
        base.hasEdit = true;
      } else if (element.toLowerCase() === `delete_${moduleName}`) {
        base.hasDelete = true;
      } else if (
        element.toLowerCase() === "can_export" ||
        element.toLowerCase() === "can_import"
      ) {
        base.hasExport = true;
      }
    }

    return (
      <PermissionProviderContext userPermissions={base}>
        {children}
      </PermissionProviderContext>
    );
  } catch (error) {
    console.error("❌ Unexpected error in PermissionProvider:", error);
    return null;
  }
};

export default PermissionProvider;
