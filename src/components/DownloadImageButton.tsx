import React from "react";
import { Download } from "lucide-react";

interface Props {
  url: string;
}

const DownloadImageButton: React.FC<Props> = ({ url }) => {
  const handleDownload = async () => {
    try {
      const res = await fetch(url, { mode: "cors" });
      const blob = await res.blob();
      const blobUrl = window.URL.createObjectURL(blob);

      const a = document.createElement("a");
      a.href = blobUrl;
      a.download = url.split("/").pop() ?? "image";
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(blobUrl);
    } catch (err) {
      console.error("خطا در دانلود تصویر:", err);
    }
  };

  return (
    <button
      onClick={handleDownload}
      className="flex items-center gap-2 px-4 py-2 rounded-full border border-gray-300 text-gray-700 cursor-pointer bg-gray-50 transition-all duration-300 text-sm"
    >
      <Download size={16} />
      دانلود تصویر
    </button>
  );
};

export default DownloadImageButton;
