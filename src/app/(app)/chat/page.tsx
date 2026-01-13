
'use client';

import { useMemo } from 'react';
import Link from 'next/link';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { formatDistanceToNow } from 'date-fns';
import { useCollection, useFirestore, useUser, useDoc } from '@/firebase';
import { collection, query, where, doc } from 'firebase/firestore';
import type { Conversation, User } from '@/lib/types';
import { Loader2 } from 'lucide-react';
import { isValidHttpUrl } from '@/lib/is-valid-url';
import { cn } from '@/lib/utils';

function ConversationItem({ conversation, currentUserId }: { conversation: Conversation, currentUserId: string }) {
  const firestore = useFirestore();
  const participantId = conversation.participants.find(p => p !== currentUserId);

  const participantRef = useMemo(() => {
    if (!firestore || !participantId) return null;
    return doc(firestore, 'users', participantId);
  }, [firestore, participantId]);
  
  const { data: participant, loading } = useDoc<User>(participantRef);

  if (loading || !participant) {
    return (
      <div className="flex items-center gap-4 p-4">
        <Avatar className="h-12 w-12">
            <AvatarFallback><Loader2 className="h-6 w-6 animate-spin" /></AvatarFallback>
        </Avatar>
        <div className="flex-1 space-y-2">
            <div className="h-4 w-1/2 rounded bg-muted" />
            <div className="h-3 w-3/4 rounded bg-muted" />
        </div>
      </div>
    )
  }

  const userImage = participant.photos?.[0];
  const firstName = participant.name.split(' ')[0];
  const lastMessage = conversation.lastMessage || { text: 'No messages yet', timestamp: conversation.createdAt };
  const isUnread = lastMessage.senderId !== currentUserId;


  return (
    <Link
      href={`/profile/${participant.id}`}
      key={conversation.id}
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
        <div className="flex-1 overflow-hidden">
          <div className="flex items-baseline justify-between">
            <p className="font-semibold">{firstName}</p>
            <p className="text-xs text-muted-foreground">
              {lastMessage.timestamp ? formatDistanceToNow(new Date(lastMessage.timestamp.seconds * 1000), { addSuffix: true }) : ''}
            </p>
          </div>
          <div className="flex items-center gap-2">
             <p className={cn(
                "mt-1 truncate text-sm",
                isUnread ? "font-bold text-foreground" : "text-muted-foreground"
            )}>
                {lastMessage.senderId === currentUserId && 'You: '}{lastMessage.text}
             </p>
            {isUnread && <div className="h-2 w-2 shrink-0 rounded-full bg-primary" />}
          </div>
        </div>
      </div>
    </Link>
  );
}


export default function ChatListPage() {
  const firestore = useFirestore();
  const { user } = useUser();

  const conversationsQuery = useMemo(() => {
    if (!firestore || !user) return null;
    return query(
      collection(firestore, 'conversations'),
      where('participants', 'array-contains', user.uid)
    );
  }, [firestore, user]);

  const { data: conversations, loading } = useCollection<Conversation>(conversationsQuery);
  
  const sortedConversations = useMemo(() => {
    if (!conversations) return [];
    return [...conversations].sort((a, b) => {
        const timeA = a.lastMessage?.timestamp?.seconds || a.createdAt?.seconds || 0;
        const timeB = b.lastMessage?.timestamp?.seconds || b.createdAt?.seconds || 0;
        return timeB - timeA;
    });
  }, [conversations]);

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
            {sortedConversations && user && sortedConversations.map((convo) => (
              <ConversationItem key={convo.id} conversation={convo} currentUserId={user.uid} />
            ))}
             {conversations?.length === 0 && (
              <p className="text-center text-muted-foreground p-8">No conversations yet. Start swiping to find a match!</p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
