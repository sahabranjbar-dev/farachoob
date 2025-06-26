"use client";

import { useCallback, useEffect, useState } from "react";
import { API } from "../configs/API";
import {
  IFetchData,
  useDataGetterInputs,
  useDataGetterOuput,
} from "../types/useDataGetter";

export default function useDataGetter<T>({
  url,
  method,
  params,
  immediatelyFetch = true,
  body,
}: useDataGetterInputs): useDataGetterOuput<T> {
  const [data, setData] = useState<T[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<any>(null);

  const fetchData = useCallback(
    async ({ inputUrl, inputBody, inputParams }: IFetchData) => {
      try {
        setLoading(true);
        const response = await API({
          url: inputUrl || url,
          method,
          params: { ...inputParams, ...params },
          data: JSON.stringify({ ...inputBody, ...body }),
        });

        const result = response.data.resultList;
        setData(result);
        return result;
      } catch (err) {
        setError(err);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [url, method, params, body, API]
  );

  useEffect(() => {
    if (immediatelyFetch) {
      fetchData({});
    }
  }, [fetchData, immediatelyFetch]);

  return {
    data,
    loading,
    error,
    fetch: fetchData,
  };
}
