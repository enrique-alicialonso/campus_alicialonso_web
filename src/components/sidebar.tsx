"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  Home,
  Settings,
  Users,
  ChevronRight,
  ChevronDown,
  CircleChevronRight,
  CircleChevronLeft,
} from "lucide-react";
import { ResponsiveMenuItem } from "@/types/responsive-layout-types";
type SidebarProps = {
  showIconsOnly: boolean;
  setShowIconsOnly: (value: boolean) => void;
  menuItems: ResponsiveMenuItem[];
};

export default function Sidebar({
  showIconsOnly,
  setShowIconsOnly,
  menuItems,
}: SidebarProps) {
  const [openMenus, setOpenMenus] = useState<string[]>([]);

  const toggleMenu = (menuId: string) => {
    setOpenMenus((prev) =>
      prev.includes(menuId)
        ? prev.filter((id) => id !== menuId)
        : [...prev, menuId]
    );
  };

  return (
    <div className="flex h-full flex-col bg-gray-100 p-3">
      <div className="mb-4 flex justify-end lg:hidden">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setShowIconsOnly(!showIconsOnly)}
        >
          {showIconsOnly ? <CircleChevronRight /> : <CircleChevronLeft />}
        </Button>
      </div>
      <nav>
        <ul className="space-y-2">
          {menuItems.map((item) => (
            <li key={item.id}>
              {item.subItems ? (
                <Collapsible
                  open={openMenus.includes(item.id)}
                  onOpenChange={() => toggleMenu(item.id)}
                >
                  <CollapsibleTrigger asChild>
                    <Button
                      variant="ghost"
                      className={`w-full justify-start ${
                        showIconsOnly ? "px-2" : "px-4"
                      }`}
                    >
                      {item.icon}
                      {!showIconsOnly && (
                        <>
                          <span className="ml-2">{item.label}</span>
                          {openMenus.includes(item.id) ? (
                            <ChevronDown className="ml-auto h-4 w-4" />
                          ) : (
                            <ChevronRight className="ml-auto h-4 w-4" />
                          )}
                        </>
                      )}
                    </Button>
                  </CollapsibleTrigger>
                  <CollapsibleContent>
                    <ul className="ml-4 mt-2 space-y-2">
                      {item.subItems.map((subItem) => (
                        <li key={subItem.id}>
                          <Link href={subItem.href ?? ""} passHref>
                            <Button
                              variant="ghost"
                              className={`w-full justify-start ${
                                showIconsOnly ? "px-2" : "px-4"
                              }`}
                            >
                              {!showIconsOnly && <span>{subItem.label}</span>}
                            </Button>
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </CollapsibleContent>
                </Collapsible>
              ) : (
                <Link href={item.href ?? ""} passHref>
                  <Button
                    variant="ghost"
                    className={`w-full justify-start ${
                      showIconsOnly ? "px-2" : "px-4"
                    }`}
                  >
                    {item.icon}
                    {!showIconsOnly && (
                      <span className="ml-2">{item.label}</span>
                    )}
                  </Button>
                </Link>
              )}
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
}
