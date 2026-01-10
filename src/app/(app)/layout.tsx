import type { ReactNode } from "react";
import { SidebarProvider, Sidebar, SidebarInset } from "@/components/ui/sidebar";
import { AppSidebarContent } from '@/components/AppSidebarContent';
import { AppHeader } from '@/components/AppHeader';

export default function AppLayout({ children }: { children: ReactNode }) {
    return (
        <SidebarProvider>
            <Sidebar>
                <AppSidebarContent />
            </Sidebar>
            <SidebarInset>
                <AppHeader />
                <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-auto">
                    {children}
                </main>
            </SidebarInset>
        </SidebarProvider>
    );
}