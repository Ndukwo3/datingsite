
"use client";

import { useState, useMemo } from 'react';
import { motion, AnimatePresence, useMotionValue, useTransform, animate } from 'framer-motion';
import { Heart, X, RotateCcw, Star, Loader2 } from 'lucide-react';
import { doc, setDoc, collection, getDocs, writeBatch, serverTimestamp, where, query } from 'firebase/firestore';

import { Button } from '@/components/ui/button';
import { ProfileCard } from '@/components/ProfileCard';
import { MatchNotification } from '@/components/MatchNotification';
import type { User } from '@/lib/types';
import { useUser, useFirestore, useCollection } from '@/firebase';
import { errorEmitter } from '@/firebase/error-emitter';
import { FirestorePermissionError } from '@/firebase/errors';

type SwipeDirection = 'left' | 'right' | 'up' | null;

export default function SwipePage() {
  const { user: currentUser, userData } = useUser();
  const firestore = useFirestore();

  // Fetch users that are not the current user and have completed onboarding
  const usersQuery = useMemo(() => {
    if (!firestore) return null;
    return query(
        collection(firestore, 'users'),
        where('onboardingComplete', '==', true)
    );
  }, [firestore]);

  const { data: allUsers, loading } = useCollection<User>(usersQuery);
  
  const potentialMatches = useMemo(() => {
    if (!allUsers || !currentUser) return [];
    return allUsers.filter(u => u.id !== currentUser.uid);
  }, [allUsers, currentUser]);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [swipeDirection, setSwipeDirection] = useState<SwipeDirection | null>(null);
  const [lastSwipedUser, setLastSwipedUser] = useState<User | null>(null);
  const [showMatch, setShowMatch] = useState(false);

  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const rotate = useTransform(x, [-200, 200], [-30, 30]);
  const opacityX = useTransform(x, [-100, -20, 0], [1, 0, 0]);
  const opacityHeart = useTransform(x, [0, 20, 100], [0, 0, 1]);
  const opacityStar = useTransform(y, [-100, -20, 0], [1, 0, 0]);

  const handleSwipe = async (swipedUser: User, direction: 'left' | 'right' | 'up') => {
      if (!currentUser || !firestore || !userData) return;

      const swipeData = {
          swiperId: currentUser.uid,
          swipedId: swipedUser.id,
          direction: direction,
          timestamp: serverTimestamp(),
      };
      
      const swipeCollectionRef = collection(firestore, 'swipes');
      const swipeDocRef = doc(swipeCollectionRef);
      setDoc(swipeDocRef, swipeData).catch(error => {
        const permissionError = new FirestorePermissionError({
            path: swipeDocRef.path,
            operation: 'create',
            requestResourceData: swipeData
        });
        errorEmitter.emit('permission-error', permissionError);
      });

      if (direction === 'right' || direction === 'up') {
          // Check for a match
          const theirSwipeQuery = query(
              collection(firestore, 'swipes'),
              where('swiperId', '==', swipedUser.id),
              where('swipedId', '==', currentUser.uid),
              where('direction', 'in', ['right', 'up'])
          );

          const theirSwipeSnapshot = await getDocs(theirSwipeQuery);
          if (!theirSwipeSnapshot.empty) {
              // It's a match!
              setLastSwipedUser(swipedUser);
              setShowMatch(true);

              const conversationId = [currentUser.uid, swipedUser.id].sort().join('_');
              const conversationRef = doc(firestore, 'conversations', conversationId);
              
              const conversationData = {
                participants: [currentUser.uid, swipedUser.id],
                createdAt: serverTimestamp(),
                // Embed participant details for easier display in chat lists
                participantDetails: {
                  [currentUser.uid]: { ...userData, id: currentUser.uid },
                  [swipedUser.id]: { ...swipedUser, id: swipedUser.id }
                }
              };

              const batch = writeBatch(firestore);
              batch.set(conversationRef, conversationData, { merge: true });

              batch.commit().catch(error => {
                const permissionError = new FirestorePermissionError({
                    path: conversationRef.path,
                    operation: 'write',
                    requestResourceData: conversationData
                });
                errorEmitter.emit('permission-error', permissionError);
              });
          }
      }
  };


  const triggerSwipe = (direction: 'left' | 'right' | 'up') => {
    if (!potentialMatches || currentIndex >= potentialMatches.length) return;
    
    setSwipeDirection(direction);
    const swipedUser = potentialMatches[currentIndex];
    setLastSwipedUser(swipedUser);

    handleSwipe(swipedUser, direction);
    
    // Animate card away
    const exitX = direction === 'left' ? -300 : direction === 'right' ? 300 : 0;
    const exitY = direction === 'up' ? -500 : 0;
    
    animate(x, exitX, { duration: 0.3 });
    animate(y, exitY, { duration: 0.3 });

    setTimeout(() => {
        setCurrentIndex(currentIndex + 1);
        x.set(0);
        y.set(0);
        setSwipeDirection(null);
    }, 300);
  };
  
  const onDragEnd = (event: any, info: { offset: { x: number; y: number }; }) => {
    if (info.offset.y < -150) {
      triggerSwipe('up');
    } else if (info.offset.x > 150) {
      triggerSwipe('right');
    } else if (info.offset.x < -150) {
      triggerSwipe('left');
    } else {
        // Snap back to center
        animate(x, 0, { type: 'spring', stiffness: 500, damping: 30 });
        animate(y, 0, { type: 'spring', stiffness: 500, damping: 30 });
    }
  };

  const resetSwipes = () => {
    setCurrentIndex(0);
    setShowMatch(false);
  }

  const closeMatchNotification = () => {
    setShowMatch(false);
  }
  
  const currentProfile = potentialMatches?.[currentIndex];
  
  const variants = {
    initial: { scale: 0.9, opacity: 0, rotate: 5 },
    animate: { scale: 1, opacity: 1, y: 0, rotate: 0 },
    exit: (direction: SwipeDirection) => {
        return {
            x: direction === 'right' ? 300 : direction === 'left' ? -300 : 0,
            y: direction === 'up' ? -500 : 0,
            opacity: 0,
            scale: 0.8,
            transition: { duration: 0.3 }
        };
    }
  };

  if (loading) {
    return <div className="flex h-full items-center justify-center"><Loader2 className="h-8 w-8 animate-spin" /></div>;
  }

  return (
    <>
    <AnimatePresence>
        {showMatch && lastSwipedUser && (
            <MatchNotification
                matchedUser={lastSwipedUser}
                onKeepSwiping={closeMatchNotification}
            />
        )}
    </AnimatePresence>

    <div className="flex h-full flex-col items-center justify-center gap-8">
      <div className="relative w-full max-w-sm h-[60vh]">
        <AnimatePresence custom={swipeDirection}>
          {currentProfile ? (
            <motion.div
              key={currentIndex}
              drag
              style={{ x, y, rotate }}
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
                    <motion.div style={{ opacity: opacityStar }}>
                        <Star className="h-24 w-24 text-blue-500 fill-blue-500" />
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

      <div className="flex items-center justify-center gap-4">
        <Button
            onClick={() => triggerSwipe('left')}
            variant="outline"
            size="icon"
            className="h-20 w-20 rounded-full border-2 border-yellow-500 text-yellow-500 shadow-lg transition-transform duration-300 hover:scale-110 hover:bg-yellow-500/10"
            aria-label="Dislike"
            disabled={swipeDirection !== null || showMatch || !currentProfile}
        >
            <X className="h-10 w-10" />
        </Button>
        <Button
            onClick={() => triggerSwipe('right')}
            size="icon"
            className="h-24 w-24 rounded-full bg-primary text-primary-foreground shadow-xl transition-transform duration-300 hover:scale-110"
            aria-label="Like"
            disabled={swipeDirection !== null || showMatch || !currentProfile}
        >
            <Heart className="h-12 w-12 fill-current" />
        </Button>
        <Button
            onClick={() => triggerSwipe('up')}
            size="icon"
            className="h-20 w-20 rounded-full bg-blue-500 text-white shadow-xl transition-transform duration-300 hover:scale-110 hover:bg-blue-500/80"
            aria-label="Super Like"
            disabled={swipeDirection !== null || showMatch || !currentProfile}
        >
            <Star className="h-10 w-10 fill-current" />
        </Button>
      </div>
    </div>
    </>
  );
}
