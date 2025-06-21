"use client";

import React, { useState, useCallback } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "./ui/button";
import { PencilLine, Trash2, Check, X, RefreshCcw, Funnel } from "lucide-react";
import { Input } from "./ui/input";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { format } from "date-fns";
import { faIR } from "date-fns/locale";
import { MultiSelect } from "./MultiSelect";
import { toast } from "sonner";
import axios from "axios";
import useSWR from "swr";
import { cn, fetcher } from "@/lib/utils";
import UserFilter from "./UserFilter";
import { Skeleton } from "./ui/skeleton";

interface Roles {
  id?: number;
  farsiTitle?: string;
}

interface User {
  id: number | string;
  name: string;
  email: string;
  roles: Roles[];
  createdAt: string;
}

interface RoleOption {
  value: string;
  label: string;
}

export default function UsersTable() {
  const [filters, setFilters] = useState<Record<string, string>>({});
  const [roles, setRoles] = useState<RoleOption[]>([]);
  const [isOpen, setIsOpen] = useState(false);

  const [editingId, setEditingId] = useState<number | string | null>(null);
  const [editedUser, setEditedUser] = useState<Partial<User>>({});
  const [isSaving, setIsSaving] = useState(false);
  const [rolesLoading, setRolesLoading] = useState(false);

  const queryString = new URLSearchParams(filters).toString();
  const {
    data: users = [],
    isLoading,
    mutate,
    isValidating,
  } = useSWR(`/api/dashboard/users?${queryString}`, fetcher, {
    revalidateOnFocus: false,
    revalidateOnReconnect: false,
  });

  const fetchRoles = useCallback(async () => {
    try {
      setRolesLoading(true);
      const res = await axios.get("/api/dashboard/roles");
      const data = res.data.map((item: { id: number; farsiTitle: string }) => ({
        value: item.id.toString(),
        label: item.farsiTitle,
      }));
      setRoles(data);
    } catch {
      toast.error("خطا در دریافت نقش‌ها");
    } finally {
      setRolesLoading(false);
    }
  }, []);

  const handleEdit = (user: User) => {
    setEditingId(user.id);
    setEditedUser({ ...user });
    if (roles.length === 0) fetchRoles();
  };

  const handleInputChange = (field: keyof User, value: any) => {
    setEditedUser((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = async () => {
    if (!editedUser.name || !editedUser.email || !editedUser.roles?.length) {
      toast.error("لطفا تمامی فیلدها را تکمیل کنید.");
      return;
    }

    setIsSaving(true);
    try {
      await axios.put("/api/dashboard/users", {
        id: editedUser.id,
        name: editedUser.name,
        email: editedUser.email,
        roleIds: editedUser.roles,
        createdAt: editedUser.createdAt,
      });
      toast.success("کاربر با موفقیت بروزرسانی شد.");
      setEditingId(null);
      setEditedUser({});
      mutate();
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "خطا در بروزرسانی کاربر.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setEditedUser({});
  };

  // ثابت کردن عرض ستون‌ها با Tailwind (مقدار عرض به دلخواه قابل تنظیم است)
  const fixedColumnWidth = {
    name: "w-48", // 12rem = 192px
    email: "w-64", // 16rem = 256px
    roles: "w-48",
    createdAt: "w-36",
    actions: "w-32",
  };

  // کلاس برای متن بریده شده با سه نقطه در حالت عادی (غیر ویرایشی)
  const ellipsisClass = "overflow-hidden whitespace-nowrap text-ellipsis";

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100">
          مدیریت کاربران
        </h2>

        <div className="flex items-start justify-start gap-2 my-2">
          <Button
            variant="outline"
            className="flex items-center gap-1 hover:text-orange-500"
            onClick={() =>
              mutate(`/api/dashboard/users?${queryString}`, {
                revalidate: true,
              })
            }
            disabled={isSaving}
            tooltip="بروزرسانی"
          >
            <RefreshCcw className="h-4 w-4" />
          </Button>

          <Button
            variant="outline"
            className={cn("flex items-center gap-1 hover:text-orange-500", {
              "text-red-400 border-orange-400": isOpen,
            })}
            onClick={() => setIsOpen((prev) => !prev)}
            tooltip="فیلتر"
          >
            <Funnel />
          </Button>
        </div>

        <UserFilter
          isOpen={isOpen}
          onFilterChange={setFilters}
          roleOptions={roles}
          fetchRoles={fetchRoles}
        />
      </div>

      {/* Table */}
      <div className="overflow-auto rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead
                className={`text-center ${fixedColumnWidth.name}`}
                style={{ minWidth: "192px" }}
              >
                نام کاربر
              </TableHead>
              <TableHead
                className={`text-center ${fixedColumnWidth.email}`}
                style={{ minWidth: "256px" }}
              >
                ایمیل
              </TableHead>
              <TableHead
                className={`text-center ${fixedColumnWidth.roles}`}
                style={{ minWidth: "192px" }}
              >
                نقش
              </TableHead>
              <TableHead
                className={`text-center ${fixedColumnWidth.createdAt}`}
                style={{ minWidth: "144px" }}
              >
                تاریخ ثبت
              </TableHead>
              <TableHead
                className={`text-center ${fixedColumnWidth.actions}`}
                style={{ minWidth: "128px" }}
              >
                عملیات
              </TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {(isLoading || isValidating) && (
              <TableRow>
                <TableCell colSpan={5} className="p-6">
                  <Skeleton className="w-full h-12 mb-2" />
                  <Skeleton className="w-full h-12 mb-2" />
                  <Skeleton className="w-full h-12 mb-2" />
                  <Skeleton className="w-full h-12 mb-2" />
                  <Skeleton className="w-full h-12 mb-2" />
                </TableCell>
              </TableRow>
            )}

            {!isLoading && users?.resultList?.length === 0 && (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-4">
                  هیچ کاربری یافت نشد.
                </TableCell>
              </TableRow>
            )}

            {users?.resultList?.map((user: User) => {
              const isEditing = editingId === user.id;

              return (
                <TableRow
                  key={user.id}
                  className={cn(isEditing ? "h-24" : "h-12", "align-middle")}
                >
                  {/* Name */}
                  <TableCell
                    className={cn(
                      "text-center",
                      fixedColumnWidth.name,
                      !isEditing && ellipsisClass
                    )}
                    title={user.name}
                    style={{ minWidth: "192px" }}
                  >
                    {isEditing ? (
                      <Input
                        value={editedUser.name ?? ""}
                        onChange={(e) =>
                          handleInputChange("name", e.target.value)
                        }
                        className="text-center"
                        disabled={isSaving}
                      />
                    ) : (
                      user.name
                    )}
                  </TableCell>

                  {/* Email */}
                  <TableCell
                    className={cn(
                      "text-center",
                      fixedColumnWidth.email,
                      !isEditing && ellipsisClass
                    )}
                    title={user.email}
                    style={{ minWidth: "256px" }}
                  >
                    {isEditing ? (
                      <Input
                        value={editedUser.email ?? ""}
                        onChange={(e) =>
                          handleInputChange("email", e.target.value)
                        }
                        className="text-center"
                        disabled={isSaving}
                      />
                    ) : (
                      user.email
                    )}
                  </TableCell>

                  {/* Roles */}
                  <TableCell
                    className={cn(
                      "flex justify-center text-center",
                      fixedColumnWidth.roles,
                      !isEditing && ellipsisClass
                    )}
                    title={user.roles.map((role) => role.farsiTitle).join(", ")}
                    style={{ minWidth: "192px" }}
                  >
                    {isEditing ? (
                      <MultiSelect
                        options={roles}
                        defaultValue={
                          editedUser.roles
                            ? editedUser.roles.map((role) =>
                                typeof role === "string"
                                  ? role
                                  : role.id?.toString() ?? ""
                              )
                            : []
                        }
                        onValueChange={(selectedRoles) =>
                          handleInputChange("roles", selectedRoles)
                        }
                        placeholder="انتخاب نقش"
                        animation={0.5}
                        variant="inverted"
                        disabled={rolesLoading || isSaving}
                      />
                    ) : (
                      user.roles.map((role) => role.farsiTitle).join(" , ")
                    )}
                  </TableCell>

                  {/* Date */}
                  <TableCell
                    className={cn(
                      "text-center",
                      fixedColumnWidth.createdAt,
                      !isEditing && ellipsisClass
                    )}
                    title={new Date(user.createdAt).toLocaleDateString("fa-IR")}
                    style={{ minWidth: "144px" }}
                  >
                    {isEditing ? (
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            className="w-full"
                            disabled={isSaving}
                          >
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
                            disabled={isSaving}
                          />
                        </PopoverContent>
                      </Popover>
                    ) : (
                      new Date(user.createdAt).toLocaleDateString("fa-IR")
                    )}
                  </TableCell>

                  {/* Actions */}
                  <TableCell
                    className={cn(
                      "flex justify-center items-center gap-2",
                      fixedColumnWidth.actions
                    )}
                    style={{ minWidth: "128px" }}
                  >
                    {isEditing ? (
                      <>
                        <Button
                          variant="ghost"
                          onClick={handleSave}
                          disabled={isSaving}
                        >
                          <Check className="text-green-500" />
                        </Button>
                        <Button
                          variant="ghost"
                          onClick={handleCancelEdit}
                          disabled={isSaving}
                        >
                          <X className="text-red-500" />
                        </Button>
                      </>
                    ) : (
                      <>
                        <Button
                          variant="ghost"
                          onClick={() => handleEdit(user)}
                          disabled={isSaving}
                        >
                          <PencilLine className="text-blue-500" />
                        </Button>
                        <Button
                          variant="ghost"
                          onClick={() =>
                            toast.info("امکان حذف به زودی اضافه می‌شود.")
                          }
                          disabled={isSaving}
                        >
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
    </div>
  );
}
