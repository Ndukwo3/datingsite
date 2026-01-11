
import Image from 'next/image';
import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/card';
import { users } from '@/lib/data';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { formatActivity } from '@/lib/utils';
import { cn } from '@/lib/utils';
import { MapPin } from 'lucide-react';

export default function FeedPage() {
  // Sort users by activity: online first, then by most recent activity
  const sortedUsers = [...users].sort((a, b) => {
    if (a.lastSeen === 'online' && b.lastSeen !== 'online') return -1;
    if (a.lastSeen !== 'online' && b.lastSeen === 'online') return 1;
    if (a.lastSeen instanceof Date && b.lastSeen instanceof Date) {
      return b.lastSeen.getTime() - a.lastSeen.getTime();
    }
    return 0;
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-headline text-3xl font-bold">Activity Feed</h1>
        <p className="text-muted-foreground">
          See who's online now and who was active recently.
        </p>
      </div>

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
        {sortedUsers.map((user) => {
          const userImage = PlaceHolderImages.find(p => p.id === user.photos[0]);
          const isOnline = user.lastSeen === 'online';
          
          return (
            <Link href={`/profile/${user.id}`} key={user.id}>
              <Card className="overflow-hidden transition-transform duration-300 hover:scale-105 hover:shadow-lg">
                <CardContent className="relative aspect-[3/4.5] p-0">
                  {userImage && (
                    <Image
                      src={userImage.imageUrl}
                      alt={user.name}
                      fill
                      className="object-cover"
                      data-ai-hint={userImage.imageHint}
                    />
                  )}
                  <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 to-transparent p-3 text-primary-foreground">
                    <p className="font-semibold">{user.name}, {user.age}</p>
                     <p className="mt-0.5 flex items-center gap-1 text-xs text-primary-foreground/80">
                      <MapPin className="h-3 w-3" /> {user.location.split(',')[0]}
                    </p>
                    <div className="mt-1.5 flex items-center gap-1.5 text-xs">
                        <div className={cn("h-2 w-2 rounded-full", isOnline ? "bg-green-400" : "bg-gray-400")} />
                        <span>{formatActivity(user.lastSeen)}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
