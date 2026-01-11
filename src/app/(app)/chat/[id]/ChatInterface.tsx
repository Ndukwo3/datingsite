
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
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogClose } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Textarea } from '@/components/ui/textarea';

type ChatInterfaceProps = {
  conversation: Conversation;
  initialMessages: Message[];
  currentUser: User;
};

const popularEmojis = ['😀', '😂', '❤️', '👍', '🙏', '😍', '🤔', '😎', '🔥', '🎉', '😊', '😭'];

const reportReasons = [
    { id: 'spam', label: 'Spam or Scam' },
    { id: 'inappropriate', label: 'Inappropriate Content' },
    { id: 'harassment', label: 'Harassment or Hate Speech' },
    { id: 'underage', label: 'Underage User' },
    { id: 'other', label: 'Other' },
];


export function ChatInterface({ conversation, initialMessages, currentUser }: ChatInterfaceProps) {
  const [messages, setMessages] = useState(initialMessages);
  const [newMessage, setNewMessage] = useState('');
  const [isSending, setIsSending] = useState(false);
  const { toast } = useToast();
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  
  const [isReportDialogOpen, setIsReportDialogOpen] = useState(false);
  const [reportReason, setReportReason] = useState('');
  const [reportDetails, setReportDetails] = useState('');


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

  const handleReportSubmit = () => {
     toast({
        title: `User ${participantFirstName} reported`,
        description: "Thank you for helping keep our community safe. Our team will review your report.",
    });
    setReportReason('');
    setReportDetails('');
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
                            {reportReason && (
                                <div className="space-y-2">
                                    <Label htmlFor="report-details">Please provide more details (optional)</Label>
                                    <Textarea 
                                        id="report-details" 
                                        value={reportDetails}
                                        onChange={(e) => setReportDetails(e.target.value)}
                                        placeholder={`Tell us more about the ${reportReason} issue...`}
                                        className="min-h-[100px]"
                                    />
                                </div>
                            )}
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
