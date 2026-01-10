
"use client";

import * as React from "react";
import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Heart, Mail, KeyRound, User } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Checkbox } from "./ui/checkbox";
import Link from "next/link";
import { SplashScreen } from "./SplashScreen";
import { ThemeToggle } from "./ThemeToggle";

const GoogleIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" width="24px" height="24px" {...props}>
        <path fill="#FFC107" d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12s5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24s8.955,20,20,20s20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z" />
        <path fill="#FF3D00" d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z" />
        <path fill="#4CAF50" d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.223,0-9.651-3.358-11.297-7.962l-6.571,4.819C9.656,39.663,16.318,44,24,44z" />
        <path fill="#1976D2" d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571l6.19,5.238C43.021,36.25,44,30.413,44,24C44,22.659,43.862,21.35,43.611,20.083z" />
    </svg>
);


type Tab = "login" | "signup";

type AuthPageProps = {
    defaultTab: Tab;
};

export function AuthPage({ defaultTab }: AuthPageProps) {
    const [activeTab, setActiveTab] = useState<Tab>(defaultTab);
    const router = useRouter();
    const searchParams = useSearchParams();
    const fromNav = searchParams.get('fromNav');
    const [showSplash, setShowSplash] = useState(!!fromNav);

    React.useEffect(() => {
        if (showSplash) {
            const timer = setTimeout(() => setShowSplash(false), 2500);
            return () => clearTimeout(timer);
        }
    }, [showSplash]);

    if (showSplash) {
        return <SplashScreen />;
    }

    const handleFormSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        router.push('/onboarding');
    };
    
    const handleSwitchTab = (tab: Tab) => {
        setActiveTab(tab);
    };

    return (
        <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-gradient-to-br from-pink-100 via-red-50 to-yellow-50 p-6 dark:from-pink-900/80 dark:via-red-800/70 dark:to-purple-900/80 md:p-8 font-body">
            <div className="absolute inset-0 z-0">
                <motion.div 
                    className="absolute top-[10%] left-[10%] h-48 w-48 rounded-full bg-white/10 dark:bg-white/5"
                    animate={{ y: [-20, 20], x: [-20, 20] }}
                    transition={{ duration: 15, repeat: Infinity, repeatType: "reverse", ease: "easeInOut" }}
                />
                <motion.div 
                    className="absolute bottom-[15%] right-[15%] h-64 w-64 rounded-full bg-white/10 dark:bg-white/5"
                    animate={{ y: [30, -30], x: [30, -30] }}
                    transition={{ duration: 20, repeat: Infinity, repeatType: "reverse", ease: "easeInOut" }}
                />
            </div>

            <ThemeToggle className="absolute top-4 right-4 md:top-6 md:right-6 text-foreground bg-black/10 hover:bg-black/20 hover:text-white" />
            
            <motion.div 
                className="relative z-10 w-full max-w-sm rounded-2xl bg-white/20 p-8 shadow-2xl backdrop-blur-lg"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, ease: "easeOut" }}
            >
                <div className="mb-8 flex flex-col items-center text-center">
                    <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-pink-500 to-orange-400">
                        <Heart className="h-8 w-8 text-white" />
                    </div>
                    <h1 className="font-headline text-3xl font-bold text-gray-800 dark:text-white">LinkUp9ja</h1>
                    <p className="mt-2 text-gray-600 dark:text-gray-200">Find your perfect match in Nigeria</p>
                </div>

                <div className="relative flex rounded-lg bg-gray-100/70 p-1">
                    <motion.div 
                        className="absolute inset-0.5 w-1/2 rounded-md bg-white shadow"
                        animate={{ x: activeTab === 'login' ? '0%' : '100%' }}
                        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                    />
                    <button onClick={() => handleSwitchTab('login')} className={cn("relative z-10 w-1/2 py-2 text-sm font-medium transition-colors", activeTab === 'login' ? 'text-pink-600' : 'text-gray-500')}>
                        Login
                    </button>
                    <button onClick={() => handleSwitchTab('signup')} className={cn("relative z-10 w-1/2 py-2 text-sm font-medium transition-colors", activeTab === 'signup' ? 'text-pink-600' : 'text-gray-500')}>
                        Sign Up
                    </button>
                </div>

                <div className="relative mt-6 h-[360px] overflow-hidden">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={activeTab}
                            initial={{ opacity: 0, x: activeTab === 'login' ? -50 : 50 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: activeTab === 'login' ? 50 : -50 }}
                            transition={{ duration: 0.4, ease: "easeInOut" }}
                            className="absolute w-full"
                        >
                            {activeTab === 'login' ? <LoginForm onSubmit={handleFormSubmit} /> : <SignUpForm onSubmit={handleFormSubmit} />}
                        </motion.div>
                    </AnimatePresence>
                </div>
            </motion.div>
        </div>
    );
}

