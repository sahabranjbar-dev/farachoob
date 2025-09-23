"use client";

import React, { useEffect, useRef } from "react";
import { gsap } from "gsap";
import Image from "next/image";
import { Button } from "@/components/ui/button";

const mockCartItems = [
  {
    id: 1,
    name: "صندلی اداری لوکس",
    price: 2500000,
    quantity: 2,
    image: "/images/product1.jpg",
  },
  {
    id: 2,
    name: "میز کار مدرن",
    price: 3500000,
    quantity: 1,
    image: "/images/product2.jpg",
  },
];

const CartPage = () => {
  const mainRef = useRef(null);

  useEffect(() => {
    gsap.fromTo(
      mainRef.current,
      { opacity: 0, y: 50 },
      { opacity: 1, y: 0, duration: 0.8, ease: "power3.out" }
    );
  }, []);

  const total = mockCartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  const discount = total > 5000000 ? 500000 : 0;

  return (
    <div
      ref={mainRef}
      className="container mx-auto px-4 py-8 flex flex-col lg:flex-row gap-6"
    >
      {/* لیست محصولات */}
      <div className="flex-1 bg-white rounded-2xl shadow-md p-6">
        <h2 className="text-2xl font-bold mb-6 text-orange-600">
          سبد خرید شما
        </h2>
        <div className="space-y-6">
          {mockCartItems.map((item) => (
            <div
              key={item.id}
              className="flex items-center gap-4 border-b pb-4"
            >
              <Image
                src={item.image}
                alt={item.name}
                width={80}
                height={80}
                className="rounded-xl object-cover"
                unoptimized
              />
              <div className="flex-1">
                <p className="font-semibold">{item.name}</p>
                <p className="text-sm text-gray-500">
                  {item.price.toLocaleString()} تومان
                </p>
              </div>
              <div className="flex items-center gap-2">
                <button className="px-2 py-1 bg-gray-200 rounded">-</button>
                <span>{item.quantity}</span>
                <button className="px-2 py-1 bg-gray-200 rounded">+</button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* خلاصه سبد خرید */}
      <div className="w-full lg:w-1/3 bg-white rounded-2xl shadow-md p-6 h-fit sticky top-6">
        <h3 className="text-xl font-bold text-orange-600 mb-4">خلاصه خرید</h3>
        <div className="space-y-2 text-gray-700">
          <div className="flex justify-between">
            <span>مبلغ کل:</span>
            <span>{total.toLocaleString()} تومان</span>
          </div>
          <div className="flex justify-between text-green-600">
            <span>تخفیف:</span>
            <span>{discount.toLocaleString()} تومان</span>
          </div>
          <div className="flex justify-between font-bold text-lg mt-4">
            <span>مبلغ نهایی:</span>
            <span>{(total - discount).toLocaleString()} تومان</span>
          </div>
        </div>
        <Button className="mt-6 w-full bg-orange-500 hover:bg-orange-600 text-white text-lg py-3 rounded-xl transition-all">
          ادامه فرآیند خرید
        </Button>
      </div>
    </div>
  );
};

export default CartPage;
