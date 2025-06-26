import { Method } from "axios";

export interface useDataGetterInputs {
  url?: string;
  method?: Method;
  params?: any;
  body?: any;
  immediatelyFetch?: boolean;
}

export interface IFetchData {
  inputUrl?: string;
  inputBody?: any;
  inputParams?: any;
}

export interface useDataGetterOuput<T = any> {
  data?: T[];
  loading?: boolean;
  fetch?: ({ inputUrl, inputBody, inputParams }: IFetchData) => void;
  error?: any;
}
