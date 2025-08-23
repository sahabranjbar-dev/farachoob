"use client";

import { Mail, HelpCircle, CheckCircle, AlertCircle } from "lucide-react";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useState } from "react";

const salesData = [
  { month: "فروردین", sales: 120 },
  { month: "اردیبهشت", sales: 240 },
  { month: "خرداد", sales: 180 },
  { month: "تیر", sales: 300 },
  { month: "مرداد", sales: 260 },
  { month: "شهریور", sales: 350 },
];

const emails = [
  { id: 1, subject: "پیگیری سفارش #1245", from: "ali@example.com" },
  { id: 2, subject: "سوال در مورد موجودی محصول", from: "sara@example.com" },
  { id: 3, subject: "لغو سفارش #1280", from: "hamed@example.com" },
];

const questions = [
  { id: 1, question: "زمان ارسال سفارش‌ها چقدر است؟" },
  { id: 2, question: "آیا امکان بازگشت کالا وجود دارد؟" },
  { id: 3, question: "چطور می‌توانم سفارش عمده ثبت کنم؟" },
];

const adminTasksInitial = [
  {
    id: 1,
    title: "بازبینی سفارش‌های معوق",
    priority: "high",
    completed: false,
  },
  { id: 2, title: "تایید موجودی محصولات", priority: "medium", completed: true },
  {
    id: 3,
    title: "پاسخ به ایمیل‌های مشتریان",
    priority: "high",
    completed: false,
  },
  {
    id: 4,
    title: "به‌روزرسانی اطلاعات محصولات",
    priority: "low",
    completed: false,
  },
];

export default function DashboardContent() {
  const [tasks, setTasks] = useState(adminTasksInitial);

  const toggleTaskCompletion = (taskId: number) => {
    setTasks(
      tasks.map((t) =>
        t.id === taskId ? { ...t, completed: !t.completed } : t
      )
    );
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 p-6">
      {/* نمودار فروش */}
      <div className="col-span-2 bg-white rounded-2xl shadow p-6">
        <h2 className="text-lg font-semibold mb-4">نمودار فروش محصولات</h2>
        <div className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={salesData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Line
                type="monotone"
                dataKey="sales"
                stroke="#f97316"
                strokeWidth={3}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* ایمیل‌ها */}
      <div className="bg-white rounded-2xl shadow p-6">
        <h2 className="text-lg font-semibold flex items-center gap-2 mb-4">
          <Mail className="w-5 h-5 text-orange-500" /> ایمیل‌های دریافتی
        </h2>
        <ScrollArea className="h-72">
          <ul className="space-y-3">
            {emails.map((email) => (
              <li
                key={email.id}
                className="p-3 rounded-lg bg-gray-50 hover:bg-orange-50 transition"
              >
                <p className="text-sm font-medium">{email.subject}</p>
                <p className="text-xs text-gray-500">{email.from}</p>
              </li>
            ))}
          </ul>
        </ScrollArea>
      </div>

      {/* سوالات */}
      <div className="bg-white rounded-2xl shadow p-6 lg:col-span-3">
        <h2 className="text-lg font-semibold flex items-center gap-2 mb-4">
          <HelpCircle className="w-5 h-5 text-orange-500" /> سوالات مشتریان
        </h2>
        <ul className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          {questions.map((q) => (
            <li
              key={q.id}
              className="p-4 rounded-lg bg-gray-50 hover:bg-orange-50 transition"
            >
              {q.question}
            </li>
          ))}
        </ul>
      </div>

      {/* تسک‌های ادمین */}
      <div className="bg-white rounded-2xl shadow p-6 lg:col-span-3">
        <h2 className="text-lg font-semibold flex items-center gap-2 mb-4">
          <AlertCircle className="w-5 h-5 text-red-500" /> تسک‌ها
        </h2>
        <ul className="space-y-3">
          {tasks.map((task) => (
            <li
              key={task.id}
              className="flex items-center justify-between p-4 rounded-lg bg-gray-50 hover:bg-red-50 transition"
            >
              <div className="flex items-center gap-2">
                {task.completed ? (
                  <CheckCircle className="w-5 h-5 text-green-500" />
                ) : (
                  <AlertCircle className="w-5 h-5 text-red-500" />
                )}
                <p
                  className={`${
                    task.completed ? "line-through text-gray-400" : ""
                  }`}
                >
                  {task.title}
                </p>
              </div>
              <button
                className="text-sm text-blue-500 hover:underline"
                onClick={() => toggleTaskCompletion(task.id)}
              >
                {task.completed ? "بازنشانی" : "انجام شد"}
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
