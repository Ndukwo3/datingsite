
import { notFound } from 'next/navigation';
import Image from 'next/image';
import { users } from '@/lib/data';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { CheckCircle, Heart, MapPin, X } from 'lucide-react';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"

type ProfilePageProps = {
  params: {
    id: string;
  };
};

export default function UserProfilePage({ params }: ProfilePageProps) {
  const user = users.find(u => u.id === params.id);

  if (!user) {
    notFound();
  }

  const userImages = user.photos.map(photoId => PlaceHolderImages.find(p => p.id === photoId)).filter(Boolean);

  return (
    <div className="mx-auto max-w-2xl space-y-8 pb-12">
      <Card className="overflow-hidden rounded-2xl">
        <Carousel className="w-full">
            <CarouselContent>
                {userImages.map((image, index) => (
                    <CarouselItem key={index}>
                        <div className="relative aspect-video w-full">
                            {image && (
                                <Image
                                src={image.imageUrl}
                                alt={`${user.name}'s photo ${index + 1}`}
                                fill
                                className="object-cover"
                                />
                            )}
                        </div>
                    </CarouselItem>
                ))}
            </CarouselContent>
            {userImages.length > 1 && (
                <>
                    <CarouselPrevious className="left-4" />
                    <CarouselNext className="right-4" />
                </>
            )}
        </Carousel>
      </Card>

      <div className="space-y-6 px-4 sm:px-0">
        <div className="space-y-2">
            <div className="flex items-center gap-3">
                <h1 className="font-headline text-4xl font-bold">{user.name}, {user.age}</h1>
                 {user.isVerified && <CheckCircle className="h-7 w-7 text-blue-500 fill-blue-100" />}
            </div>
            <p className="flex items-center gap-2 text-muted-foreground">
                <MapPin className="h-5 w-5" />
                {user.location}
            </p>
        </div>

        <div className="space-y-2">
            <h2 className="text-xl font-semibold font-headline">About Me</h2>
            <p className="text-muted-foreground leading-relaxed">
                {user.bio}
            </p>
        </div>

        <div className="space-y-2">
            <h2 className="text-xl font-semibold font-headline">Interests</h2>
            <div className="flex flex-wrap gap-2">
                {user.interests.map(interest => (
                    <Badge key={interest} variant="secondary">{interest}</Badge>
                ))}
            </div>
        </div>

        <div className="fixed bottom-0 left-0 right-0 z-10 border-t bg-background/90 p-4 backdrop-blur-sm sm:static sm:z-auto sm:border-t-0 sm:bg-transparent sm:p-0">
            <div className="mx-auto flex max-w-sm items-center justify-center gap-4">
            <Button
                variant="outline"
                size="icon"
                className="h-20 w-20 rounded-full border-2 border-yellow-500 text-yellow-500 shadow-lg transition-transform duration-300 hover:scale-110 hover:bg-yellow-500/10"
                aria-label="Dislike"
            >
                <X className="h-10 w-10" />
            </Button>
            <Button
                size="icon"
                className="h-24 w-24 rounded-full bg-primary text-primary-foreground shadow-xl transition-transform duration-300 hover:scale-110"
                aria-label="Like"
            >
                <Heart className="h-12 w-12 fill-current" />
            </Button>
            </div>
        </div>
      </div>
    </div>
  );
}
