"use client";

import FullScreenLoading from "@/components/FullScreenLoading";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import useDataGetter from "@/hooks/useDataGetter";
import useTabular from "@/hooks/useTabular";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { SwitchRtl } from "@/components/SwitchRtl";
import { CheckIcon, X, Upload, Trash2 } from "lucide-react";
import Image from "next/image";
import dynamic from "next/dynamic";
import "react-quill-new/dist/quill.snow.css";
import axios from "axios";
import { toast } from "sonner";

// ادیتور رو داینامیک ایمپورت می‌کنیم تا تو SSR مشکل نداشته باشه
const ReactQuill = dynamic(() => import("react-quill-new"), { ssr: false });

interface FormValues {
  title: string;
  content: string;
  coverImage?: File | null | string;
  published: boolean;
}

interface Props {
  initialData?: Partial<FormValues> & { id?: string };
}

const BlogForm = ({ initialData }: Props) => {
  const [imagePreview, setImagePreview] = useState<File | string | null>(
    initialData?.coverImage || null
  );
  const [loading, setLoading] = useState<boolean>(false);
  const form = useForm<FormValues>({
    defaultValues: {
      title: initialData?.title || "",
      content: initialData?.content || "",
      coverImage: initialData?.coverImage || null,
      published: initialData?.published || false,
    },
  });

  const router = useRouter();
  const id = initialData?.id;
  const { closeCurrentTab, open } = useTabular();

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];

    if (file) {
      form.setValue("coverImage", file);

      const reader = new FileReader();
      reader.onload = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  async function onSubmit(data: FormValues) {
    setLoading(true);

    try {
      const formData = new FormData();
      formData.append("title", data.title);
      formData.append("content", data.content);
      formData.append("published", data.published ? "true" : "false");

      if (data.coverImage) {
        formData.append("coverImage", data.coverImage);
      }

      if (initialData?.id) {
        formData.append("id", initialData.id);
      }

      const response = await axios({
        url: id ? `/api/dashboard/blogs/${id}` : "/api/dashboard/blogs",
        method: id ? "PUT" : "POST",
        data: formData,
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      if (response.status === 200 || response.status === 201) {
        toast.success(
          id ? "مقاله با موفقیت ویرایش شد" : "مقاله با موفقیت ایجاد شد"
        );
        closeCurrentTab();
        // اگر id وجود دارد، یعنی در حال ویرایش هستیم
        // پس باید به صفحه ویرایش برویم
        open(
          "/blogs/blogsForm",
          `فرم ویرایش ${response.data?.article?.title}`,
          {
            pageType: "EDIT",
            id: response.data?.article?.id,
          }
        );
      }
    } catch (error) {
      console.error("Error submitting form:", error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <Card className="relative shadow-lg rounded-2xl border">
      {loading && <FullScreenLoading />}
      <CardHeader>
        <CardTitle className="text-center text-xl font-bold">
          {initialData?.id ? "ویرایش مقاله" : "ایجاد مقاله جدید"}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* عنوان مقاله */}
            <FormField
              control={form.control}
              name="title"
              rules={{ required: "عنوان مقاله الزامی است" }}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>عنوان مقاله</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder="عنوان مقاله را وارد کنید"
                      className="rounded-lg"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* آپلود تصویر */}
            <FormItem>
              <FormLabel>تصویر کاور</FormLabel>
              <div className="flex flex-col gap-4">
                <div className="flex items-center gap-4">
                  <label
                    htmlFor="coverImage"
                    className="cursor-pointer border rounded-lg p-3 flex items-center gap-2 hover:bg-gray-100 transition"
                  >
                    <Upload size={16} />
                    انتخاب تصویر
                  </label>
                  <Input
                    id="coverImage"
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="hidden"
                  />

                  {(form.watch("coverImage") || imagePreview) && (
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        form.setValue("coverImage", null);
                        setImagePreview(null);
                      }}
                      className="flex items-center gap-1"
                    >
                      <Trash2 size={16} /> حذف تصویر
                    </Button>
                  )}
                </div>

                {imagePreview && (
                  <div className="relative w-full h-64 border rounded-lg overflow-hidden shadow">
                    <Image
                      src={
                        imagePreview instanceof File
                          ? URL.createObjectURL(imagePreview)
                          : imagePreview
                      }
                      alt="پیش‌نمایش تصویر"
                      fill
                      className="object-contain bg-gray-50"
                    />
                  </div>
                )}
              </div>
            </FormItem>

            {/* محتوای مقاله */}
            <FormField
              control={form.control}
              name="content"
              rules={{ required: "محتوای مقاله الزامی است" }}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>محتوای مقاله</FormLabel>
                  <FormControl>
                    <ReactQuill
                      theme="snow"
                      value={field.value}
                      onChange={field.onChange}
                      className="bg-white rounded-lg min-h-[250px]"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* وضعیت انتشار */}
            <FormField
              control={form.control}
              name="published"
              render={({ field }) => (
                <FormItem className="flex items-center justify-between rounded-lg border p-3 bg-gray-50">
                  <FormLabel>وضعیت انتشار</FormLabel>
                  <FormControl>
                    <SwitchRtl
                      checked={field.value}
                      onChange={field.onChange}
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            {/* دکمه‌ها */}
            <div className="flex justify-end gap-3 pt-4">
              <Button
                type="submit"
                variant="primary"
                disabled={loading}
                className="flex items-center gap-2"
              >
                <CheckIcon size={18} />
                {loading ? "در حال ذخیره..." : "ذخیره"}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={closeCurrentTab}
                className="flex items-center gap-2"
              >
                <X size={18} /> انصراف
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default BlogForm;
