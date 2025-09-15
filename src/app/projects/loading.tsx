import Spinner from "@/components/Spinner";
import React from "react";

const Loading = () => {
  return (
    <div className="flex items-center justify-center min-h-screen bg-white/25 backdrop-blur-sm z-550">
      <Spinner />
    </div>
  );
};

export default Loading;
