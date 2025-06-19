"use client";

import React from "react";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Role } from "@/types/dashboard";
import { Button } from "./ui/button";
import { PencilLine, Trash2 } from "lucide-react";

interface User {
  id: number | string;
  name: string;
  email: string;
  roles: string[]; // اینجا آرایه رشته‌ای از نقش‌هاست مثل ["ADMIN", "MANAGER"]
  createdAt: string;
}

interface Props {
  users: User[];
}

export default function UsersTable({ users }: Props) {
  return (
    <div className="overflow-auto rounded-md border">
      <Table>
        {/* <TableCaption>لیست کاربران سیستم</TableCaption> */}
        <TableHeader>
          <TableRow>
            <TableHead className="text-center">نام کاربر</TableHead>
            <TableHead className="text-center">ایمیل</TableHead>
            <TableHead className="text-center">نقش</TableHead>
            <TableHead className="text-center">تاریخ ثبت</TableHead>
            <TableHead className="text-center">عملیات</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {users.map((user) => (
            <TableRow key={user.id}>
              <TableCell className="text-center">{user.name}</TableCell>
              <TableCell className="text-center">{user.email}</TableCell>
              <TableCell className="text-center">
                {user.roles.join(", ")} {/* تبدیل آرایه نقش‌ها به رشته */}
              </TableCell>
              <TableCell className="text-center">
                {new Date(user.createdAt).toLocaleDateString("fa-IR")}
              </TableCell>
              <TableCell className="flex justify-center items-center">
                <Button variant={"ghost"}>
                  <PencilLine className="text-blue-500" />
                </Button>
                <Button variant={"ghost"}>
                  <Trash2 className="text-red-500" />
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
