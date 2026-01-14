
"use client";

import { useMemo, useState, useEffect } from "react";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { UserNav } from "@/components/UserNav";
import { Button } from "./ui/button";
import { Bell, Heart, MessageSquareText, Sparkles, Loader2, Star } from "lucide-react";
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
import { useCollection, useFirestore, useUser, useDoc } from "@/firebase";
import { collection, query, where, doc, orderBy, collectionGroup } from "firebase/firestore";
import type { Conversation, User, Swipe } from "@/lib/types";
import { formatDistanceToNow } from "date-fns";

type NotificationType = 'welcome' | 'match' | 'message' | 'like';

const welcomeNotification = {
    id: 'welcome',
    type: 'welcome' as NotificationType,
    user: { name: 'LinkUp9ja' },
    message: 'Welcome to LinkUp9ja! Check out our community rules.',
    time: 'Just now',
    href: '/welcome',
    timestamp: new Date(),
}

function LikeNotificationItem({ swipe }: { swipe: Swipe }) {
    const firestore = useFirestore();
    const { data: liker, loading } = useDoc<User>(
        firestore && swipe.swiperId ? doc(firestore, 'users', swipe.swiperId) : null
    );

    if (loading || !liker) {
        return (
             <DropdownMenuItem asChild className="p-2 cursor-pointer">
                <div className="flex items-start gap-3 w-full">
                     <div className="relative">
                        <Avatar className="h-9 w-9 bg-muted animate-pulse" />
                    </div>
                    <div className="flex-1 space-y-1">
                        <div className="h-4 w-3/4 rounded bg-muted animate-pulse" />
                        <div className="h-3 w-1/2 rounded bg-muted animate-pulse" />
                    </div>
                </div>
            </DropdownMenuItem>
        );
    }
    
    const time = swipe.timestamp ? formatDistanceToNow(swipe.timestamp.toDate(), { addSuffix: true }) : 'a while ago';
    const isSuperLike = swipe.direction === 'up';

    return (
        <DropdownMenuItem asChild className="p-2 cursor-pointer">
            <Link href={`/profile/${liker.id}`}>
                <div className="flex items-start gap-3">
                    <div className="relative">
                        <Avatar className="h-9 w-9">
                            {liker.photos?.[0] ? <AvatarImage src={liker.photos[0]} alt={liker.name} /> : <AvatarFallback><Sparkles className="h-5 w-5 text-primary"/></AvatarFallback>}
                        </Avatar>
                        <div className="absolute -bottom-1 -right-1 p-0.5 bg-background rounded-full">
                            {isSuperLike ? <Star className="h-4 w-4 text-blue-500 fill-blue-500" /> : <Heart className="h-4 w-4 text-primary fill-primary" />}
                        </div>
                    </div>
                    <div className="flex-1">
                        <p className="text-sm">
                            <span className="font-semibold">{liker.name}</span> {isSuperLike ? 'super liked you!' : 'liked you!'}
                        </p>
                        <p className="text-xs text-muted-foreground">{time}</p>
                    </div>
                </div>
            </Link>
        </DropdownMenuItem>
    );
}


function MatchNotificationItem({ conversation, currentUserId }: { conversation: Conversation, currentUserId: string }) {
    const firestore = useFirestore();
    const participantId = conversation.participants.find(p => p !== currentUserId);

    const { data: participant, loading } = useDoc<User>(
        firestore && participantId ? doc(firestore, 'users', participantId) : null
    );

    if (loading || !participant) {
        return (
             <DropdownMenuItem asChild className="p-2 cursor-pointer">
                <div className="flex items-start gap-3 w-full">
                     <div className="relative">
                        <Avatar className="h-9 w-9 bg-muted animate-pulse" />
                    </div>
                    <div className="flex-1 space-y-1">
                        <div className="h-4 w-3/4 rounded bg-muted animate-pulse" />
                        <div className="h-3 w-1/2 rounded bg-muted animate-pulse" />
                    </div>
                </div>
            </DropdownMenuItem>
        );
    }
    
    const timestamp = conversation.createdAt;
    const time = timestamp ? formatDistanceToNow(timestamp.toDate(), { addSuffix: true }) : 'a while ago';
    
    return (
        <DropdownMenuItem asChild className="p-2 cursor-pointer">
            <Link href={`/chat/${participant.id}`}>
                <div className="flex items-start gap-3">
                    <div className="relative">
                        <Avatar className="h-9 w-9">
                            {participant.photos?.[0] ? <AvatarImage src={participant.photos[0]} alt={participant.name} /> : <AvatarFallback><Sparkles className="h-5 w-5 text-primary"/></AvatarFallback>}
                        </Avatar>
                        <div className="absolute -bottom-1 -right-1 p-0.5 bg-background rounded-full">
                            <Heart className="h-4 w-4 text-primary fill-primary" />
                        </div>
                    </div>
                    <div className="flex-1">
                        <p className="text-sm">
                            You matched with <span className="font-semibold">{participant.name}</span>!
                        </p>
                        <p className="text-xs text-muted-foreground">{time}</p>
                    </div>
                </div>
            </Link>
        </DropdownMenuItem>
    );
}


