"use client";

import { useCallback, useEffect, useState } from "react";
import { API } from "../configs/API";
import {
  IFetchData,
  useDataGetterInputs,
  useDataGetterOuput,
} from "../types/useDataGetter";
import { toast } from "sonner";

interface State<T> {
  data: T[] | null;
  loading: boolean;
  error: any;
}

export default function useDataGetter<T>({
  url,
  method,
  params,
  immediatelyFetch = true,
  body,
}: useDataGetterInputs): useDataGetterOuput<T> {
  const [state, setState] = useState<State<T>>({
    data: null,
    loading: false,
    error: null,
  });

  const fetchData = useCallback(
    async ({ inputUrl, inputBody, inputParams }: IFetchData = {}) => {
      setState((prev) => ({ ...prev, loading: true, error: null }));

      try {
        const response = await API({
          url: inputUrl || url,
          method,
          params: { ...params, ...inputParams },
          data: JSON.stringify({ ...body, ...inputBody }),
        });

        const result = response.data;
        setState({ data: result, loading: false, error: null });
        return result;
      } catch (err: any) {
        setState({ data: null, loading: false, error: err });

        toast.error(err?.response?.data?.message || "خطایی رخ داده است", {
          position: "bottom-center",
          closeButton: true,
        });
      }
    },
    [url, method, params, body]
  );

  useEffect(() => {
    if (immediatelyFetch) {
      fetchData();
    }
  }, [fetchData, immediatelyFetch]);

  return {
    data: state.data ?? [],
    loading: state.loading,
    error: state.error,
    fetch: fetchData,
  };
}
