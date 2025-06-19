// /app/unauthorized/page.tsx
"use client";

import Link from "next/link";
import { Player } from "@lottiefiles/react-lottie-player";
import { Button } from "@/components/ui/button";

export default function UnauthorizedPage() {
  return (
    <div className="min-h-screen flex flex-col justify-center items-center text-center p-4">
      <Player
        autoplay
        loop
        src="https://assets3.lottiefiles.com/private_files/lf30_ta7dqrvk.json"
        style={{ height: "300px", width: "300px" }}
      />
      <h1 className="text-3xl font-bold text-orange-600 mt-4">
        دسترسی غیر مجاز
      </h1>
      <p className="text-gray-600 mt-2 mb-6">شما به این صفحه دسترسی ندارید!</p>
      <Link href="/">
        <Button variant="outline">بازگشت به صفحه اصلی</Button>
      </Link>
    </div>
  );
}
