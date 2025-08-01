"use client";

import FullScreenLoading from "@/components/FullScreenLoading";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Checkbox } from "@/components/ui/checkbox";
import useParams from "@/hooks/useParams";
import { useTransition } from "react";
import { IFilterItems } from "../meta/types";

interface FilterItemsProps extends IFilterItems {
  paramName: string; // اسم پارامتر query که باید کنترل کنه مثل "category" یا "brand"
}

const FilterItems = ({
  filtersContent,
  title,
  paramName,
}: FilterItemsProps) => {
  const { setActiveParam, params } = useParams();
  const [isPending, startTransition] = useTransition();

  // مقدار پارامتر فعال (ممکنه string یا string[] باشه)
  const selectedParams = Array.isArray(params?.[paramName])
    ? params[paramName]
    : params?.[paramName]
    ? [params[paramName]]
    : [];

  return (
    <Accordion type="single" collapsible>
      <AccordionItem value="item-1">
        <AccordionTrigger className="font-bold cursor-pointer">
          {title}
        </AccordionTrigger>
        <AccordionContent>
          {isPending && (
            <div className="text-gray-500 text-sm mb-2 fixed top-0 right-0 w-screen h-screen bg-white bg-opacity-70 flex justify-center items-center z-100">
              <FullScreenLoading />
            </div>
          )}
          {filtersContent?.map((content) => {
            const { englishTitle, farsiTitle } = content;

            const isChecked = selectedParams.includes(englishTitle);

            const handleChange = (checked: boolean) => {
              let updated: string[] = [];

              if (checked) {
                updated = Array.from(
                  new Set([...selectedParams, englishTitle])
                );
              } else {
                updated = selectedParams.filter(
                  (item) => item !== englishTitle
                );
              }

              startTransition(() => {
                setActiveParam({
                  [paramName]: updated.length > 0 ? updated : undefined,
                });
              });
            };

            return (
              <div
                key={englishTitle}
                className="border-b p-2 m-2 flex justify-start items-center gap-2"
              >
                <Checkbox
                  id={`${paramName}-${englishTitle}`}
                  checked={isChecked}
                  onCheckedChange={handleChange}
                  className="cursor-pointer"
                />
                <label
                  className="cursor-pointer"
                  htmlFor={`${paramName}-${englishTitle}`}
                >
                  {farsiTitle}
                </label>
              </div>
            );
          })}
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
};

export default FilterItems;
