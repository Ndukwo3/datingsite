import { notFound } from 'next/navigation';
import { conversations, messages, currentUser } from '@/lib/data';
import { ChatInterface } from './ChatInterface';

type ChatPageProps = {
  params: {
    id: string;
  };
};

export default function ChatPage({ params }: ChatPageProps) {
  const conversation = conversations.find(c => c.id === params.id);
  
  if (!conversation) {
    notFound();
  }

  const initialMessages = messages[params.id] || [];
  
  return (
    <ChatInterface 
      conversation={conversation}
      initialMessages={initialMessages}
      currentUser={currentUser}
    />
  );
}
