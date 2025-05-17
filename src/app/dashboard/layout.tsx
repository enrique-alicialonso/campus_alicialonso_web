import { Inter } from "next/font/google";
import "../globals.css";
import { cn } from "@/lib/utils/utils";
import Sidebar from "@/components/ui/sidebar";
import {
  LayoutDashboard,
  Settings,
  ShoppingCart,
  UsersRound,
} from "lucide-react";
import { getSession } from "@/lib/firebase/config/auth";
import { redirect } from "next/navigation";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Campus Virtual Alicia Alonso",
  description:
    "Panel de control principal para el personal y estudiantes del Instituto Alicia Alonso",
};

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getSession();

  if (!session) {
    redirect("/");
  }

  return (
    <html lang="en">
      <body
        className={cn(
          "min-h-screen w-full bg-white text-black flex",
          inter.className,
          { "debug-screens": process.env.NODE_ENV === "development" }
        )}
      >
        <Sidebar />
        <div className="p-8 w-full">{children}</div>
      </body>
    </html>
  );
}
