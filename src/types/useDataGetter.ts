import { Method } from "axios";

export interface useDataGetterInputs {
  url?: string;
  method?: Method;
  params?: any;
  body?: any;
  immediatelyFetch?: boolean;
  onSuccess?: (data?: any) => void;
  onFailure?: (error?: any) => void;
}

export interface IFetchData {
  inputUrl?: string;
  inputBody?: any;
  inputParams?: any;
}

export interface useDataGetterOuput<T = any> {
  data?: T | null;
  loading?: boolean;
  fetch?: ({ inputUrl, inputBody, inputParams }: IFetchData) => Promise<T>;
  error?: any;
}
