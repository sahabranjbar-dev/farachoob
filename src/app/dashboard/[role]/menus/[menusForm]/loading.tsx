import Spinner from "@/components/Spinner";
import React from "react";

const Loading = () => {
  return (
    <div className="flex min-h-screen justify-center items-center">
      <Spinner />
    </div>
  );
};

export default Loading;
