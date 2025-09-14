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
import { Upload, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import useTabular from "@/hooks/useTabular";
import useDataGetter from "@/hooks/useDataGetter";
import axios from "axios";
import Image from "next/image";
import { toast } from "sonner";

interface Props {
  initialData?: {
    id?: string;
    images?: string[];
    description?: string | null; // 👈 تغییر مهم
    title?: string;
    createdAt?: Date;
    updateAt?: Date;
    active?: boolean;
    userId?: string;
    authorId?: string;
  } | null;
}

interface FormValues {
  title?: string;
  description?: string;
  images?: (File | string)[];
}

const ProjectsForm = ({ initialData }: Props) => {
  console.log({ initialData });

  const id = initialData?.id;

  const [projectLoading, setProjectLoading] = useState<boolean>(false);
  const { closeCurrentTab, open } = useTabular();
  const form = useForm<FormValues>({
    defaultValues: {
      ...initialData,
      title: initialData?.title ?? "",
      description: initialData?.description ?? "",
      images: initialData?.images ?? [],
    },
  });

  const onSubmit = useCallback(
    async (data: FormValues) => {
      try {
        setProjectLoading(true);
        const formData = new FormData();
        formData.append("title", data.title ?? "");
        formData.append("description", data?.description ?? "");
        console.log({ data });

        if (data.images && data.images.length > 0) {
          data.images.forEach((item) => {
            if (item instanceof File) {
              // فایل جدید
              formData.append("images", item);
            } else if (typeof item === "string") {
              // URL قدیمی
              formData.append("images", item);
            }
          });
        }

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
    [fetch]
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
              <FormField
                name="images"
                control={form.control}
                render={({ field }) => (
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
                            onChange={(e: ChangeEvent<HTMLInputElement>) => {
                              const files = e.target.files
                                ? Array.from(e.target.files)
                                : [];
                              field.onChange(files.length > 0 ? files : null);
                            }}
                          />
                        </label>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="flex justify-start items-center flex-wrap">
                {!!initialData?.images?.length &&
                  initialData.images.map((item, index) => (
                    <Image
                      alt={`image-${index}`}
                      src={item}
                      key={index}
                      width={500}
                      height={500}
                      className="border rounded inline"
                    />
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
