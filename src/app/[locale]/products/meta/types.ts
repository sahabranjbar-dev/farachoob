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
  englishTitle: string;
  farsiTitle: string;
  id: string;
  image: any;
  price: number;
  description: string;
  stock: number;
  brand: any;
  category: any;
}

export interface IFilterSidebar {
  fetch?: ({ inputBody, inputParams, inputUrl }: IFetchData) => Promise<any>;
}
