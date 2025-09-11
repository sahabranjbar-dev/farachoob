import Link from "next/link";

export default function NotFoundPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900 text-center px-4">
      <h1 className="text-4xl font-bold mt-6 text-gray-800 dark:text-white">
        صفحه پیدا نشد!
      </h1>

      <p className="text-gray-500 dark:text-gray-300 mt-2 max-w-md">
        متأسفیم، صفحه‌ای که به دنبال آن هستید وجود ندارد یا ممکن است حذف شده
        باشد.
      </p>

      <Link href={`/dashboard`}>بازگشت به صفحه اصلی</Link>
    </div>
  );
}
