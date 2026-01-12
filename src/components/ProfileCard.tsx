
"use client";

import Image from 'next/image';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import type { User } from '@/lib/types';
import { BadgeCheck, MapPin, ChevronLeft, ChevronRight, User as UserIcon } from 'lucide-react';
import { useState, useCallback, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { isValidHttpUrl } from '@/lib/is-valid-url';

type ProfileCardProps = {
  user: User;
};

export function ProfileCard({ user }: ProfileCardProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(0);

  const paginate = useCallback((newDirection: number) => {
    if (!user.photos || user.photos.length <= 1) return;
    setDirection(newDirection);
    setCurrentIndex(prevIndex => {
      const newIndex = prevIndex + newDirection;
      if (newIndex < 0) return user.photos.length - 1;
      if (newIndex >= user.photos.length) return 0;
      return newIndex;
    });
  }, [user.photos]);

  useEffect(() => {
    setCurrentIndex(0);
  }, [user]);

  const hasMultiplePhotos = user.photos && user.photos.length > 1;

  const variants = {
    enter: (direction: number) => {
      return {
        x: direction > 0 ? 1000 : -1000,
        opacity: 0
      };
    },
    center: {
      zIndex: 1,
      x: 0,
      opacity: 1
    },
    exit: (direction: number) => {
      return {
        zIndex: 0,
        x: direction < 0 ? 1000 : -1000,
        opacity: 0
      };
    }
  };

  const userImage = user.photos?.[currentIndex];

  return (
    <Card className="relative aspect-[3/4.5] w-full max-w-xs overflow-hidden rounded-2xl shadow-lg group">
      <AnimatePresence initial={false} custom={direction}>
        <motion.div
          key={currentIndex}
          className="absolute inset-0 w-full h-full"
          custom={direction}
          variants={variants}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{
            x: { type: "spring", stiffness: 300, damping: 30 },
            opacity: { duration: 0.2 }
          }}
        >
          {isValidHttpUrl(userImage) ? (
            <Image
              src={userImage}
              alt={`${user.name}'s photo ${currentIndex + 1}`}
              fill
              className="object-cover"
              priority={currentIndex === 0}
            />
          ) : (
             <div className="w-full h-full bg-muted flex items-center justify-center">
                <UserIcon className="w-24 h-24 text-muted-foreground" />
            </div>
          )}
        </motion.div>
      </AnimatePresence>

      {hasMultiplePhotos && (
        <>
           <div className="absolute top-2 left-0 right-0 z-10 flex items-center justify-center gap-1 px-2">
            {user.photos.map((_, i) => (
              <div key={i} className="h-1 flex-1 rounded-full bg-white/50 overflow-hidden">
                <div 
                  className={cn(
                    "h-full rounded-full bg-white transition-transform duration-300 origin-left",
                    i === currentIndex ? "transform-none" : "scale-x-0"
                  )}
                />
              </div>
            ))}
          </div>

          <div
            className="absolute left-0 top-0 h-full w-1/2 z-20 cursor-pointer"
            onClick={(e) => { e.stopPropagation(); paginate(-1); }}
          />
          <div
            className="absolute right-0 top-0 h-full w-1/2 z-20 cursor-pointer"
            onClick={(e) => { e.stopPropagation(); paginate(1); }}
          />
        </>
      )}


      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent pointer-events-none" />
      <CardContent className="absolute bottom-0 w-full p-6 text-primary-foreground">
        <div className="flex items-center gap-2">
            <h2 className="font-headline text-3xl font-bold">{user.name}, {user.age}</h2>
            {user.isVerified && <BadgeCheck className="h-6 w-6 text-blue-400 fill-primary-foreground" />}
        </div>
        <p className="mt-1 flex items-center gap-1.5 text-sm text-primary-foreground/80">
          <MapPin className="h-4 w-4" /> {user.location}
        </p>
        <p className="mt-4 text-sm leading-relaxed text-left line-clamp-3">{user.bio}</p>
        <div className="mt-4 flex flex-wrap gap-2">
          {user.interests.slice(0, 4).map((interest) => (
            <Badge key={interest} variant="secondary" className="bg-primary-foreground/20 text-primary-foreground backdrop-blur-sm">
              {interest}
            </Badge>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
