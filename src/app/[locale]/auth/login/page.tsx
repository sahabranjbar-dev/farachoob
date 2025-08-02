"use client";

import { useEffect, useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { User, Lock, Eye, EyeOff, XCircle } from "lucide-react";
import { useTranslations } from "next-intl";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import { Link } from "@/i18n/navigation";
import Image from "next/image";
import Spinner from "@/components/Spinner";

type LoginFormData = {
  email: string; // بهتره با ایمیل لاگین کنیم چون شما تو authOptions ایمیل رو چک میکنی
  password: string;
  rememberMe: boolean;
};

const LoginPage = () => {
  const t = useTranslations("Login");
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    mode: "onTouched",
  });

  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const onSubmit: SubmitHandler<LoginFormData> = async (data) => {
    setMessage(null);
    setLoading(true);
    const res = await signIn("credentials", {
      redirect: false,
      email: data.email,
      password: data.password,
      // rememberMe رو میتونی خودت دستی مدیریت کنی، یا از next-auth استفاده کن
    });
    setLoading(false);
    if (res?.error) {
      setMessage({ type: "error", text: t("LOGIN_ERROR") });
    } else {
      setMessage({ type: "success", text: t("LOGIN_SUCCESS") });
      // بعد از لاگین موفق به صفحه دلخواه میریم
      router.push("/");
    }
  };

  const searchParams = useSearchParams();
  const error = searchParams.get("error");

  useEffect(() => {
    if (error === "CredentialsSignin") {
      setMessage({ type: "error", text: t("LOGIN_ERROR") });
    }
  }, [error]);
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
          <div className="relative z-10 space-y-4">
            {/* <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight">
              {t("WELCOME")}
            </h1> */}
            <p className="text-lg md:text-xl font-semibold">
              {t("YOUR_HEADLINE_NAME")}
            </p>
            <p className="text-sm md:text-base text-orange-100 leading-relaxed max-w-sm mx-auto text-justify">
              {t("INTRO_TEXT")}
            </p>
          </div>
        </div>

        <div className="flex-1 p-8 md:p-12 lg:p-16 space-y-8 bg-white lg:rounded-r-2xl">
          <div className="text-left">
            <h2 className="text-3xl font-extrabold text-gray-900 md:text-4xl">
              {t("SIGN_IN_HEADING")}
            </h2>
            <p className="mt-1 text-sm text-gray-700">
              {t("SIGN_IN_SUBHEADING")}
            </p>
          </div>

          {message && (
            <div
              className={`rounded-md p-3 text-sm font-medium flex items-center justify-between ${
                message.type === "success"
                  ? "bg-green-100 text-green-800"
                  : "bg-red-100 text-red-800"
              }`}
              role="alert"
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

          <form
            onSubmit={handleSubmit(onSubmit)}
            className="space-y-6"
            noValidate
          >
            <div>
              <label htmlFor="email" className="sr-only">
                {t("EMAIL_LABEL")}
              </label>
              <div className="relative rounded-md shadow-sm">
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
                  <User className="h-5 w-5 text-gray-500" aria-hidden="true" />
                </div>
                <input
                  id="email"
                  type="email"
                  autoComplete="email"
                  placeholder={t("EMAIL_LABEL")}
                  {...register("email", {
                    required: t("EMAIL_REQUIRED"),
                    pattern: {
                      value: /^\S+@\S+\.\S+$/,
                      message: t("EMAIL_INVALID"),
                    },
                  })}
                  className={`block w-full appearance-none rounded-md border pr-10 pl-3 py-2 placeholder-gray-500 focus:outline-none sm:text-sm ${
                    errors.email
                      ? "border-red-500 focus:border-red-500 focus:ring-red-500"
                      : "border-gray-300 focus:border-orange-500 focus:ring-orange-500"
                  }`}
                />
              </div>
              {errors.email && (
                <p className="text-xs text-red-600 mt-1">
                  {errors.email.message}
                </p>
              )}
            </div>

            <div>
              <label htmlFor="password" className="sr-only">
                {t("PASSWORD_LABEL")}
              </label>
              <div className="relative rounded-md shadow-sm">
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
                  <Lock className="h-5 w-5 text-gray-500" aria-hidden="true" />
                </div>
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  placeholder={t("PASSWORD_LABEL")}
                  {...register("password", {
                    required: t("PASSWORD_REQUIRED"),
                    minLength: {
                      value: 8,
                      message: t("PASSWORD_MIN_LENGTH"),
                    },
                  })}
                  className={`block w-full appearance-none rounded-md border pl-10 pr-10 py-2 placeholder-gray-500 focus:outline-none sm:text-sm ${
                    errors.password
                      ? "border-red-500 focus:border-red-500 focus:ring-red-500"
                      : "border-gray-300 focus:border-orange-500 focus:ring-orange-500"
                  }`}
                />
                <div
                  className="absolute inset-y-0 left-0 flex items-center pl-3 cursor-pointer"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5 text-gray-500" />
                  ) : (
                    <Eye className="h-5 w-5 text-gray-500" />
                  )}
                </div>
              </div>
              {errors.password && (
                <p className="text-xs text-red-600 mt-1">
                  {errors.password.message}
                </p>
              )}
            </div>

            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-2">
                <input
                  id="remember-me"
                  type="checkbox"
                  {...register("rememberMe")}
                  className="h-4 w-4 text-orange-600 focus:ring-orange-500 border-gray-300 rounded"
                />
                <label
                  htmlFor="remember-me"
                  className="ml-2 block text-gray-800"
                >
                  {t("REMEMBER_ME")}
                </label>
              </div>
              <a
                href="#"
                className="font-medium text-orange-600 hover:text-orange-500"
              >
                {t("FORGOT_PASSWORD")}
              </a>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="disabled:bg-neutral-500 disabled:cursor-not-allowed flex w-full justify-center rounded-md border border-transparent bg-orange-600 py-2 px-4 text-base font-medium text-white shadow-sm hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2"
            >
              {loading ? (
                <div className="flex justify-center items-center">
                  <div role="status">
                    <svg
                      aria-hidden="true"
                      className="w-8 h-8 text-gray-200 animate-spin dark:text-gray-600 fill-gray-400"
                      viewBox="0 0 100 101"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                        fill="currentColor"
                      />
                      <path
                        d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                        fill="currentFill"
                      />
                    </svg>
                    <span className="sr-only">Loading...</span>
                  </div>
                </div>
              ) : (
                t("SIGN_IN_BUTTON")
              )}
            </button>

            <div className="relative flex justify-center text-sm">
              <div className="bg-white z-10 px-2 text-gray-600">
                {t("OR_SEPARATOR")}
              </div>
              <div className="absolute inset-x-0 top-1/2 h-px -translate-y-1/2 bg-gray-300"></div>
            </div>

            <Link
              href="/auth/OTP"
              className="flex w-full justify-center rounded-md border border-gray-300 bg-white py-2 px-4 text-base font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2"
            >
              {t("SIGN_IN_OTHER_BUTTON")}
            </Link>

            <p className="text-center text-sm text-gray-700">
              {t("NO_ACCOUNT_QUESTION")}{" "}
              <Link
                href="/auth/register"
                className="font-medium text-orange-600 hover:text-orange-500"
              >
                {t("SIGN_UP_LINK")}
              </Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
