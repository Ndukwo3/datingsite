
"use client";

import * as React from "react";
import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Heart, Mail, KeyRound, User, Phone, Check, Shield } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Checkbox } from "./ui/checkbox";
import Link from "next/link";
import { SplashScreen } from "./SplashScreen";
import { ThemeToggle } from "./ThemeToggle";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";
import Image from "next/image";

type AuthStep = "login" | "signup" | "captcha";
type UserData = {
    name: string;
    phone: string;
    email: string;
};

const GoogleIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" width="24px" height="24px" {...props}>
        <path fill="#FFC107" d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571c0,0,0,0,0,0l6.19,5.238C39.608,34.09,44,28.866,44,24C44,22.659,43.862,21.35,43.611,20.083z" />
        <path fill="#FF3D00" d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z" />
        <path fill="#4CAF50" d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.223,0-9.651-3.358-11.297-7.962l-6.571,4.819C9.656,39.663,16.318,44,24,44z" />
        <path fill="#1565C0" d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571l6.19,5.238C43.021,36.25,44,30.413,44,24C44,22.659,43.862,21.35,43.611,20.083z" />
    </svg>
);


const captchaImages = [
    { src: "https://picsum.photos/seed/car1/200/200", type: "car" },
    { src: "https://picsum.photos/seed/bike1/200/200", type: "bike" },
    { src: "https://picsum.photos/seed/car2/200/200", type: "car" },
    { src: "https://picsum.photos/seed/tree1/200/200", type: "tree" },
    { src: "https://picsum.photos/seed/car3/200/200", type: "car" },
    { src: "https://picsum.photos/seed/house1/200/200", type: "house" },
    { src: "https://picsum.photos/seed/car4/200/200", type: "car" },
    { src: "https://picsum.photos/seed/flower1/200/200", type: "flower" },
    { src: "https://picsum.photos/seed/boat1/200/200", type: "boat" },
  ];
  
const captchaCorrectType = "car";
  
export function AuthPage({ defaultTab }: { defaultTab: "login" | "signup" }) {
    const [authStep, setAuthStep] = useState<AuthStep>(defaultTab);
    const [userData, setUserData] = useState<UserData | null>(null);
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
        setUserData(data);
        setTimeout(() => {
            setIsLoading(false);
            setAuthStep("captcha");
        }, 500);
    };

    const handleCaptchaSuccess = () => {
        setIsLoading(true);
        setTimeout(() => {
            setIsLoading(false);
            router.push('/onboarding');
        }, 1000);
    }
    
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
            case 'captcha':
                return <ImageCaptcha onSuccess={handleCaptchaSuccess} isLoading={isLoading} />;
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
                {authStep !== 'captcha' ? (
                <>
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
                </>
                ) : (
                    <div className="mb-8 flex flex-col items-center text-center">
                         <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500 to-green-400">
                            <Shield className="h-8 w-8 text-white" />
                        </div>
                        <h1 className="font-headline text-3xl font-bold text-gray-800 dark:text-white">
                           Security Check
                        </h1>
                        <p className="mt-2 text-gray-600 dark:text-gray-200">
                            Please verify you're human.
                        </p>
                    </div>
                )}


                <div className="relative mt-6 h-[420px] overflow-hidden">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={authStep}
                            initial={{ opacity: 0, x: 50 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -50 }}
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

const ImageCaptcha = ({ onSuccess, isLoading }: { onSuccess: () => void; isLoading: boolean; }) => {
    const [selected, setSelected] = useState<string[]>([]);
    const { toast } = useToast();
  
    const toggleSelect = (src: string) => {
      setSelected(prev =>
        prev.includes(src) ? prev.filter(s => s !== src) : [...prev, src]
      );
    };
  
    const handleSubmit = () => {
      const correctSelections = selected.filter(src => {
        const image = captchaImages.find(img => img.src === src);
        return image?.type === captchaCorrectType;
      });
  
      const totalCorrect = captchaImages.filter(img => img.type === captchaCorrectType).length;
      
      if (correctSelections.length === totalCorrect && selected.length === totalCorrect) {
        onSuccess();
      } else {
        toast({
          title: "Verification Failed",
          description: "Please try again.",
          variant: "destructive",
        });
        setSelected([]);
      }
    };
  
    return (
        <div className="space-y-4 text-center">
            <p className="text-sm font-medium text-gray-700 dark:text-gray-200">Select all images with a <span className="font-bold">{captchaCorrectType}</span>.</p>
            <div className="grid grid-cols-3 gap-2">
            {captchaImages.map((image, index) => (
                <div
                key={index}
                className={cn(
                    "relative aspect-square cursor-pointer rounded-md overflow-hidden transition-all duration-200",
                    selected.includes(image.src) ? 'ring-2 ring-blue-500 ring-offset-2' : ''
                )}
                onClick={() => toggleSelect(image.src)}
                >
                <Image src={image.src} alt={`captcha image ${index + 1}`} fill className="object-cover" />
                {selected.includes(image.src) && (
                    <div className="absolute inset-0 bg-blue-500/50 flex items-center justify-center">
                        <Check className="w-8 h-8 text-white" />
                    </div>
                )}
                </div>
            ))}
            </div>
            <Button onClick={handleSubmit} className="w-full bg-gradient-to-r from-blue-500 to-green-500 py-3 text-white font-semibold shadow-lg hover:scale-105 transition-transform" disabled={isLoading}>
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Verify
            </Button>
        </div>
    );
};


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
            <div className="relative my-6">
                <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t border-gray-300 dark:border-gray-600" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-white/50 px-2 text-gray-500 dark:bg-gray-800/50 dark:text-gray-400 backdrop-blur-sm">Or continue with</span>
                </div>
            </div>
            <Button variant="outline" className="w-full">
                <GoogleIcon className="mr-2 h-5 w-5" />
                Continue with Google
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
            <div className="relative my-4">
                <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t border-gray-300 dark:border-gray-600" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-white/50 px-2 text-gray-500 dark:bg-gray-800/50 dark:text-gray-400 backdrop-blur-sm">Or continue with</span>
                </div>
            </div>
            <Button variant="outline" className="w-full">
                <GoogleIcon className="mr-2 h-5 w-5" />
                Continue with Google
            </Button>
        </form>
    );
};

