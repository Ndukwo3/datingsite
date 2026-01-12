
'use client';

import { notFound, useParams, useRouter } from 'next/navigation';
import { ChatInterface } from './ChatInterface';
import { useDoc, useFirestore, useUser } from '@/firebase';
import { doc } from 'firebase/firestore';
import type { User, Conversation } from '@/lib/types';
import { Loader2 } from 'lucide-react';
import { useMemo, useEffect } from 'react';

export default function ChatPage() {
  const params = useParams();
  const router = useRouter();
  const firestore = useFirestore();
  const { user: currentUser } = useUser();
  const participantId = Array.isArray(params.id) ? params.id[0] : params.id;
  
  const isOwnProfile = currentUser?.uid === participantId;

  useEffect(() => {
    if (isOwnProfile) {
        router.replace('/profile');
    }
  }, [isOwnProfile, router]);
  
  const conversationId = useMemo(() => {
    if (!currentUser || !participantId) return null;
    return [currentUser.uid, participantId].sort().join('_');
  }, [currentUser, participantId]);

  const { data: participant, loading: participantLoading } = useDoc<User>(
    firestore && participantId ? doc(firestore, 'users', participantId) : null
  );
  
  const { data: conversation, loading: conversationLoading } = useDoc<Conversation>(
    firestore && conversationId ? doc(firestore, 'conversations', conversationId) : null
  );

  const loading = participantLoading || conversationLoading;
  const isNewMatch = !conversation;

  if (loading || !conversationId || isOwnProfile) {
    return <div className="flex h-full items-center justify-center"><Loader2 className="h-8 w-8 animate-spin" /></div>;
  }
  
  if (!participant) {
    notFound();
  }
  
  return (
    <ChatInterface 
      participant={participant}
      conversationId={conversationId}
      isNewMatch={isNewMatch}
    />
  );
}