const LoginForm = ({ onSubmit }: { onSubmit: (e: React.FormEvent) => void }) => (
    <form onSubmit={onSubmit} className="space-y-6">
        <div>
            <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                <Input
                    type="email"
                    placeholder="Email Address"
                    required
                    className="pl-10 placeholder:text-muted-foreground focus:placeholder:text-transparent"
                />
            </div>
        </div>
        <div>
            <div className="relative">
                <KeyRound className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                <Input
                    type="password"
                    placeholder="Password"
                    required
                    className="pl-10 placeholder:text-muted-foreground focus:placeholder:text-transparent"
                />
            </div>
        </div>
        <div className="flex items-center justify-between text-sm">
            <label className="flex items-center gap-2 text-gray-600 dark:text-gray-300">
                <Checkbox id="remember-me" />
                Remember me
            </label>
            <Link href="#" className="font-medium text-pink-600 hover:text-pink-500 dark:text-gray-200 dark:hover:text-white">
                Forgot Password?
            </Link>
        </div>
        <Button type="submit" className="w-full bg-gradient-to-r from-pink-500 to-orange-500 py-3 text-white font-semibold shadow-lg hover:scale-105 transition-transform">
            Log In
        </Button>
        <div className="my-6 flex items-center gap-4">
            <div className="h-px flex-grow bg-gray-300" />
            <span className="text-sm font-medium text-gray-400">OR</span>
            <div className="h-px flex-grow bg-gray-300" />
        </div>
        <Button variant="outline" className="w-full">
            <GoogleIcon className="mr-2 h-5 w-5" />
            Continue with Google
        </Button>
    </form>
);

const SignUpForm = ({ onSubmit }: { onSubmit: (e: React.FormEvent) => void }) => (
    <form onSubmit={onSubmit} className="space-y-6">
         <div className="grid grid-cols-2 gap-4">
            <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                <Input
                    type="text"
                    placeholder="First Name"
                    required
                    className="pl-10 placeholder:text-muted-foreground focus:placeholder:text-transparent"
                />
            </div>
             <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                <Input
                    type="text"
                    placeholder="Last Name"
                    required
                    className="pl-10 placeholder:text-muted-foreground focus:placeholder:text-transparent"
                />
            </div>
        </div>
        <div>
            <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                <Input
                    type="email"
                    placeholder="Email Address"
                    required
                    className="pl-10 placeholder:text-muted-foreground focus:placeholder:text-transparent"
                />
            </div>
        </div>
        <div>
            <div className="relative">
                <KeyRound className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                <Input
                    type="password"
                    placeholder="Password"
                    required
                    className="pl-10 placeholder:text-muted-foreground focus:placeholder:text-transparent"
                />
            </div>
        </div>
        <Button type="submit" className="w-full bg-gradient-to-r from-pink-500 to-orange-500 py-3 text-white font-semibold shadow-lg hover:scale-105 transition-transform">
            Get Started
        </Button>
         <div className="my-6 flex items-center gap-4">
            <div className="h-px flex-grow bg-gray-300" />
            <span className="text-sm font-medium text-gray-400">OR</span>
            <div className="h-px flex-grow bg-gray-300" />
        </div>
        <Button variant="outline" className="w-full">
            <GoogleIcon className="mr-2 h-5 w-5" />
            Continue with Google
        </Button>
    </form>
);

    

    