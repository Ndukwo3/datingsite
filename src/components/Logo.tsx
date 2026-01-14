
import Link from 'next/link';
import { Heart } from 'lucide-react';
import { cn } from '@/lib/utils';

type LogoProps = {
  className?: string;
  iconOnly?: boolean;
  iconSize?: number;
  href?: string;
}

export function Logo({ className, iconOnly = false, iconSize = 5, href = "/" }: LogoProps) {
  const iconDimensions = `h-${iconSize} w-${iconSize}`;
  return (
    <Link href={href} className={cn("flex items-center gap-2 group", className)}>
      <div className="bg-primary rounded-lg p-1.5 group-hover:scale-110 transition-transform">
        <Heart className={cn("text-primary-foreground", iconDimensions)} />
      </div>
      {!iconOnly && (
        <span className="text-xl font-bold font-headline">
          LinkUp9ja
        </span>
      )}
    </Link>
  );
}
