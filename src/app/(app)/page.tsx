"use client";

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, X, RotateCcw } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { ProfileCard } from '@/components/ProfileCard';
import { potentialMatches } from '@/lib/data';

export default function SwipePage() {
  const [profiles, setProfiles] = useState(potentialMatches);
  const [currentIndex, setCurrentIndex] = useState(0);

  const handleSwipe = () => {
    if (currentIndex < profiles.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
        // Option to reset or show 'no more profiles'
    }
  };

  const resetSwipes = () => {
    setCurrentIndex(0);
  }
  
  const currentProfile = profiles[currentIndex];

  return (
    <div className="flex h-full flex-col items-center justify-center gap-8">
      <div className="relative w-full max-w-sm h-[60vh] md:h-[70vh]">
        <AnimatePresence>
          {currentIndex < profiles.length ? (
            <motion.div
              key={currentIndex}
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 1.2, opacity: 0 }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              className="absolute inset-0 flex items-center justify-center"
            >
              <ProfileCard user={currentProfile} />
            </motion.div>
          ) : (
            <div className="flex flex-col items-center justify-center text-center h-full rounded-2xl bg-muted">
                 <h2 className="text-2xl font-bold font-headline">No More Profiles</h2>
                 <p className="text-muted-foreground mt-2">You've seen everyone. Check back later!</p>
                 <Button onClick={resetSwipes} className="mt-4" variant="outline">
                    <RotateCcw className="mr-2 h-4 w-4"/>
                    Start Over
                 </Button>
            </div>
          )}
        </AnimatePresence>
      </div>

      <div className="flex items-center gap-6">
        <Button
          onClick={handleSwipe}
          variant="outline"
          size="icon"
          className="h-20 w-20 rounded-full border-2 border-yellow-500 text-yellow-500 shadow-lg transition-transform duration-300 hover:scale-110 hover:bg-yellow-500/10"
          aria-label="Dislike"
        >
          <X className="h-10 w-10" />
        </Button>
        <Button
          onClick={handleSwipe}
          size="icon"
          className="h-24 w-24 rounded-full bg-primary text-primary-foreground shadow-xl transition-transform duration-300 hover:scale-110"
          aria-label="Like"
        >
          <Heart className="h-12 w-12 fill-current" />
        </Button>
      </div>
    </div>
  );
}
