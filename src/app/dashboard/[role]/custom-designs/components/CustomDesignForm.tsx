"use client";
import DownloadImageButton from "@/components/DownloadImageButton";
import { Button } from "@/components/ui/button";
import useTabular from "@/hooks/useTabular";
import { format } from "date-fns";
import {
  X,
  Eye,
  CheckCircle,
  Trash2,
  Download,
  ChevronRight,
  ChevronLeft,
} from "lucide-react";
import Link from "next/link";
import React, { useState } from "react";

type Props = {
  initialData?: any;
};

export default function CustomDesignViewPage({ initialData }: Props) {
  const { closeCurrentTab, open } = useTabular();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [showImageModal, setShowImageModal] = useState(false);
  const [activeGalleryTab, setActiveGalleryTab] = useState("all");
  const nextImage = () => {
    setCurrentImageIndex((prev) =>
      prev === initialData.images.length - 1 ? 0 : prev + 1
    );
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) =>
      prev === 0 ? initialData.images.length - 1 : prev - 1
    );
  };

  const openImageModal = (index: number) => {
    setCurrentImageIndex(index);
    setShowImageModal(true);
  };

  const markAsReviewed = async () => {
    // API call implementation here
    // try {
    //   const response = await fetch(
    //     `/api/custom-design/${initialData?.id}/mark-reviewed`,
    //     {
    //       method: "POST",
    //     }
    //   );
    //   if (response.ok) {
    //     // Show success notification
    //   }
    // } catch (error) {
    //   console.error("Error:", error);
    // }
  };

  const deleteRequest = async () => {
    // if (confirm("آیا از حذف این درخواست اطمینان دارید؟")) {
    //   try {
    //     const response = await fetch(
    //       `/api/custom-design/${initialData?.id}/delete`,
    //       {
    //         method: "POST",
    //       }
    //     );
    //     if (response.ok) {
    //       closeCurrentTab();
    //       // Show success notification
    //     }
    //   } catch (error) {
    //     console.error("Error:", error);
    //   }
    // }
  };

  return (
    <>
      <main className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50/30 py-8">
        <div className="container mx-auto px-4 max-w-6xl">
          <header className="mb-8 flex items-start justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-800 mb-2 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text">
                جزئیات درخواست طراحی
              </h1>
              <p className="text-gray-500 text-sm">
                نمایش اطلاعات و تصاویر ارسال شده توسط کاربر
              </p>
            </div>

            <Button
              onClick={closeCurrentTab}
              variant="outline"
              className="rounded-full flex items-center gap-2 border-gray-300 hover:border-gray-400 transition-all duration-200"
            >
              <X size={18} />
              بستن
            </Button>
          </header>

          <section className="bg-white rounded-2xl shadow-lg p-6 mb-6 border border-gray-100">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* گالری تصاویر */}
              <div className="lg:col-span-1">
                <div className="rounded-xl border border-gray-200 overflow-hidden shadow-sm">
                  {initialData?.images && initialData?.images?.length > 0 ? (
                    <div className="relative group">
                      <div
                        className="aspect-[4/3] overflow-hidden cursor-pointer"
                        onClick={() => openImageModal(0)}
                      >
                        <img
                          src={initialData.images[0].url}
                          alt={`تصویر اصلی`}
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                      </div>
                    </div>
                  ) : (
                    <div className="p-8 text-center text-gray-500 flex flex-col items-center">
                      <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-3">
                        <Eye size={24} className="text-gray-400" />
                      </div>
                      تصویری ارسال نشده است
                    </div>
                  )}
                </div>

                {/* تصاویر کوچک */}
                {initialData?.images?.length > 1 && (
                  <div className="grid grid-cols-3 gap-2 mt-3">
                    {initialData.images
                      .slice(1, 4)
                      .map((img: any, index: number) => (
                        <div
                          key={img.id}
                          className="aspect-square rounded-md overflow-hidden border border-gray-200 cursor-pointer transition-all duration-200 hover:border-blue-400 hover:shadow-md"
                          onClick={() => openImageModal(index + 1)}
                        >
                          <img
                            src={img.url}
                            alt={`تصویر ${index + 2}`}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      ))}
                    {initialData.images.length > 4 && (
                      <div
                        className="aspect-square rounded-md overflow-hidden border border-gray-200 bg-gray-100 flex items-center justify-center cursor-pointer"
                        onClick={() => setActiveGalleryTab("all")}
                      >
                        <span className="text-gray-600 font-medium">
                          +{initialData.images.length - 4}
                        </span>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* اطلاعات اصلی */}
              <div className="lg:col-span-2">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-gray-100">
                  <h2 className="text-2xl font-bold text-gray-800">
                    {initialData?.productType}
                  </h2>
                  <div className="text-sm text-gray-500 bg-gray-100 py-1 px-3 rounded-full">
                    ارسال شده در:{" "}
                    {format(
                      new Date(initialData?.createdAt),
                      "yyyy/MM/dd - HH:mm"
                    )}
                  </div>
                </div>

                <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div className="bg-gray-50 p-4 rounded-xl">
                    <h3 className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">
                      نام
                    </h3>
                    <p className="text-gray-800 font-medium">
                      {initialData?.name}
                    </p>
                  </div>

                  <div className="bg-gray-50 p-4 rounded-xl">
                    <h3 className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">
                      موبایل
                    </h3>
                    <p className="text-gray-800 font-medium dir-ltr text-left">
                      {initialData?.mobile}
                    </p>
                  </div>

                  <div className="bg-gray-50 p-4 rounded-xl">
                    <h3 className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">
                      ابعاد
                    </h3>
                    <p className="text-gray-800 font-medium">
                      {initialData?.dimensions || "—"}
                    </p>
                  </div>

                  <div className="bg-gray-50 p-4 rounded-xl">
                    <h3 className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">
                      جنس
                    </h3>
                    <p className="text-gray-800 font-medium">
                      {initialData?.material || "—"}
                    </p>
                  </div>

                  <div className="bg-gray-50 p-4 rounded-xl md:col-span-2">
                    <h3 className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">
                      رنگ
                    </h3>
                    <div className="mt-1 flex items-center gap-3">
                      <div
                        className="w-8 h-8 rounded-md border shadow-sm"
                        style={{ background: initialData?.color || "#e5e7eb" }}
                        aria-hidden
                      />
                      <span className="text-gray-800 font-medium">
                        {initialData?.color || "تعیین نشده"}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="mt-6 bg-gray-50 p-4 rounded-xl">
                  <h3 className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-2">
                    توضیحات
                  </h3>
                  <p className="text-gray-800 whitespace-pre-line">
                    {initialData?.description || "—"}
                  </p>
                </div>

                {/* اکشن‌ها */}
                <div className="mt-8 flex flex-wrap gap-3">
                  <Button
                    onClick={markAsReviewed}
                    className="rounded-full px-5 gap-2 bg-emerald-500 hover:bg-emerald-600 transition-all duration-300 shadow-sm hover:shadow-md"
                  >
                    <CheckCircle size={18} />
                    علامت‌گذاری به عنوان بررسی‌شده
                  </Button>

                  <Button
                    onClick={deleteRequest}
                    variant="outline"
                    className="rounded-full px-5 gap-2 border-red-200 text-red-600 hover:bg-red-50 transition-all duration-300"
                  >
                    <Trash2 size={18} />
                    حذف درخواست
                  </Button>
                </div>
              </div>
            </div>
          </section>

          {/* گالری کامل */}
          <section className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-800">
                گالری تصاویر
              </h3>
              <div className="flex gap-1 bg-gray-100 p-1 rounded-lg">
                <button
                  className={`px-3 py-1 text-sm rounded-md transition-all ${
                    activeGalleryTab === "all"
                      ? "bg-white shadow-sm"
                      : "text-gray-600 hover:text-gray-800"
                  }`}
                  onClick={() => setActiveGalleryTab("all")}
                >
                  همه
                </button>
                <button
                  className={`px-3 py-1 text-sm rounded-md transition-all ${
                    activeGalleryTab === "recent"
                      ? "bg-white shadow-sm"
                      : "text-gray-600 hover:text-gray-800"
                  }`}
                  onClick={() => setActiveGalleryTab("recent")}
                >
                  جدیدترین
                </button>
              </div>
            </div>

            {initialData?.images?.length > 0 ? (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {initialData.images.map((img: any, index: number) => (
                  <div
                    key={img.id}
                    className="group relative rounded-xl overflow-hidden border border-gray-200 shadow-sm cursor-pointer transition-all duration-300 hover:shadow-md hover:border-blue-400"
                    onClick={() => openImageModal(index)}
                  >
                    <img
                      src={img.url}
                      alt={`تصویر ${index + 1}`}
                      className="w-full h-48 object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gray-500/70 bg-opacity-0 group-hover:bg-opacity-10 transition-all duration-300 flex items-center justify-center opacity-0 group-hover:opacity-100">
                      <Eye className="text-blue-300" size={50} />
                    </div>
                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-3 text-white text-xs opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      {format(new Date(img.createdAt), "yyyy/MM/dd")}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-10 text-gray-500">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Eye size={24} className="text-gray-400" />
                </div>
                هیچ تصویری برای نمایش وجود ندارد.
              </div>
            )}
          </section>
        </div>
      </main>

      {/* مودال نمایش تصویر */}
      {showImageModal && initialData?.images?.length > 0 && (
        <div className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4">
          <div className="relative max-w-4xl max-h-full p-4">
            <button
              onClick={() => setShowImageModal(false)}
              className="absolute -top-6 right-0 text-white hover:text-gray-300 transition-colors z-10"
            >
              <X size={28} />
            </button>

            <div className="relative">
              <img
                src={initialData.images[currentImageIndex].url}
                alt={`تصویر ${currentImageIndex + 1}`}
                className="max-w-full max-h-[80vh] object-contain rounded-lg"
              />

              {initialData?.images?.length > 0 && (
                <div className="absolute -bottom-10 -left-3 p-4 m-2">
                  <DownloadImageButton
                    url={initialData.images[currentImageIndex].url}
                  />
                </div>
              )}
              {initialData.images.length > 1 && (
                <>
                  <button
                    onClick={nextImage}
                    className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition-all duration-300"
                  >
                    <ChevronLeft size={24} />
                  </button>
                  <button
                    onClick={prevImage}
                    className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition-all duration-300"
                  >
                    <ChevronRight size={24} />
                  </button>
                </>
              )}
            </div>

            <div className="text-white text-center mt-4">
              تصویر {currentImageIndex + 1} از {initialData.images.length}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
