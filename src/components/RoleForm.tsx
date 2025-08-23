"use client";
import { useCallback, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { MultiSelect } from "./MultiSelect";
import { SwitchRtl } from "./SwitchRtl";
import { Button } from "./ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel } from "./ui/form";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import useDataGetter from "@/hooks/useDataGetter";
import FullScreenLoading from "./FullScreenLoading";
import Spinner from "./Spinner";

export interface FormValues {
  id: string;
  farsiTitle: string;
  englishTitle: string;
  description?: string;
  createdAt?: string;
  status?: boolean;
  updateAt?: string;
  users?: User[];
  permissions?: Permission[];
  permissionIds?: any;
}

export interface User {
  id: string;
  email: string;
  name: string;
  role: Role;
}

export interface Role {
  id: string;
  farsiTitle: string;
  englishTitle: string;
  description: string;
  status: boolean;
  createdAt: string;
  updateAt: string;
}

export interface Permission {
  id: string;
  permission: Permission2;
  permissionId: string;
}

export interface Permission2 {
  id: string;
  name: string;
  description: string;
  createdAt: string;
  updateAt: string;
}

interface Props {
  initialData?: Partial<FormValues>;
}

const RoleForm = ({ initialData }: Props) => {
  const [loading, setLoading] = useState<boolean>(false);
  const form = useForm<FormValues>({
    defaultValues: {
      farsiTitle: "",
      englishTitle: "",
      description: "",
      status: true,
      permissionIds: initialData?.permissions?.map((item) => item.permissionId),
      ...initialData,
    },
  });

  const onSubmit = useCallback(
    async ({
      farsiTitle,
      englishTitle,
      description,
      status,
      permissionIds,
      id,
    }: FormValues) => {
      const isEdit = !!id;
      setLoading(true);
      try {
        const response = await fetch("/api/dashboard/roles", {
          method: isEdit ? "PUT" : "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            farsiTitle,
            englishTitle,
            description,
            status,
            permissionIds,
            id,
          }),
        });
        if (!response.ok) {
          toast.error("مشکلی به وجود آمده است");
        }
        const result = await response.json();

        if (result.status) {
          toast.success("عملیات با موفقیت انجام شد", {
            position: "bottom-center",
          });
        }
      } catch (error) {
        toast.error("مشکلی به وجود آمده است");
      } finally {
        setLoading(false);
      }
    },
    []
  );

  const {
    data: permissionOptions,
    error,
    fetch: fetchPermission,
    loading: loadingPermissions,
  } = useDataGetter({
    url: "/dashboard/permissions",
    immediatelyFetch: false,
  });

  const options = permissionOptions?.resultList.map((item: any) => {
    return {
      label: item.farsiTitle,
      value: item?.id,
    };
  });

  console.log({ options });

  return (
    <div>
      {loading && <FullScreenLoading />}
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
            name="permissionIds"
            render={({ field }) => {
              console.log({ field });

              return (
                <MultiSelect
                  onClickCapture={() => {
                    fetchPermission?.({});
                  }}
                  options={options ?? []}
                  defaultValue={field.value}
                  onValueChange={field.onChange}
                  placeholder="انتخاب مجوز"
                  animation={0.5}
                  variant="inverted"
                  loading={loadingPermissions}
                  className="bg-white"
                />
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
