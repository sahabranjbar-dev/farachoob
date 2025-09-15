import React from "react";

interface EmptyArticlesProps {
  title?: string;
  subtitle?: string;
  actionLabel?: string;
  onAction?: () => void;
}

export default function EmptyArticles({
  title = "فعلا مقاله‌ای در سایت وجود ندارد",
  subtitle = "به‌زودی محتوا اضافه خواهد شد.",
  actionLabel,
  onAction,
}: EmptyArticlesProps) {
  return (
    <section
      role="status"
      aria-live="polite"
      className="min-h-[90vh] flex flex-col items-center justify-center px-6 py-12 bg-white dark:bg-black"
    >
      {/* svg */}
      <div className="w-full max-w-md flex flex-col items-center">
        <div className="w-48 h-48 mb-6 rounded-lg bg-gradient-to-br from-gray-50 to-gray-100 dark:from-neutral-900 dark:to-neutral-800 flex items-center justify-center shadow-lg">
          <svg
            width="180"
            height="140"
            viewBox="0 0 180 140"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden="true"
            className="block"
          >
            <rect x="6" y="20" width="120" height="88" rx="6" fill="#E6EEF8" />
            <rect x="12" y="26" width="108" height="12" rx="3" fill="#D6E6F6" />
            <rect x="12" y="46" width="90" height="8" rx="2" fill="#C8DBEF" />
            <rect x="12" y="58" width="80" height="8" rx="2" fill="#C8DBEF" />
            <rect x="12" y="70" width="100" height="8" rx="2" fill="#C8DBEF" />
            <path d="M138 20h36v88h-36z" fill="#FFF" stroke="#E2E8F0" />
            <circle cx="156" cy="44" r="10" fill="#FDE68A" />
            <g opacity="0.9">
              <path
                d="M20 116c8-6 28-10 46-10s38 4 46 10v8H20v-8z"
                fill="#EDEFF6"
              />
            </g>
          </svg>
        </div>

        {/* متن */}
        <h2 className="text-2xl sm:text-3xl font-semibold text-gray-800 dark:text-gray-50 text-center">
          {title}
        </h2>

        <p className="mt-3 text-sm sm:text-base text-gray-500 dark:text-gray-300 text-center max-w-[34rem]">
          {subtitle}
        </p>

        {/* اختیاری: دکمه */}
        {actionLabel && onAction && (
          <div className="mt-6">
            <button
              onClick={onAction}
              className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md shadow-sm transition"
            >
              <svg
                className="w-4 h-4"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                aria-hidden="true"
              >
                <path
                  d="M12 5v14M5 12h14"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              <span>{actionLabel}</span>
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
