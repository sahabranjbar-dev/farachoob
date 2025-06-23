"use client";

import { useEffect, useMemo, useState } from "react";
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
import PaginationWrapper from "@/components/Pagination";

type Permission = {
  id: number;
  name: string;
};

interface MenuData {
  totalItems: number;
  currentPage: number;
  totalPages: number;
  resultList: Menu[];
}

type Menu = {
  id: number;
  title: string;
  href: string;
  icon?: string | null;
  permission: Permission;
  status: boolean;
};

export default function MenusPage() {
  const [data, setData] = useState<MenuData>({
    currentPage: 1,
    resultList: [],
    totalItems: 10,
    totalPages: 10,
  });
  // const [permissions, setPermissions] = useState<Permission[]>([]);
  const [loading, setLoading] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const [editMenu, setEditMenu] = useState<Menu | undefined | null>(null);

  const [currentPage, setCurrentPage] = useState(1);

  // دریافت منوها
  async function fetchMenus() {
    setLoading(true);
    const res = await fetch("/api/dashboard/menus");
    const data = await res.json();
    setData(data);
    setLoading(false);
  }

  useEffect(() => {
    fetchMenus();
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

  const tableHeader = useMemo(
    () => [
      { id: 1, title: "عنوان" },
      { id: 2, title: "آدرس" },
      { id: 3, title: "آیکن" },
      { id: 4, title: "دسترسی" },
      { id: 5, title: "وضعیت" },
      { id: 6, title: "عملیات" },
    ],
    []
  );
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
            {tableHeader.map((item) => {
              return (
                <TableHead className="text-center font-bold" key={item.id}>
                  {item.title}
                </TableHead>
              );
            })}
          </TableRow>
        </TableHeader>
        <TableBody>
          {data?.resultList?.map((menu) => (
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
          {data?.resultList?.length === 0 && !loading && (
            <TableRow>
              <TableCell colSpan={6} className="text-center py-6">
                داده‌ای موجود نیست
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
      <PaginationWrapper
        totalCount={data.totalItems}
        currentPage={currentPage}
        totalPages={data?.totalPages}
        onPageChange={(page) => setCurrentPage(page)}
        totalCountName="منو"
      />

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
            // permissions={permissions}
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
