
"use client";

import { useState } from 'react';
import { motion, AnimatePresence, useMotionValue, useTransform } from 'framer-motion';
import { Heart, X, RotateCcw } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { ProfileCard } from '@/components/ProfileCard';
import { potentialMatches } from '@/lib/data';

type SwipeDirection = 'left' | 'right' | null;

export default function SwipePage() {
  const [profiles, setProfiles] = useState(potentialMatches);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [swipeDirection, setSwipeDirection] = useState<SwipeDirection>(null);

  const x = useMotionValue(0);
  const rotate = useTransform(x, [-200, 200], [-30, 30]);
  const opacityX = useTransform(x, [-100, -20, 0, 20, 100], [1, 0, 0, 0, 0]);
  const opacityHeart = useTransform(x, [-100, -20, 0, 20, 100], [0, 0, 0, 0, 1]);

  const handleSwipe = (direction: 'left' | 'right') => {
    setSwipeDirection(direction);
    setTimeout(() => {
        if (currentIndex < profiles.length) {
            setCurrentIndex(currentIndex + 1);
        }
        setSwipeDirection(null);
    }, 300);
  };
  
  const onDragEnd = (event: any, info: { offset: { x: any; }; velocity: { x: any; }; }) => {
    if (info.offset.x > 100) {
      handleSwipe('right');
    } else if (info.offset.x < -100) {
      handleSwipe('left');
    }
  };

  const resetSwipes = () => {
    setCurrentIndex(0);
    setProfiles(potentialMatches); // Reshuffle or refetch if needed
  }
  
  const currentProfile = profiles[currentIndex];
  
  const variants = {
    initial: { scale: 0.8, opacity: 0, y: 50 },
    animate: { scale: 1, opacity: 1, y: 0 },
    exit: (direction: SwipeDirection) => {
        return {
            x: direction === 'right' ? 300 : -300,
            opacity: 0,
            scale: 0.8,
            transition: { duration: 0.3 }
        };
    }
  };

  return (
    <div className="flex h-full flex-col items-center justify-center gap-8">
      <div className="relative w-full max-w-sm h-[60vh] md:h-[70vh]">
        <AnimatePresence custom={swipeDirection}>
          {currentIndex < profiles.length ? (
            <motion.div
              key={currentIndex}
              drag="x"
              dragConstraints={{ left: 0, right: 0, top: 0, bottom: 0 }}
              style={{ x, rotate }}
              onDragEnd={onDragEnd}
              variants={variants}
              initial="initial"
              animate="animate"
              exit="exit"
              custom={swipeDirection}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              className="absolute inset-0 flex items-center justify-center cursor-grab active:cursor-grabbing"
            >
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10 pointer-events-none">
                    <motion.div style={{ opacity: opacityHeart }}>
                        <Heart className="h-24 w-24 text-primary fill-primary" />
                    </motion.div>
                     <motion.div style={{ opacity: opacityX }}>
                        <X className="h-24 w-24 text-destructive" />
                    </motion.div>
                </div>
              <ProfileCard user={currentProfile} />
            </motion.div>
          ) : (
            <motion.div 
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="flex flex-col items-center justify-center text-center h-full rounded-2xl bg-muted"
            >
                 <h2 className="text-2xl font-bold font-headline">No More Profiles</h2>
                 <p className="text-muted-foreground mt-2">You've seen everyone. Check back later!</p>
                 <Button onClick={resetSwipes} className="mt-4" variant="outline">
                    <RotateCcw className="mr-2 h-4 w-4"/>
                    Start Over
                 </Button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="flex items-center gap-6">
        <Button
          onClick={() => handleSwipe('left')}
          variant="outline"
          size="icon"
          className="h-20 w-20 rounded-full border-2 border-yellow-500 text-yellow-500 shadow-lg transition-transform duration-300 hover:scale-110 hover:bg-yellow-500/10"
          aria-label="Dislike"
          disabled={swipeDirection !== null}
        >
          <X className="h-10 w-10" />
        </Button>
        <Button
          onClick={() => handleSwipe('right')}
          size="icon"
          className="h-24 w-24 rounded-full bg-primary text-primary-foreground shadow-xl transition-transform duration-300 hover:scale-110"
          aria-label="Like"
          disabled={swipeDirection !== null}
        >
          <Heart className="h-12 w-12 fill-current" />
        </Button>
      </div>
    </div>
  );
}



