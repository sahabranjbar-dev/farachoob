// src/app/global-error.tsx
"use client";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html>
      <body>
        <h2>خطایی رخ داده است</h2>
        <button onClick={() => reset()}>تلاش مجدد</button>
      </body>
    </html>
  );
}
