"use client";

import { Button } from "@/components/ui/button";
import useDataGetter from "@/hooks/useDataGetter";
import { emitSocket } from "@/lib/socket";
import { cn, normalizePhoneNumber } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";
import { Loader2, Mail, MapPin, Phone, RefreshCcw, Send } from "lucide-react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

const ContactUsSchema = z.object({
  name: z.string().min(2, "نام باید حداقل ۲ کاراکتر باشد"),
  email: z.string().email("ایمیل معتبر نیست"),
  message: z
    .string()
    .min(5, "پیام باید حداقل ۵ کاراکتر باشد")
    .max(500, "پیام میتواند حداکثر ۵۰۰ کاراکتر باشد"),
  captcha: z.string().min(1, "کد امنیتی الزامی است"),
  mobile: z.string().superRefine((val, ctx) => {
    const normalized = normalizePhoneNumber(val);
    if (!/^09\d{9}$/.test(normalized)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "شماره موبایل معتبر نیست (باید با 09 شروع شود)",
      });
    }
  }),
});

type ContactUsFormValues = z.infer<typeof ContactUsSchema>;
export interface Data {
  status: number;
  message: string;
  description: string;
  id: string;
  name: string;
  email: string;
  createdAt: string;
  adminUsersIds?: { id: string }[];
  mobile?: string;
}

