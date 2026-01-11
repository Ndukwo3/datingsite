
'use client';

import type { ReactNode } from "react";
import { useRouter } from "next/navigation";
import { SidebarProvider, Sidebar, SidebarInset } from "@/components/ui/sidebar";
import { AppSidebarContent } from '@/components/AppSidebarContent';
import { AppHeader } from '@/components/AppHeader';
import { cn } from "@/lib/utils";
import { useUser } from "@/firebase";
import { Loader2 } from "lucide-react";

export default function AppLayout({ children }: { children: ReactNode }) {
    const { user, loading } = useUser();
    const router = useRouter();

    if (loading) {
        return (
            <div className="flex h-screen w-screen items-center justify-center bg-background">
                <Loader2 className="h-8 w-8 animate-spin" />
            </div>
        );
    }
    
    if (!user) {
        router.replace('/login');
        return null;
    }

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
