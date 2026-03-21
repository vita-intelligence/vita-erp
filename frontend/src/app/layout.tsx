import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Vita ERP",
  description: "Manufacturing ERP system",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return children;
}