const ContactUs = () => {
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    setError,
    formState: { errors },
  } = useForm<ContactUsFormValues>({
    resolver: zodResolver(ContactUsSchema),
  });

  const { fetch: fetchCaptcha, data: captcha } = useDataGetter({
    url: "/captcha",
    responseType: "blob",
  });
  const { data, error, fetch, loading } = useDataGetter<Data>({
    url: "contact-us",
    immediatelyFetch: false,
    method: "POST",
    onFailure(error) {
      console.log(error?.response?.data, "error.response.data");

      toast.error(error?.response?.data?.message);
      if (error?.response?.data?.reason === "captcha") {
        setError("captcha", {
          message: error.response.data.message,
          type: "validate",
        });
      }
      fetchCaptcha?.({});
    },
    onSuccess(data) {
      window.scrollTo(0, 0);
      reset();
    },
  });

  const onSubmit = async (data: ContactUsFormValues) => {
    fetch?.({
      inputBody: { ...data },
    }).then((data) => {
      console.log({ data });

      data?.adminUsersIds?.forEach((item) => {
        emitSocket("new-notification", { toUserId: item.id });
      });
    });
  };
  console.log({ data });

  if (data?.id)
    return (
      <div className="min-h-screen mx-auto container mt-12 text-center">
        <div className="flex justify-center items-center gap-2">
          <h2 className="text-3xl">پیام شما با موفقیت ارسال شد</h2>
        </div>
        <DotLottieReact
          className="w-96 h-64 mx-auto"
          speed={0.75}
          src="/success.lottie"
          autoplay
          loop={false}
        />

        <div>{data?.description}</div>
      </div>
    );

  return (
    <div className="max-w-6xl mx-auto px-4 py-12 md:py-10">
      <div className="text-center mb-12 md:mb-16">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-800 dark:text-gray-50 mb-4">
          با ما در تماس باشید
        </h1>
        <p className="text-gray-600 dark:text-neutral-200 max-w-2xl mx-auto leading-relaxed text-base md:text-lg">
          سوال، پیشنهاد یا انتقاد دارید؟ فرم زیر را پر کنید تا در کوتاه‌ترین
          زمان با شما ارتباط بگیریم.
        </p>
      </div>

      <div className="bg-white  rounded-2xl shadow-lg overflow-hidden md:flex border border-gray-100">
        {/* Contact Information */}
        <div className="hidden md:flex md:w-2/5 bg-gradient-to-br from-orange-600 to-orange-400 p-8 md:p-10 text-white  flex-col justify-center relative">
          <div className="absolute inset-0 bg-white/10 backdrop-blur-sm" />
          <div className="relative z-10 space-y-8">
            <div>
              <h2 className="text-2xl font-bold mb-6">اطلاعات تماس</h2>
              <div className="text-gray-50">
                از طریق راه‌های زیر با ما در ارتباط باشید.
              </div>
            </div>

            <div className="space-y-6">
              <div className="flex items-start space-x-3 space-x-reverse">
                <div className="bg-gray-text-gray:bg-transparent p-2 rounded-lg mt-1">
                  <Phone className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-semibold">تلفن</h3>
                  <a href="tel:+989118286606" className="text-gray-50">
                    0911-828-6606
                  </a>
                </div>
              </div>

              <div className="flex items-start space-x-3 space-x-reverse">
                <div className="bg-gray-text-gray:bg-transparent p-2 rounded-lg mt-1">
                  <Mail className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-semibold">ایمیل</h3>
                  <a href="mailto:info@farachob.com" className="text-gray-50">
                    info@farachob.com
                  </a>
                </div>
              </div>

              <div className="flex items-start space-x-3 space-x-reverse">
                <div className="bg-blue-500/20 dark:bg-transparent p-2 rounded-lg mt-1">
                  <MapPin className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-semibold">آدرس</h3>
                  <p className="text-gray-50">
                    مازندران، بابل، شهرک صنعتی منصور کنده، مجتمع صنعتی فراچوب
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Contact Form */}
        <div className="md:w-3/5 p-8 md:p-10 bg-white dark:bg-gray-900">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-100 mb-2">
                  نام کامل <span className="text-red-500">*</span>
                </label>
                <input
                  {...register("name")}
                  className={cn(
                    "w-full px-4 py-3 rounded-lg border transition-all focus:ring-2 focus:ring-blue-500 focus:border-transparent",
                    errors.name ? "border-red-500" : "border-gray-300"
                  )}
                  placeholder="نام و نام خانوادگی"
                />
                {errors.name && (
                  <p className="mt-1 text-sm text-red-500">
                    {errors.name.message}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-100 mb-2">
                  شماره موبایل <span className="text-red-500">*</span>
                </label>
                <input
                  {...register("mobile")}
                  className={cn(
                    "w-full px-4 py-3 rounded-lg border transition-all focus:ring-2 focus:ring-blue-500 focus:border-transparent",
                    errors.name ? "border-red-500" : "border-gray-300"
                  )}
                  placeholder="شماره موبایل خود را وارد کنید..."
                />
                {errors.mobile && (
                  <p className="mt-1 text-sm text-red-500">
                    {errors.mobile?.message}
                  </p>
                )}
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-100 mb-2">
                  ایمیل <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  {...register("email")}
                  className={cn(
                    "w-full px-4 py-3 rounded-lg border transition-all focus:ring-2 focus:ring-blue-500 focus:border-transparent",
                    errors.email ? "border-red-500" : "border-gray-300"
                  )}
                  placeholder="example@domain.com"
                />
                {errors.email && (
                  <p className="mt-1 text-sm text-red-500">
                    {errors.email.message}
                  </p>
                )}
              </div>
            </div>

            {/* Message */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-100 mb-2">
                پیام شما <span className="text-red-500">*</span>
              </label>
              <textarea
                rows={4}
                {...register("message")}
                className={cn(
                  "w-full px-4 py-3 rounded-lg border transition-all focus:ring-2 focus:ring-blue-500 focus:border-transparent",
                  errors.message ? "border-red-500" : "border-gray-300"
                )}
                placeholder="متن پیام خود را اینجا بنویسید..."
                maxLength={501}
              />
              {errors.message && (
                <p className="mt-1 text-sm text-red-500">
                  {errors.message.message}
                </p>
              )}
            </div>

            {/* Captcha */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-100 mb-2">
                کد امنیتی <span className="text-red-500">*</span>
              </label>
              <div className="flex flex-col md:flex-row md:items-center gap-4">
                <input
                  type="text"
                  {...register("captcha")}
                  className={cn(
                    "px-4 py-3 rounded-lg border transition-all focus:ring-2 focus:ring-blue-500 focus:border-transparent md:max-w-[180px]",
                    errors.captcha ? "border-red-500" : "border-gray-300"
                  )}
                  placeholder="کد را وارد کنید"
                />
                <div className="flex-grow">
                  <div className="flex items-center gap-2">
                    {captcha ? (
                      <img
                        src={URL.createObjectURL(captcha)}
                        alt="CAPTCHA"
                        className="cursor-pointer rounded border border-gray-300"
                      />
                    ) : (
                      <div className="h-10 w-32 animate-pulse rounded bg-gray-200"></div>
                    )}
                    <Button
                      onClick={() => fetchCaptcha?.({})}
                      type="button"
                      size="icon"
                      left={<RefreshCcw className="h-4 w-4" />}
                      variant="ghost"
                      tooltip="دریافت مجدد کپچا"
                    />
                  </div>
                </div>
              </div>
              {errors.captcha && (
                <p className="mt-1 text-sm text-red-500">
                  {errors.captcha.message}
                </p>
              )}
            </div>

            {/* Submit */}
            <Button
              type="submit"
              disabled={loading}
              left={
                loading ? (
                  <Loader2 className="animate-spin ml-2 h-5 w-5" />
                ) : (
                  <Send className="ml-2 h-5 w-5" />
                )
              }
              className="w-full flex justify-center items-center px-6 py-3.5 rounded-lg shadow font-semibold text-white transition-all duration-300 disabled:cursor-not-allowed disabled:bg-neutral-500"
            >
              {loading ? "در حال ارسال..." : " ارسال پیام"}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ContactUs;
