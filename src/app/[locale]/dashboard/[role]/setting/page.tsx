"use client";
import React, { useState } from "react";

const UserSettingsPage = () => {
  const [activeTab, setActiveTab] = useState("profile");
  const [userData, setUserData] = useState({
    name: "سارا محمدی",
    email: "sara.mohamadi@example.com",
    bio: "طراح و توسعه‌دهنده رابط کاربری",
    phone: "+98 912 345 6789",
    location: "تهران، ایران",
    notifications: {
      email: true,
      push: false,
      sms: true,
    },
    privacy: {
      profileVisible: true,
      searchVisible: true,
    },
    theme: "light",
  });

  const handleInputChange = (e: any) => {
    const { name, value, type, checked } = e.target;
    if (type === "checkbox") {
      const [category, field] = name.split(".");
      setUserData((prev: any) => ({
        ...prev,
        [category]: {
          ...prev[category],
          [field]: checked,
        },
      }));
    } else {
      setUserData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleSubmit = (e: any) => {
    e.preventDefault();
    // در اینجا می‌توانید اطلاعات را ذخیره یا ارسال کنید
    alert("تغییرات با موفقیت ذخیره شد!");
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-10">
          <h1 className="text-3xl font-bold text-gray-900">
            تنظیمات حساب کاربری
          </h1>
          <p className="mt-2 text-lg text-gray-600">
            اطلاعات شخصی و تنظیمات حریم خصوصی خود را مدیریت کنید
          </p>
        </div>

        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="flex flex-col md:flex-row">
            {/* نوار کناری */}
            <div className="md:w-1/4 bg-gray-100 p-6">
              <nav className="space-y-1">
                <button
                  onClick={() => setActiveTab("profile")}
                  className={`w-full flex items-center px-3 py-2 text-sm font-medium rounded-md ${
                    activeTab === "profile"
                      ? "bg-blue-100 text-blue-700"
                      : "text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  <span className="ml-2">👤</span>
                  پروفایل
                </button>
                <button
                  onClick={() => setActiveTab("security")}
                  className={`w-full flex items-center px-3 py-2 text-sm font-medium rounded-md ${
                    activeTab === "security"
                      ? "bg-blue-100 text-blue-700"
                      : "text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  <span className="ml-2">🔒</span>
                  امنیت
                </button>
                <button
                  onClick={() => setActiveTab("notifications")}
                  className={`w-full flex items-center px-3 py-2 text-sm font-medium rounded-md ${
                    activeTab === "notifications"
                      ? "bg-blue-100 text-blue-700"
                      : "text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  <span className="ml-2">🔔</span>
                  اعلان‌ها
                </button>
                <button
                  onClick={() => setActiveTab("privacy")}
                  className={`w-full flex items-center px-3 py-2 text-sm font-medium rounded-md ${
                    activeTab === "privacy"
                      ? "bg-blue-100 text-blue-700"
                      : "text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  <span className="ml-2">👁️</span>
                  حریم خصوصی
                </button>
                <button
                  onClick={() => setActiveTab("appearance")}
                  className={`w-full flex items-center px-3 py-2 text-sm font-medium rounded-md ${
                    activeTab === "appearance"
                      ? "bg-blue-100 text-blue-700"
                      : "text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  <span className="ml-2">🎨</span>
                  ظاهر
                </button>
              </nav>
            </div>

            {/* محتوای اصلی */}
            <div className="md:w-3/4 p-6">
              <form onSubmit={handleSubmit}>
                {/* بخش پروفایل */}
                {activeTab === "profile" && (
                  <div className="space-y-6">
                    <h2 className="text-xl font-semibold text-gray-800 border-b pb-2">
                      اطلاعات پروفایل
                    </h2>

                    <div className="flex items-center space-x-4 space-x-reverse mb-6">
                      <div className="flex-shrink-0">
                        <img
                          className="h-16 w-16 rounded-full object-cover border-2 border-white shadow-md"
                          src="https://randomuser.me/api/portraits/women/65.jpg"
                          alt="پروفایل کاربر"
                        />
                      </div>
                      <div>
                        <button
                          type="button"
                          className="text-sm text-blue-600 font-medium"
                        >
                          تغییر عکس پروفایل
                        </button>
                        <p className="text-xs text-gray-500">
                          JPG, GIF یا PNG. حداکثر 2MB
                        </p>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label
                          htmlFor="name"
                          className="block text-sm font-medium text-gray-700 mb-1"
                        >
                          نام کامل
                        </label>
                        <input
                          type="text"
                          id="name"
                          name="name"
                          value={userData.name}
                          onChange={handleInputChange}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                        />
                      </div>

                      <div>
                        <label
                          htmlFor="email"
                          className="block text-sm font-medium text-gray-700 mb-1"
                        >
                          آدرس ایمیل
                        </label>
                        <input
                          type="email"
                          id="email"
                          name="email"
                          value={userData.email}
                          onChange={handleInputChange}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                        />
                      </div>

                      <div>
                        <label
                          htmlFor="phone"
                          className="block text-sm font-medium text-gray-700 mb-1"
                        >
                          شماره تلفن
                        </label>
                        <input
                          type="tel"
                          id="phone"
                          name="phone"
                          value={userData.phone}
                          onChange={handleInputChange}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                        />
                      </div>

                      <div>
                        <label
                          htmlFor="location"
                          className="block text-sm font-medium text-gray-700 mb-1"
                        >
                          موقعیت مکانی
                        </label>
                        <input
                          type="text"
                          id="location"
                          name="location"
                          value={userData.location}
                          onChange={handleInputChange}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                        />
                      </div>
                    </div>

                    <div>
                      <label
                        htmlFor="bio"
                        className="block text-sm font-medium text-gray-700 mb-1"
                      >
                        بیوگرافی
                      </label>
                      <textarea
                        id="bio"
                        name="bio"
                        rows={3}
                        value={userData.bio}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                      />
                      <p className="mt-1 text-sm text-gray-500">
                        چند جمله درباره خودتان بنویسید.
                      </p>
                    </div>
                  </div>
                )}

                {/* بخش اعلان‌ها */}
                {activeTab === "notifications" && (
                  <div className="space-y-6">
                    <h2 className="text-xl font-semibold text-gray-800 border-b pb-2">
                      تنظیمات اعلان‌ها
                    </h2>

                    <div className="space-y-4">
                      <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                        <div>
                          <h3 className="font-medium text-gray-800">ایمیل</h3>
                          <p className="text-sm text-gray-600">
                            ارسال اعلان‌ها از طریق ایمیل
                          </p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            name="notifications.email"
                            checked={userData.notifications.email}
                            onChange={handleInputChange}
                            className="sr-only peer"
                          />
                          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                        </label>
                      </div>

                      <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                        <div>
                          <h3 className="font-medium text-gray-800">
                            اعلان‌های push
                          </h3>
                          <p className="text-sm text-gray-600">
                            دریافت اعلان‌ها در مرورگر
                          </p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            name="notifications.push"
                            checked={userData.notifications.push}
                            onChange={handleInputChange}
                            className="sr-only peer"
                          />
                          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                        </label>
                      </div>

                      <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                        <div>
                          <h3 className="font-medium text-gray-800">پیامک</h3>
                          <p className="text-sm text-gray-600">
                            ارسال اعلان‌ها از طریق پیامک
                          </p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            name="notifications.sms"
                            checked={userData.notifications.sms}
                            onChange={handleInputChange}
                            className="sr-only peer"
                          />
                          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                        </label>
                      </div>
                    </div>
                  </div>
                )}

                {/* بخش حریم خصوصی */}
                {activeTab === "privacy" && (
                  <div className="space-y-6">
                    <h2 className="text-xl font-semibold text-gray-800 border-b pb-2">
                      تنظیمات حریم خصوصی
                    </h2>

                    <div className="space-y-4">
                      <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                        <div>
                          <h3 className="font-medium text-gray-800">
                            پروفایل قابل مشاهده
                          </h3>
                          <p className="text-sm text-gray-600">
                            اجازه دهید دیگران پروفایل شما را ببینند
                          </p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            name="privacy.profileVisible"
                            checked={userData.privacy.profileVisible}
                            onChange={handleInputChange}
                            className="sr-only peer"
                          />
                          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                        </label>
                      </div>

                      <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                        <div>
                          <h3 className="font-medium text-gray-800">
                            قابل جستجو بودن
                          </h3>
                          <p className="text-sm text-gray-600">
                            اجازه دهید دیگران شما را جستجو کنند
                          </p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            name="privacy.searchVisible"
                            checked={userData.privacy.searchVisible}
                            onChange={handleInputChange}
                            className="sr-only peer"
                          />
                          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                        </label>
                      </div>
                    </div>

                    <div className="p-4 bg-blue-50 rounded-lg border border-blue-100">
                      <h3 className="font-medium text-blue-800 mb-2">
                        حریم خصوصی داده‌ها
                      </h3>
                      <p className="text-sm text-blue-700">
                        ما به حریم خصوصی شما احترام می‌گذاریم. داده‌های شما هرگز
                        بدون رضایت شما به اشتراک گذاشته نمی‌شوند.
                      </p>
                      <button
                        type="button"
                        className="mt-3 text-sm text-blue-600 font-medium"
                      >
                        خط‌مشی حریم خصوصی را مطالعه کنید
                      </button>
                    </div>
                  </div>
                )}

                {/* بخش ظاهر */}
                {activeTab === "appearance" && (
                  <div className="space-y-6">
                    <h2 className="text-xl font-semibold text-gray-800 border-b pb-2">
                      تنظیمات ظاهر
                    </h2>

                    <div>
                      <h3 className="font-medium text-gray-800 mb-3">تم</h3>
                      <div className="flex space-x-4 space-x-reverse">
                        <div
                          className={`p-4 border rounded-lg cursor-pointer transition-all ${
                            userData.theme === "light"
                              ? "border-blue-500 ring-2 ring-blue-200"
                              : "border-gray-200"
                          }`}
                          onClick={() =>
                            setUserData({ ...userData, theme: "light" })
                          }
                        >
                          <div className="w-16 h-16 bg-gray-100 rounded-md mb-2 border border-gray-200"></div>
                          <span className="text-sm font-medium">روشن</span>
                        </div>

                        <div
                          className={`p-4 border rounded-lg cursor-pointer transition-all ${
                            userData.theme === "dark"
                              ? "border-blue-500 ring-2 ring-blue-200"
                              : "border-gray-200"
                          }`}
                          onClick={() =>
                            setUserData({ ...userData, theme: "dark" })
                          }
                        >
                          <div className="w-16 h-16 bg-gray-800 rounded-md mb-2 border border-gray-700"></div>
                          <span className="text-sm font-medium">تیره</span>
                        </div>

                        <div
                          className={`p-4 border rounded-lg cursor-pointer transition-all ${
                            userData.theme === "auto"
                              ? "border-blue-500 ring-2 ring-blue-200"
                              : "border-gray-200"
                          }`}
                          onClick={() =>
                            setUserData({ ...userData, theme: "auto" })
                          }
                        >
                          <div className="w-16 h-16 bg-gradient-to-r from-gray-100 to-gray-800 rounded-md mb-2 border border-gray-200"></div>
                          <span className="text-sm font-medium">خودکار</span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* دکمه‌های اقدام */}
                <div className="mt-8 pt-6 border-t border-gray-200 flex justify-end space-x-3 space-x-reverse">
                  <button
                    type="button"
                    className="px-5 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                  >
                    بستن
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-lg shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                  >
                    ذخیره تغییرات
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserSettingsPage;
