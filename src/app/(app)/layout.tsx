
'use client';

import type { ReactNode } from "react";
import { useEffect } from "react";
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

    useEffect(() => {
        // Only redirect when loading is complete and there's no user.
        if (!loading && !user) {
            router.replace('/login');
        }
        
        // Ask for notification permission once the user is logged in
        if (!loading && user) {
            if ("Notification" in window && Notification.permission === "default") {
                Notification.requestPermission();
            }
        }

    }, [user, loading, router]);

    // Show a loading spinner while the auth state is being determined.
    if (loading) {
        return (
            <div className="flex h-screen w-screen items-center justify-center bg-background">
                <Loader2 className="h-8 w-8 animate-spin" />
            </div>
        );
    }
    
    // If loading is finished and there's still no user, the useEffect will handle the redirect.
    // We can render null or a loading spinner here to prevent a brief flash of the layout.
    if (!user) {
        return (
             <div className="flex h-screen w-screen items-center justify-center bg-background">
                <Loader2 className="h-8 w-8 animate-spin" />
            </div>
        );
    }
    
    // If we have a user, render the full layout.
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
