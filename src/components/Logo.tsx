import Link from 'next/link';
import { Heart } from 'lucide-react';
import { cn } from '@/lib/utils';

type LogoProps = {
  className?: string;
  iconOnly?: boolean;
}

export function Logo({ className, iconOnly = false }: LogoProps) {
  return (
    <Link href="/" className={cn("flex items-center gap-2 group", className)}>
      <div className="bg-primary rounded-lg p-1.5 group-hover:scale-110 transition-transform">
        <Heart className="h-5 w-5 text-primary-foreground" />
      </div>
      {!iconOnly && (
        <span className="text-xl font-bold font-headline">
          LinkUp9ja
        </span>
      )}
    </Link>
  );
}
