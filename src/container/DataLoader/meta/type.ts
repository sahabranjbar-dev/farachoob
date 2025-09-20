import { IFetchData } from "@/types/useDataGetter";

export interface IDataLoader<T = any> {
  data?: T;
  fetch?: ({ inputBody, inputParams, inputUrl }: IFetchData) => Promise<any>;
  error?: any;
  loading?: boolean;
}

export interface IDataLoaderOutput<T> {
  data?: T;
  loading?: boolean;
  fetch?: ({ inputBody, inputParams, inputUrl }: IFetchData) => Promise<any>;
  error?: any;
}
