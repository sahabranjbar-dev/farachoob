import { UseDataGetterInputs } from "@/types/useDataGetter";

export interface IDataGetter extends Omit<UseDataGetterInputs, "url"> {
  url: string;
}
