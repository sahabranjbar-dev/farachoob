"use client";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { IFilterItems, IFilterSidebar } from "../meta/types";
import { Checkbox } from "@/components/ui/checkbox";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormField } from "@/components/ui/form";

const FormSchema = z.object({
  items: z.array(z.string()).refine((value) => value.some((item) => item), {
    message: "You have to select at least one item.",
  }),
});

export function FilterSidebar({}: IFilterSidebar) {
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      items: ["recents", "home"],
    },
  });

  const onSubmit = () => {};
  return (
    <div className="space-y-6 bg-white p-4 border shadow-2xl rounded-2xl">
      <h1>فیلترها</h1>
      <div>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField
              name="brands"
              render={() => {
                return (
                  <FilterItems
                    title="برند"
                    filtersContent={[
                      {
                        englishTitle: "brand 1",
                        farsiTitle: "برند ۱",
                        id: "123",
                      },
                    ]}
                  />
                );
              }}
            />
          </form>
        </Form>
      </div>
    </div>
  );
}

export const FilterItems = ({ filtersContent, title }: IFilterItems) => {
  return (
    <Accordion type="single" collapsible>
      <AccordionItem value="item-1">
        <AccordionTrigger className="font-bold cursor-pointer">
          {title}
        </AccordionTrigger>
        <AccordionContent>
          {filtersContent?.map((content) => {
            return (
              <div className="border-b p-2 m-2 flex justify-start items-center gap-2 ">
                <Checkbox
                  id={content.englishTitle}
                  className="cursor-pointer "
                />
                <label
                  className="cursor-pointer"
                  htmlFor={content.englishTitle}
                >
                  {content.farsiTitle}
                </label>
              </div>
            );
          })}
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
};
