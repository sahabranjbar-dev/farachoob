"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";

interface Props {
  articleId: string;
}

export default function CommentForm({ articleId }: Props) {
  const [text, setText] = useState("");
  const [captcha, setCaptcha] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    // TODO: اتصال به API برای ثبت نظر
    await new Promise((res) => setTimeout(res, 1000));

    setLoading(false);
    setText("");
    setCaptcha("");
    alert("نظر شما ثبت شد ✅");
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white border rounded-xl shadow-md p-6 space-y-4"
    >
      <h3 className="text-lg font-semibold">ثبت نظر</h3>
      <Textarea
        placeholder="نظر خود را بنویسید..."
        value={text}
        onChange={(e) => setText(e.target.value)}
        required
      />
      <div>
        <Input
          placeholder="کد کپچا (مثلاً 2 + 3 = ?)"
          value={captcha}
          onChange={(e) => setCaptcha(e.target.value)}
          required
        />
      </div>
      <Button type="submit" disabled={loading}>
        {loading ? "در حال ارسال..." : "ثبت نظر"}
      </Button>
    </form>
  );
}
