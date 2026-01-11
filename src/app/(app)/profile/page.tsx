
'use client';

import { currentUser } from '@/lib/data';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Image from 'next/image';
import { Briefcase, ChevronRight, CircleUser, Crown, Edit, Eye, GraduationCap, Heart, HelpCircle, KeyRound, MapPin, MessageSquare, Bell, ShieldCheck, Trash2, Upload, User, UserCheck } from 'lucide-react';
import Link from 'next/link';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';

export default function ProfilePage() {
    const userImage = PlaceHolderImages.find(p => p.id === currentUser.photos[0]);

  return (
    <div className="space-y-8">
      <h1 className="font-headline text-3xl font-bold">My Profile</h1>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        {/* Left Column */}
        <div className="col-span-1 space-y-8 lg:col-span-2">

            {/* Profile Header Card */}
             <Card className="overflow-hidden">
                <CardContent className="p-6">
                    <div className="flex flex-col items-center gap-6 sm:flex-row">
                        <Avatar className="h-24 w-24 border-4 border-primary">
                            {userImage && <AvatarImage src={userImage.imageUrl} alt={currentUser.name} />}
                            <AvatarFallback>{currentUser.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div className="flex-1 text-center sm:text-left">
                            <div className="flex items-center justify-center sm:justify-start gap-2">
                                <h2 className="text-2xl font-bold">{currentUser.name}, {currentUser.age}</h2>
                                <Badge variant="outline" className="border-green-500 text-green-500">Free Plan</Badge>
                            </div>
                            <p className="mt-1 flex items-center justify-center sm:justify-start gap-1.5 text-muted-foreground">
                                <MapPin className="h-4 w-4" /> {currentUser.location}
                            </p>
                             <div className="mt-4 flex justify-center sm:justify-start gap-6 text-center">
                                <div>
                                    <p className="text-xl font-bold">47</p>
                                    <p className="text-xs text-muted-foreground">Matches</p>
                                </div>
                                <div>
                                    <p className="text-xl font-bold">128</p>
                                    <p className="text-xs text-muted-foreground">Likes Sent</p>
                                </div>
                                <div>
                                    <p className="text-xl font-bold">12</p>
                                    <p className="text-xs text-muted-foreground">Super Likes</p>
                                </div>
                            </div>
                        </div>
                        <Button asChild className="w-full sm:w-auto">
                            <Link href="/profile/edit">
                                <Edit className="mr-2 h-4 w-4" /> Edit Profile
                            </Link>
                        </Button>
                    </div>
                </CardContent>
            </Card>

          {/* My Photos Card */}
          <Card>
            <CardHeader className="flex-row items-center justify-between">
              <CardTitle>My Photos</CardTitle>
              <Button variant="ghost" size="sm">
                <Upload className="mr-2 h-4 w-4" />
                Add Photo
              </Button>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
                {currentUser.photos.map((photoId, index) => {
                  const photo = PlaceHolderImages.find(p => p.id === photoId);
                  return (
                    <div key={index} className="group relative aspect-square">
                      {photo && (
                        <Image
                          src={photo.imageUrl}
                          alt={`Profile photo ${index + 1}`}
                          fill
                          className="rounded-lg object-cover"
                        />
                      )}
                      {index === 0 && <Badge className="absolute top-2 left-2">Main</Badge>}
                    </div>
                  );
                })}
                <div className="flex aspect-square cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-muted-foreground/50 text-muted-foreground transition-colors hover:bg-muted">
                  <Upload className="h-8 w-8" />
                  <span className="mt-2 text-sm">Add Photo</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* About Me Card */}
          <Card>
            <CardHeader className="flex-row items-center justify-between">
              <CardTitle>About Me</CardTitle>
              <Button variant="ghost" size="icon"><Edit className="h-4 w-4" /></Button>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">{currentUser.bio}</p>
            </CardContent>
          </Card>
          
          {/* Basics Card */}
           <Card>
            <CardHeader className="flex-row items-center justify-between">
              <CardTitle>Basics</CardTitle>
               <Button variant="ghost" size="icon"><Edit className="h-4 w-4" /></Button>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="flex items-center gap-3 text-muted-foreground">
                    <Briefcase className="h-5 w-5 text-primary" />
                    <span>{currentUser.job}</span>
                </div>
                 <div className="flex items-center gap-3 text-muted-foreground">
                    <GraduationCap className="h-5 w-5 text-primary" />
                    <span>{currentUser.education}</span>
                </div>
                <div className="flex items-center gap-3 text-muted-foreground">
                    <MapPin className="h-5 w-5 text-primary" />
                    <span>{currentUser.location}</span>
                </div>
            </CardContent>
          </Card>


          {/* Interests Card */}
          <Card>
            <CardHeader className="flex-row items-center justify-between">
              <CardTitle>Interests</CardTitle>
              <Button variant="ghost" size="icon"><Edit className="h-4 w-4" /></Button>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {currentUser.interests.map((interest) => (
                  <Badge key={interest} variant="secondary">{interest}</Badge>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column */}
        <div className="col-span-1 space-y-8">
            {/* Profile Status Card */}
            <Card>
                <CardHeader>
                    <CardTitle>Profile Status</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="flex items-center justify-between">
                        <div className='flex items-center gap-2'>
                            <Eye className="h-5 w-5 text-muted-foreground" />
                            <span className="font-medium">Visible</span>
                        </div>
                        <Switch defaultChecked />
                    </div>
                    <p className="text-sm text-muted-foreground mt-2">Your profile is visible in discovery.</p>
                </CardContent>
            </Card>

            {/* Quick Actions Card */}
            <Card>
                <CardHeader>
                    <CardTitle>Quick Actions</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                    <Link href="#" className="flex items-center justify-between rounded-md p-3 hover:bg-muted">
                        <div className='flex items-center gap-3'>
                            <ShieldCheck className="h-5 w-5 text-primary" />
                            <span className='font-medium'>Get Verified</span>
                        </div>
                        <ChevronRight className="h-5 w-5 text-muted-foreground" />
                    </Link>
                     <Link href="#" className="flex items-center justify-between rounded-md p-3 hover:bg-muted">
                        <div className='flex items-center gap-3'>
                            <KeyRound className="h-5 w-5 text-primary" />
                            <span className='font-medium'>Privacy Settings</span>
                        </div>
                        <ChevronRight className="h-5 w-5 text-muted-foreground" />
                    </Link>
                     <Link href="#" className="flex items-center justify-between rounded-md p-3 hover:bg-muted">
                        <div className='flex items-center gap-3'>
                            <Bell className="h-5 w-5 text-primary" />
                            <span className='font-medium'>Notifications</span>
                        </div>
                        <ChevronRight className="h-5 w-5 text-muted-foreground" />
                    </Link>
                     <Link href="#" className="flex items-center justify-between rounded-md p-3 hover:bg-muted">
                        <div className='flex items-center gap-3'>
                            <HelpCircle className="h-5 w-5 text-primary" />
                            <span className='font-medium'>Help & Support</span>
                        </div>
                        <ChevronRight className="h-5 w-5 text-muted-foreground" />
                    </Link>
                </CardContent>
            </Card>

            {/* Go Premium Card */}
            <Card className="bg-primary-gradient text-primary-foreground text-center">
                <CardHeader>
                    <div className="mx-auto bg-primary-foreground/20 rounded-full p-2 w-fit">
                        <Crown className="h-6 w-6" />
                    </div>
                    <CardTitle className="pt-2">Go Premium</CardTitle>
                    <CardDescription className="text-primary-foreground/80">
                        Get unlimited swipes, see who likes you, and more!
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <Button asChild className="w-full bg-primary-foreground text-primary font-bold hover:bg-primary-foreground/90">
                        <Link href="/premium">Upgrade Now</Link>
                    </Button>
                </CardContent>
            </Card>

            {/* Danger Zone Card */}
            <Card>
                <CardHeader>
                    <CardTitle className="text-destructive">Danger Zone</CardTitle>
                </CardHeader>
                <CardContent>
                    <Button variant="destructive" className="w-full" >
                        <Trash2 className="mr-2 h-4 w-4" />
                        Delete Account
                    </Button>
                </CardContent>
            </Card>
        </div>
      </div>
    </div>
  );
}
