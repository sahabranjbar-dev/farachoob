"use client";

import { Input } from "@/components/ui/input";
import { Link } from "@/i18n/navigation";
import { XCircle } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";

type FormData = {
  mobile: string;
};

const LoginWithPhone = () => {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>();

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  const onSubmit = async (data: FormData) => {
    try {
      const response = await fetch("https://api.sms.ir/v1/send/verify", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "text/plain",
          "x-api-key": "fz3cwtYml9c7vz8FfxqmVVqLzGWmEwiaBr0CvVv09YXntNWr",
        },
        body: JSON.stringify({
          mobile: data?.mobile,
          templateId: 722649,
          parameters: [
            {
              name: "CODE",
              value: "12345",
            },
          ],
        }),
      });
      // نگهداری confirmation برای وارد کردن کد بعدی
      // setConfirm(confirmation); // یا تو context بذار
      const result = await response.json();
    } catch (error) {
      console.error("خطا در ارسال OTP:", error);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-orange-500 to-orange-800 p-4 relative overflow-hidden">
      <div className="hidden lg:block absolute -bottom-20 -left-20 h-64 w-64 rounded-full bg-orange-600 opacity-20 filter blur-xl"></div>
      <div className="hidden lg:block absolute top-10 left-10 h-32 w-32 rounded-full bg-orange-700 opacity-20 filter blur-xl"></div>
      <div className="hidden lg:block absolute -top-32 right-20 h-80 w-80 rounded-full bg-orange-500 opacity-20 filter blur-xl"></div>

      <div className="max-w-[1020px] container mx-auto relative z-10 w-full overflow-hidden rounded-2xl bg-white shadow-2xl flex flex-col lg:flex-row">
        <div className="hidden relative flex-1 bg-gradient-to-br from-orange-700 to-orange-900 p-8 text-white lg:flex flex-col justify-center items-center text-center lg:rounded-l-2xl lg:p-12 xl:p-16">
          <div className="absolute -bottom-10 left-10 h-48 w-48 rounded-full bg-orange-600 opacity-30 filter blur-lg"></div>
          <div className="absolute top-20 right-20 h-24 w-24 rounded-full bg-orange-500 opacity-40 filter blur-lg"></div>
          <div className="mb-16">
            <Link href="/">
              <Image
                alt="logo"
                src="/logo.webp"
                width={200}
                height={200}
                className="p-2 rounded-2xl dark:bg-transparent"
              />
            </Link>
          </div>
        </div>

        <div className="flex-1 p-8 md:p-12 lg:p-16 space-y-8 bg-white lg:rounded-r-2xl">
          <div className="text-left">
            <p className="text-center text-md font-extrabold text-gray-900 md:text-2xl">
              .لطفا شماره موبایل خود را وارد نمایید
            </p>
            {/* <p className="mt-1 text-sm text-gray-700">SIGN_IN_SUBHEADING</p> */}
          </div>

          <>
            {message && (
              <div
                className={`rounded-md p-3 text-sm font-medium flex items-center justify-between ${
                  message.type === "success"
                    ? "bg-green-100 text-green-800"
                    : "bg-red-100 text-red-800"
                }`}
              >
                <span>{message.text}</span>
                <button
                  onClick={() => setMessage(null)}
                  className="ml-4 text-current hover:opacity-75"
                >
                  <XCircle size={18} />
                </button>
              </div>
            )}

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div>
                {/* <label
                  htmlFor="mobile"
                  className="block text-sm font-medium text-gray-700"
                >
                  شماره موبایل
                </label> */}
                <Input
                  id="mobile"
                  type="tel"
                  placeholder="مثلاً 09123456789"
                  {...register("mobile", {
                    required: "شماره موبایل الزامی است",
                    // pattern: {
                    //   value: /^09\d{9}$/,
                    //   message: "فرمت شماره موبایل صحیح نیست",
                    // },
                  })}
                  className={`w-full px-4 py-2 mt-1 border rounded-md focus:outline-none ${
                    errors.mobile ? "border-red-500" : "border-gray-300"
                  }`}
                />
                {errors.mobile && (
                  <p className="text-xs text-red-600 mt-1">
                    {errors.mobile.message}
                  </p>
                )}
              </div>

              {/* <InputOTPWithSeparator /> */}

              <button
                type="submit"
                disabled={loading}
                className="w-full py-2 px-4 bg-orange-600 text-white font-semibold rounded-md hover:bg-orange-700 transition disabled:bg-gray-400"
              >
                {loading ? "در حال ارسال..." : "ارسال کد تأیید"}
              </button>
            </form>
            {/* مهم! این div باید داخل صفحه باشه */}
            <div id="recaptcha-container"></div>
          </>
        </div>
      </div>
    </div>
  );
};

export default LoginWithPhone;
