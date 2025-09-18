"use client";

import { useCallback, useEffect, useState } from "react";
import { API } from "../configs/API";
import {
  IFetchData,
  UseDataGetterInputs,
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
  showError = false,
  showSuccessMessage = false,
  responseType,
  headers,
  signal,
  ...axiosConfigs
}: UseDataGetterInputs): useDataGetterOuput<T> {
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
    ({
      inputUrl,
      inputBody,
      inputParams,
      signal: inputSignal,
      ...res
    }: IFetchData) => {
      setState((prev) => ({ ...prev, loading: true, error: null }));

      return new Promise(async (resolve, reject) => {
        try {
          const response = await API({
            ...axiosConfigs,
            ...res,
            url: inputUrl || url,
            method,
            headers,
            params: { ...params, ...inputParams },
            data: JSON.stringify({ ...body, ...inputBody }),
            responseType,
            signal: signal || inputSignal,
          });

          const result: T = response.data;
          setState({ data: result, loading: false, error: null });
          resolve(result);
          onSuccess?.(result);
          if (showSuccessMessage) {
            toast.success("عملیات با موفقیت انجام شد");
          }
          return result;
        } catch (err: any) {
          setState({ data: null, loading: false, error: err });
          reject(err);
          onFailure?.(err);
          if (!showError) return;
          toast.error(err?.response?.data?.message || "خطایی رخ داده است", {
            position: "bottom-center",
            closeButton: true,
          });
        }
      });
    },
    []
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
