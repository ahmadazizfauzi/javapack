import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "@/styles/globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "JavaPack - International Travel Gear Rental & CMS",
  description:
    "JavaPack public travel gear rental website and admin CMS for products, content, and rental orders.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.className} bg-surface-canvas text-surface-foreground`}>
        {children}
      </body>
    </html>
  );
}
