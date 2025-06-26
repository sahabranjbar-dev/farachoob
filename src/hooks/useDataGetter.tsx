"use client";

import { useCallback, useEffect, useState } from "react";
import { API } from "../configs/API";
import {
  IFetchData,
  useDataGetterInputs,
  useDataGetterOuput,
} from "../types/useDataGetter";
import { toast } from "sonner";

interface State<T = any> {
  data: T | null;
  loading: boolean;
  error: any;
}

export default function useDataGetter<T = any>({
  url,
  method,
  params,
  immediatelyFetch = true,
  body,
  onFailure,
  onSuccess,
}: useDataGetterInputs): useDataGetterOuput<T> {
  const [state, setState] = useState<State<T>>({
    data: null,
    loading: false,
    error: null,
  });

  const fetchData: ({
    inputBody,
    inputParams,
    inputUrl,
  }: IFetchData) => Promise<T> = useCallback(
    ({ inputUrl, inputBody, inputParams }: IFetchData = {}) => {
      setState((prev) => ({ ...prev, loading: true, error: null }));

      return new Promise(async (resolve, reject) => {
        try {
          const response = await API({
            url: inputUrl || url,
            method,
            params: { ...params, ...inputParams },
            data: JSON.stringify({ ...body, ...inputBody }),
          });

          const result = response.data;
          setState({ data: result, loading: false, error: null });
          resolve(result);
          onSuccess?.(result);
          return result;
        } catch (err: any) {
          setState({ data: null, loading: false, error: err });
          reject(err);
          onFailure?.(err);
          toast.error(err?.response?.data?.message || "خطایی رخ داده است", {
            position: "bottom-center",
            closeButton: true,
          });
        }
      });
    },
    [url, method, params, body]
  );

  useEffect(() => {
    if (immediatelyFetch) {
      fetchData({});
    }
  }, [fetchData, immediatelyFetch]);

  return {
    data: state.data,
    loading: state.loading,
    error: state.error,
    fetch: fetchData,
  };
}
