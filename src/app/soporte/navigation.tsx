import { ResponsiveMenuItem } from "@/types/responsive-layout-types";
import { Home, School, Settings } from "lucide-react";

const navigation: ResponsiveMenuItem[] = [
  { id: "home", icon: <Home />, label: "Home", href: "/soporte" },
  {
    id: "classroom",
    icon: <School />,
    label: "Classroom",
    href: "/soporte/classroom",
  },
  {
    id: "settings",
    icon: <Settings />,
    label: "Settings",
    subItems: [
      {
        id: "general",
        icon: <Settings />,
        label: "General",
        href: "/settings/general",
      },
      {
        id: "security",
        icon: <Settings />,
        label: "Security",
        href: "/settings/security",
      },
      {
        id: "notifications",
        icon: <Settings />,
        label: "Notifications",
        href: "/settings/notifications",
      },
    ],
  },
];

export default navigation;
