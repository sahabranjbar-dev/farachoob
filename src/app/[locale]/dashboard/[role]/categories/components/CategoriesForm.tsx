"use client";
import FullScreenLoading from "@/components/FullScreenLoading";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import useDataGetter from "@/hooks/useDataGetter";
import useTabular from "@/hooks/useTabular";
import { useRouter } from "next/navigation";
import React from "react";
import { useForm } from "react-hook-form";

interface FormValues {
  farsiTitle: string;
  englishTitle: string;
}

interface Props {
  initialData?: Partial<FormValues> & { id?: string };
}

const CategoriesForm = ({ initialData }: Props) => {
  const form = useForm<FormValues>({
    defaultValues: {
      farsiTitle: "",
      englishTitle: "",
      ...initialData,
    },
  });

  const router = useRouter();
  const isCreate = initialData?.id === "CREATE";
  const { closeCurrentTab, open } = useTabular();
  const { data, error, fetch, loading } = useDataGetter({
    url: "dashboard/categories",
    method: initialData?.id ? "PUT" : "POST",
    immediatelyFetch: false,
  });

  async function onSubmit(data: FormValues) {
    const payload = initialData?.id ? { id: initialData.id, ...data } : data;

    fetch?.({
      inputBody: payload,
    })
      .then((data) => {
        closeCurrentTab();
        open("/categories/categoriesForm", `فرم ویرایش ${data?.farsiTitle}`, {
          pageType: "EDIT",
          id: data?.id,
        });
      })
      .catch(() => {});
  }
  return (
    <Card className="relative">
      {loading && <FullScreenLoading />}
      <CardHeader>
        <CardTitle className="text-center">
          فرم {initialData?.id ? "ویرایش" : "ایجاد"} دسته‌بندی
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="farsiTitle"
              rules={{ required: "نام فارسی دسته‌بندی الزامی است" }}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>نام فارسی دسته‌بندی</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder="نام فارسی دسته‌بندی را وارد کنید"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="englishTitle"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>نام انگلیسی دسته‌بندی (اختیاری)</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      value={field.value ?? ""}
                      placeholder="نام انگلیسی دسته‌بندی را وارد کنید"
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            <div className="flex justify-end gap-4">
              <Button type="submit" variant="primary">
                ذخیره
              </Button>
              <Button variant="outline" onClick={closeCurrentTab}>
                انصراف
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default CategoriesForm;
