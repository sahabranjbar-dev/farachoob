import { IFetchData } from "@/types/useDataGetter";

export interface IDataLoader {
  data?: any;
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
