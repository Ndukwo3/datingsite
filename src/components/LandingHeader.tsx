import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Logo } from '@/components/Logo';
import { cn } from '@/lib/utils';

type LandingHeaderProps = {
  theme?: 'light' | 'dark';
};

export function LandingHeader({ theme = 'dark' }: LandingHeaderProps) {
  const isLight = theme === 'light';

  const linkClasses = "relative text-sm font-medium after:absolute after:left-0 after:-bottom-1 after:h-[2px] after:w-full after:origin-center after:scale-x-0 after:bg-primary after:transition-transform after:duration-300 after:ease-out after:content-[''] hover:after:scale-x-100";

  return (
    <header className={cn(
      "p-4",
      isLight ? "relative bg-background" : "absolute top-0 left-0 right-0 z-10 bg-transparent"
    )}>
      <div className="container mx-auto flex items-center justify-between">
        <Logo className={cn(isLight ? "text-foreground" : "text-white")} />
        <nav className={cn(
          "hidden md:flex absolute left-1/2 -translate-x-1/2 items-center gap-6",
          isLight ? "text-foreground" : "text-white"
        )}>
          <Link href="/about" className={linkClasses}>About</Link>
          <Link href="/safety" className={linkClasses}>Safety</Link>
          <Link href="/support" className={linkClasses}>Support</Link>
        </nav>
        <div className="flex items-center gap-2 sm:gap-4">
          <Button asChild variant="ghost" className={cn(
            isLight ? "text-foreground hover:bg-muted" : "text-white hover:bg-white/10 hover:text-white"
          )}>
            <Link href="/login">Log In</Link>
          </Button>
          <Button asChild className={cn(
            isLight ? "bg-primary text-primary-foreground hover:bg-primary/90" : "bg-white text-black hover:bg-white/90"
          )}>
            <Link href="/signup">Sign Up</Link>
          </Button>
        </div>
      </div>
    </header>
  );
}
