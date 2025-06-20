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
import { Trash2 } from "lucide-react";

type Permission = {
  id: number;
  name: string;
  description?: string;
};

export default function PermissionsPage() {
  const [permissions, setPermissions] = useState<Permission[]>([]);
  const [loading, setLoading] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const [editPermission, setEditPermission] = useState<Permission | null>(null);

  async function fetchPermissions() {
    setLoading(true);
    const res = await fetch("/api/dashboard/permissions");
    const data = await res.json();
    setPermissions(data);
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
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">مدیریت مجوزها</h1>
        <Button onClick={() => openEditForm()} variant="primary">
          افزودن مجوز جدید
        </Button>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>نام مجوز</TableHead>
            <TableHead>توضیح</TableHead>
            <TableHead className="text-center">عملیات</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {permissions.map((perm) => (
            <TableRow key={perm.id}>
              <TableCell>{perm.name}</TableCell>
              <TableCell>{perm.description || "-"}</TableCell>
              <TableCell className="text-center space-x-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => openEditForm(perm)}
                >
                  ویرایش
                </Button>
                <Button
                  size="sm"
                  variant="destructive"
                  onClick={() => handleDelete(perm.id)}
                >
                  <Trash2 size={16} />
                </Button>
              </TableCell>
            </TableRow>
          ))}
          {permissions.length === 0 && !loading && (
            <TableRow>
              <TableCell colSpan={3} className="text-center py-6">
                داده‌ای موجود نیست
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>

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
