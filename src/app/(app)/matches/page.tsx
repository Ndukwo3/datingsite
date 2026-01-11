
import Image from 'next/image';
import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/card';
import { conversations } from '@/lib/data';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { BadgeCheck } from 'lucide-react';

export default function MatchesPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-headline text-3xl font-bold">Your Matches</h1>
        <p className="text-muted-foreground">
          These are the people you've connected with. Start a conversation!
        </p>
      </div>

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
        {conversations.map(({ id, participant }) => {
          const userImage = PlaceHolderImages.find(p => p.id === participant.photos[0]);
          return (
            <Link href={`/chat/${id}`} key={id}>
              <Card className="overflow-hidden transition-transform duration-300 hover:scale-105 hover:shadow-lg">
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
                  <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent p-3">
                    <div className="flex items-center gap-1.5">
                      <p className="font-semibold text-primary-foreground">{participant.name}</p>
                      {participant.isVerified && <BadgeCheck className="h-4 w-4 text-blue-400 fill-primary-foreground" />}
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
