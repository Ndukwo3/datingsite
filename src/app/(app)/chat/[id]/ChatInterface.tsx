
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
import type { Message, User } from '@/lib/types';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { ArrowLeft, Loader2, MoreVertical, SendHorizontal, Smile, ShieldAlert, User as UserIcon } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogClose } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { useUser, useFirestore, useCollection } from '@/firebase';
import { collection, addDoc, serverTimestamp, query, orderBy } from 'firebase/firestore';

type ChatInterfaceProps = {
  participant: User;
  conversationId: string;
};

const popularEmojis = ['😀', '😂', '❤️', '👍', '🙏', '😍', '🤔', '😎', '🔥', '🎉', '😊', '😭'];

const reportReasons = [
    { id: 'spam', label: 'Spam or Scam' },
    { id: 'inappropriate', label: 'Inappropriate Content' },
    { id: 'harassment', label: 'Harassment or Hate Speech' },
    { id: 'underage', label: 'Underage User' },
    { id: 'other', label: 'Other' },
];


export function ChatInterface({ participant, conversationId }: ChatInterfaceProps) {
  const [newMessage, setNewMessage] = useState('');
  const [isSending, setIsSending] = useState(false);
  const { toast } = useToast();
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const { user: currentUser } = useUser();
  const firestore = useFirestore();

  const messagesQuery = firestore ? query(collection(firestore, 'conversations', conversationId, 'messages'), orderBy('timestamp', 'asc')) : null;
  const { data: messages, loading } = useCollection<Message>(messagesQuery);
  
  const [isReportDialogOpen, setIsReportDialogOpen] = useState(false);
  const [reportReason, setReportReason] = useState('');

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
    if (!newMessage.trim() || !currentUser || !firestore) return;

    setIsSending(true);

    try {
      const messagesCol = collection(firestore, 'conversations', conversationId, 'messages');
      await addDoc(messagesCol, {
        senderId: currentUser.uid,
        receiverId: participant.id,
        text: newMessage,
        timestamp: serverTimestamp(),
      });

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

  const handleReportSubmit = () => {
     toast({
        title: `User ${participantFirstName} reported`,
        description: "Thank you for helping keep our community safe. Our team will review your report.",
    });
    setReportReason('');
    setIsReportDialogOpen(false);
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
                 <Dialog open={isReportDialogOpen} onOpenChange={setIsReportDialogOpen}>
                    <DialogTrigger asChild>
                        <DropdownMenuItem onSelect={(e) => e.preventDefault()} className="text-destructive focus:text-destructive">
                             <ShieldAlert className="mr-2" /> Report User
                        </DropdownMenuItem>
                    </DialogTrigger>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Report {participantFirstName}</DialogTitle>
                            <DialogDescription>
                                Help us understand what's happening. Your safety is our priority.
                            </DialogDescription>
                        </DialogHeader>
                        <div className="space-y-4 py-2">
                             <p className="font-medium">What is the reason for this report?</p>
                             <RadioGroup value={reportReason} onValueChange={setReportReason}>
                                {reportReasons.map((reason) => (
                                    <div key={reason.id} className="flex items-center space-x-2">
                                        <RadioGroupItem value={reason.id} id={reason.id} />
                                        <Label htmlFor={reason.id}>{reason.label}</Label>
                                    </div>
                                ))}
                            </RadioGroup>
                        </div>
                        <DialogFooter>
                            <DialogClose asChild>
                                <Button variant="ghost">Cancel</Button>
                            </DialogClose>
                            <Button
                                onClick={handleReportSubmit}
                                disabled={!reportReason}
                                className={cn(buttonVariants({variant: 'destructive'}))}
                            >
                                Submit Report
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </DropdownMenuContent>
        </DropdownMenu>
      </header>
      
      <ScrollArea className="flex-1" ref={scrollAreaRef}>
        <div className="p-6 space-y-6">
            {loading && <div className="flex justify-center"><Loader2 className="h-6 w-6 animate-spin" /></div>}
            {messages?.map((msg) => {
            const isCurrentUser = msg.senderId === currentUser?.uid;
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
