
'use client';

import { notFound, useParams } from 'next/navigation';
import { ChatInterface } from './ChatInterface';
import { useDoc, useFirestore, useUser } from '@/firebase';
import { doc } from 'firebase/firestore';
import type { User } from '@/lib/types';
import { Loader2 } from 'lucide-react';
import { useMemo } from 'react';

export default function ChatPage() {
  const params = useParams();
  const firestore = useFirestore();
  const { user: currentUser } = useUser();
  const participantId = Array.isArray(params.id) ? params.id[0] : params.id;
  
  const conversationId = useMemo(() => {
    if (!currentUser || !participantId) return null;
    return [currentUser.uid, participantId].sort().join('_');
  }, [currentUser, participantId]);


  const { data: participant, loading } = useDoc<User>(
    firestore && participantId ? doc(firestore, 'users', participantId) : null
  );

  if (loading || !conversationId) {
    return <div className="flex h-full items-center justify-center"><Loader2 className="h-8 w-8 animate-spin" /></div>;
  }
  
  if (!participant) {
    notFound();
  }
  
  return (
    <ChatInterface 
      participant={participant}
      conversationId={conversationId}
    />
  );
}
