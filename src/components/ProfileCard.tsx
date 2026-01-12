
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
  const userImage = user.photos?.[0];

  return (
    <Card className="relative aspect-[3/4.5] w-full max-w-xs overflow-hidden rounded-2xl shadow-lg group">
        <div
          className="absolute inset-0 w-full h-full"
        >
          {isValidHttpUrl(userImage) ? (
            <Image
              src={userImage}
              alt={`${user.name}'s photo`}
              fill
              className="object-cover"
              priority
            />
          ) : (
             <div className="w-full h-full bg-muted flex items-center justify-center">
                <UserIcon className="w-24 h-24 text-muted-foreground" />
            </div>
          )}
        </div>
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
