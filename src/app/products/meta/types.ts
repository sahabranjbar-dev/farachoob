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
  variations: Variation[];
  price: number;
  description: string;
  stock: number;
  brand: any;
  category: any;
}

export interface Variation {
  id: string;
  productId: string;
  colorName: string;
  colorCode: string;
  price: number;
  stock: number;
  images: Image[];
}

export interface Image {
  id: string;
  url: string;
  variationId: string;
}
export interface IFilterSidebar {
  fetch?: ({ inputBody, inputParams, inputUrl }: IFetchData) => Promise<any>;
}
