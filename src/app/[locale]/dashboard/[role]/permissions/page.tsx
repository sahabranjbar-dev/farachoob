"use client";

import { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import PermissionForm from "../../../../../components/PermissionForm";
import { Funnel, PencilLine, Plus, RefreshCcw, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";
import PermissionFilters from "./components/PermissionFilters";
import PaginationWrapper from "@/components/Pagination";

type Permission = {
  id: number;
  farsiTitle: string;
  rowNumber?: number;
  englishTitle?: string;
  createdAt?: Date;
  updateAt?: string;
};

interface Data {
  totalItems?: number;
  currentPage: number;
  totalPages?: number;
  resultList: Permission[];
}

export default function PermissionsPage() {
  const [data, setData] = useState<Data>({ currentPage: 1, resultList: [] });
  const [loading, setLoading] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const [editPermission, setEditPermission] = useState<Permission | null>(null);

  const [currentPage, setCurrentPage] = useState(1);

  async function fetchPermissions() {
    setLoading(true);
    const res = await fetch("/api/dashboard/permissions");
    const data = await res.json();
    setData(data);
    setLoading(false);
  }

  useEffect(() => {
    fetchPermissions();
  }, []);
  async function handleDelete(id: number) {
    if (!confirm("آیا از حذف این مجوز مطمئن هستید؟")) return;
    await fetch(`/api/dashboard/permissions?id=${id}`, {
      method: "DELETE",
    });
    fetchPermissions();
  }

  function openEditForm(permission?: Permission) {
    setEditPermission(permission ?? null);
    setOpenDialog(true);
  }

  return (
    <div className="p-2 space-y-3">
      {/* <h1 className="text-2xl font-bold">مدیریت مجوزها</h1> */}
      <div className="flex justify-start gap-2 items-center">
        <Button
          onClick={() => openEditForm()}
          variant="primary"
          tooltip="افزودن مجوز جدید"
        >
          <Plus />
        </Button>

        <Button
          variant="outline"
          className="flex items-center gap-1 hover:text-orange-500"
          // onClick={() =>
          //   mutate(`/api/dashboard/users?${queryString}`, {
          //     revalidate: true,
          //   })
          // }
          // disabled={isSaving}
          tooltip="بروزرسانی"
        >
          <RefreshCcw className="h-4 w-4" />
        </Button>

        <Button
          variant="outline"
          className={cn("flex items-center gap-1 hover:text-orange-500", {
            // "text-red-400 border-orange-400": isOpen,
          })}
          // onClick={() => setIsOpen((prev) => !prev)}
          tooltip="فیلتر"
        >
          <Funnel />
        </Button>
      </div>
      <PermissionFilters />
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="text-center font-semibold">ردیف</TableHead>
            <TableHead className="text-center font-semibold">
              نام فارسی
            </TableHead>
            <TableHead className="text-center font-semibold">
              نام انگلیسی
            </TableHead>
            <TableHead className="text-center font-semibold">
              تاریخ ایجاد
            </TableHead>
            <TableHead className="text-center font-semibold">
              تاریخ ویرایش
            </TableHead>
            <TableHead className="text-center font-semibold">عملیات</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data?.resultList?.map((perm) => {
            const createdAt = perm.createdAt ? new Date(perm.createdAt) : null;
            const updateAt = perm.updateAt ? new Date(perm.updateAt) : null;
            return (
              <TableRow key={perm.id}>
                <TableCell className="text-center">{perm.rowNumber}</TableCell>
                <TableCell className="text-center">{perm.farsiTitle}</TableCell>
                <TableCell className="text-center">
                  {perm.englishTitle || "-"}
                </TableCell>
                <TableCell className="text-center">
                  {createdAt ? createdAt.toLocaleDateString("fa") : "-"}
                </TableCell>
                <TableCell className="text-center">
                  {updateAt ? updateAt.toLocaleDateString("fa") : "-"}
                </TableCell>
                <TableCell className="text-center space-x-2">
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => openEditForm(perm)}
                  >
                    <PencilLine className="text-blue-500" />
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => handleDelete(perm.id)}
                  >
                    <Trash2 className="text-red-500" />
                  </Button>
                </TableCell>
              </TableRow>
            );
          })}
          {data?.resultList?.length === 0 && !loading && (
            <TableRow>
              <TableCell colSpan={3} className="text-center py-6">
                داده‌ای موجود نیست
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
      <PaginationWrapper
        totalCount={data?.totalItems}
        currentPage={currentPage}
        totalPages={data?.totalPages}
        onPageChange={(page) => setCurrentPage(page)}
        totalCountName="کاربر"
      />
      {/* Dialog Form */}
      <Dialog open={openDialog} onOpenChange={setOpenDialog}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>
              {editPermission ? "ویرایش مجوز" : "افزودن مجوز جدید"}
            </DialogTitle>
            <DialogDescription>
              لطفا اطلاعات مجوز را وارد کنید.
            </DialogDescription>
          </DialogHeader>
          <PermissionForm
            initialData={editPermission ?? undefined}
            onSuccess={() => {
              setOpenDialog(false);
              fetchPermissions();
            }}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}
