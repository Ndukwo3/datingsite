
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
import { Flame, MessageSquareText, Users, CircleUser, Crown, LogOut, Settings, Rss, Newspaper } from "lucide-react";
import { ThemeToggle } from "./ThemeToggle";
import { getAuth, signOut } from "firebase/auth";
import { useFirebaseApp, useSidebar } from "@/firebase";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";

const menuItems = [
  { href: "/feed", label: "Feed", icon: Rss },
  { href: "/discover", label: "Swipe", icon: Flame },
  { href: "/matches", label: "Matches", icon: Users },
  { href: "/chat", label: "Chat", icon: MessageSquareText },
  { href: "/blog", label: "Blog", icon: Newspaper },
  { href: "/profile", label: "Profile", icon: CircleUser },
];

export function AppSidebarContent() {
  const pathname = usePathname();
  const firebaseApp = useFirebaseApp();
  const router = useRouter();
  const { toast } = useToast();
  const { setOpenMobile } = useSidebar();
  
  const isActive = (href: string) => {
    if (href === '/discover') return pathname === '/discover';
    if (href === '/chat') return pathname.startsWith('/chat');
    if (href === '/blog') return pathname.startsWith('/blog');
    if (href === '/profile') return pathname.startsWith('/profile');
    return pathname === href;
  };

  const handleLogout = async () => {
    if (firebaseApp) {
      const auth = getAuth(firebaseApp);
      try {
        await signOut(auth);
        toast({ title: "Logged out successfully." });
        setOpenMobile(false);
        router.push('/login');
      } catch (error) {
        console.error("Logout error:", error);
        toast({ title: "Logout failed", description: "Please try again.", variant: "destructive" });
      }
    }
  };

  const handleLinkClick = () => {
    setOpenMobile(false);
  }

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
                onClick={handleLinkClick}
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
                className="mt-4 bg-yellow-400/20 text-yellow-600 hover:bg-yellow-400/30 dark:text-yellow-400 dark:bg-yellow-400/10 dark:hover:bg-yellow-400/20"
                isActive={isActive('/premium')}
                tooltip={{children: 'Upgrade to Premium'}}
                 onClick={handleLinkClick}
              >
                <Link href="/premium">
                  <Crown className="h-5 w-5" />
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
                <SidebarMenuButton asChild tooltip={{children: 'Settings'}} onClick={handleLinkClick}>
                    <Link href="/profile">
                        <Settings className="h-5 w-5" />
                        <span>Settings</span>
                    </Link>
                </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
                <SidebarMenuButton onClick={handleLogout} tooltip={{children: 'Logout'}}>
                  <LogOut className="h-5 w-5" />
                  <span>Logout</span>
                </SidebarMenuButton>
            </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </>
  );
}
