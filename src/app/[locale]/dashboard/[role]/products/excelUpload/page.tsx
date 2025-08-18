"use client";

import { useState } from "react";
import axios from "axios";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

const BulkUploadProducts = () => {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!file) return toast.error("یک فایل اکسل انتخاب کنید");

    const formData = new FormData();
    formData.append("file", file);

    try {
      setLoading(true);
      const response = await axios.post(
        "/api/dashboard/products/bulk-upload",
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );
      toast.success(`${response.data.results.length} محصول با موفقیت ایجاد شد`);
      setFile(null);
    } catch (error: any) {
      toast.error(error.response?.data?.error || error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-center text-2xl font-bold">
          آپلود گروهی محصولات
        </CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        <Input
          type="file"
          accept=".xlsx, .xls, .csv"
          onChange={(e) => setFile(e.target.files?.[0] ?? null)}
        />
        <Button onClick={handleSubmit} disabled={loading}>
          {loading ? "در حال بارگذاری..." : "آپلود و ایجاد محصولات"}
        </Button>
      </CardContent>
    </Card>
  );
};

export default BulkUploadProducts;
