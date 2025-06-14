"use client";

import { useState } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { User, Mail, Lock, Eye, EyeOff, XCircle } from 'lucide-react';
import { useTranslations } from 'next-intl'; // Import useTranslations

type RegisterFormData = {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
};

const RegisterPage = () => {
  const t = useTranslations("Register"); // Initialize useTranslations for the "Register" namespace

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<RegisterFormData>({
    mode: 'onTouched',
  });

  const password = watch('password');

  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>({text: "خطایی رخ داده است", type: "error"});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const onSubmit: SubmitHandler<RegisterFormData> = (data) => {
    console.log('Registration Data:', data);
    // Simulate API call success/failure
    const success = true; // In a real app, this would be based on API response
    if (success) {
      setMessage({ type: 'success', text: t('REGISTRATION_SUCCESS') });
    } else {
      setMessage({ type: 'error', text: t('REGISTRATION_ERROR') });
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-orange-500 to-orange-800 p-4 font-sans relative overflow-hidden">
      {/* Decorative Circles */}
      <div className="lg:block absolute hidden -bottom-20 -left-20 h-64 w-64 rounded-full bg-orange-600 opacity-20 filter blur-xl"></div>
      <div className="lg:block hidden absolute top-10 left-10 h-32 w-32 rounded-full bg-orange-700 opacity-20 filter blur-xl"></div>
      <div className="lg:block hidden absolute -top-32 right-20 h-80 w-80 rounded-full bg-orange-500 opacity-20 filter blur-xl"></div>

      <div className="relative z-10 w-full max-w-5xl overflow-hidden rounded-2xl bg-white shadow-2xl flex flex-col lg:flex-row">
        {/* Left Section (Welcome) */}
        <div className="hidden relative flex-1 bg-gradient-to-br from-orange-700 to-orange-900 p-8 text-white lg:flex flex-col justify-center items-center text-center lg:rounded-l-2xl lg:p-12 xl:p-16">
          <div className="absolute -bottom-10 left-10 h-48 w-48 rounded-full bg-orange-600 opacity-30 filter blur-lg"></div>
          <div className="absolute top-20 right-20 h-24 w-24 rounded-full bg-orange-500 opacity-40 filter blur-lg"></div>
          <div className="relative z-10 space-y-4">
            <h1 className="text-lg md:text-xl font-semibold">
              {t('WELCOME')}
            </h1>
            <p className="text-sm md:text-base text-orange-100 leading-relaxed max-w-sm mx-auto">
              {t('INTRO_TEXT')}
            </p>
          </div>
        </div>

        {/* Right Section (Register Form) */}
        <div className="flex-1 p-8 md:p-12 lg:p-16 space-y-8 bg-white lg:rounded-r-2xl">
          <div className="text-center">
            <h2 className="text-3xl font-extrabold text-gray-900 md:text-4xl">
              {t('CREATE_ACCOUNT_HEADING')}
            </h2>
          </div>

          {/* Message Box */}
          {message && (
            <div
              className={`rounded-md p-3 text-sm font-medium flex items-center justify-between ${
                message.type === 'success'
                  ? 'bg-green-100 text-green-800'
                  : 'bg-red-100 text-red-800'
              }`}
              role="alert"
            >
              <span>{message.text}</span>
              <button onClick={() => setMessage(null)} className="ml-4 text-current hover:opacity-75">
                <XCircle size={18} />
              </button>
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6" noValidate>
            {/* Name Field */}
            <div>
              <label htmlFor="name" className="sr-only">
                {t('FULL_NAME_LABEL')}
              </label>
              <div className="relative rounded-md shadow-sm">
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
                  <User className="h-5 w-5 text-gray-400" aria-hidden="true" />
                </div>
                <input
                  id="name"
                  type="text"
                  autoComplete="name"
                  placeholder={t('FULL_NAME_LABEL')}
                  {...register('name', {
                    required: t('FULL_NAME_REQUIRED'),
                  })}
                  className={`block w-full appearance-none rounded-md border pr-10 pl-3 py-2 placeholder-gray-400 focus:outline-none sm:text-sm ${
                    errors.name
                      ? 'border-red-500 focus:border-red-500 focus:ring-red-500'
                      : 'border-gray-300 focus:border-orange-500 focus:ring-orange-500'
                  }`}
                />
              </div>
              {errors.name && (
                <p className="text-xs text-red-600 mt-1">{errors.name.message}</p>
              )}
            </div>

            {/* Email Field */}
            <div>
              <label htmlFor="email" className="sr-only">
                {t('EMAIL_LABEL')}
              </label>
              <div className="relative rounded-md shadow-sm">
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
                  <Mail className="h-5 w-5 text-gray-400" aria-hidden="true" />
                </div>
                <input
                  id="email"
                  type="email"
                  autoComplete="email"
                  placeholder={t('EMAIL_LABEL')}
                  {...register('email', {
                    required: t('EMAIL_REQUIRED'),
                    pattern: {
                      value: /^\S+@\S+\.\S+$/,
                      message: t('EMAIL_INVALID'),
                    },
                  })}
                  className={`block w-full appearance-none rounded-md border pr-10 pl-3 py-2 placeholder-gray-400 focus:outline-none sm:text-sm ${
                    errors.email
                      ? 'border-red-500 focus:border-red-500 focus:ring-red-500'
                      : 'border-gray-300 focus:border-orange-500 focus:ring-orange-500'
                  }`}
                />
              </div>
              {errors.email && (
                <p className="text-xs text-red-600 mt-1">{errors.email.message}</p>
              )}
            </div>

            {/* Password Field */}
            <div>
              <label htmlFor="password" className="sr-only">
                {t('PASSWORD_LABEL')}
              </label>
              <div className="relative rounded-md shadow-sm">
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
                  <Lock className="h-5 w-5 text-gray-400" aria-hidden="true" />
                </div>
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="new-password"
                  placeholder={t('PASSWORD_LABEL')}
                  {...register('password', {
                    required: t('PASSWORD_REQUIRED'),
                    minLength: {
                      value: 8,
                      message: t('PASSWORD_MIN_LENGTH'),
                    },
                  })}
                  className={`block w-full appearance-none rounded-md border pr-10 pl-10 py-2 placeholder-gray-400 focus:outline-none sm:text-sm ${
                    errors.password
                      ? 'border-red-500 focus:border-red-500 focus:ring-red-500'
                      : 'border-gray-300 focus:border-orange-500 focus:ring-orange-500'
                  }`}
                />
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 cursor-pointer" onClick={() => setShowPassword(!showPassword)}>
                  {showPassword ? (
                    <EyeOff className="h-5 w-5 text-gray-400" aria-hidden="true" />
                  ) : (
                    <Eye className="h-5 w-5 text-gray-400" aria-hidden="true" />
                  )}
                </div>
              </div>
              {errors.password && (
                <p className="text-xs text-red-600 mt-1">{errors.password.message}</p>
              )}
            </div>

            {/* Confirm Password Field */}
            <div>
              <label htmlFor="confirmPassword" className="sr-only">
                {t('CONFIRM_PASSWORD_LABEL')}
              </label>
              <div className="relative rounded-md shadow-sm">
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
                  <Lock className="h-5 w-5 text-gray-400" aria-hidden="true" />
                </div>
                <input
                  id="confirmPassword"
                  type={showConfirmPassword ? 'text' : 'password'}
                  autoComplete="new-password"
                  placeholder={t('CONFIRM_PASSWORD_LABEL')}
                  {...register('confirmPassword', {
                    required: t('CONFIRM_PASSWORD_REQUIRED'),
                    validate: (value) =>
                      value === password || t('PASSWORDS_MISMATCH'),
                  })}
                  className={`block w-full appearance-none rounded-md border pr-10 pl-10 py-2 placeholder-gray-400 focus:outline-none sm:text-sm ${
                    errors.confirmPassword
                      ? 'border-red-500 focus:border-red-500 focus:ring-red-500'
                      : 'border-gray-300 focus:border-orange-500 focus:ring-orange-500'
                  }`}
                />
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 cursor-pointer" onClick={() => setShowConfirmPassword(!showConfirmPassword)}>
                  {showConfirmPassword ? (
                    <EyeOff className="h-5 w-5 text-gray-400" aria-hidden="true" />
                  ) : (
                    <Eye className="h-5 w-5 text-gray-400" aria-hidden="true" />
                  )}
                </div>
              </div>
              {errors.confirmPassword && (
                <p className="text-xs text-red-600 mt-1">
                  {errors.confirmPassword.message}
                </p>
              )}
            </div>

            {/* Submit Button */}
            <div>
              <button
                type="submit"
                className="flex w-full justify-center rounded-md border border-transparent bg-orange-600 py-2 px-4 text-base font-medium text-white shadow-sm hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2"
              >
                {t('SIGN_UP_BUTTON')}
              </button>
            </div>
          </form>

          <p className="text-center text-sm text-gray-600">
            {t('ALREADY_HAVE_ACCOUNT_QUESTION')}{' '}
            <a href="/auth/login" className="font-medium text-orange-600 hover:text-orange-500">
              {t('SIGN_IN_LINK')}
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;