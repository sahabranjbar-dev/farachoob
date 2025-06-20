"use client";

import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type Permission = {
  id: number;
  name: string;
};

type FormValues = {
  id?: number;
  title: string;
  href: string;
  icon?: string;
  permissionId: number;
  status: boolean;
};

interface Props {
  initialData?: Partial<FormValues> | null | undefined;
  permissions: Permission[];
  onSuccess: () => void;
}

export default function MenuForm({
  initialData,
  permissions,
  onSuccess,
}: Props) {
  const form = useForm<FormValues>({
    defaultValues: {
      title: "",
      href: "",
      icon: "",
      permissionId: 0,
      status: true,
      ...initialData,
    },
  });

  useEffect(() => {
    // اگر initialData داشت، فرم رو بروزرسانی کن
    if (initialData) {
      form.reset(initialData);
    }
  }, [initialData]);

  async function onSubmit(data: FormValues) {
    try {
      const method = initialData?.id ? "PUT" : "POST";
      const payload = initialData?.id ? { id: initialData.id, ...data } : data;

      const res = await fetch("/api/dashboard/menus", {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error("خطا در ذخیره‌سازی");

      onSuccess();
      form.reset();
    } catch (error) {
      alert((error as Error).message);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="title"
          rules={{ required: "عنوان الزامی است" }}
          render={({ field, fieldState }) => (
            <FormItem>
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
          name="icon"
          render={({ field }) => (
            <FormItem>
              <FormLabel>آیکن (اختیاری)</FormLabel>
              <FormControl>
                <Input {...field} placeholder="مثلا: UserCog" />
              </FormControl>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="permissionId"
          rules={{ required: "انتخاب دسترسی الزامی است" }}
          render={({ field }) => (
            <FormItem>
              <FormLabel>دسترسی</FormLabel>
              <Select
                onValueChange={(value) => field.onChange(Number(value))}
                value={field.value ? String(field.value) : ""}
                defaultValue=""
              >
                <SelectTrigger>
                  <SelectValue placeholder="یک دسترسی انتخاب کنید" />
                </SelectTrigger>
                <SelectContent>
                  {permissions.map((perm) => (
                    <SelectItem key={perm.id} value={String(perm.id)}>
                      {perm.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="status"
          render={({ field }) => (
            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
              <FormLabel className="mb-0">فعال باشد</FormLabel>
              <FormControl>
                <Switch
                  checked={field.value}
                  onCheckedChange={field.onChange}
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
  );
}
