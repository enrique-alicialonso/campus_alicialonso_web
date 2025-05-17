"use client";
import React from "react";
import { Nav, NavItem } from "./nav";
import {
  BookA,
  ChevronRight,
  LayoutDashboard,
  Settings,
  ShoppingCart,
  UsersRound,
} from "lucide-react";
import { Button } from "./button";

import { useWindowWidth } from "@react-hook/window-size";
import SignInButton from "@/components/SignInButton";

type SidebarProps = {};

const links: NavItem[] = [
  {
    title: "Dashboard",
    href: "/dashboard",
    icon: LayoutDashboard,
    variant: "default",
  },
  {
    title: "Users",
    href: "/dashboard/users",
    icon: UsersRound,
    variant: "ghost",
  },
  {
    title: "Cursos",
    href: "/dashboard/cursos",
    icon: BookA,
    variant: "ghost",
  },
  {
    title: "Orders",
    href: "/dashboard/orders",
    icon: ShoppingCart,
    variant: "ghost",
  },
  {
    title: "Settings",
    href: "/dashboard/settings",
    icon: Settings,
    variant: "ghost",
  },
];

export default function Sidebar({}: SidebarProps) {
  const [isCollapsed, setIsCollapsed] = React.useState(false);

  const onlyWidth = useWindowWidth();
  const mobileWidth = onlyWidth < 768;

  function toggleSidebar() {
    setIsCollapsed(!isCollapsed);
  }
  return (
    <div className="relative min-w-[80px] border-r px-3 pb-10 pt-24">
      {!mobileWidth && (
        <div className="absolute right-[-20px] top-7">
          <Button
            variant="secondary"
            className="rounded-full p-2"
            onClick={toggleSidebar}
          >
            <ChevronRight />
          </Button>
        </div>
      )}
      <Nav isCollapsed={mobileWidth ? true : isCollapsed} links={links} />
    </div>
  );
}
