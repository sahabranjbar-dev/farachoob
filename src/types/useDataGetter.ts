import { Method } from "axios";

export interface useDataGetterInputs<Body = any, Params = any> {
  url?: string;
  method?: Method;
  params?: Params;
  body?: Body;
  immediatelyFetch?: boolean;
  onSuccess?: (data?: any) => void;
  onFailure?: (error?: any) => void;
  showError?: boolean;
}

export interface IFetchData<InputBody = any, InputParams = any> {
  inputUrl?: string;
  inputBody?: InputBody;
  inputParams?: InputParams;
}

export interface useDataGetterOuput<T = any> {
  data?: T | null;
  loading?: boolean;
  fetch?: ({ inputUrl, inputBody, inputParams }: IFetchData) => Promise<T>;
  error?: Error;
}
