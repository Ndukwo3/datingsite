
"use client";

import * as React from "react";
import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Heart, Mail, KeyRound, User, Phone } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Checkbox } from "./ui/checkbox";
import Link from "next/link";
import { SplashScreen } from "./SplashScreen";
import { ThemeToggle } from "./ThemeToggle";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";

type AuthStep = "login" | "signup";
type UserData = {
    name: string;
    phone: string;
    email: string;
};

export function AuthPage({ defaultTab }: { defaultTab: "login" | "signup" }) {
    const [authStep, setAuthStep] = useState<AuthStep>(defaultTab);
    const router = useRouter();
    const searchParams = useSearchParams();
    const fromNav = searchParams.get('fromNav');
    const [showSplash, setShowSplash] = useState(!!fromNav);
    const [isLoading, setIsLoading] = useState(false);

    React.useEffect(() => {
        if (showSplash) {
            const timer = setTimeout(() => setShowSplash(false), 2500);
            return () => clearTimeout(timer);
        }
    }, [showSplash]);

    if (showSplash) {
        return <SplashScreen />;
    }

    const handleSignupSubmit = (data: UserData) => {
        setIsLoading(true);
        setTimeout(() => {
            setIsLoading(false);
            router.push('/onboarding');
        }, 1000);
    };
    
    const handleLoginSubmit = () => {
        setIsLoading(true);
        // Simulate a network request
        setTimeout(() => {
            setIsLoading(false);
            router.push('/');
        }, 1000);
    };

    const renderForm = () => {
        switch (authStep) {
            case 'login':
                return <LoginForm onSubmit={handleLoginSubmit} isLoading={isLoading} />;
            case 'signup':
                return <SignUpForm onSubmit={handleSignupSubmit} isLoading={isLoading} />;
            default:
                return null;
        }
    }
    
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
                    <h1 className="font-headline text-3xl font-bold text-gray-800 dark:text-white">
                        LinkUp9ja
                    </h1>
                    <p className="mt-2 text-gray-600 dark:text-gray-200">
                        Find your perfect match in Nigeria
                    </p>
                </div>

                <div className="relative mt-4 flex rounded-lg bg-gray-100/70 p-1">
                    <motion.div 
                        className="absolute inset-0.5 w-1/2 rounded-md bg-white shadow"
                        animate={{ x: authStep === 'login' ? '0%' : '100%' }}
                        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                    />
                    <button onClick={() => setAuthStep('login')} className={cn("relative z-10 w-1/2 py-2 text-sm font-medium transition-colors", authStep === 'login' ? 'text-pink-600' : 'text-gray-500')}>
                        Login
                    </button>
                    <button onClick={() => setAuthStep('signup')} className={cn("relative z-10 w-1/2 py-2 text-sm font-medium transition-colors", authStep === 'signup' ? 'text-pink-600' : 'text-gray-500')}>
                        Sign Up
                    </button>
                </div>

                <div className="relative mt-6 h-[340px] overflow-hidden">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={authStep}
                            initial={{ opacity: 0, x: authStep === 'login' ? -50 : 50 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: authStep === 'login' ? 50 : -50 }}
                            transition={{ duration: 0.4, ease: "easeInOut" }}
                            className="absolute w-full"
                        >
                            {renderForm()}
                        </motion.div>
                    </AnimatePresence>
                </div>
            </motion.div>
        </div>
    );
}

const LoginForm = ({ onSubmit, isLoading }: { onSubmit: () => void; isLoading: boolean; }) => {
    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        onSubmit();
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <div>
                <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <Input
                        name="email"
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
                <Link href="#" className="font-medium text-pink-600 hover:text-pink-500 dark:text-white dark:hover:text-gray-300">
                    Forgot Password?
                </Link>
            </div>
            <Button type="submit" className="w-full bg-gradient-to-r from-pink-500 to-orange-500 py-3 text-white font-semibold shadow-lg hover:scale-105 transition-transform" disabled={isLoading}>
                 {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Log In
            </Button>
        </form>
    );
};

const SignUpForm = ({ onSubmit, isLoading }: { onSubmit: (data: UserData) => void; isLoading: boolean; }) => {
    const { toast } = useToast();
    
    const handleNameInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        e.target.value = e.target.value.replace(/[^a-zA-Z\s]/g, '');
    };

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        const password = formData.get('password') as string;
        const confirmPassword = formData.get('confirmPassword') as string;

        if (password !== confirmPassword) {
            toast({
                title: "Passwords do not match",
                description: "Please check your passwords and try again.",
                variant: "destructive",
            });
            return;
        }

        const data = {
            name: formData.get('name') as string,
            phone: formData.get('phone') as string,
            email: formData.get('email') as string,
        };
        onSubmit(data);
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
             <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                <Input
                    name="name"
                    type="text"
                    placeholder="Full Name"
                    required
                    className="pl-10 placeholder:text-muted-foreground focus:placeholder:text-transparent"
                    onChange={handleNameInputChange}
                />
            </div>
            <div className="relative">
                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                <Input
                    name="phone"
                    type="tel"
                    placeholder="Phone Number"
                    required
                    className="pl-10 placeholder:text-muted-foreground focus:placeholder:text-transparent"
                />
            </div>
            <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                <Input
                    name="email"
                    type="email"
                    placeholder="Email Address"
                    required
                    className="pl-10 placeholder:text-muted-foreground focus:placeholder:text-transparent"
                />
            </div>
            <div className="relative">
                <KeyRound className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                <Input
                    name="password"
                    type="password"
                    placeholder="Password"
                    required
                    className="pl-10 placeholder:text-muted-foreground focus:placeholder:text-transparent"
                />
            </div>
             <div className="relative">
                <KeyRound className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                <Input
                    name="confirmPassword"
                    type="password"
                    placeholder="Confirm Password"
                    required
                    className="pl-10 placeholder:text-muted-foreground focus:placeholder:text-transparent"
                />
            </div>
            <Button type="submit" className="w-full bg-gradient-to-r from-pink-500 to-orange-500 py-3 text-white font-semibold shadow-lg hover:scale-105 transition-transform" disabled={isLoading}>
                 {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Sign Up
            </Button>
        </form>
    );
};

    