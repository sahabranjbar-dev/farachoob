"use client";
import React from "react";
import { Button } from "../ui/button";
import { RefreshCcw } from "lucide-react";
import useDataGetter from "@/hooks/useDataGetter";
import Image from "next/image";

const Captcha = () => {
  const { fetch: fetchCaptcha, data } = useDataGetter({
    url: "/captcha",
    responseType: "blob",
  });
  return (
    <div className="flex items-center gap-2">
      {data ? (
        <Image
          src={URL.createObjectURL(data)}
          alt="CAPTCHA"
          className="cursor-pointer rounded border border-gray-300"
        />
      ) : (
        <div className="h-10 w-32 animate-pulse rounded bg-gray-200"></div>
      )}
      <Button
        onClick={() => fetchCaptcha?.({})}
        type="button"
        size="icon"
        left={<RefreshCcw className="h-4 w-4" />}
        variant="ghost"
        tooltip="دریافت مجدد کپچا"
      />
    </div>
  );
};

export default Captcha;
