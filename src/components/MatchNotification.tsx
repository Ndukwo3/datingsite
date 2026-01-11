
"use client";

import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { useUser } from '@/firebase';
import type { User } from '@/lib/types';
import { Heart, User as UserIcon } from 'lucide-react';

type MatchNotificationProps = {
  matchedUser: User;
  onKeepSwiping: () => void;
};

export function MatchNotification({ matchedUser, onKeepSwiping }: MatchNotificationProps) {
  const { userData: currentUser } = useUser();

  const currentUserImage = currentUser?.photos?.[0];
  const matchedUserImage = matchedUser.photos?.[0];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-black/90 backdrop-blur-sm p-4"
    >
      <motion.h1 
        className="font-headline text-5xl font-bold text-white mb-8 bg-primary-gradient bg-clip-text text-transparent"
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2, type: 'spring', stiffness: 100 }}
      >
        It's a Match!
      </motion.h1>
      <p className="text-lg text-white/80 mb-12">
        You and {matchedUser.name} have liked each other.
      </p>

      <div className="relative flex items-center justify-center w-full max-w-sm mb-16">
        <motion.div
          initial={{ x: '-50%', rotate: -15, scale: 0.8 }}
          animate={{ x: '-20%', rotate: -10, scale: 1 }}
          transition={{ delay: 0.3, type: 'spring' }}
          className="relative w-40 h-52 md:w-48 md:h-64"
        >
          {currentUserImage && typeof currentUserImage === 'string' && currentUserImage.length > 0 ? (
            <Image
              src={currentUserImage}
              alt={currentUser?.name || 'Current User'}
              fill
              className="rounded-2xl object-cover border-4 border-white shadow-2xl"
            />
          ) : (
            <div className="w-full h-full bg-muted rounded-2xl border-4 border-white shadow-2xl flex items-center justify-center">
              <UserIcon className="w-16 h-16 text-muted-foreground" />
            </div>
          )}
        </motion.div>
        
        <motion.div 
            className="absolute z-10 p-3 bg-white rounded-full"
            initial={{ scale: 0 }}
            animate={{ scale: [0, 1.2, 1] }}
            transition={{ delay: 0.8, type: 'spring', stiffness: 200 }}
        >
            <Heart className="h-8 w-8 text-primary fill-primary" />
        </motion.div>

        <motion.div
          initial={{ x: '50%', rotate: 15, scale: 0.8 }}
          animate={{ x: '20%', rotate: 10, scale: 1 }}
          transition={{ delay: 0.3, type: 'spring' }}
          className="relative w-40 h-52 md:w-48 md:h-64"
        >
          {matchedUserImage && typeof matchedUserImage === 'string' && matchedUserImage.length > 0 ? (
            <Image
              src={matchedUserImage}
              alt={matchedUser.name}
              fill
              className="rounded-2xl object-cover border-4 border-white shadow-2xl"
            />
          ) : (
             <div className="w-full h-full bg-muted rounded-2xl border-4 border-white shadow-2xl flex items-center justify-center">
              <UserIcon className="w-16 h-16 text-muted-foreground" />
            </div>
          )}
        </motion.div>
      </div>

      <div className="flex flex-col gap-4 w-full max-w-xs">
        <Button asChild size="lg" className="bg-primary-gradient text-primary-foreground font-bold text-lg">
          <Link href={`/chat/${matchedUser.id}`}>Send a Message</Link>
        </Button>
        <Button onClick={onKeepSwiping} size="lg" variant="ghost" className="text-white font-bold hover:bg-white/10 hover:text-white">
          Keep Swiping
        </Button>
      </div>
    </motion.div>
  );
}
