import { Method } from "axios";
import { AxiosRequestConfig } from "axios";

export interface UseDataGetterInputs<Body = any, Params = any>
  extends AxiosRequestConfig<Body> {
  url?: string;
  method?: Method;
  params?: Params;
  body?: Body;

  immediatelyFetch?: boolean;
  onSuccess?: (data?: any) => void;
  onFailure?: (error?: any) => void;
  showError?: boolean;
  showSuccessMessage?: boolean;
}

export interface IFetchData<InputBody = any, InputParams = any>
  extends AxiosRequestConfig {
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
