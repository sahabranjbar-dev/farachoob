"use client";

import FullScreenLoading from "@/components/FullScreenLoading";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { PermissionKey } from "@/constants/MENU_CONFIG";
import useDataGetter from "@/hooks/useDataGetter";
import useTabular from "@/hooks/useTabular";
import { CheckIcon, X } from "lucide-react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

type FormValues = {
  permissionKey: string | null;
  title: string | null;
};

interface Props {
  initialData?: Partial<FormValues> & { id?: string };
}

export default function PermissionForm({ initialData }: Props) {
  const form = useForm<FormValues>({
    defaultValues: {
      title: null,
      permissionKey: null,
      ...initialData,
    },
  });

  const { closeCurrentTab, open } = useTabular();

  const { data, error, fetch, loading } = useDataGetter({
    url: "dashboard/permissions",
    method: initialData?.id ? "PUT" : "POST",
    immediatelyFetch: false,
    showError: true,
  });

  async function onSubmit(data: FormValues) {
    const payload = initialData?.id ? { id: initialData.id, ...data } : data;

    fetch?.({
      inputBody: payload,
    }).then((data) => {
      toast.success(
        `${initialData?.id ? "ویرایش" : "ایجاد"} مجوز با موفقیت انجام شد`
      );
      closeCurrentTab();
      open("/permissions/permissionsForm", `فرم ویرایش ${data?.title}`, {
        pageType: "EDIT",
        id: data?.id,
      });
    });
  }

  return (
    <Card className="relative">
      {loading ? <FullScreenLoading /> : null}
      <CardHeader>
        <CardTitle className="text-center">
          فرم {!!initialData?.id ? "ویرایش" : "ایجاد"} مجوز
        </CardTitle>
      </CardHeader>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="grid grid-cols-2 p-4"
        >
          <FormField
            control={form.control}
            name="title"
            rules={{ required: "نام فارسی مجوز الزامی است" }}
            render={({ field }) => (
              <FormItem>
                <FormLabel>نام فارسی مجوز</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    value={field.value ?? ""}
                    placeholder="نام فارسی مجوز را وارد کنید"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="permissionKey"
            rules={{ required: "permissionKey الزامی است" }}
            render={({ field }) => (
              <FormItem>
                <FormLabel>permissionKey</FormLabel>
                <FormControl>
                  <Input {...field} value={field.value ?? ""} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="flex justify-end gap-4 p-4 col-start-2">
            <Button left={<CheckIcon />} type="submit" variant="primary">
              ذخیره
            </Button>
            <Button left={<X />} variant="outline" onClick={closeCurrentTab}>
              بستن
            </Button>
          </div>
        </form>
      </Form>
    </Card>
  );
}
