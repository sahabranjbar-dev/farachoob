import { ReactNode } from "react";

export interface ITable {
  columns: ITableColumns[];
  data: any[];
}

export interface ITableColumns {
  field: string;
  title: string;
  width?: string;
  render?: (v?: any, row?: any, meta?: any) => ReactNode;
  hasDateFormatter?: boolean;
  [key: string]: any;
}
