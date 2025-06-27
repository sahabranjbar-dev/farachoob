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
import { usetabular } from "@/hooks/useTabular";
import { useRouter } from "@/i18n/navigation";
import { Check } from "lucide-react";
import { useForm } from "react-hook-form";

type FormValues = {
  id?: number;
  title: string;
  href: string;
  icon?: string;
  permissionId: string;
  status: boolean;
};

const MenusFormPage = () => {
  const router = useRouter();
  const { params, setActiveParam } = useParams<{
    pageType?: string;
    id?: string;
  }>();
  const id = params?.id;
  const { data: formData, loading: formDataLoading } = useDataGetter({
    url: `dashboard/menus/${id}`,
    immediatelyFetch: Boolean(id),
    onSuccess(data) {
      if (data?.id) {
        form.reset({
          id: data?.id,
          title: data?.title || "",
          href: data?.href || "",
          icon: data?.icon || "",
          permissionId: data?.permissionId || "",
          status: data?.status ?? true,
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
  });
  const onSubmit = (data: FormValues) => {
    fetch?.({
      inputBody: data,
    }).then((data) => {
      setActiveParam({
        pageType: "EDIT",
        id: data?.id,
      });
    });
  };
  const { closeCurrentTab } = usetabular();
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
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 ">
            <div className="grid grid-cols-3 gap-4">
              <FormField
                control={form.control}
                name="title"
                rules={{ required: "عنوان الزامی است" }}
                render={({ field, fieldState }) => (
                  <FormItem className="">
                    <FormLabel>عنوان منو</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="مثال: مدیریت کاربران" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="href"
                rules={{ required: "آدرس الزامی است" }}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>آدرس</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="/dashboard/admin/users" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="permissionId"
                rules={{ required: "انتخاب دسترسی الزامی است" }}
                render={({ field, fieldState }) => (
                  <FormItem>
                    <FormLabel>دسترسی</FormLabel>
                    <FormControl onClick={() => {}}>
                      <Select
                        value={field.value}
                        defaultValue="salam"
                        onValueChange={(val) => field.onChange(val)}
                        onOpenChange={() => {
                          if (
                            permissionLoading ||
                            permissions?.resultList?.length
                          )
                            return;
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
                              (permission: {
                                id: string;
                                farsiTitle: string;
                              }) => (
                                <SelectItem
                                  key={permission?.id}
                                  value={permission?.id ?? ""}
                                >
                                  {permission?.farsiTitle}
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
              <FormField
                control={form.control}
                name="icon"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>آیکن</FormLabel>
                    <FormControl>
                      <Input type="file" {...field} />
                    </FormControl>
                  </FormItem>
                )}
              />

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
              <Button variant="outline" onClick={closeCurrentTab}>
                انصراف
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
      <CardFooter></CardFooter>
    </Card>
  );
};

export default MenusFormPage;
