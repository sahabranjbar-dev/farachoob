"use client";

import React, { useState } from "react";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";
import { Bell, Package } from "lucide-react";

const CustomerDashboard = () => {
  const [orders, setOrders] = useState([
    {
      id: "ORD001",
      product: "کفش اسپرت",
      category: "لباس",
      status: "ارسال شد",
      amount: 1200000,
    },
    {
      id: "ORD002",
      product: "پیراهن مردانه",
      category: "لباس",
      status: "در انتظار پرداخت",
      amount: 650000,
    },
    {
      id: "ORD003",
      product: "هدفون بی‌سیم",
      category: "الکترونیک",
      status: "تحویل داده شد",
      amount: 980000,
    },
    {
      id: "ORD004",
      product: "کتاب داستان",
      category: "کتاب",
      status: "ارسال شد",
      amount: 200000,
    },
    {
      id: "ORD005",
      product: "کفش رسمی",
      category: "لباس",
      status: "تحویل داده شد",
      amount: 850000,
    },
  ]);

  const [notifications, setNotifications] = useState([
    { id: 1, message: "سفارش ORD002 هنوز پرداخت نشده", time: "2 ساعت پیش" },
    { id: 2, message: "تخفیف 10٪ برای خرید بعدی فعال شد", time: "1 روز پیش" },
  ]);

  const [activities, setActivities] = useState([
    { id: 1, action: "سفارش ORD001 تحویل داده شد", time: "1 روز پیش" },
    { id: 2, action: "پرداخت ORD002 انجام نشد", time: "2 روز پیش" },
    { id: 3, action: "نظرات برای محصول هدفون ثبت شد", time: "3 روز پیش" },
  ]);

  // محاسبه داده برای Pie Chart
  const categoryData = Object.values(
    orders.reduce((acc: any, order) => {
      if (!acc[order.category])
        acc[order.category] = { name: order.category, value: 0 };
      acc[order.category].value += 1;
      return acc;
    }, {})
  );

  const COLORS = ["#3b82f6", "#f97316", "#10b981", "#f43f5e", "#8b5cf6"];

  return (
    <div className="p-6 space-y-6">
      {/* ردیف بالا: نمودار و اعلان‌ها کنار هم */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* نمودار دایره‌ای */}
        <div className="bg-white shadow-lg rounded-2xl p-4">
          <h2 className="text-lg font-semibold text-gray-700 mb-4 flex items-center gap-2">
            <Package size={20} /> نسبت سفارشات بر اساس دسته‌بندی
          </h2>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={categoryData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={100}
                label={(entry) => `${entry.name} (${entry.value})`}
              >
                {categoryData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* اعلان‌ها */}
        <div className="bg-white shadow-lg rounded-2xl p-4">
          <h2 className="text-lg font-semibold text-gray-700 mb-4 flex items-center gap-2">
            <Bell size={20} /> اعلان‌ها
          </h2>
          <ul className="space-y-2 max-h-72 overflow-y-auto">
            {notifications.map((n) => (
              <li key={n.id} className="p-3 border rounded-lg hover:bg-gray-50">
                <p>{n.message}</p>
                <span className="text-xs text-gray-400">{n.time}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* جدول آخرین سفارش‌ها */}
      <div className="bg-white shadow-lg rounded-2xl p-4">
        <h2 className="text-lg font-semibold text-gray-700 mb-4 flex items-center gap-2">
          <Package size={20} /> آخرین سفارش‌ها
        </h2>
        <div className="overflow-x-auto">
          <table className="w-full text-right table-auto border-collapse">
            <thead>
              <tr className="border-b bg-gray-50">
                <th className="p-2">کد سفارش</th>
                <th className="p-2">محصول</th>
                <th className="p-2">دسته‌بندی</th>
                <th className="p-2">وضعیت</th>
                <th className="p-2">مبلغ</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order.id} className="border-b hover:bg-gray-50">
                  <td className="p-2">{order.id}</td>
                  <td className="p-2">{order.product}</td>
                  <td className="p-2">{order.category}</td>
                  <td className="p-2">{order.status}</td>
                  <td className="p-2">{order.amount.toLocaleString()} تومان</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* گزارش فعالیت‌های کاربر */}
      <div className="bg-white shadow-lg rounded-2xl p-4">
        <h2 className="text-lg font-semibold text-gray-700 mb-4">
          گزارش فعالیت‌ها
        </h2>
        <ul className="space-y-2 max-h-72 overflow-y-auto">
          {activities.map((a) => (
            <li key={a.id} className="p-3 border rounded-lg hover:bg-gray-50">
              <p>{a.action}</p>
              <span className="text-xs text-gray-400">{a.time}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default CustomerDashboard;
