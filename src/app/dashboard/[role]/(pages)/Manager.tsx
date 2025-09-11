"use client";

import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

const chartData = [
  { name: "فروردین", sales: 3200 },
  { name: "اردیبهشت", sales: 4000 },
  { name: "خرداد", sales: 3000 },
  { name: "تیر", sales: 5000 },
  { name: "مرداد", sales: 4800 },
  { name: "شهریور", sales: 6200 },
];

const pieData = [
  { name: "محصول A", value: 400 },
  { name: "محصول B", value: 300 },
  { name: "محصول C", value: 300 },
  { name: "محصول D", value: 200 },
];

const COLORS = ["#3b82f6", "#f43f5e", "#10b981", "#f59e0b"];

const summary = [
  {
    title: "کاربران",
    value: 1342,
    color: "bg-gradient-to-r from-indigo-500 to-purple-500 text-white",
  },
  {
    title: "سفارش‌ها",
    value: 284,
    color: "bg-gradient-to-r from-pink-500 to-red-500 text-white",
  },
  {
    title: "درآمد",
    value: "۴۸,۲۵۰,۰۰۰ تومان",
    color: "bg-gradient-to-r from-orange-400 to-yellow-500 text-white",
  },
  {
    title: "پیام‌ها",
    value: 12,
    color: "bg-gradient-to-r from-emerald-500 to-teal-500 text-white",
  },
];

const latestOrders = [
  { id: 1, customer: "علی رضایی", amount: "۱,۲۰۰,۰۰۰ تومان", status: "موفق" },
  {
    id: 2,
    customer: "زهرا مرادی",
    amount: "۸۵۰,۰۰۰ تومان",
    status: "در انتظار",
  },
  {
    id: 3,
    customer: "محمد احمدی",
    amount: "۲,۴۰۰,۰۰۰ تومان",
    status: "لغو شد",
  },
];

const ManagerDashboardPage = () => {
  return (
    <div className="p-6 space-y-6">
      <h1 className="text-3xl font-bold text-gray-800">داشبورد مدیر</h1>

      {/* کارت‌های رنگی */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {summary.map((item, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card className={cn("rounded-2xl shadow-md", item.color)}>
              <CardContent className="p-4">
                <p className="text-sm opacity-80">{item.title}</p>
                <p className="text-2xl font-bold">{item.value}</p>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* چارت‌ها */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* نمودار خطی فروش */}
        <Card className="rounded-2xl shadow-sm p-4 bg-white">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">
            آمار فروش شش‌ماهه اخیر
          </h2>
          <ResponsiveContainer width="100%" height={320}>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Line
                type="monotone"
                dataKey="sales"
                stroke="#3b82f6"
                strokeWidth={3}
                dot={{ r: 6, stroke: "#3b82f6", fill: "white", strokeWidth: 2 }}
                activeDot={{ r: 8 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </Card>

        {/* نمودار دایره‌ای */}
        <Card className="rounded-2xl shadow-sm p-4 bg-white">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">
            سهم محصولات
          </h2>
          <ResponsiveContainer width="100%" height={320}>
            <PieChart>
              <Pie
                data={pieData}
                cx="50%"
                cy="50%"
                labelLine={false}
                outerRadius={120}
                fill="#8884d8"
                dataKey="value"
                label={({ name, percent }: any) =>
                  `${name} ${((percent ? percent : 1) * 100).toFixed(0)}%`
                }
              >
                {pieData.map((_, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </Card>
      </div>

      {/* جدول سفارش‌های اخیر */}
      <Card className="rounded-2xl shadow-sm p-4 bg-white">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">
          سفارش‌های اخیر
        </h2>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-gray-100 text-right">
                <th className="p-2">مشتری</th>
                <th className="p-2">مبلغ</th>
                <th className="p-2">وضعیت</th>
              </tr>
            </thead>
            <tbody>
              {latestOrders.map((order) => (
                <tr key={order.id} className="border-b">
                  <td className="p-2">{order.customer}</td>
                  <td className="p-2">{order.amount}</td>
                  <td
                    className={cn(
                      "p-2 font-medium",
                      order.status === "موفق" && "text-green-600",
                      order.status === "لغو شد" && "text-red-600",
                      order.status === "در انتظار" && "text-yellow-600"
                    )}
                  >
                    {order.status}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
};

export default ManagerDashboardPage;
