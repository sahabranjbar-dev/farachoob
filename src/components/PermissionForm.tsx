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
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

type FormValues = {
  name: string;
  description?: string;
};

interface Props {
  initialData?: Partial<FormValues> & { id?: number };
  onSuccess: () => void;
}

export default function PermissionForm({ initialData, onSuccess }: Props) {
  const form = useForm<FormValues>({
    defaultValues: {
      name: "",
      description: "",
      ...initialData,
    },
  });

  useEffect(() => {
    if (initialData) {
      form.reset(initialData);
    }
  }, [initialData]);

  async function onSubmit(data: FormValues) {
    try {
      const method = initialData?.id ? "PUT" : "POST";
      const payload = initialData?.id ? { id: initialData.id, ...data } : data;

      const res = await fetch("/api/dashboard/permissions", {
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
          name="name"
          rules={{ required: "نام مجوز الزامی است" }}
          render={({ field }) => (
            <FormItem>
              <FormLabel>نام مجوز</FormLabel>
              <FormControl>
                <Input {...field} placeholder="مثلا: CAN_MANAGE_USERS" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>توضیح (اختیاری)</FormLabel>
              <FormControl>
                <Textarea
                  {...field}
                  placeholder="مثلا: دسترسی به مدیریت کاربران"
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
