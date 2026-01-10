import { SidebarTrigger } from "@/components/ui/sidebar";
import { UserNav } from "@/components/UserNav";
import { Button } from "./ui/button";
import { Bell, Search } from "lucide-react";
import { ThemeToggle } from "./ThemeToggle";

export function AppHeader() {
  return (
    <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b bg-background/70 px-4 backdrop-blur-xl sm:px-6">
      <SidebarTrigger className="md:hidden" />
      <div className="flex-1">
        {/* Can add a search bar here if needed */}
      </div>
      <div className="flex items-center gap-2">
        <Button variant="ghost" size="icon" className="rounded-full">
            <Bell className="h-5 w-5"/>
            <span className="sr-only">Notifications</span>
        </Button>
        <ThemeToggle />
        <UserNav />
      </div>
    </header>
  );
}
