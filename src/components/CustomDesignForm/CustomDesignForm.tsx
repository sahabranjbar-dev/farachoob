"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Upload,
  X,
  Palette,
  Ruler,
  Box,
  User,
  Phone,
  FileImage,
  RefreshCcw,
} from "lucide-react";
import { useState, useRef } from "react";
import useDataGetter from "@/hooks/useDataGetter";
import { normalizePhoneNumber } from "@/lib/utils";
import { toast } from "sonner";
import Image from "next/image";
import { AxiosError } from "axios";
import { emitSocket } from "@/lib/socket";

// ✅ اسکیمای ولیدیشن
const formSchema = z.object({
  name: z.string().min(3, "نام الزامی است"),
  mobile: z.string().superRefine((val, ctx) => {
    const normalized = normalizePhoneNumber(val);
    if (!/^09\d{9}$/.test(normalized)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "شماره موبایل معتبر نیست (باید با 09 شروع شود)",
      });
    }
  }),
  productType: z.string().min(2, "نوع محصول الزامی است"),
  dimensions: z.string().min(2, "ابعاد الزامی است"),
  material: z.string().min(2, "جنس الزامی است"),
  color: z.string(),
  description: z.string().optional(),
  captcha: z.string().min(4, "کد امنیتی الزامی است"),
});

type FormValues = z.infer<typeof formSchema>;

