"use client";

import React, { useCallback, useMemo, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { toast } from "sonner";
import { Button } from "./ui/button";
import { PencilLine, Trash2, Check, X } from "lucide-react";
import { Input } from "./ui/input";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { format } from "date-fns";
import { faIR } from "date-fns/locale";
import { MultiSelect } from "./MultiSelect";
import { useRouter } from "next/navigation";
import axios from "axios";

interface User {
  id: number | string;
  name: string;
  email: string;
  roles: string[];
  createdAt: string;
}

interface Props {
  users: User[];
}

export default function UsersTable({ users }: Props) {
  const [editingId, setEditingId] = useState<number | string | null>(null);
  const [editedUser, setEditedUser] = useState<Partial<User>>({});
  const router = useRouter();
  const [options, setOptions] = useState<{ value: string; label: string }[]>([
    { label: "", value: "" },
  ]);

  const fetchRoles = useCallback(async () => {
    const response = await axios.get("/api/dashboard/roles");
    if (response.status !== 200) {
      toast.error("دریافت نقش‌ها با مشکل مواجه شد");
      return;
    }
    const data = response.data.map(
      (item: { englishTitle: string; farsiTitle: string; id: number }) => {
        return {
          id: item.id,
          value: item?.id,
          label: item?.farsiTitle,
        };
      }
    );
    setOptions(data);
  }, []);

  const handleEdit = (user: User) => {
    setEditingId(user.id);
    setEditedUser({ ...user });
    fetchRoles();
  };

  const handleInputChange = (field: keyof User, value: string | string[]) => {
    setEditedUser((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSave = async () => {
    try {
      const response = await fetch(`/api/dashboard/users`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: editedUser.email,
          name: editedUser.name,
          roleIds: editedUser.roles,
          id: editedUser.id,
        }),
      });

      if (!response.ok) {
        throw new Error("خطا در بروزرسانی کاربر.");
      }

      toast.success("کاربر با موفقیت بروزرسانی شد.");
      setEditingId(null);
      setEditedUser({});
      router.refresh(); // رفرش صفحه برای گرفتن داده‌های جدید
    } catch (error) {
      toast.error("بروزرسانی با خطا مواجه شد.");
      console.error(error);
    }
  };

  return (
    <div className="overflow-auto rounded-md border">
      <Table>
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
          {users.map((user) => {
            const isEditing = editingId === user.id;

            return (
              <TableRow key={user.id}>
                {/* نام کاربر */}
                <TableCell className="text-center">
                  {isEditing ? (
                    <Input
                      value={editedUser.name ?? ""}
                      onChange={(e) =>
                        handleInputChange("name", e.target.value)
                      }
                      className="text-center"
                    />
                  ) : (
                    user.name
                  )}
                </TableCell>

                {/* ایمیل */}
                <TableCell className="text-center">
                  {isEditing ? (
                    <Input
                      value={editedUser.email ?? ""}
                      onChange={(e) =>
                        handleInputChange("email", e.target.value)
                      }
                      className="text-center"
                    />
                  ) : (
                    user.email
                  )}
                </TableCell>

                {/* نقش‌ها */}
                <TableCell className="flex justify-center text-center">
                  {isEditing ? (
                    <MultiSelect
                      options={options}
                      defaultValue={editedUser.roles ?? []}
                      onValueChange={(selectedRoles) =>
                        handleInputChange("roles", selectedRoles)
                      }
                      placeholder="انتخاب نقش"
                      animation={0.5}
                      variant="inverted"
                    />
                  ) : (
                    user.roles.join(", ")
                  )}
                </TableCell>

                {/* تاریخ ثبت */}
                <TableCell className="text-center">
                  {isEditing ? (
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button variant="outline" className="w-full">
                          {editedUser.createdAt
                            ? format(
                                new Date(editedUser.createdAt),
                                "yyyy/MM/dd",
                                { locale: faIR }
                              )
                            : "انتخاب تاریخ"}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0">
                        <Calendar
                          mode="single"
                          selected={
                            editedUser.createdAt
                              ? new Date(editedUser.createdAt)
                              : undefined
                          }
                          onSelect={(date) =>
                            handleInputChange(
                              "createdAt",
                              date?.toISOString() ?? ""
                            )
                          }
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                  ) : (
                    new Date(user.createdAt).toLocaleDateString("fa-IR")
                  )}
                </TableCell>

                {/* عملیات */}
                <TableCell className="flex justify-center items-center gap-2">
                  {isEditing ? (
                    <>
                      <Button variant="ghost" onClick={handleSave}>
                        <Check className="text-green-500" />
                      </Button>
                      <Button
                        variant="ghost"
                        onClick={() => {
                          setEditingId(null);
                          setEditedUser({});
                        }}
                      >
                        <X className="text-red-500" />
                      </Button>
                    </>
                  ) : (
                    <>
                      <Button variant="ghost" onClick={() => handleEdit(user)}>
                        <PencilLine className="text-blue-500" />
                      </Button>
                      <Button variant="ghost">
                        <Trash2 className="text-red-500" />
                      </Button>
                    </>
                  )}
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}
