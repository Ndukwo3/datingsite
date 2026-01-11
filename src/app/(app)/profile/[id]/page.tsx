
import { notFound } from 'next/navigation';
import Image from 'next/image';
import { users } from '@/lib/data';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { BadgeCheck, Heart, MapPin, X, Star, Briefcase, GraduationCap, Instagram, Share2, Flag, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

function SpotifyIcon(props: React.SVGProps<SVGSVGElement>) {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 496 512"
            fill="currentColor"
            {...props}
        >
            <path d="M248 8C111.1 8 0 119.1 0 256s111.1 248 248 248 248-111.1 248-248S384.9 8 248 8zm100.7 364.9c-4.2 0-6.8-1.3-10.7-3.6-62.4-37.6-135-46.8-227.9-25.6-2.9 1.3-6.8 1.3-9.4-1.3s-3.6-6.8-1.3-9.4c23.4-14.5 119.6-32.4 186.3-15.6 2.9 1.3 6.8 1.3 9.4 1.3 2.9 0 6.8-1.3 9.4-3.6 2.6-2.6 3.9-6.8 1.3-9.4-23.4-14.5-119.6-32.4-186.3-15.6-2.9 1.3-6.8 1.3-9.4-1.3-2.6-2.6-3.9-6.8-1.3-9.4 23.4-14.5 119.6-32.4 186.3-15.6 2.9 1.3 6.8 1.3 9.4 1.3 2.9 0 6.8-1.3 9.4-3.6 2.6-2.6 3.9-6.8 1.3-9.4-23.4-14.5-119.6-32.4-186.3-15.6-2.9 1.3-6.8 1.3-9.4-1.3-2.6-2.6-3.9-6.8-1.3-9.4 23.4-14.5 119.6-32.4 186.3-15.6-2.9 1.3-6.8 1.3-9.4-1.3s-3.6-6.8-1.3-9.4c93.2-21.2 168.1-12 230.5 25.6 2.9 1.3 6.8 1.3 9.4 1.3 2.9 0 6.8-1.3 9.4-3.6 2.6-2.6 3.9-6.8 1.3-9.4-62.4-37.6-135-46.8-227.9-25.6-2.9 1.3-6.8 1.3-9.4-1.3s-3.6-6.8-1.3-9.4c93.2-21.2 168.1-12 230.5 25.6 2.9 1.3 6.8 1.3 9.4 1.3 2.9 0 6.8-1.3 9.4-3.6 2.6-2.6 3.9-6.8 1.3-9.4-62.4-37.6-135-46.8-227.9-25.6-2.9 1.3-6.8 1.3-9.4-1.3s-3.6-6.8-1.3-9.4c93.2-21.2 168.1-12 230.5 25.6 2.9 1.3 6.8 1.3 9.4 1.3z"/>
        </svg>
    );
}

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

  const userImage = PlaceHolderImages.find(p => p.id === user.photos[0]);

  return (
    <div className="relative flex h-full min-h-screen flex-col md:flex-row">
       <Button asChild variant="ghost" size="icon" className="absolute top-4 left-4 z-20 bg-black/50 text-white hover:bg-black/75 hover:text-white md:hidden">
          <Link href="/feed"><ArrowLeft /></Link>
       </Button>

      {/* Left side: Photo Gallery */}
      <div className="relative md:w-2/5 md:h-screen md:sticky md:top-0 bg-black">
        {userImage && (
            <Image
            src={userImage.imageUrl}
            alt={`${user.name}'s photo`}
            fill
            className="object-cover"
            />
        )}
      </div>

      {/* Right side: Profile Details */}
      <div className="md:w-3/5 p-6 md:p-10 space-y-8 overflow-y-auto">
        <div className="space-y-2">
            <div className="flex items-center gap-3">
                <h1 className="font-headline text-4xl font-bold">{user.name}, {user.age}</h1>
                 {user.isVerified && <BadgeCheck className="h-7 w-7 text-blue-500 fill-blue-100" />}
            </div>
            <p className="flex items-center gap-2 text-muted-foreground">
                <MapPin className="h-5 w-5" />
                {user.location} - 5km away
            </p>
        </div>

        <div className="space-y-3">
            <h2 className="text-xl font-semibold font-headline">About Me</h2>
            <p className="text-muted-foreground leading-relaxed">
                {user.bio}
            </p>
        </div>
        
        <div className="space-y-3">
            <h2 className="text-xl font-semibold font-headline">Basics</h2>
            <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
                <Card className='p-4 bg-muted/50'>
                    <div className='flex items-center gap-3'>
                        <div className='bg-primary/20 text-primary p-2 rounded-lg'><Briefcase/></div>
                        <span>{user.job}</span>
                    </div>
                </Card>
                 <Card className='p-4 bg-muted/50'>
                    <div className='flex items-center gap-3'>
                        <div className='bg-primary/20 text-primary p-2 rounded-lg'><GraduationCap/></div>
                        <span>{user.education}</span>
                    </div>
                </Card>
            </div>
        </div>

        <div className="space-y-3">
            <h2 className="text-xl font-semibold font-headline">Interests</h2>
            <div className="flex flex-wrap gap-2">
                {user.interests.map(interest => (
                    <Badge key={interest} variant="secondary" className="bg-pink-100 dark:bg-pink-900/50 text-pink-700 dark:text-pink-300 border-pink-200/50 dark:border-pink-500/30 text-sm px-3 py-1">{interest}</Badge>
                ))}
            </div>
        </div>
        
        {(user.socials?.instagram || user.socials?.spotify) && (
             <div className="space-y-3">
                <h2 className="text-xl font-semibold font-headline">Connect</h2>
                <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
                   {user.socials?.instagram && (
                     <Card className='p-4 bg-muted/50'>
                        <a href={`https://instagram.com/${user.socials.instagram.substring(1)}`} target="_blank" rel="noopener noreferrer" className='flex items-center gap-3 text-muted-foreground hover:text-foreground'>
                            <Instagram className="text-[#E1306C]" />
                            <span>{user.socials.instagram}</span>
                        </a>
                    </Card>
                   )}
                   {user.socials?.spotify && (
                     <Card className='p-4 bg-muted/50'>
                        <a href="#" className='flex items-center gap-3 text-muted-foreground hover:text-foreground'>
                             <SpotifyIcon className="h-5 w-5 text-[#1DB954]" />
                            <span>{user.socials.spotify}</span>
                        </a>
                    </Card>
                   )}
                </div>
            </div>
        )}
       
        <div className="py-6">
            <div className="mx-auto flex max-w-sm items-center justify-evenly gap-4">
                <Button variant="ghost" size="icon" className='text-muted-foreground h-12 w-12'><Share2/></Button>
                <Button variant="outline" size="icon" className="h-16 w-16 rounded-full border-2 border-yellow-500 text-yellow-500 shadow-lg hover:bg-yellow-500/10" aria-label="Dislike">
                    <X className="h-8 w-8" />
                </Button>
                <Button size="icon" className="h-20 w-20 rounded-full bg-primary text-primary-foreground shadow-xl" aria-label="Like">
                    <Heart className="h-10 w-10 fill-current" />
                </Button>
                <Button size="icon" className="h-16 w-16 rounded-full bg-blue-500 text-white shadow-xl" aria-label="Super Like">
                    <Star className="h-8 w-8 fill-current" />
                </Button>
                <Button variant="ghost" size="icon" className='text-muted-foreground h-12 w-12'><Flag/></Button>
            </div>
        </div>

      </div>
    </div>
  );
}