// 🎨 کامپوننت کاستوم Color Picker
function ColorPicker({
  value,
  onChange,
}: {
  value?: string;
  onChange: (val: string) => void;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const presetColors = [
    "#3b82f6",
    "#ef4444",
    "#10b981",
    "#f59e0b",
    "#8b5cf6",
    "#000000",
    "#ffffff",
    "#64748b",
  ];

  return (
    <div className="relative">
      <div
        className="flex items-center gap-3 cursor-pointer p-2 rounded-lg border border-gray-200 hover:border-gray-300 transition-colors w-fit"
        onClick={() => setIsOpen(!isOpen)}
      >
        <div
          className="w-8 h-8 rounded-md border border-gray-300"
          style={{ backgroundColor: value || "#000000" }}
        ></div>
        <span className="text-sm text-gray-700">
          {value ? value.toUpperCase() : "انتخاب رنگ"}
        </span>
        <Palette size={18} className="text-gray-500" />
      </div>

      {isOpen && (
        <div className="absolute top-full left-0 mt-2 bg-white p-4 rounded-xl shadow-lg border border-gray-100 z-10 w-64">
          <div className="grid grid-cols-4 gap-2 mb-3">
            {presetColors.map((color) => (
              <div
                key={color}
                className="w-8 h-8 rounded-md cursor-pointer border border-gray-200"
                style={{ backgroundColor: color }}
                onClick={() => {
                  onChange(color);
                  setIsOpen(false);
                }}
              ></div>
            ))}
          </div>
          <div className="flex items-center gap-2">
            <input
              type="color"
              value={value || "#000000"}
              onChange={(e) => onChange(e.target.value)}
              className="w-10 h-10 rounded-lg cursor-pointer border p-1"
            />
            <span
              className="text-sm text-gray-700"
              style={{ direction: "ltr" }}
            >
              {value || "#000000"}
            </span>
          </div>
        </div>
      )}
    </div>
  );
}

export default function CustomDesignForm() {
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors },
    setError,
  } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      color: "#3b82f6",
    },
  });

  const colorValue = watch("color");

  const { fetch: fetchCaptcha, data: captcha } = useDataGetter({
    url: "/captcha",
    responseType: "blob",
  });

  // 🛰️ useDataGetter برای submit
  const { loading, fetch } = useDataGetter({
    method: "POST",
    url: "/custom-design-request",
    immediatelyFetch: false,
  });

  // 📤 سابمیت فرم
  const onSubmit = async (values: FormValues) => {
    const formData = new FormData();

    // اضافه کردن فیلدهای متنی
    Object.entries(values).forEach(([key, value]) => {
      if (value) formData.append(key, value as any);
    });

    // اضافه کردن فایل‌ها با نام "images" (همانند backend)
    selectedFiles.forEach((file) => {
      formData.append("images", file);
    });

    fetch?.({
      inputBody: formData,
      headers: {
        // headers نباید برای FormData تعیین شود چون مرورگر به طور خودکار Content-Type را تنظیم می‌کند
      },
    })
      .then(
        (data: { adminsId: string[]; success: boolean; requestId: string }) => {
          if (!data?.success) return;
          toast.success("ارسال با موفقیت انجام شد");
          reset();
          setSelectedFiles([]);
          const adminsIds = data?.adminsId;
          adminsIds.forEach((item) => {
            emitSocket("new-notification", { toUserId: item });
          });
          fetchCaptcha?.({});
        }
      )
      .catch((err: AxiosError<{ error: string; reason: string }>) => {
        const error = err.response?.data;
        if (error?.reason === "captcha") {
          const message = error.error;
          setError("captcha", {
            message,
            type: "value",
          });
          fetchCaptcha?.({});
        } else {
          toast.error("ارسال با خطا مواجه شد");
        }
      });
  };

  // 📂 انتخاب چند فایل
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files ? Array.from(e.target.files) : [];
    if (files.length + selectedFiles.length > 10) {
      toast.warning("❌ حداکثر ۱۰ تصویر می‌توانید انتخاب کنید.");
      return;
    }
    setSelectedFiles((prev) => [...prev, ...files]);
  };

  // حذف فایل انتخاب شده
  const removeFile = (index: number) => {
    setSelectedFiles((prev) => prev.filter((_, i) => i !== index));
  };

  // دراگ و دراپ فایل‌ها
  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();

    const files = e.dataTransfer.files ? Array.from(e.dataTransfer.files) : [];
    if (files.length + selectedFiles.length > 10) {
      toast.warning("❌ حداکثر ۱۰ تصویر می‌توانید انتخاب کنید.");
      return;
    }
    setSelectedFiles((prev) => [...prev, ...files]);
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  };

  return (
    <section className="w-full py-20 bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-slate-900 dark:via-slate-800 dark:to-indigo-900">
      <div className="container mx-auto px-4 max-w-4xl">
        {/* هدر */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center p-4 bg-blue-100 dark:bg-blue-900/30 rounded-full mb-5">
            <Box className="h-8 w-8 text-blue-600 dark:text-blue-400" />
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-gray-800 dark:text-white mb-4">
            طراحی اختصاصی <span className="text-blue-600">فراچوب</span>
          </h2>
          <p className="text-gray-600 dark:text-gray-300 text-lg md:text-xl max-w-2xl mx-auto">
            ایده‌های خلاقانه خود را با ما به اشتراک بگذارید تا آن‌ها را به
            زیباترین محصولات چوبی تبدیل کنیم.
          </p>
        </div>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-white dark:bg-slate-800 p-8 md:p-10 rounded-2xl shadow-xl border border-gray-100 dark:border-slate-700"
          encType="multipart/form-data"
        >
          {/* نام */}
          <div className="flex flex-col">
            <label className="font-medium text-gray-700 dark:text-gray-300 mb-2 flex items-center gap-2">
              <User size={18} />
              نام و نام خانوادگی <span className="text-red-500">*</span>
            </label>
            <Input
              placeholder="مثلاً علی رضایی"
              {...register("name")}
              className="py-6 px-4 rounded-xl border-gray-200 dark:border-slate-600 dark:bg-slate-700 dark:text-white"
            />
            {errors.name && (
              <span className="text-red-500 text-sm mt-2 flex items-center gap-1">
                <X size={14} />
                {errors.name.message}
              </span>
            )}
          </div>

          {/* موبایل */}
          <div className="flex flex-col">
            <label className="font-medium text-gray-700 dark:text-gray-300 mb-2 flex items-center gap-2">
              <Phone size={18} />
              شماره موبایل <span className="text-red-500">*</span>
            </label>
            <Input
              placeholder="09123456789"
              {...register("mobile")}
              className="py-6 px-4 rounded-xl border-gray-200 dark:border-slate-600 dark:bg-slate-700 dark:text-white"
            />
            {errors.mobile && (
              <span className="text-red-500 text-sm mt-2 flex items-center gap-1">
                <X size={14} />
                {errors.mobile.message}
              </span>
            )}
          </div>

          {/* نوع محصول */}
          <div className="flex flex-col">
            <label className="font-medium text-gray-700 dark:text-gray-300 mb-2 flex items-center gap-2">
              <Box size={18} />
              نوع محصول <span className="text-red-500">*</span>
            </label>
            <Input
              placeholder="میز، صندلی، تخت ..."
              {...register("productType")}
              className="py-6 px-4 rounded-xl border-gray-200 dark:border-slate-600 dark:bg-slate-700 dark:text-white"
            />
            {errors.productType && (
              <span className="text-red-500 text-sm mt-2 flex items-center gap-1">
                <X size={14} />
                {errors.productType.message}
              </span>
            )}
          </div>

          {/* ابعاد */}
          <div className="flex flex-col">
            <label className="font-medium text-gray-700 dark:text-gray-300 mb-2 flex items-center gap-2">
              <Ruler size={18} />
              ابعاد محصول <span className="text-red-500">*</span>
            </label>
            <Input
              placeholder="مثلاً 120x80 سانتی‌متر"
              {...register("dimensions")}
              className="py-6 px-4 rounded-xl border-gray-200 dark:border-slate-600 dark:bg-slate-700 dark:text-white"
            />
            {errors.dimensions && (
              <span className="text-red-500 text-sm mt-2 flex items-center gap-1">
                <X size={14} />
                {errors.dimensions.message}
              </span>
            )}
          </div>

          {/* جنس */}
          <div className="flex flex-col">
            <label className="font-medium text-gray-700 dark:text-gray-300 mb-2">
              جنس محصول <span className="text-red-500">*</span>
            </label>
            <Input
              placeholder="چوب، فلز، ترکیبی ..."
              {...register("material")}
              className="py-6 px-4 rounded-xl border-gray-200 dark:border-slate-600 dark:bg-slate-700 dark:text-white"
            />
            {errors.material && (
              <span className="text-red-500 text-sm mt-2 flex items-center gap-1">
                <X size={14} />
                {errors.material.message}
              </span>
            )}
          </div>

          {/* رنگ */}
          <div className="flex flex-col">
            <label className="font-medium text-gray-700 dark:text-gray-300 mb-2">
              رنگ محصول
            </label>
            <ColorPicker
              value={colorValue}
              onChange={(val) => setValue("color", val)}
            />
          </div>

          {/* توضیحات */}
          <div className="flex flex-col md:col-span-2">
            <label className="font-medium text-gray-700 dark:text-gray-300 mb-2">
              توضیحات اضافی
            </label>
            <Textarea
              placeholder="اگر توضیحات بیشتری دارید اینجا بنویسید..."
              {...register("description")}
              className="min-h-32 py-4 px-4 rounded-xl border-gray-200 dark:border-slate-600 dark:bg-slate-700 dark:text-white"
            />
          </div>

          {/* آپلود فایل */}
          <div className="flex flex-col md:col-span-2">
            <label className="font-medium text-gray-700 dark:text-gray-300 mb-2 flex items-center gap-2">
              <FileImage size={18} />
              آپلود تصاویر طرح (حداکثر ۱۰ تصویر)
            </label>

            <div
              className="relative border-2 border-dashed border-gray-300 dark:border-slate-600 rounded-2xl p-8 text-center cursor-pointer transition-all hover:border-blue-400 hover:bg-blue-50 dark:hover:bg-slate-700/50"
              onClick={() => fileInputRef.current?.click()}
              onDrop={handleDrop}
              onDragOver={handleDragOver}
            >
              <input
                type="file"
                multiple
                accept="image/*"
                onChange={handleFileChange}
                className="absolute inset-0 opacity-0 cursor-pointer"
                ref={fileInputRef}
                name="images"
              />
              <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 dark:bg-blue-900/30 rounded-full mb-4">
                <Upload className="h-8 w-8 text-blue-600 dark:text-blue-400" />
              </div>
              <p className="text-gray-600 dark:text-gray-400 text-base mb-2">
                تصاویر خود را انتخاب یا اینجا رها کنید
              </p>
              <p className="text-gray-500 dark:text-gray-500 text-sm">
                فرمت‌های مجاز: JPG, PNG, GIF (حداکثر ۱۰ فایل)
              </p>
            </div>

            {selectedFiles.length > 0 && (
              <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
                {selectedFiles.map((file, idx) => (
                  <div key={idx} className="relative group">
                    <div className="h-24 rounded-lg bg-gray-100 dark:bg-slate-700 flex items-center justify-center overflow-hidden">
                      {file.type.startsWith("image/") ? (
                        <img
                          src={URL.createObjectURL(file)}
                          alt={file.name}
                          className="object-cover h-full w-full"
                        />
                      ) : (
                        <FileImage className="h-8 w-8 text-gray-400" />
                      )}
                    </div>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        removeFile(idx);
                      }}
                      className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <X size={14} />
                    </button>
                    <p className="text-xs text-gray-500 dark:text-gray-400 truncate mt-1">
                      {file.name}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* دکمه */}
          <div className="md:col-span-2 flex flex-col items-center mt-4 gap-2">
            <div className="flex items-center gap-2">
              {captcha ? (
                <Image
                  src={URL.createObjectURL(captcha)}
                  alt="CAPTCHA"
                  width={100}
                  height={50}
                  className="cursor-pointer rounded border border-gray-300"
                  unoptimized
                />
              ) : (
                <div className="h-10 w-32 animate-pulse rounded bg-gray-200"></div>
              )}
              <Button
                onClick={() => fetchCaptcha?.({})}
                type="button"
                size="icon"
                variant="ghost"
              >
                <RefreshCcw className="h-4 w-4" />
              </Button>
            </div>

            <div className="">
              <Input
                placeholder="کد امنیتی"
                {...register("captcha")}
                required={false}
                className="dark:bg-gray-800"
              />
              {errors.captcha && (
                <p className="mt-1 text-sm text-red-500">
                  {errors.captcha.message}
                </p>
              )}
            </div>
            <Button
              type="submit"
              disabled={loading}
              className="px-12 py-6 text-lg rounded-xl bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-700 hover:to-indigo-800 transition-all shadow-lg hover:shadow-blue-500/25"
            >
              {loading ? (
                <div className="flex items-center gap-2">
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  در حال ارسال...
                </div>
              ) : (
                "ثبت سفارش طراحی"
              )}
            </Button>
          </div>
        </form>

        {/* اطلاعات تماس */}
        <div className="text-center mt-10 text-gray-600 dark:text-gray-400 text-sm">
          <p>در صورت نیاز به راهنمایی بیشتر با پشتیبانی فراچوب تماس بگیرید</p>
        </div>
      </div>
    </section>
  );
}
