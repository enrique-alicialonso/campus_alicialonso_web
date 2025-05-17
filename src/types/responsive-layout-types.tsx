export interface ResponsiveMenuItem {
  id: string;
  icon: React.ReactNode;
  label: string;
  href?: string;
  subItems?: ResponsiveMenuItem[];
}
