// /app/auth/error/page.tsx
"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Player } from "@lottiefiles/react-lottie-player";
import { Button } from "@/components/ui/button";

export default function AuthErrorPage() {
  const searchParams = useSearchParams();
  const error = searchParams.get("error") || "Unknown Error";

  return (
    <div className="min-h-screen flex flex-col justify-center items-center text-center p-4">
      <Player
        autoplay
        loop
        src="https://assets4.lottiefiles.com/packages/lf20_j1adxtyb.json"
        style={{ height: "300px", width: "300px" }}
      />
      <h1 className="text-3xl font-bold text-red-600 mt-4">خطا!</h1>
      <p className="text-gray-600 mt-2 mb-6">یک مشکلی پیش آمده: {error}</p>
      <Link href="/auth/login">
        <Button variant="outline">بازگشت به صفحه ورود</Button>
      </Link>
    </div>
  );
}
