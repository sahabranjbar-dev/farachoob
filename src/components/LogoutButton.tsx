"use client";

import { signOut } from "next-auth/react";

export default function LogoutButton() {
  return (
    <button
      onClick={() => signOut({ callbackUrl: "/auth/login" })}
      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full "
    >
      خروج
    </button>
  );
}
