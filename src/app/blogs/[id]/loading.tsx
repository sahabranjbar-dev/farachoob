import { Loader2 } from "lucide-react";
import React from "react";

const loading = () => {
  return (
    <div className="w-full h-full flex justify-center items-center min-h-screen">
      <Loader2 className="animate-spin" />
    </div>
  );
};

export default loading;
