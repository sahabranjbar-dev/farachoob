"use client";
import { cn } from "@/lib/utils";
import { useTheme } from "next-themes";
import React from "react";
import "../assets/Blogs.css";

interface Props {
  safeContent: any;
}
const Article = ({ safeContent }: Props) => {
  const { theme } = useTheme();
  console.log({ theme });

  return (
    <article
      className={cn(
        "article-content p-4 m-4 ",
        theme === "dark" ? "dark" : "white"
      )}
      dangerouslySetInnerHTML={{ __html: safeContent }}
    />
  );
};

export default Article;
