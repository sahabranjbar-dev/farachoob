import { IFetchData } from "@/types/useDataGetter";

export interface IListContainer {
  url: string;
  body?: any;
  params?: any;
}

export interface IListContainerContext {
  data?: any;
  loading?: boolean;
  fetch?: ({ inputUrl, inputBody, inputParams }: IFetchData) => void;
  error?: any;
}
