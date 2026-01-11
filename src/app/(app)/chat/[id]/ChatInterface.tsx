
"use client";

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';
import type { Conversation, Message, User } from '@/lib/types';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { ArrowLeft, Loader2, MoreVertical, SendHorizontal } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { detectHarassment } from '@/ai/flows/harassment-detection';

type ChatInterfaceProps = {
  conversation: Conversation;
  initialMessages: Message[];
  currentUser: User;
};

export function ChatInterface({ conversation, initialMessages, currentUser }: ChatInterfaceProps) {
  const [messages, setMessages] = useState(initialMessages);
  const [newMessage, setNewMessage] = useState('');
  const [isSending, setIsSending] = useState(false);
  const { toast } = useToast();
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  const participant = conversation.participant;
  const participantImage = PlaceHolderImages.find(p => p.id === participant.photos[0]);
  const participantFirstName = participant.name.split(' ')[0];

  useEffect(() => {
    if (scrollAreaRef.current) {
        // A bit of a hack to scroll to bottom. The underlying component might not expose a direct way.
        const viewport = scrollAreaRef.current.querySelector('div[data-radix-scroll-area-viewport]');
        if (viewport) {
            viewport.scrollTop = viewport.scrollHeight;
        }
    }
  }, [messages]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    setIsSending(true);

    try {
        const harassmentResult = await detectHarassment({ message: newMessage });
        if(harassmentResult.isHarassment) {
            toast({
                title: "Message Blocked",
                description: `Our AI detected potential harassment: ${harassmentResult.reason}. Please be respectful.`,
                variant: 'destructive',
                duration: 5000,
            });
            setIsSending(false);
            return;
        }

        const messageToSend: Message = {
            id: `msg-${Date.now()}`,
            senderId: currentUser.id,
            receiverId: participant.id,
            text: newMessage,
            timestamp: new Date(),
        };

        setMessages(prev => [...prev, messageToSend]);
        setNewMessage('');

    } catch (error) {
        console.error("Failed to send message or detect harassment:", error);
        toast({
            title: "Error",
            description: "Could not send message. Please try again.",
            variant: "destructive",
        });
    } finally {
        setIsSending(false);
    }
  };

  return (
    <div className="flex h-[calc(100vh-8rem)] flex-col rounded-xl border bg-card">
      <header className="flex items-center gap-4 border-b p-4">
        <Button asChild variant="ghost" size="icon" className="md:hidden">
            <Link href="/chat"><ArrowLeft /></Link>
        </Button>
        <Avatar className="h-10 w-10">
          {participantImage && <AvatarImage src={participantImage.imageUrl} alt={participant.name} />}
          <AvatarFallback>{participantFirstName.charAt(0)}</AvatarFallback>
        </Avatar>
        <div className="flex-1">
          <p className="font-semibold">{participantFirstName}</p>
          <div className="flex items-center gap-1.5">
            <div className="h-2 w-2 rounded-full bg-green-400" />
            <p className="text-sm text-muted-foreground">Online</p>
          </div>
        </div>
        <Button variant="ghost" size="icon">
          <MoreVertical className="h-5 w-5" />
        </Button>
      </header>
      
      <ScrollArea className="flex-1" ref={scrollAreaRef}>
        <div className="p-6 space-y-6">
            {messages.map((msg) => {
            const isCurrentUser = msg.senderId === currentUser.id;
            return (
                <div
                key={msg.id}
                className={cn('flex items-end gap-2', isCurrentUser ? 'justify-end' : 'justify-start')}
                >
                <div
                    className={cn(
                    'max-w-xs rounded-2xl p-3 md:max-w-md',
                    isCurrentUser ? 'rounded-br-none bg-primary text-primary-foreground' : 'rounded-bl-none bg-muted'
                    )}
                >
                    <p className="text-sm">{msg.text}</p>
                </div>
                </div>
            );
            })}
        </div>
      </ScrollArea>
      
      <Separator />

      <footer className="p-4">
        <form onSubmit={handleSendMessage} className="flex items-center gap-2">
          <Input
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type a message..."
            autoComplete="off"
            disabled={isSending}
          />
          <Button type="submit" size="icon" disabled={isSending || !newMessage.trim()}>
            {isSending ? <Loader2 className="h-5 w-5 animate-spin" /> : <SendHorizontal className="h-5 w-5" />}
          </Button>
        </form>
      </footer>
    </div>
  );
}
