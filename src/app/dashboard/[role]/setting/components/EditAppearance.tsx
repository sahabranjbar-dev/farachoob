import { UseFormRegister } from "react-hook-form";
import { IUserForm } from "./SettingForm";
import { useTheme } from "next-themes";
import { useEffect } from "react";
import { useSetting } from "../../../../../../stores/settingStore";

interface EditAppearanceProps {
  register: UseFormRegister<IUserForm>;
  watch: (field: keyof IUserForm) => any; // برای گرفتن مقدار فعلی
}

const EditAppearance = ({ register, watch }: EditAppearanceProps) => {
  const theme = watch("theme");
  const { setTheme } = useTheme();
  const setUserData = useSetting((state) => state.setUserData);

  useEffect(() => {
    setTheme(theme === "auto" ? "system" : theme);
    setUserData((prev) => ({ ...prev, theme: theme }));
  }, [theme]);
  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200 border-b pb-2">
        تنظیمات ظاهر
      </h2>

      <div>
        <h3 className="font-medium text-gray-800 dark:text-gray-200 mb-3">
          تم
        </h3>
        <div className="flex gap-4">
          {/* روشن */}
          <label
            className={`flex flex-col items-center p-4 border rounded-lg cursor-pointer transition-all w-28
              ${
                theme === "light"
                  ? "border-blue-500 ring-2 ring-blue-200"
                  : "border-gray-200 hover:border-gray-400"
              }`}
          >
            <input
              type="radio"
              value="light"
              {...register("theme")}
              className="hidden"
            />
            <div className="w-16 h-16 bg-gray-100 rounded-md mb-2 border border-gray-200"></div>
            <span className="text-sm font-medium">روشن</span>
          </label>

          {/* تیره */}
          <label
            className={`flex flex-col items-center p-4 border rounded-lg cursor-pointer transition-all w-28
              ${
                theme === "dark"
                  ? "border-blue-500 ring-2 ring-blue-200"
                  : "border-gray-200 hover:border-gray-400"
              }`}
          >
            <input
              type="radio"
              value="dark"
              {...register("theme")}
              className="hidden"
            />
            <div className="w-16 h-16 bg-gray-800 rounded-md mb-2 border border-gray-700"></div>
            <span className="text-sm font-medium">تیره</span>
          </label>

          {/* خودکار */}
          <label
            className={`flex flex-col items-center p-4 border rounded-lg cursor-pointer transition-all w-28
              ${
                theme === "auto"
                  ? "border-blue-500 ring-2 ring-blue-200"
                  : "border-gray-200 hover:border-gray-400"
              }`}
          >
            <input
              type="radio"
              value="auto"
              {...register("theme")}
              className="hidden"
            />
            <div className="w-16 h-16 bg-gradient-to-r from-gray-100 to-gray-800 rounded-md mb-2 border border-gray-200"></div>
            <span className="text-sm font-medium">خودکار</span>
          </label>
        </div>
      </div>
    </div>
  );
};

export default EditAppearance;
