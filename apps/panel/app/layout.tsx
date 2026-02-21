import type { Metadata } from "next";
import localFont from "next/font/local";
import { ThemeProvider } from "../components/providers/theme-provider";
import "./globals.css";

const IRANSansXFaNum = localFont({
  src: [
    {
      path: "../public/fonts/IRANSansXFaNum-Thin.woff2",
      weight: "100",
      style: "normal",
    },
    {
      path: "../public/fonts/IRANSansXFaNum-UltraLight.woff2",
      weight: "200",
      style: "normal",
    },
    {
      path: "../public/fonts/IRANSansXFaNum-Light.woff2",
      weight: "300",
      style: "normal",
    },
    {
      path: "../public/fonts/IRANSansXFaNum-Regular.woff2",
      weight: "400",
      style: "normal",
    },
    {
      path: "../public/fonts/IRANSansXFaNum-Medium.woff2",
      weight: "500",
      style: "normal",
    },
    {
      path: "../public/fonts/IRANSansXFaNum-DemiBold.woff2",
      weight: "600",
      style: "normal",
    },
    {
      path: "../public/fonts/IRANSansXFaNum-Bold.woff2",
      weight: "700",
      style: "normal",
    },
    {
      path: "../public/fonts/IRANSansXFaNum-ExtraBold.woff2",
      weight: "800",
      style: "normal",
    },
    {
      path: "../public/fonts/IRANSansXFaNum-Black.woff2",
      weight: "900",
      style: "normal",
    },
    {
      path: "../public/fonts/IRANSansXFaNum-ExtraBlack.woff2",
      weight: "900",
      style: "normal",
    },
  ],
  variable: "--font-primary",
  display: "swap",
});

export const metadata: Metadata = {
  title: "سیستم مدیریت آموزشی",
  description: "سیستم مدیریت آموزشی",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>): React.ReactElement {
  return (
    <html lang="fa-IR" dir="rtl" suppressHydrationWarning>
      <body className={IRANSansXFaNum.className}>
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  );
}
