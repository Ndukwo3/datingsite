
import { SidebarTrigger } from "@/components/ui/sidebar";
import { UserNav } from "@/components/UserNav";
import { Button } from "./ui/button";
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
import { buttonVariants } from "./ui/button";
import { cn } from "@/lib/utils";

const notifications = [
    {
        id: 'welcome',
        type: 'welcome',
        user: { name: 'LinkUp9ja', image: '' },
        message: 'Welcome to LinkUp9ja! Check out our community rules.',
        time: 'Just now',
        href: '/welcome'
    },
    {
        id: '1',
        type: 'match',
        user: { id: 'user-3', name: 'Chioma', image: 'https://images.unsplash.com/photo-1756485161657-e005fc9e4393?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHw2fHxhJTIwbmlnZXJpYW4lMjBsYWR5fGVufDB8fHx8MTc2ODA3MTc4MHww&ixlib=rb-4.1.0&q=80&w=1080' },
        time: '5m ago',
        href: '/profile/user-3'
    },
    {
        id: '2',
        type: 'message',
        user: { id: 'user-2', name: 'Bolu', image: 'https://images.unsplash.com/photo-1589635823089-774fca28fe13?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHw5fHxhJTIwbmlnZXJpYSUyMGd1eXxlbnwwfHx8fDE3NjgwNzE2OTh8MA&ixlib=rb-4.1.0&q=80&w=1080' },
        message: 'Maybe I can play for you sometime?',
        time: '2h ago',
        href: '/chat/user-2'
    }
]

export function AppHeader() {
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
                <Button variant="ghost" size="icon" className="rounded-full relative">
                    <Bell className="h-5 w-5"/>
                    <span className="sr-only">Notifications</span>
                    {notifications.length > 0 && (
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
                                            {notif.user.image ? <AvatarImage src={notif.user.image} alt={notif.user.name} /> : <AvatarFallback><Sparkles className="h-5 w-5 text-primary"/></AvatarFallback>}
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
        <ThemeToggle />
        <UserNav />
      </div>
    </header>
  );
}
