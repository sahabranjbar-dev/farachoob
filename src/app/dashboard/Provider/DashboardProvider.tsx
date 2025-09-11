"use client";
import FullScreenLoading from "@/components/FullScreenLoading";
import useTabular from "@/hooks/useTabular";
import React, { ReactNode } from "react";

interface Props {
  children: ReactNode;
}

const DashboardProvider = ({ children }: Props) => {
  const { isPending } = useTabular();
  return <>{isPending ? <FullScreenLoading /> : children}</>;
};

export default DashboardProvider;
