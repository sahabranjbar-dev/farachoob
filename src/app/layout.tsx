import localFont from "next/font/local";

export const myFont = localFont({
  src: [
    {
      path: "../../public/fonts/Samim-FD.woff2",
      weight: "500",
      style: "normal",
    },
  ],
  display: "swap",
});

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html suppressHydrationWarning dir="rtl">
      <body className={`${myFont.className} overflow-x-hidden`}>
        {children}
      </body>
    </html>
  );
}
