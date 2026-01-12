
"use client";

import { useMemo } from "react";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { UserNav } from "@/components/UserNav";
import { Button, buttonVariants } from "./ui/button";
import { Bell, Heart, MessageSquareText, Sparkles } from "lucide-react";
import { ThemeToggle } from "./ThemeToggle";
import { Logo } from "./Logo";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { useCollection, useFirestore, useUser } from "@/firebase";
import { collection, query, where, orderBy, Timestamp } from "firebase/firestore";
import type { Conversation, Message, User } from "@/lib/types";
import { formatDistanceToNow } from "date-fns";

type NotificationType = 'welcome' | 'match' | 'message';

type Notification = {
    id: string;
    type: NotificationType;
    user: Partial<User>;
    message?: string;
    time: string;
    href: string;
    timestamp: Date;
};

const welcomeNotification: Notification = {
    id: 'welcome',
    type: 'welcome',
    user: { name: 'LinkUp9ja' },
    message: 'Welcome to LinkUp9ja! Check out our community rules.',
    time: 'Just now',
    href: '/welcome',
    timestamp: new Date(),
}

export function AppHeader() {
  const { user: currentUser } = useUser();
  const firestore = useFirestore();

  const conversationsQuery = useMemo(() => {
    if (!firestore || !currentUser) return null;
    return query(
      collection(firestore, 'conversations'),
      where('participants', 'array-contains', currentUser.uid)
    );
  }, [firestore, currentUser]);

  const { data: conversations } = useCollection<Conversation>(conversationsQuery);

  const notifications: Notification[] = useMemo(() => {
    if (!conversations || !currentUser) return [welcomeNotification];

    const matchNotifications = conversations.map((convo) => {
        const participantId = convo.participants.find(p => p !== currentUser.uid) || '';
        const participant = convo.participantDetails[participantId];
        const convoTimestamp = convo.createdAt?.seconds ? new Date(convo.createdAt.seconds * 1000) : new Date();
        return {
            id: `match-${convo.id}`,
            type: 'match' as NotificationType,
            user: { id: participant.id, name: participant.name, photos: participant.photos },
            time: formatDistanceToNow(convoTimestamp, { addSuffix: true }),
            href: `/chat/${participant.id}`,
            timestamp: convoTimestamp
        }
    });

    const messageNotifications = conversations.filter(c => c.lastMessage && c.lastMessage.senderId !== currentUser.uid).map((convo) => {
        const participantId = convo.participants.find(p => p !== currentUser.uid) || '';
        const participant = convo.participantDetails[participantId];
        const lastMessageTimestamp = convo.lastMessage.timestamp?.seconds ? new Date(convo.lastMessage.timestamp.seconds * 1000) : new Date();

        return {
            id: `msg-${convo.id}`,
            type: 'message' as NotificationType,
            user: { id: participant.id, name: participant.name, photos: participant.photos },
            message: convo.lastMessage.text,
            time: formatDistanceToNow(lastMessageTimestamp, { addSuffix: true }),
            href: `/chat/${participant.id}`,
            timestamp: lastMessageTimestamp,
        }
    });

    const allNotifications = [...matchNotifications, ...messageNotifications]
      .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
      
    // Deduplicate, keeping the most recent (e.g., show message notif over match notif for same user)
    const uniqueNotifications = allNotifications.reduce((acc, current) => {
        const existing = acc.find(item => item.user.id === current.user.id);
        if (!existing) {
            acc.push(current);
        }
        return acc;
    }, [] as Notification[]);

    return [welcomeNotification, ...uniqueNotifications];
  }, [conversations, currentUser]);


  return (
    <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b bg-background/70 px-4 backdrop-blur-xl sm:px-6">
      <div className="flex items-center gap-2 md:hidden">
        <SidebarTrigger />
        <Logo />
      </div>
      <div className="flex-1">
        {/* Can add a search bar here if needed */}
      </div>
      <div className="flex items-center gap-2">
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="rounded-full relative text-foreground">
                    <Bell className="h-5 w-5"/>
                    <span className="sr-only">Notifications</span>
                    {notifications.length > 1 && ( // More than just welcome
                      <span className="absolute top-0 right-0 block h-2 w-2 rounded-full bg-primary ring-2 ring-background" />
                    )}
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-80" align="end">
                <DropdownMenuLabel>Notifications</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <div className="flex flex-col gap-1">
                    {notifications.map((notif) => (
                        <DropdownMenuItem key={notif.id} asChild className="p-2 cursor-pointer">
                            <Link href={notif.href}>
                                <div className="flex items-start gap-3">
                                    <div className="relative">
                                        <Avatar className="h-9 w-9">
                                            {notif.user.photos?.[0] ? <AvatarImage src={notif.user.photos[0]} alt={notif.user.name} /> : <AvatarFallback><Sparkles className="h-5 w-5 text-primary"/></AvatarFallback>}
                                        </Avatar>
                                        <div className="absolute -bottom-1 -right-1 p-0.5 bg-background rounded-full">
                                            {notif.type === 'match' && <Heart className="h-4 w-4 text-primary fill-primary" />}
                                            {notif.type === 'message' && <MessageSquareText className="h-4 w-4 text-blue-500 fill-blue-500" />}
                                            {notif.type === 'welcome' && <Sparkles className="h-4 w-4 text-yellow-500 fill-yellow-500" />}
                                        </div>
                                    </div>
                                    <div className="flex-1">
                                        <p className="text-sm">
                                            {notif.type === 'match' ? (
                                                <>You matched with <span className="font-semibold">{notif.user.name}</span>!</>
                                            ) : notif.type === 'welcome' ? (
                                                <span className="font-semibold">{notif.message}</span>
                                            ) : (
                                                <><span className="font-semibold">{notif.user.name}</span> sent a message</>
                                            )}
                                        </p>
                                        <p className="text-xs text-muted-foreground">{notif.time}</p>
                                    </div>
                                </div>
                            </Link>
                        </DropdownMenuItem>
                    ))}
                </div>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                    <Link href="#" className={cn(buttonVariants({variant: 'link'}), 'w-full')}>
                        View all notifications
                    </Link>
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
        <ThemeToggle className="text-foreground" />
        <UserNav />
      </div>
    </header>
  );
}
