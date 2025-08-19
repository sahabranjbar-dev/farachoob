"use client";

import React, { useState } from "react";
import ReactQuill from "react-quill-new";
import "react-quill-new/dist/quill.snow.css";

export default function ArticleEditor() {
  const [value, setValue] = useState("");

  return (
    <div className="w-full">
      <ReactQuill
        theme="snow"
        value={value}
        onChange={setValue}
        className="h-96"
      />
      <p className="mt-4">Preview:</p>
      <div dangerouslySetInnerHTML={{ __html: value }} />
    </div>
  );
}
