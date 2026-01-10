
"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useEffect } from 'react';

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Logo } from "@/components/Logo";
import { ThemeToggle } from "@/components/ThemeToggle";
import { PlaceHolderImages } from "@/lib/placeholder-images";
import { SplashScreen } from "@/components/SplashScreen";
import { useRouter, useSearchParams } from "next/navigation";


export default function LoginPage() {
  const bgImage = PlaceHolderImages.find(p => p.id === 'hero-1');
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const fromNav = searchParams.get('fromNav');
    if (fromNav) {
      const timer = setTimeout(() => {
        setLoading(false);
        // Clean up the URL
        router.replace('/login', { scroll: false });
      }, 2500); 
      return () => clearTimeout(timer);
    } else {
      setLoading(false);
    }
  }, [router, searchParams]);

  if (loading) {
    return <SplashScreen />;
  }

  return (
    <div className="relative min-h-screen w-full">
      {bgImage && (
        <Image
          src={bgImage.imageUrl}
          alt={bgImage.description}
          fill
          className="object-cover opacity-20"
          data-ai-hint={bgImage.imageHint}
        />
      )}
      <ThemeToggle className="absolute top-4 right-4 z-10" />
      <div className="relative flex min-h-screen items-center justify-center p-4">
        <div className="w-full max-w-md">
          <div className="mb-8 flex justify-center">
              <Logo />
          </div>
          <Card className="bg-card/70 backdrop-blur-lg">
            <CardHeader className="space-y-1 text-center">
              <CardTitle className="font-headline text-2xl">Welcome Back</CardTitle>
              <CardDescription>
                Enter your email below to login to your account
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" placeholder="m@example.com" required />
              </div>
              <div className="space-y-2">
                <div className="flex items-center">
                  <Label htmlFor="password">Password</Label>
                  <Link
                    href="#"
                    className="ml-auto inline-block text-sm underline"
                  >
                    Forgot your password?
                  </Link>
                </div>
                <Input id="password" type="password" required />
              </div>
              <Button type="submit" className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-bold" asChild>
                  <Link href="/onboarding?fromNav=true">Log in</Link>
              </Button>
            </CardContent>
            <div className="mt-4 text-center text-sm p-6 pt-0">
              Don&apos;t have an account?{" "}
              <Link href="/signup?fromNav=true" className="underline">
                Sign up
              </Link>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
