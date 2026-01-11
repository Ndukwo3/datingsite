
'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/card';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { BadgeCheck, MessageSquare, Sparkles, Loader2 } from 'lucide-react';
import { cn, formatMatchTime } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { useCollection, useFirestore, useUser } from '../../../firebase';
import { collection, query, where } from 'firebase/firestore';
import type { Conversation, User } from '@/lib/types';


export default function MatchesPage() {
    const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
    const firestore = useFirestore();
    const { user: currentUser } = useUser();

    // Query for conversations where the current user is a participant
    const matchesQuery = firestore && currentUser
        ? query(
            collection(firestore, 'conversations'),
            where('participants', 'array-contains', currentUser.uid)
        )
        : null;

    const { data: matches, loading } = useCollection<Conversation>(matchesQuery);

    if (loading) {
      return <div className="flex h-full items-center justify-center"><Loader2 className="h-8 w-8 animate-spin" /></div>;
    }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-headline text-3xl font-bold">Your Matches</h1>
        <p className="text-muted-foreground">
          These are the people you've connected with. Start a conversation!
        </p>
      </div>

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
        {matches && matches.map((match) => {
          const participantId = match.participants.find(p => p !== currentUser?.uid);
          if (!participantId) return null;

          // Assuming participant details are embedded. If not, a separate fetch is needed.
          const participant = match.participantDetails[participantId] as User;
          if (!participant) return null;

          const userImage = PlaceHolderImages.find(p => p.id === participant.photos[0]);
          // Use createdAt for match time, assuming lastMessage might not exist initially
          const matchTimestamp = match.createdAt ? new Date(match.createdAt.seconds * 1000) : new Date();
          const isNewMatch = matchTimestamp > twentyFourHoursAgo;
          
          return (
            <Link href={`/chat/${participant.id}`} key={match.id} className="group">
              <Card className="overflow-hidden transition-all duration-300 hover:scale-105 hover:shadow-lg border-transparent hover:border-primary">
                <CardContent className="relative aspect-square p-0">
                  {userImage && (
                    <Image
                      src={userImage.imageUrl}
                      alt={participant.name}
                      fill
                      className="object-cover"
                      data-ai-hint={userImage.imageHint}
                    />
                  )}
                  {isNewMatch && (
                     <Badge className="absolute top-2 right-2 bg-accent text-accent-foreground border-none">
                        <Sparkles className="h-3 w-3 mr-1" />
                        New
                    </Badge>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent transition-all group-hover:from-black/90" />
                  <div className="absolute inset-x-0 bottom-0 p-3">
                     <div className="flex items-center gap-1.5">
                      <p className="font-semibold text-primary-foreground">{participant.name}</p>
                      {participant.isVerified && <BadgeCheck className="h-4 w-4 text-blue-400 fill-primary-foreground" />}
                    </div>
                     <p className="text-xs text-primary-foreground/80 mt-1">
                        Matched {formatMatchTime(matchTimestamp)}
                    </p>
                  </div>
                   <div className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 transition-opacity group-hover:opacity-100">
                        <MessageSquare className="h-8 w-8 text-white" />
                    </div>
                </CardContent>
              </Card>
            </Link>
          );
        })}
        {matches?.length === 0 && (
          <p className="col-span-full text-center text-muted-foreground p-8">No matches yet. Keep swiping!</p>
        )}
      </div>
    </div>
  );
}
