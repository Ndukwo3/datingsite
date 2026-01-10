import Image from 'next/image';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import type { User } from '@/lib/types';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { CheckCircle, MapPin } from 'lucide-react';

type ProfileCardProps = {
  user: User;
};

export function ProfileCard({ user }: ProfileCardProps) {
  const userImage = PlaceHolderImages.find(p => p.id === user.photos[0]);

  return (
    <Card className="relative aspect-[3/4.5] w-full max-w-sm overflow-hidden rounded-2xl shadow-lg">
      {userImage && (
        <Image
          src={userImage.imageUrl}
          alt={user.name}
          fill
          className="object-cover"
          data-ai-hint={userImage.imageHint}
        />
      )}
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
      <CardContent className="absolute bottom-0 w-full p-6 text-primary-foreground">
        <div className="flex items-center gap-2">
            <h2 className="font-headline text-3xl font-bold">{user.name}, {user.age}</h2>
            {user.isVerified && <CheckCircle className="h-6 w-6 text-blue-400 fill-primary-foreground" />}
        </div>
        <p className="mt-1 flex items-center gap-1.5 text-sm text-primary-foreground/80">
          <MapPin className="h-4 w-4" /> {user.location}
        </p>
        <p className="mt-4 text-sm leading-relaxed">{user.bio}</p>
        <div className="mt-4 flex flex-wrap gap-2">
          {user.interests.slice(0, 4).map((interest) => (
            <Badge key={interest} variant="secondary" className="bg-primary-foreground/20 text-primary-foreground backdrop-blur-sm">
              {interest}
            </Badge>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
