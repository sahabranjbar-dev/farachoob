"use client";
import React, { cloneElement, isValidElement, PropsWithChildren } from "react";
import { useList } from "../ListContainer/ListContainer";

type ListInjectedProps = {
  data: any;
  error: any;
  fetch: () => void;
  loading: boolean;
};

const ListDataProvider = ({
  children,
}: PropsWithChildren<{ children: React.ReactElement<ListInjectedProps> }>) => {
  const { data, error, fetch } = useList();

  if (isValidElement(children)) {
    return cloneElement(children, {
      data,
      error,
      fetch: () => fetch?.({}),
    });
  }
  return null;
};

export default ListDataProvider;
