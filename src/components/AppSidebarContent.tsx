"use client";

import Link from "next/link";
import { usePathname } from 'next/navigation';
import {
  SidebarHeader,
  SidebarContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarFooter,
} from "@/components/ui/sidebar";
import { Logo } from "@/components/Logo";
import { Button } from "./ui/button";
import { Flame, MessageSquareText, Users, CircleUser, Crown, LogOut, Settings } from "lucide-react";
import { cn } from "@/lib/utils";
import { ThemeToggle } from "./ThemeToggle";

const menuItems = [
  { href: "/discover", label: "Swipe", icon: Flame },
  { href: "/matches", label: "Matches", icon: Users },
  { href: "/chat", label: "Chat", icon: MessageSquareText },
  { href: "/profile", label: "Profile", icon: CircleUser },
];

export function AppSidebarContent() {
  const pathname = usePathname();
  
  const isActive = (href: string) => {
    if (href === '/discover') return pathname === '/discover' || pathname === '/';
    return pathname.startsWith(href);
  };

  return (
    <>
      <SidebarHeader>
        <Logo />
      </SidebarHeader>
      <SidebarContent className="p-2">
        <SidebarMenu>
          {menuItems.map((item) => (
            <SidebarMenuItem key={item.label}>
              <SidebarMenuButton
                asChild
                isActive={isActive(item.href)}
                tooltip={{children: item.label}}
              >
                <Link href={item.href}>
                  <item.icon className="h-5 w-5" />
                  <span>{item.label}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
           <SidebarMenuItem>
              <SidebarMenuButton
                asChild
                className="mt-4 bg-accent/50 text-accent-foreground hover:bg-accent"
                isActive={isActive('/premium')}
                tooltip={{children: 'Upgrade to Premium'}}
              >
                <Link href="/premium">
                  <Crown className="h-5 w-5 text-accent-foreground" />
                  <span>Upgrade</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
        </SidebarMenu>
      </SidebarContent>
      <SidebarFooter>
        <div className="md:hidden flex justify-between items-center p-2 border-t">
          <span>Switch Theme</span>
          <ThemeToggle />
        </div>
        <SidebarMenu>
            <SidebarMenuItem>
                <SidebarMenuButton asChild tooltip={{children: 'Settings'}}>
                    <Link href="#">
                        <Settings className="h-5 w-5" />
                        <span>Settings</span>
                    </Link>
                </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
                <SidebarMenuButton asChild tooltip={{children: 'Logout'}}>
                    <Link href="/login?fromNav=true">
                        <LogOut className="h-5 w-5" />
                        <span>Logout</span>
                    </Link>
                </SidebarMenuButton>
            </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </>
  );
}
