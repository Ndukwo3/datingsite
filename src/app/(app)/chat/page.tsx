
'use client';

import { useMemo } from 'react';
import Link from 'next/link';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { formatDistanceToNow } from 'date-fns';
import { useCollection, useFirestore, useUser } from '@/firebase';
import { collection, query, where, orderBy } from 'firebase/firestore';
import { Conversation } from '@/lib/types';
import { Loader2 } from 'lucide-react';
import { isValidHttpUrl } from '@/lib/is-valid-url';

export default function ChatListPage() {
  const firestore = useFirestore();
  const { user } = useUser();

  const conversationsQuery = useMemo(() => {
    if (!firestore || !user) return null;
    return query(
      collection(firestore, 'conversations'),
      where('participants', 'array-contains', user.uid),
      orderBy('lastMessage.timestamp', 'asc')
    );
  }, [firestore, user]);

  const { data: conversations, loading } = useCollection<Conversation>(conversationsQuery);

  if (loading) {
    return <div className="flex h-full items-center justify-center"><Loader2 className="h-8 w-8 animate-spin" /></div>;
  }

  return (
    <div className="max-w-4xl mx-auto">
      <Card>
        <CardHeader>
          <CardTitle className="font-headline">Conversations</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {conversations && conversations.map((convo) => {
              const participant = convo.participantDetails[convo.participants.find(p => p !== user?.uid) || ''];
              if (!participant) return null;

              const userImage = participant.photos?.[0];
              const firstName = participant.name.split(' ')[0];
              
              const lastMessage = convo.lastMessage || { text: 'No messages yet', timestamp: new Date() };

              return (
                <Link
                  href={`/chat/${participant.id}`}
                  key={convo.id}
                  className="block rounded-lg p-4 transition-colors hover:bg-muted"
                >
                  <div className="flex items-center gap-4">
                    <Avatar className="h-12 w-12">
                      {isValidHttpUrl(userImage) ? (
                        <AvatarImage src={userImage} alt={participant.name} />
                      ) : (
                        <AvatarFallback>{firstName.charAt(0)}</AvatarFallback>
                      )}
                    </Avatar>
                    <div className="flex-1">
                      <div className="flex items-baseline justify-between">
                        <p className="font-semibold">{firstName}</p>
                        <p className="text-xs text-muted-foreground">
                          {lastMessage.timestamp ? formatDistanceToNow(new Date(lastMessage.timestamp.seconds * 1000), { addSuffix: true }) : ''}
                        </p>
                      </div>
                      <p className="mt-1 truncate text-sm text-muted-foreground">
                        {lastMessage.text}
                      </p>
                    </div>
                  </div>
                </Link>
              );
            })}
             {conversations?.length === 0 && (
              <p className="text-center text-muted-foreground p-8">No conversations yet. Start swiping to find a match!</p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
