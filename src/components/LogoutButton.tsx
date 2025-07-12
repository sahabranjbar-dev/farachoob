"use client";

import { LogOut } from "lucide-react";
import { signOut } from "next-auth/react";

export default function LogoutButton() {
  return (
    <button
      onClick={() => signOut({ callbackUrl: "/" })}
      className="flex justify-around items-center gap-2 px-4 py-2 text-sm text-red-500 hover:bg-orange-100 w-full "
    >
      <LogOut />
      خروج
    </button>
  );
}
