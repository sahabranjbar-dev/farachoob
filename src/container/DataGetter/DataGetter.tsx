import React, { cloneElement, PropsWithChildren, ReactElement } from "react";
import { IDataGetter } from "./meta/types";
import useDataGetter from "@/hooks/useDataGetter";

const DataGetter = ({
  body,
  immediatelyFetch,
  method = "GET",
  onFailure,
  onSuccess,
  params,
  url,
  children,
}: PropsWithChildren<IDataGetter>) => {
  const { data, error, fetch, loading } = useDataGetter({
    body,
    immediatelyFetch,
    method,
    onFailure,
    onSuccess,
    params,
    url,
  });
  return React.isValidElement(children)
    ? cloneElement(children as React.ReactElement<any>, {
        data,
        error,
        fetch,
        loading,
      })
    : null;
};

export default DataGetter;
