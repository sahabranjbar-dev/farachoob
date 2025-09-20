"use client";
import DataGetter from "@/container/DataGetter/DataGetter";
import DataLoader from "@/container/DataLoader/DataLoader";
import React from "react";
import SettingForm from "./components/SettingForm";
import { useSession } from "next-auth/react";

const SettingPage = () => {
  const session = useSession();

  return (
    <DataGetter params={{ id: session.data?.user.id }} url="/dashboard/setting">
      <DataLoader>
        <SettingForm />
      </DataLoader>
    </DataGetter>
  );
};

export default SettingPage;
