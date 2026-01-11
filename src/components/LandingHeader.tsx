
"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Logo } from '@/components/Logo';
import { cn } from '@/lib/utils';
import { useEffect, useState } from 'react';
import { ThemeToggle } from './ThemeToggle';
import { Menu } from 'lucide-react';
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet"


type LandingHeaderProps = {
  theme?: 'light' | 'dark';
};

const navLinks = [
    { href: "/about", label: "About" },
    { href: "/safety", label: "Safety" },
    { href: "/support", label: "Support" },
]

export function LandingHeader({ theme = 'dark' }: LandingHeaderProps) {
  const pathname = usePathname();
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const isLight = theme === 'light' || (isScrolled && theme === 'dark');

  const linkClasses = (href: string, mobile?: boolean) => cn(
    "relative text-sm font-medium after:absolute after:left-0 after:-bottom-1 after:h-[2px] after:w-full after:origin-center after:scale-x-0 after:bg-primary after:transition-transform after:duration-300 after:ease-out after:content-[''] hover:after:scale-x-100",
    { "after:scale-x-100": pathname === href },
    mobile && "text-lg"
  );

  return (
    <header className={cn(
      "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
      isLight 
        ? "bg-background/80 backdrop-blur-lg border-b" 
        : "bg-transparent",
      isScrolled && !isLight && "bg-black/50 backdrop-blur-lg"
    )}>
      <div className="flex items-center justify-between px-4 sm:px-6 h-16">
        <Logo className={cn(isLight ? "text-foreground" : "text-white")} />
        
        <nav className={cn(
          "hidden md:flex items-center gap-6",
          isLight ? "text-foreground" : "text-white"
        )}>
            {navLinks.map(link => (
                <Link key={link.href} href={link.href} className={linkClasses(link.href)}>{link.label}</Link>
            ))}
        </nav>
        
        <div className="flex items-center gap-2 sm:gap-4">
          <Button asChild variant="ghost" className={cn(
            isLight ? "text-foreground hover:bg-muted" : "text-white hover:bg-white/10 hover:text-white"
          )}>
            <Link href="/login?fromNav=true">Log In</Link>
          </Button>
          <Button asChild className={cn(
            isLight ? "bg-primary text-primary-foreground hover:bg-primary/90" : "bg-white text-black hover:bg-white/90"
          )}>
            <Link href="/signup?fromNav=true">Sign Up</Link>
          </Button>
          <ThemeToggle className={cn(isLight ? "text-foreground" : "text-white", "hidden md:inline-flex")}/>
        </div>
      </div>
    </header>
  );
}
