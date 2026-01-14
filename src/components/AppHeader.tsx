
"use client";

import { useMemo, useState, useEffect, useCallback } from "react";
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
import { collection, query, where, doc, orderBy, updateDoc } from "firebase/firestore";
import type { Conversation, User, Notification, NotificationItem } from "@/lib/types";
import { formatDistanceToNow } from "date-fns";

type CombinedNotification = (NotificationItem & { fromUser?: User });

function NotificationItem({ notification }: { notification: CombinedNotification }) {
    const { fromUser } = notification;

    if (!fromUser) {
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
    
    const time = formatDistanceToNow(new Date(notification.createdAt), { addSuffix: true });
    
    let icon, message, link;

    switch(notification.type) {
        case 'like':
            icon = notification.isSuperLike ? <Star className="h-4 w-4 text-blue-500 fill-blue-500" /> : <Heart className="h-4 w-4 text-primary fill-primary" />;
            message = <p className="text-sm"><span className="font-semibold">{fromUser.name}</span> {notification.isSuperLike ? 'super liked you!' : 'liked you!'}</p>;
            link = `/profile/${fromUser.id}`;
            break;
        case 'match':
             icon = <Heart className="h-4 w-4 text-primary fill-primary" />;
             message = <p className="text-sm">You matched with <span className="font-semibold">{fromUser.name}</span>!</p>;
             link = `/chat/${fromUser.id}`;
            break;
        default:
             icon = <Sparkles className="h-4 w-4 text-yellow-500 fill-yellow-500" />;
             message = <p className="text-sm font-semibold">Welcome to LinkUp9ja!</p>;
             link = '/welcome';
    }


    return (
        <DropdownMenuItem asChild className={cn("p-2 cursor-pointer", !notification.read && "bg-primary/5")}>
            <Link href={link}>
                <div className="flex items-start gap-3 w-full">
                    <div className="relative">
                        <Avatar className="h-9 w-9">
                            {fromUser.photos?.[0] ? <AvatarImage src={fromUser.photos[0]} alt={fromUser.name} /> : <AvatarFallback><Sparkles className="h-5 w-5 text-primary"/></AvatarFallback>}
                        </Avatar>
                        <div className="absolute -bottom-1 -right-1 p-0.5 bg-background rounded-full">
                            {icon}
                        </div>
                    </div>
                    <div className="flex-1">
                        {message}
                        <p className="text-xs text-muted-foreground">{time}</p>
                    </div>
                </div>
            </Link>
        </DropdownMenuItem>
    );
}

export function AppHeader() {
  const { user: currentUser } = useUser();
  const firestore = useFirestore();

  const [hasUnreadMessages, setHasUnreadMessages] = useState(false);
  
  const conversationsQuery = useMemo(() => {
    if (!firestore || !currentUser) return null;
    return query(
      collection(firestore, `userConversations/${currentUser.uid}/conversations`),
      where('participants', 'array-contains', currentUser.uid)
    );
  }, [firestore, currentUser]);

  const { data: conversations } = useCollection<Conversation>(conversationsQuery);
  
  const notificationsRef = useMemo(() => {
      if (!firestore || !currentUser) return null;
      return doc(firestore, 'userNotifications', currentUser.uid);
  }, [firestore, currentUser]);

  const { data: notificationsData, loading: notificationsLoading } = useDoc<Notification>(notificationsRef);

  const fromUserIds = useMemo(() => {
      if (!notificationsData?.items) return [];
      return [...new Set(notificationsData.items.map(item => item.fromUserId))];
  }, [notificationsData]);

  const fromUsersQuery = useMemo(() => {
    if (!firestore || fromUserIds.length === 0) return null;
    return query(collection(firestore, 'users'), where('id', 'in', fromUserIds));
  }, [firestore, fromUserIds]);

  const { data: fromUsers, loading: fromUsersLoading } = useCollection<User>(fromUsersQuery);
  
  const fromUsersMap = useMemo(() => {
    if (!fromUsers) return new Map();
    return new Map(fromUsers.map(user => [user.id, user]));
  }, [fromUsers]);

  const combinedNotifications = useMemo(() => {
    if (!notificationsData?.items) return [];
    
    return notificationsData.items
        .map(item => ({
            ...item,
            fromUser: fromUsersMap.get(item.fromUserId)
        }))
        .sort((a, b) => b.createdAt - a.createdAt);

  }, [notificationsData, fromUsersMap]);
  
  const hasUnreadNotifications = useMemo(() => 
    notificationsData?.items?.some(item => !item.read) || false
  , [notificationsData]);


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
  }, [conversations, currentUser]);


  const handleNotificationOpenChange = async (open: boolean) => {
    if (open && hasUnreadNotifications && notificationsRef && notificationsData) {
       const updatedItems = notificationsData.items.map(n => ({ ...n, read: true }));
       await updateDoc(notificationsRef, { items: updatedItems });
    }
  }

  const loading = notificationsLoading || fromUsersLoading;


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
                <div className="flex flex-col gap-1 max-h-96 overflow-y-auto">
                    {loading && <div className="flex justify-center p-4"><Loader2 className="h-5 w-5 animate-spin"/></div>}

                    {!loading && combinedNotifications.map(item => (
                       <NotificationItem key={item.id} notification={item} />
                    ))}

                    {!loading && combinedNotifications.length === 0 && (
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
