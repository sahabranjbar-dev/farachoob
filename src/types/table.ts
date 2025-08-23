import { ReactNode } from "react";

export interface ITable<T = any> {
  columns: ITableColumns[];
  data: T[];
}

export interface ITableColumns {
  field: string;
  title: string;
  width?: string;
  render?: (v?: any, row?: any, meta?: any) => ReactNode;
  hasDateFormatter?: boolean;
  [key: string]: any;
}
