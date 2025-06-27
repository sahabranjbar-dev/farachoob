import { useDataGetterInputs } from "@/types/useDataGetter";

export interface IDataGetter extends Omit<useDataGetterInputs, "url"> {
  url: string;
}
