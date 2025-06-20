import React, { useCallback } from "react";
import { Form, FormControl, FormField, FormItem, FormLabel } from "./ui/form";
import { useForm } from "react-hook-form";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { SwitchRtl } from "./SwitchRtl";
import { Button } from "./ui/button";
import { toast } from "sonner";

type FormValues = {
  id: number;
  farsiTitle?: string | null;
  englishTitle?: string | null;
  description?: string | null;
  status?: boolean | null;
};

interface Props {
  initialData?: Partial<FormValues> & { id?: number };
  onSuccess: () => void;
}

const RoleForm = ({ initialData, onSuccess }: Props) => {
  const form = useForm<FormValues>({
    defaultValues: {
      farsiTitle: "",
      englishTitle: "",
      description: "",
      status: true,
      ...initialData,
    },
  });

  const onSubmit = useCallback(
    async ({
      farsiTitle,
      englishTitle,
      description,
      status,
      id,
    }: FormValues) => {
      const isEdit = id;
      const response = await fetch(
        isEdit ? `/api/dashboard/roles/${id}` : "/api/dashboard/roles",
        {
          method: isEdit ? "PUT" : "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            farsiTitle,
            englishTitle,
            description,
            status,
          }),
        }
      );
      if (!response.ok) {
        toast.error("مشکلی به وجود آمده است");
      }
      const result = await response.json();

      if (result.status === 201) {
        toast.success(result.message, { position: "top-center" });
        onSuccess();
      }
    },
    []
  );

  return (
    <div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <div className="flex justify-center items-center gap-2">
            <FormField
              name="farsiTitle"
              render={({ field }) => {
                return (
                  <FormItem className="w-1/2">
                    <FormLabel>نام فارسی</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        placeholder="نام فارسی نقش را وارد کنید"
                      />
                    </FormControl>
                  </FormItem>
                );
              }}
            />
            <FormField
              name="englishTitle"
              render={({ field }) => {
                return (
                  <FormItem className="w-1/2">
                    <FormLabel>نام انگلیسی</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        placeholder="نام انگلیسی نقش را وارد کنید"
                      />
                    </FormControl>
                  </FormItem>
                );
              }}
            />
          </div>
          <FormField
            name="description"
            render={({ field }) => {
              return (
                <FormItem>
                  <FormLabel>توضیحات</FormLabel>

                  <FormControl>
                    <Textarea
                      {...field}
                      placeholder="توضیحات نقش را وارد کنید"
                    />
                  </FormControl>
                </FormItem>
              );
            }}
          />
          <FormField
            control={form.control}
            name="status"
            render={({ field }) => (
              <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                <FormLabel className="mb-0">
                  {field.value ? "فعال" : "غیرفعال"}
                </FormLabel>
                <FormControl>
                  <SwitchRtl
                    checked={!!field.value}
                    onChange={field.onChange}
                  />
                </FormControl>
              </FormItem>
            )}
          />
          <div className="flex justify-end gap-4">
            <Button type="submit" variant="primary">
              ذخیره
            </Button>
            <Button
              variant="outline"
              onClick={() => {
                form.reset();
                onSuccess();
              }}
            >
              انصراف
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default RoleForm;
