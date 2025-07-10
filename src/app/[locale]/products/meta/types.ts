import { IFetchData } from "@/types/useDataGetter";

export interface IFilterItems {
  title?: string;
  filtersContent?: IFiltersContent[];
  category?: string | string[] | undefined;
}

export interface IFiltersContent {
  id: string | number;
  farsiTitle: string;
  englishTitle: string;
}

export interface IProduct {
  id?: string;
  title?: string;
  description?: string;
  price?: number;
  discount?: number;
  rate?: number;
}

export interface IFilterSidebar {
  fetch?: ({ inputBody, inputParams, inputUrl }: IFetchData) => Promise<any>;
}
