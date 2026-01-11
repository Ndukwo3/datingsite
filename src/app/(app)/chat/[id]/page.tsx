
'use client';

import { notFound, useParams } from 'next/navigation';
import { ChatInterface } from './ChatInterface';
import { useDoc, useFirestore } from '@/firebase';
import { doc } from 'firebase/firestore';
import type { User } from '@/lib/types';
import { Loader2 } from 'lucide-react';

export default function ChatPage() {
  const params = useParams();
  const firestore = useFirestore();
  const participantId = Array.isArray(params.id) ? params.id[0] : params.id;
  
  // This logic assumes a conversation ID can be deterministically created
  // In a real app, you might need to query for the conversation doc first
  const conversationId = participantId; 

  const { data: participant, loading } = useDoc<User>(
    firestore && participantId ? doc(firestore, 'users', participantId) : null
  );

  if (loading) {
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
