"use client";

import { IDataLoader } from "@/container/DataLoader/meta/type";
import { Loader, Loader2 } from "lucide-react";
import { useEffect, useLayoutEffect, useState } from "react";
import { Form, useForm } from "react-hook-form";
import { useSetting } from "../../../../../../stores/settingStore";
import EditAppearance from "./EditAppearance";
import EditPrivacy from "./EditPrivacy";
import EditProfile from "./EditProfile";
import NotificationsEdit from "./NotificationsEdit";
import SettingSidebar from "./SettingSidebar";
import useDataGetter from "@/hooks/useDataGetter";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useTheme } from "next-themes";

export interface IUserData {
  id?: string;
  email?: string;
  firstName?: string;
  lastName?: string;
  nationalId?: any;
  birthDate?: any;
  mobile?: string;
  isActive?: boolean;
  isVerified?: boolean;
  image?: string;
  roleId?: string;
  createdAt?: string;
  biography?: string;
  location?: string;
  emailNotification?: boolean;
  browserNotification?: boolean;
  smsNotification?: boolean;
  profileVisible?: boolean;
  searchVisible?: boolean;
  theme?: Theme;
}

export interface IUserForm {
  id?: string;
  firstName: string;
  lastName: string;
  email: string;
  mobile: string;
  location: string;
  biography: string;
  birthDate: string;
  image?: File | string;
  emailNotification?: boolean;
  browserNotification?: boolean;
  smsNotification?: boolean;
  profileVisible?: boolean;
  searchVisible?: boolean;
  theme?: Theme;
  // TODO: add these
  isActive?: boolean;
  isVerified?: boolean;
  nationalId?: string;
}

export type Theme = "auto" | "dark" | "light";

const SettingForm = ({
  data: userInformation,
  error,
  fetch: getUserInformation,
  loading,
}: IDataLoader<IUserData>) => {
  const [activeTab, setActiveTab] = useState("profile");
  const setUserData = useSetting((state) => state.setUserData);
  const userData = useSetting((state) => state.userData);
  const { setTheme, theme } = useTheme();

  const form = useForm<IUserForm>();

  const { register, handleSubmit, watch, reset, control, setValue } = form;

  const { loading: updateLoading, fetch: updateProfile } =
    useDataGetter<IUserData>({
      url: "/dashboard/setting",
      method: "PUT",
      immediatelyFetch: false,
    });

  const onSubmit = async (data: IUserForm) => {
    try {
      const formData = new FormData();
      formData.append("id", data.id ?? "");
      formData.append("firstName", data.firstName);
      formData.append("lastName", data.lastName);
      formData.append("email", data.email);
      formData.append("mobile", data.mobile);
      formData.append("location", data.location);
      formData.append("biography", data.biography);
      formData.append(
        "emailNotification",
        data.emailNotification ? "true" : "false"
      );
      formData.append(
        "browserNotification",
        data.browserNotification ? "true" : "false"
      );
      formData.append("profileVisible", data.searchVisible ? "true" : "false");
      formData.append("searchVisible", data.searchVisible ? "true" : "false");
      formData.append(
        "smsNotification",
        data.smsNotification ? "true" : "false"
      );
      formData.append("theme", data.theme as "light" | "dark" | "auto");

      if (typeof data.image !== "string" && data.image && data.image.size > 0) {
        formData.append("image", data.image);
      }

      updateProfile?.({
        inputBody: formData,
      }).then((data) => {
        if (data?.id) {
          toast.success("پروفایل با موفقیت ویرایش شد");
          getUserInformation?.({});
          setUserData({
            ...data,
          });
        }
      });
    } catch (err: any) {
      alert(err.message);
    } finally {
    }
  };

  useLayoutEffect(() => {
    setTheme(userData.theme ?? theme ?? "");
  }, [userData.theme, theme]);

  useEffect(() => {
    if (userInformation?.id) {
      reset({
        ...userInformation,
        id: userInformation?.id,
        theme: userInformation.theme,
        birthDate: userInformation.birthDate
          ? new Date(userInformation.birthDate).toISOString().slice(0, 10)
          : "",
        image: userInformation.image as string,
      });
      setUserData({ ...userInformation });
    }
  }, [userInformation, reset]);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-black dark:text-white py-8 px-4 sm:px-6 lg:px-8 relative">
      {loading && (
        <div className="z-10 backdrop-blur-sm flex justify-center items-center w-full h-full absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
          <Loader2 className="animate-spin h-8 w-8 text-orange-500" />
        </div>
      )}

      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-10">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
            تنظیمات حساب کاربری
          </h1>
          <p className="mt-2 text-lg text-gray-600 dark:text-gray-300">
            اطلاعات شخصی و تنظیمات حریم خصوصی خود را مدیریت کنید
          </p>
        </div>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="bg-white dark:bg-black rounded-xl shadow-lg overflow-hidden"
        >
          <div className="flex flex-col md:flex-row ">
            {/* نوار کناری */}
            <div className="md:w-1/4 bg-gray-100 dark:bg-gray-800 p-6 dark:text-gray-50">
              <SettingSidebar
                setActiveTab={setActiveTab}
                activeTab={activeTab}
              />
            </div>

            {/* محتوای اصلی */}
            <div className="md:w-3/4 p-6">
              {/* بخش پروفایل */}
              {activeTab === "profile" && (
                <EditProfile
                  register={register}
                  watch={watch}
                  control={control}
                />
              )}

              {/* بخش اعلان‌ها */}
              {activeTab === "notifications" && (
                <NotificationsEdit
                  register={register}
                  watch={watch}
                  control={control}
                />
              )}

              {/* بخش حریم خصوصی */}
              {activeTab === "privacy" && (
                <EditPrivacy register={register} watch={watch} />
              )}

              {/* بخش ظاهر */}
              {activeTab === "appearance" && (
                <EditAppearance register={register} watch={watch} />
              )}

              {/* دکمه‌های اقدام */}
              <div className="mt-8 pt-6 border-t border-gray-200 flex justify-end gap-2 space-x-3 space-x-reverse">
                <Button
                  type="button"
                  variant={"ghost"}
                  className="px-5 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                >
                  بستن
                </Button>
                <Button
                  type="submit"
                  disabled={updateLoading}
                  className="disabled:bg-gray-500 disabled:cursor-not-allowed px-5 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-lg shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                >
                  {updateLoading ? (
                    <Loader2 className="animate-spin" />
                  ) : (
                    "ذخیره تغییرات"
                  )}
                </Button>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SettingForm;
