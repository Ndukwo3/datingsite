
"use client";

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/card';
import { formatActivity } from '@/lib/utils';
import { cn } from '@/lib/utils';
import { Loader2, MapPin, User as UserIcon } from 'lucide-react';
import type { User } from '@/lib/types';
import { useCollection, useFirestore } from '@/firebase';
import { collection } from 'firebase/firestore';

// Fisher-Yates shuffle algorithm
const shuffleArray = (array: User[]) => {
  let currentIndex = array.length, randomIndex;
  while (currentIndex !== 0) {
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;
    [array[currentIndex], array[randomIndex]] = [
      array[randomIndex], array[currentIndex]];
  }
  return array;
};

export default function FeedPage() {
  const firestore = useFirestore();
  const { data: users, loading } = useCollection<User>(firestore ? collection(firestore, 'users') : null);
  const [shuffledUsers, setShuffledUsers] = useState<User[]>([]);

  useEffect(() => {
    if (users) {
      const onlineUsers = users.filter(u => u.lastSeen === 'online');
      const offlineUsers = users.filter(u => u.lastSeen !== 'online');

      const shuffledOnline = shuffleArray(onlineUsers);
      const shuffledOffline = shuffleArray(offlineUsers);

      setShuffledUsers([...shuffledOnline, ...shuffledOffline]);
    }
  }, [users]);
  
  if (loading) {
    return <div className="flex h-full items-center justify-center"><Loader2 className="h-8 w-8 animate-spin" /></div>;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-headline text-3xl font-bold">Activity Feed</h1>
        <p className="text-muted-foreground">
          See who's online now and who was active recently.
        </p>
      </div>

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
        {shuffledUsers.map((user) => {
          const userImage = user.photos?.[0];
          const isOnline = user.lastSeen === 'online';
          
          return (
            <Link href={`/profile/${user.id}`} key={user.id}>
              <Card className="overflow-hidden transition-transform duration-300 hover:scale-105 hover:shadow-lg">
                <CardContent className="relative aspect-[3/4.5] p-0">
                  {userImage && typeof userImage === 'string' && userImage.length > 0 ? (
                    <Image
                      src={userImage}
                      alt={user.name}
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-muted flex items-center justify-center">
                      <UserIcon className="w-16 h-16 text-muted-foreground" />
                    </div>
                  )}
                  <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 to-transparent p-3 text-primary-foreground">
                    <p className="font-semibold">{user.name}, {user.age}</p>
                     <p className="mt-0.5 flex items-center gap-1 text-xs text-primary-foreground/80">
                      <MapPin className="h-3 w-3" /> {user.location.split(',')[0]}
                    </p>
                    <div className="mt-1.5 flex items-center gap-1.5 text-xs">
                        <div className={cn("h-2 w-2 rounded-full", isOnline ? "bg-green-400" : "bg-gray-400")} />
                        <span>{formatActivity(user.lastSeen)}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
