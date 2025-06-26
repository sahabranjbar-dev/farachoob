"use client";

import React, { useEffect, useState } from "react";
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
import axios from "axios";

type Permission = {
  id: number;
  name: string;
};

type FormValues = {
  id?: number;
  title: string;
  href: string;
  icon?: string;
  permissionId: string;
  status: boolean;
};

interface Props {
  initialData?: Partial<FormValues> | null | undefined;
}

export default function MenuForm({ initialData }: Props) {
  const [permissions, setPermissions] = useState<
    {
      id?: string;
      englishtitle?: string;
      farsiTitle?: string;
    }[]
  >([]);
  const form = useForm<FormValues>({
    defaultValues: {
      title: "",
      href: "",
      icon: "",
      permissionId: "",
      status: true,
      ...initialData,
    },
  });

  useEffect(() => {
    fetchPermissions();
    // اگر initialData داشت، فرم رو بروزرسانی کن
    if (initialData) {
      form.reset(initialData);
    }
  }, [initialData]);

  const fetchPermissions = async () => {
    const response = await axios.get("/api/dashboard/permissions");

    setPermissions(response.data.resultList);
  };
  async function onSubmit(data: FormValues) {
    try {
      const method = initialData?.id ? "PUT" : "POST";
      const payload = initialData?.id ? { id: initialData.id, ...data } : data;

      const res = await fetch("/api/dashboard/menus", {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: data.id,
          href: data.href,
          permissionId: data.permissionId,
          title: data.title,
          status: data.status,
        }),
      });

      if (!res.ok) throw new Error("خطا در ذخیره‌سازی");

      onSuccess();
      form.reset();
    } catch (error) {
      // alert((error as Error).message);
    }
  }

  return (
    
  );
}
