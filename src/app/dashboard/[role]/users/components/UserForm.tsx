"use client";

import FullScreenLoading from "@/components/FullScreenLoading";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useForm } from "react-hook-form";
import { useState } from "react";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";
import { format } from "date-fns-jalali";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import useTabular from "@/hooks/useTabular";
import useDataGetter from "@/hooks/useDataGetter";
import { toast } from "sonner";
import { X } from "lucide-react";
import { AxiosError } from "axios";

interface IUserForm {
  initialData?: any;
  roles?: { id: string; farsiTitle: string; englishTitle: string }[]; // برای لیست نقش‌ها
}

interface FormValues {
  id?: string;
  firstName: string;
  lastName: string;
  email: string;
  mobile: string;
  birthDate?: Date | null;
  image?: string | null;
  roleId: string;
  password?: string;
}

const UserForm = ({ initialData, roles = [] }: IUserForm) => {
  const form = useForm<FormValues>({
    defaultValues: {
      id: initialData?.id,
      firstName: initialData?.firstName,
      lastName: initialData?.lastName,
      email: initialData?.email,
      mobile: initialData?.mobile,
      birthDate: initialData?.birthDate,
      image: initialData?.image,
      roleId: initialData?.role?.id,
    },
  });

  const { data, error, fetch, loading } = useDataGetter({
    url: "dashboard/users",
    method: initialData?.id ? "PUT" : "POST",
    immediatelyFetch: false,
  });
  const onSubmit = async (values: FormValues) => {
    fetch?.({
      inputBody: values,
    })
      .then((data) => {
        if (data) {
          toast.success("کاربر با موفقیت ویرایش شد.");
        }
      })
      .catch((err: AxiosError<{ message: string }>) => {
        console.error("Error updating user:", err);
        toast.error(err.response?.data.message);
      });
  };

  const { closeCurrentTab } = useTabular();

  return (
    <Card className="relative">
      {loading && <FullScreenLoading />}
      <CardHeader>
        <CardTitle className="text-center">
          فرم {initialData?.id ? "ویرایش" : "ایجاد"} کاربر
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="grid grid-cols-3 gap-4"
          >
            {/* نام */}
            <FormField
              control={form.control}
              name="firstName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>نام</FormLabel>
                  <FormControl>
                    <Input placeholder="نام را وارد کنید" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {/* نام خانوادگی */}
            <FormField
              control={form.control}
              name="lastName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>نام خانوادگی</FormLabel>
                  <FormControl>
                    <Input placeholder="نام خانوادگی را وارد کنید" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {/* ایمیل */}
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>ایمیل</FormLabel>
                  <FormControl>
                    <Input
                      type="email"
                      placeholder="example@email.com"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {/* موبایل */}
            <FormField
              control={form.control}
              name="mobile"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>شماره موبایل</FormLabel>
                  <FormControl>
                    <Input placeholder="+989..." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {/* تاریخ تولد */}
            <FormField
              control={form.control}
              name="birthDate"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>تاریخ تولد</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant="outline"
                          className="w-full justify-start text-left font-normal"
                        >
                          {field.value
                            ? format(field.value, "yyyy/MM/dd")
                            : "انتخاب تاریخ"}
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="p-0">
                      <Calendar
                        mode="single"
                        selected={field.value || undefined}
                        onSelect={(date) => field.onChange(date)}
                      />
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />
            {/* نقش */}
            <FormField
              control={form.control}
              name="roleId"
              render={({ field }) => (
                <FormItem className="col-span-1 w-full">
                  <FormLabel>نقش کاربر</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="انتخاب نقش" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {roles.map((role) => (
                        <SelectItem key={role.id} value={role.id}>
                          {role.farsiTitle}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            {/* پسورد (فقط برای ایجاد) */}
            {!initialData?.id && (
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>رمز عبور</FormLabel>
                    <FormControl>
                      <Input
                        type="password"
                        placeholder="رمز عبور"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}
            <div className="flex justify-end gap-4 col-start-3">
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

export default UserForm;
