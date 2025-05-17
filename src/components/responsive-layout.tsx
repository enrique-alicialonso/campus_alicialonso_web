"use client";

import React, { useState } from "react";
import Sidebar from "./sidebar";
import BottomTabBar from "./bottom-tab-bar";
import { Button } from "@/components/ui/button";
import { Menu } from "lucide-react";
import { ResponsiveMenuItem } from "@/types/responsive-layout-types";

export default function ResponsiveLayout({
  children,
  menuItems,
}: {
  children: React.ReactNode;
  menuItems: ResponsiveMenuItem[];
  activeItem?: string;
}) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [showIconsOnly, setShowIconsOnly] = useState(false);
  return (
    <div className="flex h-screen flex-col md:flex-row">
      <Button
        variant="outline"
        size="icon"
        className="fixed left-4 top-4 z-50 md:hidden"
        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
      >
        <Menu className="h-4 w-4" />
      </Button>

      {/* Sidebar for larger screens */}
      <div className={`hidden md:block ${isSidebarOpen ? "w-64" : "w-fit"}`}>
        <Sidebar
          showIconsOnly={showIconsOnly}
          setShowIconsOnly={setShowIconsOnly}
          menuItems={menuItems}
        />
      </div>

      {/* Main content area */}
      <div className="flex-1 overflow-auto">
        <div className="container mx-auto py-8">{children}</div>
      </div>

      {/* Bottom tab bar for mobile screens */}
      <div className="md:hidden">
        <BottomTabBar menuItems={menuItems} />
      </div>
    </div>
  );
}
