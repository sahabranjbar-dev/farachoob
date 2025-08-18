"use client";

import { Button } from "@/components/ui/button";
import axios from "axios";
import { FileDown } from "lucide-react";
import { toast } from "sonner";

interface Props {
  exportUrl: string;
}

const ExportButton = ({ exportUrl }: Props) => {
  const handleDownload = async () => {
    try {
      const response = await axios.get(exportUrl, {
        responseType: "blob", // مهم برای دریافت فایل
      });

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "products.xlsx");
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error: any) {
      toast.error(error.message || "خطا در دانلود اکسل");
    }
  };

  return (
    <Button
      onClick={handleDownload}
      variant="outline"
      className="flex items-center gap-1"
      tooltip="دانلود اکسل"
    >
      <FileDown className="hover:fill-orange-400" />
    </Button>
  );
};

export default ExportButton;
