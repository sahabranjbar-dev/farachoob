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
import React, { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";
import { UseFieldArrayReturn, UseFormReturn } from "react-hook-form";
import { FormValues } from "./ProductsForm";

interface Props {
  fields: any[];
  append: UseFieldArrayReturn<FormValues, "variations">["append"];
  remove: UseFieldArrayReturn<FormValues, "variations">["remove"];
  parentForm: UseFormReturn<FormValues>;
}

const ImagesUpload = ({ fields, append, remove, parentForm }: Props) => {
  const [imagePreviews, setImagePreviews] = useState<
    Record<number, string | null>
  >({});

  // بارگذاری پیش‌نمایش‌های موجود از مقادیر اولیه
  useEffect(() => {
    const initialPreviews: Record<number, string> = {};

    fields.forEach((field, index) => {
      const variation = parentForm.getValues(`variations.${index}`);
      if (variation?.imageUrl) {
        initialPreviews[index] = variation.imageUrl;
      }
    });

    setImagePreviews(initialPreviews);
  }, [fields, parentForm]);

  const validateImageFile = (file: File | null): boolean => {
    if (!file) return true;

    const validTypes = ["image/jpeg", "image/png", "image/webp"];
    const maxSize = 5 * 1024 * 1024;

    if (!validTypes.includes(file.type)) {
      toast.error("فرمت فایل باید JPEG, PNG یا WebP باشد");
      return false;
    }

    if (file.size > maxSize) {
      toast.error("حجم فایل نباید بیشتر از ۵ مگابایت باشد");
      return false;
    }

    return true;
  };

  const handleImageChange = useCallback(
    (file: File | null, onChange: (val: any) => void, index: number) => {
      if (file && !validateImageFile(file)) {
        return;
      }

      onChange(file);

      // پاکسازی preview قبلی اگر وجود داشت
      if (imagePreviews[index] && imagePreviews[index]?.startsWith("blob:")) {
        URL.revokeObjectURL(imagePreviews[index]!);
      }

      if (file) {
        const preview = URL.createObjectURL(file);
        setImagePreviews((prev) => ({ ...prev, [index]: preview }));
      } else {
        setImagePreviews((prev) => ({ ...prev, [index]: null }));
      }
    },
    [imagePreviews]
  );

  // پاکسازی URLهای موقت
  useEffect(() => {
    return () => {
      Object.values(imagePreviews).forEach((preview) => {
        if (preview && preview.startsWith("blob:")) {
          URL.revokeObjectURL(preview);
        }
      });
    };
  }, []);

  return (
    <div className="border col-span-3 grid grid-cols-1 md:grid-cols-3 gap-4 p-4 rounded-md">
      <div className="flex justify-between items-center col-span-3">
        <h3 className="text-lg font-semibold">تنوع‌های رنگی</h3>
        <Tooltip>
          <TooltipTrigger asChild>
            <button
              type="button"
              onClick={() => {
                append({
                  colorName: "",
                  colorCode: "#000000",
                  price: 0,
                  stock: 0,
                  image: null,
                  imageUrl: "",
                });
                toast.success("فرم رنگ ایجاد شد");
              }}
              className="cursor-pointer hover:bg-orange-400 text-white rounded-full p-2 border bg-orange-500 transition-colors"
            >
              <Plus size={20} />
            </button>
          </TooltipTrigger>
          <TooltipContent>افزودن رنگ جدید</TooltipContent>
        </Tooltip>
      </div>

      {fields.map((field, index) => {
        const variation = parentForm.getValues(`variations.${index}`);

        return (
          <div
            key={field.id}
            className="border p-4 col-span-3 grid grid-cols-1 md:grid-cols-3 gap-4 relative rounded-lg"
          >
            {fields.length > 1 && (
              <div className="absolute top-0 left-0 p-2 m-2 border flex justify-center items-center bg-red-400 rounded-full hover:bg-red-500 transition-colors">
                <Tooltip>
                  <TooltipTrigger asChild>
                    <button
                      type="button"
                      onClick={() => {
                        remove(index);
                        toast.success("فرم رنگ حذف شد");
                      }}
                      className="cursor-pointer text-white"
                    >
                      <Trash2 size={16} />
                    </button>
                  </TooltipTrigger>
                  <TooltipContent>حذف رنگ</TooltipContent>
                </Tooltip>
              </div>
            )}

            <FormField
              control={parentForm.control}
              name={`variations.${index}.colorName`}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>نام رنگ</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="مثلاً: قرمز" />
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
                  <FormLabel>قیمت (تومان)</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder="0"
                      onChange={(e) => {
                        const value = e.target.value.replace(/[^0-9]/g, "");
                        field.onChange(value ? parseInt(value) : 0);
                      }}
                      value={field?.value?.toLocaleString("fa-IR")}
                    />
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
                    <div className="flex items-center gap-2">
                      <Input type="color" className="w-20" {...field} />
                      <Input
                        type="text"
                        value={field.value}
                        onChange={field.onChange}
                        placeholder="#000000"
                        className="flex-1"
                      />
                    </div>
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
                    <Input
                      type="number"
                      {...field}
                      placeholder="0"
                      onChange={(e) =>
                        field.onChange(parseInt(e.target.value) || 0)
                      }
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={parentForm.control}
              name={`variations.${index}.image`}
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
                          <p className="text-xs text-gray-400 mt-1">
                            JPEG, PNG, WebP - حداکثر ۵MB
                          </p>
                        </div>
                        <Input
                          id={`image-upload-${index}`}
                          type="file"
                          accept="image/jpeg,image/png,image/webp"
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

            {/* نمایش تصویر */}
            <div className="col-span-1 md:col-span-3">
              <div className="flex items-center gap-4">
                <div className="relative w-32 h-32 rounded-md overflow-hidden border border-gray-200">
                  {imagePreviews[index] ? (
                    <Image
                      src={imagePreviews[index]}
                      alt={`پیش‌نمایش رنگ ${variation?.colorName || index + 1}`}
                      fill
                      className="object-cover"
                      unoptimized
                    />
                  ) : (
                    <div className="w-full h-full bg-gray-100 flex items-center justify-center">
                      <ImageIcon className="w-8 h-8 text-gray-400" />
                    </div>
                  )}
                </div>

                {imagePreviews[index] && (
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      parentForm.setValue(`variations.${index}.image`, null);
                      setImagePreviews((prev) => {
                        const newPreviews = { ...prev };
                        if (newPreviews[index]?.startsWith("blob:")) {
                          URL.revokeObjectURL(newPreviews[index]!);
                        }
                        delete newPreviews[index];
                        return newPreviews;
                      });
                    }}
                  >
                    حذف تصویر
                  </Button>
                )}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default ImagesUpload;
