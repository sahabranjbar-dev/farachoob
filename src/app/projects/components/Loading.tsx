import Spinner from "@/components/Spinner";
import React from "react";

const Loading = () => {
  return (
    <div className="flex items-center justify-center min-h-screen bg-white/25 backdrop-blur-sm z-550 fixed top-0 bottom-0 right-0 left-0 ">
      <Spinner />
    </div>
  );
};

export default Loading;
