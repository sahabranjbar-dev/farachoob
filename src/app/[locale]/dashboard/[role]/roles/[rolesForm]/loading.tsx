import Spinner from "@/components/Spinner";
import React from "react";

const loading = () => {
  return (
    <div className="flex min-h-screen">
      <Spinner />
    </div>
  );
};

export default loading;
