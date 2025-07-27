import { Table } from "@/components/ui/table";
import ListDataProvider from "@/container/ListDataProvider/ListDataProvider";
import { ITableColumns } from "@/types/table";
import React, { useMemo } from "react";

const CartList = () => {
  const columns = useMemo<ITableColumns[]>(
    () => [
      {
        field: "rowNumber",
        title: "ردیف",
      },
      {
        field: "productName",
        title: "نام محصول",
      },
      {
        field: "quantity",
        title: "تعداد",
      },
      {
        field: "price",
        title: "قیمت",
      },
      {
        field: "totalPrice",
        title: "قیمت کل",
      },
      {
        field: "actions",
        title: "عملیات",
        isActionColumn: true,
        actions: [
          {
            label: "حذف از سبد خرید",
            actionType: "delete",
          },
        ],
      },
    ],
    []
  );
  return (
    <ListDataProvider>
      <Table columns={columns} data={[]} />
    </ListDataProvider>
  );
};

export default CartList;
