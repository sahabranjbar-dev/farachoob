import Image from "next/image";
import React from "react";

const cart = () => {
  return (
    <div className="bg-white mx-auto flex justify-center items-center py-16">
      <div>
        <div>
          <Image
            src="/trolley.webp"
            alt="empty basket"
            width={200}
            height={200}
          />
        </div>
        <div>
          <p>سبد خرید شما خالی است!</p>
        </div>
      </div>
    </div>
  );
};

export default cart;
