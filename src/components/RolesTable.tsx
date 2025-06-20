"use client";

import React, { useState } from "react";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";
import RoleForm from "./RoleForm";
import { Button } from "./ui/button";
import { Edit, RefreshCcw, Trash2 } from "lucide-react";
import useSWR from "swr";
import axios from "axios";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
} from "./ui/alert-dialog";
import {
  AlertDialogDescription,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@radix-ui/react-alert-dialog";
import { toast } from "sonner";

interface Role {
  id: number;
  farsiTitle?: string | null;
  englishTitle?: string | null;
  description?: string | null;
  status?: boolean | null;
}

interface Props {
  roles: Role[];
}

const fetcher = (url: string) => axios.get(url).then((res) => res.data);

export default function RolesTable({ roles }: Props) {
  const { data, isLoading, mutate } = useSWR<Role[]>(
    "/api/dashboard/roles",
    fetcher,
    {
      fallbackData: roles,
    }
  );

  const [openDialog, setOpenDialog] = useState<boolean>(false);
  const [roleData, setRoleData] = useState<Role | null>(null);

  const handleRefresh = () => {
    mutate();
  };

  const handleDelete = async (id: number) => {
    try {
      await axios.delete(`/api/dashboard/roles/${id}`).then((res) => {
        toast.success(res.data.message);
      });
      mutate();
    } catch (error) {
      console.error("خطا در حذف نقش", error);
      toast.error("خطا در حذف نقش");
    }
  };

  if (!data?.length) {
    return (
      <div className="py-20 text-center text-gray-500 dark:text-gray-400">
        نقشی ثبت نشده است.
      </div>
    );
  }

  return (
    <>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">مدیریت نقش‌ها</h1>
        <Button onClick={() => setOpenDialog(true)} variant="primary">
          افزودن نقش جدید
        </Button>
      </div>
      لیست نقش‌ها
      <Button variant="ghost" size="icon" onClick={handleRefresh}>
        <RefreshCcw className="text-gray-500" />
      </Button>
      <Table className="w-full">
        <TableHeader>
          <TableRow>
            <TableHead className="text-center">شناسه</TableHead>
            <TableHead className="text-center">عنوان فارسی</TableHead>
            <TableHead className="text-center">عنوان انگلیسی</TableHead>
            <TableHead className="text-center">توضیحات</TableHead>
            <TableHead className="text-center">وضعیت</TableHead>
            <TableHead className="text-center">عملیات</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((role) => (
            <TableRow
              key={role.id}
              className="hover:bg-gray-100 dark:hover:bg-gray-800"
            >
              <TableCell className="text-center">{role.id}</TableCell>
              <TableCell className="text-center">
                {role.farsiTitle ?? "-"}
              </TableCell>
              <TableCell className="text-center">
                {role.englishTitle ?? "-"}
              </TableCell>
              <TableCell className="text-center">
                {role.description ?? "-"}
              </TableCell>
              <TableCell className="text-center">
                {role.status ? (
                  <span className="text-green-600 font-semibold">فعال</span>
                ) : (
                  <span className="text-red-600 font-semibold">غیرفعال</span>
                )}
              </TableCell>
              <TableCell className="flex justify-center">
                <Button
                  variant="ghost"
                  onClick={() => {
                    setRoleData(role);
                    setOpenDialog(true);
                  }}
                >
                  <Edit className="text-blue-500" />
                </Button>
                <AlertDialog>
                  <AlertDialogTrigger>
                    <Trash2 className="text-red-500 cursor-pointer" />
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>آیا مطمئن هستید؟</AlertDialogTitle>
                      <AlertDialogDescription>
                        این کار قابل برگشت نیست. با حذف نقش، همه اطلاعاتش پاک
                        میشه. مطمئنی می‌خوای ادامه بدی؟
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>انصراف</AlertDialogCancel>
                      <AlertDialogAction onClick={() => handleDelete(role.id)}>
                        تایید
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <Dialog
        open={openDialog}
        onOpenChange={(isOpen) => {
          setOpenDialog(isOpen);
          if (!isOpen) setRoleData(null);
        }}
      >
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>
              {roleData?.id ? "ویرایش نقش" : "افزودن نقش جدید"}
            </DialogTitle>
            <DialogDescription>
              لطفا اطلاعات نقش را وارد کنید.
            </DialogDescription>
          </DialogHeader>
          <RoleForm
            initialData={roleData ?? undefined}
            onSuccess={() => {
              setOpenDialog(false);
              mutate(); // 🔥 رفرش دیتا بعد از موفقیت
            }}
          />
        </DialogContent>
      </Dialog>
    </>
  );
}
