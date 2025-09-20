import { Controller, useForm } from "react-hook-form";
import { IEditProfile } from "../meta/types";
import { Plus } from "lucide-react";

const EditProfile = ({ register, control }: IEditProfile) => {
  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200 border-b pb-2">
        اطلاعات پروفایل
      </h2>
      <Controller
        name="image"
        control={control}
        render={({ field }) => {
          const previewUrl = field.value
            ? typeof field.value === "string"
              ? field.value // وقتی آپدیت از بک‌اند میاد (imageUrl)
              : URL.createObjectURL(field.value) // وقتی کاربر آپلود میکنه
            : "/images/placeholder.png";

          return (
            <div className="flex items-center gap-4 mb-6">
              {/* عکس پروفایل */}
              <div className="relative group">
                <img
                  className="h-20 w-20 rounded-full object-cover border-2 border-gray-200 shadow-md transition group-hover:opacity-80"
                  src={previewUrl}
                  alt="پروفایل کاربر"
                />

                {/* دکمه آپلود */}
                <label
                  htmlFor="image"
                  className="absolute inset-0 flex items-center justify-center bg-black/40 rounded-full opacity-0 group-hover:opacity-100 transition cursor-pointer"
                >
                  <Plus className="w-6 h-6 text-white" />
                </label>

                <input
                  type="file"
                  accept="image/*"
                  id="image"
                  className="hidden"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      field.onChange(file); // فقط فایل رو بده به RHF
                    }
                  }}
                />
              </div>
              <div>
                {!field.value ? (
                  <p className="text-xs text-gray-500">
                    JPG, GIF یا PNG. حداکثر 2MB
                  </p>
                ) : (
                  <p className="text-xs text-gray-500">
                    برای تغییر، بر روی تصویر کلیک کنید
                  </p>
                )}
              </div>
            </div>
          );
        }}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label
            htmlFor="firstName"
            className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
          >
            نام
          </label>
          <input
            type="text"
            id="firstName"
            {...register("firstName")}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
          />
        </div>
        <div>
          <label
            htmlFor="lastName"
            className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
          >
            نام‌خانوادگی
          </label>
          <input
            type="text"
            id="lastName"
            {...register("lastName")}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
          />
        </div>

        <div>
          <label
            htmlFor="email"
            className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
          >
            آدرس ایمیل
          </label>
          <input
            type="email"
            id="email"
            {...register("email")}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
          />
        </div>

        <div>
          <label
            htmlFor="phone"
            className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
          >
            شماره تلفن
          </label>
          <input
            type="tel"
            id="phone"
            {...register("mobile")}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
          />
        </div>

        <div>
          <label
            htmlFor="location"
            className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
          >
            موقعیت مکانی
          </label>
          <input
            type="text"
            id="location"
            {...register("location")}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
          />
        </div>
        <div>
          <label
            htmlFor="location"
            className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
          >
            تاریخ تولد
          </label>
          <input
            type="date"
            id="birthDate"
            {...register("birthDate")}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
          />
        </div>
      </div>

      <div>
        <label
          htmlFor="bio"
          className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
        >
          بیوگرافی
        </label>
        <textarea
          id="bio"
          rows={3}
          {...register("biography")}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
        />
        <p className="mt-1 text-sm text-gray-500">
          چند جمله درباره خودتان بنویسید.
        </p>
      </div>
    </div>
  );
};

export default EditProfile;
