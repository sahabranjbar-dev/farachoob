"use client";

import FullScreenLoading from "@/components/FullScreenLoading";
import Spinner from "@/components/Spinner";
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
import { Textarea } from "@/components/ui/textarea";
import useDataGetter from "@/hooks/useDataGetter";
import useParams from "@/hooks/useParams";
import useTabular from "@/hooks/useTabular";
import { useRouter } from "@/i18n/navigation";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

type FormValues = {
  name: string;
  description: string | null;
};

interface Props {
  initialData?: Partial<FormValues> & { id?: string };
}

export default function PermissionForm({ initialData }: Props) {
  const form = useForm<FormValues>({
    defaultValues: {
      name: "",
      description: null,
      ...initialData,
    },
  });
  const { params } = useParams();
  const router = useRouter();
  const isCreate = params?.pageType === "CREATE";
  const { closeCurrentTab, open } = useTabular();
  // useEffect(() => {
  //   if (initialData) {
  //     form.reset(initialData);
  //   }
  // }, [initialData]);

  const { data, error, fetch, loading } = useDataGetter({
    url: "dashboard/permissions",
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
        open(
          "/permissions/permissionsForm",
          `فرم ویرایش ${data?.description}`,
          {
            pageType: "EDIT",
            id: data?.id,
          }
        );
      })
      .catch((err) => {
        toast.error(err.message);
      });
  }

  return (
    <Card className="relative">
      {loading ? <FullScreenLoading /> : null}
      <CardHeader>
        <CardTitle className="text-center">
          فرم {!isCreate ? "ویرایش" : "ایجاد"} منو
        </CardTitle>
      </CardHeader>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="description"
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
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>نام انگلیسی مجوز (اختیاری)</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    value={field.value ?? ""}
                    placeholder="مثلا: CAN_MANAGE_USERS"
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
    </Card>
  );
}
