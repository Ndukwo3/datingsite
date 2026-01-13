
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
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

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
    mobile && "text-lg py-2"
  );

  const headerClasses = cn(
    "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
    isLight 
      ? "bg-background/80 backdrop-blur-lg border-b" 
      : "bg-transparent",
    isScrolled && !isLight && "bg-black/50 backdrop-blur-lg"
  );
  
  const textColorClasses = isLight ? "text-foreground" : "text-white";
  const buttonHoverClasses = isLight ? "hover:bg-muted" : "hover:bg-white/10 hover:text-white";

  return (
    <header className={headerClasses}>
      <div className="container mx-auto flex h-16 items-center justify-between px-4 sm:px-6">
        <Logo className={textColorClasses} />
        
        <nav className={cn("hidden md:flex items-center gap-6", textColorClasses)}>
            {navLinks.map(link => (
                <Link key={link.href} href={link.href} className={linkClasses(link.href)}>{link.label}</Link>
            ))}
        </nav>
        
        <div className="flex items-center gap-2 sm:gap-4">
          <div className="hidden md:flex items-center gap-2">
            <Button asChild variant="ghost" className={cn(textColorClasses, buttonHoverClasses)}>
              <Link href="/login?fromNav=true">Log In</Link>
            </Button>
            <Button asChild className={cn(isLight ? "bg-primary text-primary-foreground hover:bg-primary/90" : "bg-white text-black hover:bg-white/90")}>
              <Link href="/signup?fromNav=true">Sign Up</Link>
            </Button>
          </div>
          <ThemeToggle className={textColorClasses}/>
          <div className="md:hidden">
            <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className={cn(textColorClasses, buttonHoverClasses)}>
                    <Menu />
                    <span className="sr-only">Open menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="bg-background text-foreground">
                <div className="p-4">
                  <Logo className="mb-8" />
                  <nav className="flex flex-col gap-4">
                     {navLinks.map(link => (
                        <Link key={link.href} href={link.href} className={linkClasses(link.href, true)} onClick={() => setIsMobileMenuOpen(false)}>{link.label}</Link>
                    ))}
                  </nav>
                  <div className="mt-8 pt-8 border-t space-y-4">
                     <Button asChild variant="ghost" className="w-full justify-start text-lg" onClick={() => setIsMobileMenuOpen(false)}>
                        <Link href="/login?fromNav=true">Log In</Link>
                     </Button>
                     <Button asChild className="w-full text-lg" onClick={() => setIsMobileMenuOpen(false)}>
                        <Link href="/signup?fromNav=true">Sign Up</Link>
                     </Button>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  );
}
