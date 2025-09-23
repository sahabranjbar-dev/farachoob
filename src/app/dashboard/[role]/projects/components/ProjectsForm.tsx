"use client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  Form,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import React, { ChangeEvent, useCallback, useState } from "react";
import { useForm } from "react-hook-form";
import { Trash, Trash2, Upload, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import useTabular from "@/hooks/useTabular";
import axios from "axios";
import Image from "next/image";
import { toast } from "sonner";

interface Props {
  initialData?: {
    id?: string;
    images?: string[];
    description?: string | null;
    title?: string;
  } | null;
}

interface FormValues {
  id?: string;
  title: string;
  description?: string;
  images?: (File | string)[];
}

const ProjectsForm = ({ initialData }: Props) => {
  const id = initialData?.id;

  const [projectLoading, setProjectLoading] = useState(false);
  const { closeCurrentTab, open } = useTabular();

  // تصاویر لوکال برای مدیریت حذف/اضافه
  const [images, setImages] = useState<(File | string)[]>(
    initialData?.images ?? []
  );

  const form = useForm<FormValues>({
    defaultValues: {
      ...initialData,
      title: initialData?.title ?? "",
      description: initialData?.description ?? "",
      images: images,
    },
  });

  // اضافه کردن عکس جدید
  const handleAddImages = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      setImages((prev) => [...prev, ...files]); // اضافه به لیست
    }
  };

  // حذف عکس
  const handleRemoveImage = (index: number) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
  };

  const onSubmit = useCallback(
    async (data: FormValues) => {
      try {
        setProjectLoading(true);
        const formData = new FormData();
        formData.append("title", data.title);
        formData.append("description", data?.description ?? "");
        formData.append("id", data?.id ?? "");
        images.forEach((item) => {
          if (item instanceof File) {
            formData.append("images", item);
          } else {
            formData.append("images", item); // URL قبلی
          }
        });

        const response = await axios({
          url: "/api/dashboard/projects",
          method: "POST",
          data: formData,
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });

        const project = response.data;
        if (project?.id) closeCurrentTab();
        open("/projects/projectsForm", `فرم ویرایش ${project.title}`, {
          pageType: "EDIT",
          id: project.id,
        });

        toast.success(
          `محصول ${project.title} با موفقیت ${id ? "ویرایش" : "ایجاد"} شد`
        );
      } catch (error: any) {
        toast.error(error.message || "خطا در ارسال فرم");
      } finally {
        setProjectLoading(false);
      }
    },
    [images]
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle>فرم {id ? "ویرایش" : "ایجاد"} پروژه</CardTitle>
      </CardHeader>

      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* عنوان پروژه */}
              <FormField
                name="title"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>عنوان پروژه</FormLabel>
                    <FormControl>
                      <Input {...field} value={field.value} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* توضیحات */}
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem className="col-span-1 md:col-span-3">
                    <FormLabel className="font-medium">توضیحات</FormLabel>
                    <FormControl>
                      <Textarea
                        {...field}
                        className="bg-gray-50 min-h-[120px]"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* آپلود عکس */}
              <FormItem className="col-span-1 md:col-span-3">
                <FormLabel>تصویر پروژه</FormLabel>
                <FormControl>
                  <div className="flex justify-center items-center gap-4">
                    <label
                      htmlFor="images"
                      className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 transition-colors"
                    >
                      <div className="flex flex-col items-center justify-center pt-5 pb-6">
                        <Upload className="w-8 h-8 mb-2 text-gray-500" />
                        <p className="text-sm text-gray-500">
                          تصویر را اینجا رها کنید یا کلیک کنید
                        </p>
                      </div>
                      <Input
                        id="images"
                        type="file"
                        accept="image/*"
                        className="hidden"
                        multiple
                        onChange={handleAddImages}
                      />
                    </label>
                  </div>
                </FormControl>
              </FormItem>

              {/* نمایش و حذف تصاویر */}
              <div className="grid grid-cols-4 col-span-3 gap-4">
                {images.map((item, index) => (
                  <div key={index} className="relative group">
                    <Image
                      alt={`image-${index}`}
                      src={
                        item instanceof File ? URL.createObjectURL(item) : item
                      }
                      width={200}
                      height={200}
                      className="border rounded object-cover w-full h-40"
                      unoptimized
                    />
                    <button
                      type="button"
                      className="cursor-pointer absolute top-1 right-1 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition"
                      onClick={() => handleRemoveImage(index)}
                    >
                      <Trash2 className="w-6 h-6" />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* دکمه‌ها */}
            <div className="flex justify-end gap-4 pt-4">
              <Button
                type="submit"
                variant="primary"
                className="px-8"
                disabled={projectLoading}
              >
                {projectLoading ? "در حال ذخیره..." : "ذخیره"}
              </Button>
              <Button
                type="button"
                variant="outline"
                left={<X className="w-5 h-5" />}
                onClick={closeCurrentTab}
              >
                بستن
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default ProjectsForm;
