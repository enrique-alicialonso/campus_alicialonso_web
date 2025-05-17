import ResponsiveLayout from "@/components/responsive-layout";
import "../globals.css";
import { Inter } from "next/font/google";
import navigation from "./navigation";
// import { Providers } from './providers'

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Responsive Layout Demo",
  description: "A demo of a responsive layout with sidebar and bottom tab bar",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ResponsiveLayout menuItems={navigation}>{children}</ResponsiveLayout>
      </body>
    </html>
  );
}
