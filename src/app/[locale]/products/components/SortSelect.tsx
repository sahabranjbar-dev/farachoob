"use client";

export function SortSelect() {
  return (
    <select className="p-2 border rounded-md focus:outline-orange-500">
      <option>مرتب‌سازی بر اساس جدیدترین</option>
      <option>قیمت از کم به زیاد</option>
      <option>قیمت از زیاد به کم</option>
    </select>
  );
}
