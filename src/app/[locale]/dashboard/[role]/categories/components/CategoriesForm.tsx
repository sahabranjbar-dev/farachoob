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
import { X } from "lucide-react";
import { useRouter } from "next/navigation";
import React from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

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
        toast.success(
          initialData?.id
            ? "دسته‌بندی با موفقیت ویرایش شد"
            : "دسته‌بندی جدید با موفقیت ایجاد شد"
        );
        closeCurrentTab();
        open("/categories/categoriesForm", `فرم ویرایش ${data?.farsiTitle}`, {
          pageType: "EDIT",
          id: data?.id,
        });
      })
      .catch(() => {
        toast.error("خطا در ایجاد دسته‌بندی");
      });
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
            <div className="flex justify-start items-center">
              <FormField
                control={form.control}
                name="farsiTitle"
                rules={{ required: "نام فارسی دسته‌بندی الزامی است" }}
                render={({ field }) => (
                  <FormItem className="w-80">
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
                  <FormItem className="w-80">
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
            </div>

            <div className="flex justify-end gap-4">
              <Button type="submit" variant="primary">
                ذخیره
              </Button>
              <Button left={<X />} variant="outline" onClick={closeCurrentTab}>
                بستن
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default CategoriesForm;
