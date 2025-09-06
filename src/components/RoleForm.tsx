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
import { Card, CardHeader, CardTitle } from "./ui/card";
import { CheckIcon, ChevronDown, X } from "lucide-react";
import useTabular from "@/hooks/useTabular";

export interface FormValues {
  id: string;
  farsiTitle: string;
  englishTitle: string;
  description?: string;
  createdAt?: string;
  status: boolean;
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
  title: string;
  permissionKey: string;
  createdAt: string;
  updateAt: string;
}

interface Props {
  initialData?: Partial<FormValues>;
}

const RoleForm = ({ initialData }: Props) => {
  const form = useForm<FormValues>({
    defaultValues: {
      farsiTitle: "",
      englishTitle: "",
      description: "",
      status: true,
      permissionIds: initialData?.permissions?.map(
        (item) => item.permission.id
      ),
      ...initialData,
    },
  });

  const { closeCurrentTab } = useTabular();

  const { fetch: rolesSubmit, loading: rolesSubmitLoading } = useDataGetter({
    url: "dashboard/roles",
    method: initialData?.id ? "PUT" : "POST",
    showError: true,
    showSuccessMessage: true,
    immediatelyFetch: false,
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
      rolesSubmit?.({
        inputBody: {
          farsiTitle,
          englishTitle,
          description,
          status,
          permissionIds,
          id,
        },
      });
    },
    [rolesSubmit]
  );

  const {
    data: permissionOptions,
    error,
    fetch: fetchPermission,
    loading: loadingPermissions,
  } = useDataGetter({
    url: "/dashboard/permissions",
    immediatelyFetch: Boolean(initialData?.id),
    params: {
      pageSize: 50,
    },
  });

  const options = permissionOptions?.resultList.map((item: any) => {
    return {
      label: item.title,
      value: item?.id,
      id: item?.id,
    };
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-center">
          فرم {!!initialData?.id ? "ویرایش" : "ایجاد"} نقش
        </CardTitle>
      </CardHeader>
      {rolesSubmitLoading && <FullScreenLoading />}
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="grid grid-cols-3 gap-4 p-4"
        >
          <FormField
            name="farsiTitle"
            render={({ field }) => {
              return (
                <FormItem>
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
                <FormItem>
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

          <FormField
            control={form.control}
            name="status"
            render={({ field }) => (
              <FormItem className="flex justify-between items-center border shadow rounded-md mx-1">
                <FormLabel>وضعیت انتشار</FormLabel>
                <FormControl>
                  <SwitchRtl checked={field.value} onChange={field.onChange} />
                </FormControl>
              </FormItem>
            )}
          />
          <FormField
            name="permissionIds"
            render={({ field }) => {
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
            name="description"
            render={({ field }) => {
              return (
                <FormItem className="col-start-1 col-end-4 row-start-3 w-full h-64">
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
          <div className="flex justify-end gap-4 col-start-3 row-start-4">
            <Button
              type="submit"
              variant="primary"
              disabled={rolesSubmitLoading}
            >
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
};

export default RoleForm;
