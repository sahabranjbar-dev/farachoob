import React from "react";
import { Button } from "../ui/button";
import { PencilLine, Trash2 } from "lucide-react";
import { IRowFormButtons } from "./meta/types";

const RowFormButtons = ({}: IRowFormButtons) => {
  return (
    <>
      <Button
        variant="ghost"
        // onClick={() => handleEdit(user)}
        // disabled={isSaving}
      >
        <PencilLine className="text-blue-500" />
      </Button>
      <Button
        variant="ghost"
        // onClick={() => toast.info("امکان حذف به زودی اضافه می‌شود.")}
        // disabled={isSaving}
      >
        <Trash2 className="text-red-500" />
      </Button>
    </>
  );
};

export default RowFormButtons;
