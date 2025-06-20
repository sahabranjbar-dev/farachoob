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
import { Trash2 } from "lucide-react";
import MenuForm from "./MenuForm";

type Permission = {
  id: number;
  name: string;
};

type Menu = {
  id: number;
  title: string;
  href: string;
  icon?: string | null;
  permission: Permission;
  status: boolean;
};

export default function MenusPage() {
  const [menus, setMenus] = useState<Menu[]>([]);
  const [permissions, setPermissions] = useState<Permission[]>([]);
  const [loading, setLoading] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const [editMenu, setEditMenu] = useState<Menu | undefined | null>(null);

  // دریافت منوها
  async function fetchMenus() {
    setLoading(true);
    const res = await fetch("/api/dashboard/menus");
    const data = await res.json();
    setMenus(data);
    setLoading(false);
  }

  // دریافت permissions برای کمبو باکس
  async function fetchPermissions() {
    const res = await fetch("/api/dashboard/permissions");
    const data = await res.json();
    setPermissions(data);
  }

  useEffect(() => {
    fetchMenus();
    fetchPermissions();
  }, []);

  // حذف منو
  async function handleDelete(id: number) {
    if (!confirm("آیا از حذف این منو مطمئن هستید؟")) return;
    await fetch(`/api/dashboard/menus?id=${id}`, {
      method: "DELETE",
    });
    fetchMenus();
  }

  // باز کردن فرم و تنظیم حالت ویرایش یا افزودن
  function openEditForm(menu?: Menu) {
    setEditMenu(menu ?? null);
    setOpenDialog(true);
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">مدیریت منوها</h1>
        <Button onClick={() => openEditForm()} variant="primary">
          افزودن منو جدید
        </Button>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>عنوان</TableHead>
            <TableHead>آدرس</TableHead>
            <TableHead>آیکن</TableHead>
            <TableHead>دسترسی</TableHead>
            <TableHead>وضعیت</TableHead>
            <TableHead className="text-center">عملیات</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {menus.map((menu) => (
            <TableRow key={menu.id}>
              <TableCell>{menu.title}</TableCell>
              <TableCell>{menu.href}</TableCell>
              <TableCell>{menu.icon || "-"}</TableCell>
              <TableCell>{menu.permission.name}</TableCell>
              <TableCell>{menu.status ? "فعال" : "غیرفعال"}</TableCell>
              <TableCell className="text-center space-x-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => openEditForm(menu)}
                >
                  ویرایش
                </Button>
                <Button
                  size="sm"
                  variant="destructive"
                  onClick={() => handleDelete(menu.id)}
                >
                  <Trash2 size={16} />
                </Button>
              </TableCell>
            </TableRow>
          ))}
          {menus.length === 0 && !loading && (
            <TableRow>
              <TableCell colSpan={6} className="text-center py-6">
                داده‌ای موجود نیست
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>

      {/* Dialog for Add/Edit Form */}
      <Dialog open={openDialog} onOpenChange={setOpenDialog}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>
              {editMenu ? "ویرایش منو" : "افزودن منو جدید"}
            </DialogTitle>
            <DialogDescription>
              لطفا اطلاعات منو را وارد کنید.
            </DialogDescription>
          </DialogHeader>
          <MenuForm
            permissions={permissions}
            initialData={
              editMenu
                ? {
                    ...editMenu,
                    icon: editMenu.icon ?? undefined,
                  }
                : editMenu
            }
            onSuccess={() => {
              setOpenDialog(false);
              fetchMenus();
            }}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}
