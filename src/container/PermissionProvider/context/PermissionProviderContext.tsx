"use client";
import React, { createContext, PropsWithChildren, useContext } from "react";
import { UserPermissions } from "../PermissionProvider";

interface Props {
  userPermissions?: UserPermissions;
}

interface IPermissionProviderContext {
  userPermissions: UserPermissions;
}

export const PermissionContext = createContext<Props>({
  userPermissions: {
    hasCreate: false,
    hasDelete: false,
    hasEdit: false,
    hasView: false,
    hasExport: false,
  },
});

const PermissionProviderContext = ({
  children,
  userPermissions,
}: PropsWithChildren<IPermissionProviderContext>) => {
  return (
    <PermissionContext value={{ userPermissions }}>
      {children}
    </PermissionContext>
  );
};

export const usePermissions = () => {
  const context = useContext(PermissionContext);

  if (!context)
    throw new Error(
      "usePermissions should inside of PermissionProviderContext"
    );

  return context;
};

export default PermissionProviderContext;
