"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Home, Settings, Users } from "lucide-react";
import { ResponsiveMenuItem } from "@/types/responsive-layout-types";

interface BottomTabBarProps {
  menuItems: ResponsiveMenuItem[];
}

export default function BottomTabBar({ menuItems }: BottomTabBarProps) {
  const [openSheet, setOpenSheet] = useState<string | null>(null);

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-gray-100 p-2">
      <div className="flex justify-around">
        {menuItems.map((item) => (
          <React.Fragment key={item.id}>
            {item.subItems ? (
              <Sheet
                open={openSheet === item.id}
                onOpenChange={() =>
                  setOpenSheet(openSheet === item.id ? null : item.id)
                }
              >
                <SheetTrigger asChild>
                  <Button variant="ghost" size="icon">
                    {item.icon}
                  </Button>
                </SheetTrigger>
                <SheetContent side="bottom" className="h-[50vh]">
                  <Accordion type="single" collapsible className="w-full">
                    <AccordionItem value={item.id}>
                      <AccordionTrigger>{item.label}</AccordionTrigger>
                      <AccordionContent>
                        <ul className="space-y-2">
                          {item.subItems.map((subItem) => (
                            <li key={subItem.id}>
                              <Link href={subItem.href ?? ""} passHref>
                                <Button
                                  variant="ghost"
                                  className="w-full justify-start"
                                  onClick={() => setOpenSheet(null)}
                                >
                                  {subItem.label}
                                </Button>
                              </Link>
                            </li>
                          ))}
                        </ul>
                      </AccordionContent>
                    </AccordionItem>
                  </Accordion>
                </SheetContent>
              </Sheet>
            ) : (
              <Link href={item.href ?? ""} passHref>
                <Button variant="ghost" size="icon">
                  {item.icon}
                </Button>
              </Link>
            )}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
}
