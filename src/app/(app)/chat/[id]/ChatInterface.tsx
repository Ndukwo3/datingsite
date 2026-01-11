
"use client";

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button, buttonVariants } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import type { Conversation, Message, User } from '@/lib/types';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { ArrowLeft, Loader2, MoreVertical, SendHorizontal, Smile, ShieldAlert, User as UserIcon, XCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';

type ChatInterfaceProps = {
  conversation: Conversation;
  initialMessages: Message[];
  currentUser: User;
};

const popularEmojis = ['😀', '😂', '❤️', '👍', '🙏', '😍', '🤔', '😎', '🔥', '🎉', '😊', '😭'];

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
        const messageToSend: Message = {
            id: `msg-${Date.now()}`,
            senderId: currentUser.id,
            receiverId: participant.id,
            text: newMessage,
            timestamp: new Date(),
        };

        // Simulate sending message
        await new Promise(resolve => setTimeout(resolve, 500));

        setMessages(prev => [...prev, messageToSend]);
        setNewMessage('');

    } catch (error) {
        console.error("Failed to send message:", error);
        toast({
            title: "Error",
            description: "Could not send message. Please try again.",
            variant: "destructive",
        });
    } finally {
        setIsSending(false);
    }
  };

  const handleEmojiSelect = (emoji: string) => {
    setNewMessage(prev => prev + emoji);
  }
  
  const handleBlockUser = () => {
    toast({
        title: `User ${participantFirstName} blocked`,
        description: "You will no longer see their profile or receive messages from them.",
    });
    // Here you would add logic to actually block the user
  };

  const handleReportUser = () => {
     toast({
        title: `User ${participantFirstName} reported`,
        description: "Thank you for helping keep our community safe. Our team will review your report.",
    });
     // Here you would add logic to actually report the user
  }

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
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon">
                    <MoreVertical className="h-5 w-5" />
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
                <DropdownMenuItem asChild>
                    <Link href={`/profile/${participant.id}`}>
                        <UserIcon className="mr-2" /> View Profile
                    </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                 <AlertDialog>
                    <AlertDialogTrigger asChild>
                        <DropdownMenuItem onSelect={(e) => e.preventDefault()} className="text-destructive focus:text-destructive">
                             <ShieldAlert className="mr-2" /> Report User
                        </DropdownMenuItem>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                        <AlertDialogHeader>
                            <AlertDialogTitle>Report {participantFirstName}?</AlertDialogTitle>
                            <AlertDialogDescription>
                                Reporting this user will submit their profile for review by our safety team. Are you sure you want to proceed?
                            </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction onClick={handleReportUser} className={cn(buttonVariants({variant: 'destructive'}))}>Report</AlertDialogAction>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>
                 <AlertDialog>
                    <AlertDialogTrigger asChild>
                         <DropdownMenuItem onSelect={(e) => e.preventDefault()} className="text-destructive focus:text-destructive">
                             <XCircle className="mr-2" /> Block User
                        </DropdownMenuItem>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                        <AlertDialogHeader>
                            <AlertDialogTitle>Block {participantFirstName}?</AlertDialogTitle>
                            <AlertDialogDescription>
                                You will not be able to send or receive messages from this user, and you won't see their profile. Are you sure?
                            </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction onClick={handleBlockUser} className={cn(buttonVariants({variant: 'destructive'}))}>Block</AlertDialogAction>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>
            </DropdownMenuContent>
        </DropdownMenu>
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
        <form onSubmit={handleSendMessage} className="relative flex items-center">
            <Input
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="Type a message..."
                autoComplete="off"
                disabled={isSending}
                className="pr-20"
            />
            <div className="absolute right-2 flex items-center">
                <Popover>
                    <PopoverTrigger asChild>
                        <Button type="button" variant="ghost" size="icon" disabled={isSending} className="text-muted-foreground">
                            <Smile className="h-5 w-5" />
                        </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto border-none bg-transparent shadow-none">
                        <div className="grid grid-cols-6 gap-2 rounded-lg border bg-popover p-2">
                        {popularEmojis.map(emoji => (
                            <Button
                            key={emoji}
                            variant="ghost"
                            size="icon"
                            className="text-xl"
                            onClick={() => handleEmojiSelect(emoji)}
                            >
                            {emoji}
                            </Button>
                        ))}
                        </div>
                    </PopoverContent>
                </Popover>

                <Button type="submit" size="icon" disabled={isSending || !newMessage.trim()} className="text-muted-foreground" variant="ghost">
                    {isSending ? <Loader2 className="h-5 w-5 animate-spin" /> : <SendHorizontal className="h-5 w-5" />}
                </Button>
            </div>
        </form>
      </footer>
    </div>
  );
}
