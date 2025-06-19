"use client";

import { useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { User, Lock, Eye, EyeOff, XCircle } from "lucide-react";
import { useTranslations } from "next-intl";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Link } from "@/i18n/navigation";

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

  const onSubmit: SubmitHandler<LoginFormData> = async (data) => {
    setMessage(null);
    const res = await signIn("credentials", {
      redirect: false,
      email: data.email,
      password: data.password,
      // rememberMe رو میتونی خودت دستی مدیریت کنی، یا از next-auth استفاده کن
    });

    if (res?.error) {
      setMessage({ type: "error", text: t("LOGIN_ERROR") });
    } else {
      setMessage({ type: "success", text: t("LOGIN_SUCCESS") });
      // بعد از لاگین موفق به صفحه دلخواه میریم
      router.push("/dashboard");
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
          <div className="relative z-10 space-y-4">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight">
              {t("WELCOME")}
            </h1>
            <p className="text-lg md:text-xl font-semibold">
              {t("YOUR_HEADLINE_NAME")}
            </p>
            <p className="text-sm md:text-base text-orange-100 leading-relaxed max-w-sm mx-auto">
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
              className="flex w-full justify-center rounded-md border border-transparent bg-orange-600 py-2 px-4 text-base font-medium text-white shadow-sm hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2"
            >
              {t("SIGN_IN_BUTTON")}
            </button>

            <div className="relative flex justify-center text-sm">
              <div className="bg-white z-10 px-2 text-gray-600">
                {t("OR_SEPARATOR")}
              </div>
              <div className="absolute inset-x-0 top-1/2 h-px -translate-y-1/2 bg-gray-300"></div>
            </div>

            <button
              type="button"
              className="flex w-full justify-center rounded-md border border-gray-300 bg-white py-2 px-4 text-base font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2"
              onClick={() => alert(t("SIGN_IN_OTHER_BUTTON"))}
            >
              {t("SIGN_IN_OTHER_BUTTON")}
            </button>

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
