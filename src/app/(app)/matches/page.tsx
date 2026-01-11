
import Image from 'next/image';
import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/card';
import { conversations, users } from '@/lib/data';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { BadgeCheck, MessageSquare, Sparkles } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { cn, formatMatchTime } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';

export default function MatchesPage() {
    const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-headline text-3xl font-bold">Your Matches</h1>
        <p className="text-muted-foreground">
          These are the people you've connected with. Start a conversation!
        </p>
      </div>

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
        {conversations.map(({ id, participant, lastMessage }) => {
          const userImage = PlaceHolderImages.find(p => p.id === participant.photos[0]);
          const isNewMatch = lastMessage.timestamp > twentyFourHoursAgo;
          
          return (
            <Link href={`/chat/${id}`} key={id} className="group">
              <Card className="overflow-hidden transition-all duration-300 hover:scale-105 hover:shadow-lg border-transparent hover:border-primary">
                <CardContent className="relative aspect-square p-0">
                  {userImage && (
                    <Image
                      src={userImage.imageUrl}
                      alt={participant.name}
                      fill
                      className="object-cover"
                      data-ai-hint={userImage.imageHint}
                    />
                  )}
                  {isNewMatch && (
                     <Badge className="absolute top-2 right-2 bg-accent text-accent-foreground border-none">
                        <Sparkles className="h-3 w-3 mr-1" />
                        New
                    </Badge>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent transition-all group-hover:from-black/90" />
                  <div className="absolute inset-x-0 bottom-0 p-3">
                     <div className="flex items-center gap-1.5">
                      <p className="font-semibold text-primary-foreground">{participant.name}</p>
                      {participant.isVerified && <BadgeCheck className="h-4 w-4 text-blue-400 fill-primary-foreground" />}
                    </div>
                     <p className="text-xs text-primary-foreground/80 mt-1">
                        Matched {formatMatchTime(lastMessage.timestamp)}
                    </p>
                  </div>
                   <div className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 transition-opacity group-hover:opacity-100">
                        <MessageSquare className="h-8 w-8 text-white" />
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
