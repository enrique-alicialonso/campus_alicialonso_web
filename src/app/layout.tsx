import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils/utils";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Campus Virtual Alicia Alonso",
  description:
    "Panel de control principal para el personal y estudiantes del Instituto Alicia Alonso",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body
        className={cn(inter.className, {
          "debug-screens": process.env.NODE_ENV === "development",
        })}
      >
        {children}
      </body>
    </html>
  );
}
