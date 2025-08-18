import { ElementType, ReactElement, ReactNode } from "react";

export interface IListHeader {
  hasRefresh?: boolean;
  filter?: ReactElement;
  formPath?: string;
  title?: string;
  hasExport?: boolean;
  exportUrl?: string;
}
