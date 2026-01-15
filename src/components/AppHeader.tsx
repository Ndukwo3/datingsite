
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

function NotificationItem({ notification, currentUser }: { notification: CombinedNotification, currentUser: User | null }) {
    const { fromUser } = notification;
    
    const time = formatDistanceToNow(new Date(notification.createdAt), { addSuffix: true });
    
    let icon, message, link, avatar, avatarFallback;

    switch(notification.type) {
        case 'like':
            if (!fromUser) return null; // Likes must have a fromUser
            icon = notification.isSuperLike ? <Star className="h-4 w-4 text-blue-500 fill-blue-500" /> : <Heart className="h-4 w-4 text-primary fill-primary" />;
            message = <p className="text-sm"><span className="font-semibold">{fromUser.name}</span> {notification.isSuperLike ? 'super liked you!' : 'liked you!'}</p>;
            link = `/profile/${fromUser.id}`;
            avatar = fromUser.photos?.[0];
            avatarFallback = fromUser.name?.charAt(0);
            break;
        case 'match':
             if (!fromUser) return null; // Matches must have a fromUser
             icon = <Heart className="h-4 w-4 text-primary fill-primary" />;
             message = <p className="text-sm">You matched with <span className="font-semibold">{fromUser.name}</span>!</p>;
             link = `/chat/${fromUser.id}`;
             avatar = fromUser.photos?.[0];
             avatarFallback = fromUser.name?.charAt(0);
            break;
        case 'welcome':
             icon = <Sparkles className="h-4 w-4 text-yellow-500 fill-yellow-500" />;
             message = <p className="text-sm font-semibold">Welcome to LinkUp9ja!</p>;
             link = '/welcome';
             avatar = null; // No user avatar for welcome message
             avatarFallback = <Sparkles className="h-5 w-5 text-primary"/>;
             break;
        default:
            return null; // Should not happen
    }


    return (
        <DropdownMenuItem asChild className={cn("p-2 cursor-pointer", !notification.read && "bg-primary/5")}>
            <Link href={link}>
                <div className="flex items-start gap-3 w-full">
                    <div className="relative">
                        <Avatar className="h-9 w-9">
                            {avatar ? <AvatarImage src={avatar} /> : <AvatarFallback>{avatarFallback}</AvatarFallback>}
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
      // Filter out system messages that might not have a fromUserId or have self as fromUserId for welcome
      return [...new Set(notificationsData.items.map(item => item.fromUserId).filter(id => id && id !== currentUser?.uid))];
  }, [notificationsData, currentUser]);

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
        .map(item => {
            if (item.type === 'welcome') {
                return item; // Welcome notification has no 'fromUser'
            }
            return {
                ...item,
                fromUser: fromUsersMap.get(item.fromUserId)
            }
        })
        .sort((a, b) => b.createdAt - a.createdAt) as CombinedNotification[];

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
            convo.lastMessage.senderId !== currentUser.uid &&
            // A simple unread logic, assuming no explicit 'read' field on lastMessage
            new Date(convo.lastMessage.timestamp.seconds * 1000) > (convo.lastRead?.[currentUser.uid] || 0)
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
                       <NotificationItem key={item.id} notification={item} currentUser={currentUser as User} />
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

    