export function AppHeader() {
  const { user: currentUser, userData } = useUser();
  const firestore = useFirestore();

  const [hasUnreadNotifications, setHasUnreadNotifications] = useState(false);
  const [hasUnreadMessages, setHasUnreadMessages] = useState(false);

  // Query for conversations to find new matches
  const conversationsQuery = useMemo(() => {
    if (!firestore || !currentUser) return null;
    return query(
      collection(firestore, `userConversations/${currentUser.uid}/conversations`),
      where('participants', 'array-contains', currentUser.uid)
    );
  }, [firestore, currentUser]);

  const { data: conversations, loading: conversationsLoading } = useCollection<Conversation>(conversationsQuery);

  // Query for incoming likes using a collection group query
  const likesQuery = useMemo(() => {
    if (!firestore || !currentUser) return null;
    return query(
        collectionGroup(firestore, 'likes'),
        where('swipedId', '==', currentUser.uid),
        orderBy('timestamp', 'desc')
    );
  }, [firestore, currentUser]);

  const { data: incomingLikes, loading: likesLoading } = useCollection<Swipe>(likesQuery);

  const allNotifications = useMemo(() => {
    const notifications: (Conversation | Swipe)[] = [];

    // Add match notifications (new conversations without messages)
    if (conversations) {
        const matchNotifications = conversations.filter(c => !c.lastMessage);
        notifications.push(...matchNotifications);
    }
    
    // Add "like" notifications
    if (incomingLikes) {
        notifications.push(...incomingLikes);
    }

    // Sort all notifications by timestamp
    return notifications.sort((a, b) => {
        const timeA = (a as any).timestamp?.toDate() || (a as any).createdAt?.toDate() || 0;
        const timeB = (b as any).timestamp?.toDate() || (b as any).createdAt?.toDate() || 0;
        return timeB - timeA;
    });

  }, [conversations, incomingLikes]);


  const showWelcomeNotification = useMemo(() => {
    if (!userData || !userData.onboardingComplete || !userData.createdAt) return false;
    
    const createdAt = userData.createdAt.toDate();
    const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000);
    return createdAt > fiveMinutesAgo;

  }, [userData]);

  useEffect(() => {
    if (!conversations || !currentUser) {
        setHasUnreadMessages(false);
    } else {
        const newUnreadMessages = conversations.some(convo => 
            convo.lastMessage && 
            convo.lastMessage.senderId !== currentUser.uid
        );
        setHasUnreadMessages(newUnreadMessages);
    }

    const hasNewLikesOrMatches = allNotifications.length > 0;
    setHasUnreadNotifications(hasNewLikesOrMatches || showWelcomeNotification);

  }, [conversations, currentUser, showWelcomeNotification, allNotifications]);


  const handleNotificationOpenChange = (open: boolean) => {
    if (open && hasUnreadNotifications) {
      setHasUnreadNotifications(false);
    }
  }

  const loading = conversationsLoading || likesLoading;


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
        <Button asChild variant="ghost" size="icon" className="rounded-full relative text-foreground">
            <Link href="/chat">
                <MessageSquareText className="h-5 w-5"/>
                <span className="sr-only">Chat</span>
                 {hasUnreadMessages && (
                  <span className="absolute top-0 right-0 block h-2 w-2 rounded-full bg-primary ring-2 ring-background" />
                )}
            </Link>
        </Button>
        <DropdownMenu onOpenChange={handleNotificationOpenChange}>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="rounded-full relative text-foreground">
                    <Bell className="h-5 w-5"/>
                    <span className="sr-only">Notifications</span>
                    {hasUnreadNotifications && (
                      <span className="absolute top-0 right-0 block h-2 w-2 rounded-full bg-primary ring-2 ring-background" />
                    )}
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-80" align="end">
                <DropdownMenuLabel>Notifications</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <div className="flex flex-col gap-1">
                    {showWelcomeNotification && (
                         <DropdownMenuItem asChild className="p-2 cursor-pointer">
                            <Link href={welcomeNotification.href}>
                                <div className="flex items-start gap-3">
                                    <div className="relative">
                                        <Avatar className="h-9 w-9">
                                            <AvatarFallback><Sparkles className="h-5 w-5 text-primary"/></AvatarFallback>
                                        </Avatar>
                                        <div className="absolute -bottom-1 -right-1 p-0.5 bg-background rounded-full">
                                            <Sparkles className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                                        </div>
                                    </div>
                                    <div className="flex-1">
                                        <p className="text-sm font-semibold">{welcomeNotification.message}</p>
                                        <p className="text-xs text-muted-foreground">{welcomeNotification.time}</p>
                                    </div>
                                </div>
                            </Link>
                        </DropdownMenuItem>
                    )}

                    {loading && <div className="flex justify-center p-4"><Loader2 className="h-5 w-5 animate-spin"/></div>}

                    {currentUser && allNotifications.map(item => {
                        if ('participants' in item) { // It's a Conversation (match)
                            return <MatchNotificationItem key={`match-${item.id}`} conversation={item} currentUserId={currentUser.uid} />
                        }
                        if ('swiperId' in item) { // It's a Swipe (like)
                            return <LikeNotificationItem key={`like-${item.id}`} swipe={item} />
                        }
                        return null;
                    })}

                    {!loading && !showWelcomeNotification && allNotifications.length === 0 && (
                        <p className="p-4 text-sm text-center text-muted-foreground">No new notifications.</p>
                    )}
                </div>
            </DropdownMenuContent>
        </DropdownMenu>
        <ThemeToggle className="text-foreground" />
        <UserNav />
      </div>
    </header>
  );
}
