"use client";

import Spinner from "@/components/Spinner";
import { SwitchRtl } from "@/components/SwitchRtl";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import useDataGetter from "@/hooks/useDataGetter";
import useParams from "@/hooks/useParams";
import useTabular from "@/hooks/useTabular";
import { Check, X } from "lucide-react";
import { useForm } from "react-hook-form";
import { mutate } from "swr";

type FormValues = {
  id?: number;
  title: string;
  href: string;
  icon?: string;
  permissionId: string;
  status: boolean;
  parentId?: string;
};

const MenusFormPage = () => {
  const { params, setActiveParam } = useParams<{
    pageType?: string;
    id?: string;
  }>();
  const { closeCurrentTab } = useTabular();
  const id = params?.id;
  const { data: formData, loading: formDataLoading } = useDataGetter({
    url: `dashboard/menus/${id}`,
    immediatelyFetch: Boolean(id),
    onSuccess(data) {
      if (data?.id) {
        form.reset({
          id: data?.id,
          title: data?.title,
          href: data?.href,
          icon: data?.icon,
          permissionId: data?.permissionId,
          status: data?.status ?? true,
          parentId: data?.parentId,
        });
      }
    },
  });

  const {
    data,
    error,
    fetch,
    loading: submitLoading,
  } = useDataGetter({
    url: "dashboard/menus",
    method: id ? "PUT" : "POST",
    immediatelyFetch: false,
    showError: true,
    showSuccessMessage: true,
  });
  const form = useForm<FormValues>({
    defaultValues: {
      href: formData?.href,
      title: formData?.title,
    },
  });

  const {
    data: permissions,
    fetch: fetchPermissions,
    loading: permissionLoading,
  } = useDataGetter({
    url: "dashboard/permissions",
    immediatelyFetch: Boolean(id),
    params: {
      pageSize: 50,
    },
  });

  const onSubmit = (data: FormValues) => {
    fetch?.({
      inputBody: data,
    }).then((data) => {
      setActiveParam({
        pageType: "EDIT",
        id: data?.id,
      });
      mutate("/api/dashboard/sidebarMenu");
    });
  };

  const {
    data: menus,
    fetch: fetchMenus,
    loading: menusLoading,
  } = useDataGetter({
    url: "dashboard/menus",
    immediatelyFetch: true,
    params: {
      pageSize: 50,
    },
  });

  return (
    <Card className="relative">
      {formDataLoading && (
        <div className="backdrop-brightness-75 z-50 w-full h-full flex justify-center items-center absolute -top-0 right-0 rounded">
          <Spinner />
        </div>
      )}
      <CardHeader>
        <CardTitle className="text-center">
          فرم {id ? "ویرایش" : "ایجاد"} منو
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-3 gap-4">
              {/* عنوان */}
              <FormField
                control={form.control}
                name="title"
                rules={{ required: "عنوان الزامی است" }}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>عنوان منو</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="مثال: مدیریت کاربران" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* آدرس */}
              <FormField
                control={form.control}
                name="href"
                rules={{ required: "آدرس الزامی است" }}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>آدرس</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="/admin/users" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* والد / زیرمنو */}
              <FormField
                control={form.control}
                name="parentId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>منوی والد (اختیاری)</FormLabel>
                    <FormControl>
                      <Select
                        value={field.value || ""}
                        onValueChange={field.onChange}
                        onOpenChange={() => {
                          if (!menus?.resultList?.length) fetchMenus?.({});
                        }}
                      >
                        <SelectTrigger className="w-full cursor-pointer">
                          <SelectValue placeholder="انتخاب منوی والد" />
                        </SelectTrigger>
                        <SelectContent className="h-56">
                          {menusLoading ? (
                            <Spinner />
                          ) : (
                            menus?.resultList
                              ?.filter((menu: any) => menu.id !== id) // جلوگیری از انتخاب خودش
                              .map((menu: any) => (
                                <SelectItem key={menu.id} value={menu.id}>
                                  {menu.title}
                                </SelectItem>
                              ))
                          )}
                        </SelectContent>
                      </Select>
                    </FormControl>
                  </FormItem>
                )}
              />

              {/* دسترسی */}
              <FormField
                control={form.control}
                name="permissionId"
                rules={{ required: "انتخاب دسترسی الزامی است" }}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>دسترسی</FormLabel>
                    <FormControl>
                      <Select
                        value={field.value}
                        onValueChange={field.onChange}
                        onOpenChange={() => {
                          if (!permissions?.resultList?.length)
                            fetchPermissions?.({});
                        }}
                      >
                        <SelectTrigger className="w-full cursor-pointer">
                          <SelectValue placeholder="انتخاب دسترسی" />
                        </SelectTrigger>
                        <SelectContent className="h-56">
                          {permissionLoading ? (
                            <Spinner />
                          ) : (
                            permissions?.resultList?.map(
                              (permission: { id: string; title: string }) => (
                                <SelectItem
                                  key={permission.id}
                                  value={permission.id}
                                >
                                  {permission.title}
                                </SelectItem>
                              )
                            )
                          )}
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* آیکن */}
              <FormField
                control={form.control}
                name="icon"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>آیکن</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="مثال: plus" />
                    </FormControl>
                  </FormItem>
                )}
              />

              {/* وضعیت */}
              <FormField
                control={form.control}
                name="status"
                render={({ field }) => (
                  <FormItem className="flex items-center justify-between rounded-lg border">
                    <FormLabel>وضعیت</FormLabel>
                    <FormControl>
                      <SwitchRtl
                        checked={field.value}
                        onChange={field.onChange}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>

            <div className="flex justify-end gap-4">
              <Button
                left={submitLoading ? <Spinner /> : <Check />}
                disabled={submitLoading}
                type="submit"
                variant="primary"
              >
                ذخیره
              </Button>
              <Button left={<X />} variant="outline" onClick={closeCurrentTab}>
                انصراف
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default MenusFormPage;
