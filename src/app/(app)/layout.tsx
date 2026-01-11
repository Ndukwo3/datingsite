import type { ReactNode } from "react";
import { SidebarProvider, Sidebar, SidebarInset } from "@/components/ui/sidebar";
import { AppSidebarContent } from '@/components/AppSidebarContent';
import { AppHeader } from '@/components/AppHeader';
import { cn } from "@/lib/utils";

export default function AppLayout({ children }: { children: ReactNode }) {
    return (
        <SidebarProvider>
            <Sidebar>
                <AppSidebarContent />
            </Sidebar>
            <SidebarInset>
                <AppHeader />
                <main className={cn("flex-1 p-4 sm:p-6 lg:p-8 overflow-auto", "bg-animated-gradient")}>
                    {children}
                </main>
            </SidebarInset>
        </SidebarProvider>
    );
}
