"use client";

import { useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { User, Mail, Lock, Eye, EyeOff, XCircle } from "lucide-react";
import { useTranslations } from "next-intl";
import { Link, useRouter } from "@/i18n/navigation";

type RegisterFormData = {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
};

const RegisterPage = () => {
  const t = useTranslations("Register");
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<RegisterFormData>({
    mode: "onTouched",
  });

  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const password = watch("password");

  const togglePassword = () => setShowPassword((prev) => !prev);
  const toggleConfirmPassword = () => setShowConfirmPassword((prev) => !prev);

  const onSubmit: SubmitHandler<RegisterFormData> = async (data) => {
    try {
      const response = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (response.ok) {
        setMessage({ type: "success", text: t("REGISTRATION_SUCCESS") });
        router.replace("/auth/login");
      } else {
        setMessage({
          type: "error",
          text: result.message || t("REGISTRATION_ERROR"),
        });
      }
    } catch (error) {
      setMessage({ type: "error", text: t("REGISTRATION_ERROR") });
    }
  };

  const renderMessage = () => {
    if (!message) return null;

    return (
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
    );
  };

  const renderPasswordToggle = (show: boolean, toggle: () => void) => (
    <div
      className="absolute inset-y-0 left-0 flex items-center pl-3 cursor-pointer"
      onClick={toggle}
    >
      {show ? (
        <EyeOff className="h-5 w-5 text-gray-400" />
      ) : (
        <Eye className="h-5 w-5 text-gray-400" />
      )}
    </div>
  );

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-orange-500 to-orange-800 p-4 font-sans relative overflow-hidden">
      {/* Decorative Circles */}
      <div className="lg:block absolute hidden -bottom-20 -left-20 h-64 w-64 rounded-full bg-orange-600 opacity-20 filter blur-xl"></div>
      <div className="lg:block hidden absolute top-10 left-10 h-32 w-32 rounded-full bg-orange-700 opacity-20 filter blur-xl"></div>
      <div className="lg:block hidden absolute -top-32 right-20 h-80 w-80 rounded-full bg-orange-500 opacity-20 filter blur-xl"></div>

      <div className="relative z-10 w-full max-w-5xl overflow-hidden rounded-2xl bg-white shadow-2xl flex flex-col lg:flex-row">
        {/* Left Section */}
        <div className="hidden relative flex-1 bg-gradient-to-br from-orange-700 to-orange-900 p-8 text-white lg:flex flex-col justify-center items-center text-center lg:rounded-l-2xl lg:p-12 xl:p-16">
          <div className="absolute -bottom-10 left-10 h-48 w-48 rounded-full bg-orange-600 opacity-30 filter blur-lg"></div>
          <div className="absolute top-20 right-20 h-24 w-24 rounded-full bg-orange-500 opacity-40 filter blur-lg"></div>
          <div className="relative z-10 space-y-4">
            <h1 className="text-lg md:text-xl font-semibold">{t("WELCOME")}</h1>
            <p className="text-sm md:text-base text-orange-100 leading-relaxed max-w-sm mx-auto">
              {t("INTRO_TEXT")}
            </p>
          </div>
        </div>

        {/* Right Section */}
        <div className="flex-1 p-8 md:p-12 lg:p-16 space-y-8 bg-white lg:rounded-r-2xl">
          <div className="text-center">
            <h2 className="text-3xl font-extrabold text-gray-900 md:text-4xl">
              {t("CREATE_ACCOUNT_HEADING")}
            </h2>
          </div>

          {renderMessage()}

          <form
            onSubmit={handleSubmit(onSubmit)}
            className="space-y-6"
            noValidate
          >
            {/* Name Field */}
            <InputField
              id="name"
              icon={<User className="h-5 w-5 text-gray-400" />}
              placeholder={t("FULL_NAME_LABEL")}
              register={register("name", { required: t("FULL_NAME_REQUIRED") })}
              error={errors.name?.message}
            />

            {/* Email Field */}
            <InputField
              id="email"
              type="email"
              icon={<Mail className="h-5 w-5 text-gray-400" />}
              placeholder={t("EMAIL_LABEL")}
              register={register("email", {
                required: t("EMAIL_REQUIRED"),
                pattern: {
                  value: /^\S+@\S+\.\S+$/,
                  message: t("EMAIL_INVALID"),
                },
              })}
              error={errors.email?.message}
            />

            {/* Password Field */}
            <InputField
              id="password"
              type={showPassword ? "text" : "password"}
              icon={<Lock className="h-5 w-5 text-gray-400" />}
              placeholder={t("PASSWORD_LABEL")}
              register={register("password", {
                required: t("PASSWORD_REQUIRED"),
                minLength: { value: 8, message: t("PASSWORD_MIN_LENGTH") },
              })}
              error={errors.password?.message}
              toggle={renderPasswordToggle(showPassword, togglePassword)}
            />

            {/* Confirm Password Field */}
            <InputField
              id="confirmPassword"
              type={showConfirmPassword ? "text" : "password"}
              icon={<Lock className="h-5 w-5 text-gray-400" />}
              placeholder={t("CONFIRM_PASSWORD_LABEL")}
              register={register("confirmPassword", {
                required: t("CONFIRM_PASSWORD_REQUIRED"),
                validate: (value) =>
                  value === password || t("PASSWORDS_MISMATCH"),
              })}
              error={errors.confirmPassword?.message}
              toggle={renderPasswordToggle(
                showConfirmPassword,
                toggleConfirmPassword
              )}
            />

            {/* Submit Button */}
            <button
              type="submit"
              className="flex w-full justify-center rounded-md bg-orange-600 py-2 px-4 text-base font-medium text-white shadow-sm hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2"
            >
              {t("SIGN_UP_BUTTON")}
            </button>
          </form>

          <p className="text-center text-sm text-gray-600">
            {t("ALREADY_HAVE_ACCOUNT_QUESTION")}{" "}
            <Link
              href="/auth/login"
              className="font-medium text-orange-600 hover:text-orange-500"
            >
              {t("SIGN_IN_LINK")}
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

type InputFieldProps = {
  id: string;
  type?: string;
  icon: React.ReactNode;
  placeholder: string;
  register: any;
  error?: string;
  toggle?: React.ReactNode;
};

const InputField = ({
  id,
  type = "text",
  icon,
  placeholder,
  register,
  error,
  toggle,
}: InputFieldProps) => (
  <div>
    <label htmlFor={id} className="sr-only">
      {placeholder}
    </label>
    <div className="relative rounded-md shadow-sm">
      <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
        {icon}
      </div>
      <input
        id={id}
        type={type}
        autoComplete={id}
        placeholder={placeholder}
        {...register}
        className={`block w-full appearance-none rounded-md border pr-10 pl-10 py-2 placeholder-gray-400 focus:outline-none sm:text-sm ${
          error
            ? "border-red-500 focus:border-red-500 focus:ring-red-500"
            : "border-gray-300 focus:border-orange-500 focus:ring-orange-500"
        }`}
      />
      {toggle}
    </div>
    {error && <p className="text-xs text-red-600 mt-1">{error}</p>}
  </div>
);

export default RegisterPage;
