"use client";
import { Button } from "@/components/ui/button";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { ImageIcon, Plus, Trash2, Upload } from "lucide-react";
import Image from "next/image";
import React, { Dispatch, SetStateAction, useCallback, useState } from "react";
import { toast } from "sonner";

interface Props {
  fields: any[];
  append: any;
  remove: any;
  parentForm: any;
}

const ImagesUpload = ({ fields, append, remove, parentForm }: Props) => {
  const [imagePreviews, setImagePreviews] = useState<
    Record<number, string | null>
  >({});
  console.log({ parentForm, fields });

  const imageUrl = parentForm.getValues("");
  const isImageUrl = typeof imageUrl === "string" && imageUrl.length > 0;

  console.log({ imagePreviews, imageUrl });
  const handleImageChange = useCallback(
    (file: File | null, onChange: (val: any) => void, index: number) => {
      onChange(file);
      if (file) {
        const preview = URL.createObjectURL(file);
        setImagePreviews((prev) => ({ ...prev, [index]: preview }));
      } else {
        setImagePreviews((prev) => ({ ...prev, [index]: null }));
      }
    },
    []
  );

  return (
    <div className="border col-span-3 grid grid-cols-1 md:grid-cols-3 gap-4 p-4 rounded-md">
      <div className="flex justify-between items-center col-span-3">
        <h3>تنوع‌های رنگی</h3>
        <Tooltip>
          <TooltipTrigger asChild>
            <button
              type="button"
              onClick={() => {
                append({
                  colorName: "",
                  colorCode: "",
                  price: 0,
                  stock: 0,
                  image: null,
                });

                toast.success("فرم رنگ ایجاد شد");
              }}
              className="cursor-pointer hover:bg-orange-400 text-white rounded-full p-2 border bg-orange-500"
            >
              <Plus size={40} />
            </button>
          </TooltipTrigger>
          <TooltipContent>افزودن رنگ جدید</TooltipContent>
        </Tooltip>
      </div>
      {fields.map((field, index) => (
        <div
          key={field.id}
          className="border p-4 col-span-3 grid grid-cols-1 md:grid-cols-3 gap-4 relative"
        >
          <div className="absolute top-0 left-0 p-2 m-2 border flex justify-center items-center bg-red-400 rounded-full  hover:bg-red-500">
            <Tooltip>
              <TooltipTrigger asChild>
                <button
                  type="button"
                  onClick={() => {
                    if (fields.length === 1) return;
                    remove(index);
                    toast.success("فرم رنگ حذف شد");
                  }}
                  className="cursor-pointer text-white"
                >
                  <Trash2 />
                </button>
              </TooltipTrigger>
              <TooltipContent>حذف تصویر</TooltipContent>
            </Tooltip>
          </div>
          <FormField
            control={parentForm.control}
            name={`variations.${index}.colorName`}
            render={({ field }) => (
              <FormItem>
                <FormLabel>نام رنگ</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="نام رنگ" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={parentForm.control}
            name={`variations.${index}.price`}
            render={({ field }) => (
              <FormItem>
                <FormLabel>قیمت</FormLabel>
                <FormControl>
                  <Input type="number" {...field} placeholder="قیمت" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={parentForm.control}
            name={`variations.${index}.colorCode`}
            render={({ field }) => (
              <FormItem>
                <FormLabel>کد رنگ</FormLabel>
                <FormControl>
                  <Input type="color" className="w-32 max-w-32" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={parentForm.control}
            name={`variations.${index}.stock`}
            render={({ field }) => (
              <FormItem>
                <FormLabel>موجودی</FormLabel>
                <FormControl>
                  <Input type="number" {...field} placeholder="موجودی" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={parentForm.control}
            name={`variations.${index}.image`} // ✅ مهم
            render={({ field }) => (
              <FormItem className="col-span-1 md:col-span-3">
                <FormLabel className="font-medium">تصویر محصول</FormLabel>
                <FormControl>
                  <div className="flex items-center gap-4">
                    <label
                      htmlFor={`image-upload-${index}`}
                      className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 transition-colors"
                    >
                      <div className="flex flex-col items-center justify-center pt-5 pb-6">
                        <Upload className="w-8 h-8 mb-2 text-gray-500" />
                        <p className="text-sm text-gray-500">
                          تصویر را اینجا رها کنید یا کلیک کنید
                        </p>
                      </div>
                      <Input
                        id={`image-upload-${index}`}
                        name={`image-upload-${index}`}
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) =>
                          handleImageChange(
                            e.target.files?.[0] ?? null,
                            field.onChange,
                            index
                          )
                        }
                      />
                    </label>
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {(imagePreviews[index] || field.imageUrl) && (
            <div className="col-span-1 md:col-span-3">
              <div className="flex items-center gap-4">
                <div className="relative w-32 h-32 rounded-md overflow-hidden border border-gray-200">
                  {imagePreviews[index] ? (
                    <Image
                      src={imagePreviews[index] as string}
                      alt="پیش‌نمایش تصویر"
                      fill
                      className="object-cover"
                    />
                  ) : field.imageUrl ? (
                    <Image
                      src={field.imageUrl as string}
                      alt="تصویر محصول"
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-gray-100 flex items-center justify-center">
                      <ImageIcon className="w-8 h-8 text-gray-400" />
                    </div>
                  )}
                </div>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    parentForm.setValue(`variations.${index}.image`, null);
                    setImagePreviews((prev) => ({ ...prev, [index]: null }));
                  }}
                >
                  حذف تصویر
                </Button>
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default ImagesUpload;
