
'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button, buttonVariants } from '@/components/ui/button';
import Image from 'next/image';
import { Briefcase, ChevronRight, Crown, Edit, Eye, GraduationCap, HelpCircle, KeyRound, Loader2, MapPin, Bell, ShieldCheck, Trash2, Upload, User as UserIcon, X, Star, Ruler, HeartHandshake, Dumbbell, GlassWater, Cigarette } from 'lucide-react';
import Link from 'next/link';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { useUser, useFirestore } from '@/firebase';
import { doc, updateDoc, deleteDoc } from 'firebase/firestore';
import { useRouter } from 'next/navigation';
import { isValidHttpUrl } from '@/lib/is-valid-url';
import { useEffect, useState, useRef } from 'react';
import { useToast } from '@/hooks/use-toast';
import imageCompression from 'browser-image-compression';
import { cn } from '@/lib/utils';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { getAuth, deleteUser } from 'firebase/auth';


export default function ProfilePage() {
    const { user: authUser, loading: authLoading, userData, refreshUserData } = useUser();
    const router = useRouter();
    const { toast } = useToast();
    const firestore = useFirestore();
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [uploading, setUploading] = useState(false);
    const [isVisible, setIsVisible] = useState(true);

    useEffect(() => {
      if (!authLoading && (!authUser || (userData && userData.onboardingComplete === false))) {
          router.push('/onboarding');
      }
    }, [authLoading, authUser, userData, router]);

    if (authLoading || !userData) {
        return <div className="flex h-full items-center justify-center"><Loader2 className="h-8 w-8 animate-spin" /></div>;
    }
    
    const currentUser = userData;
    const userImage = currentUser.photos?.[0];

    const fileToDataUri = (file: File): Promise<string> => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () => resolve(reader.result as string);
            reader.onerror = reject;
            reader.readAsDataURL(file);
        });
    }

    const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files || !firestore || !authUser || !userData) return;
    
        const files = Array.from(e.target.files);
        if (userData.photos.length + files.length > 6) {
            toast({ title: "You can upload a maximum of 6 photos.", variant: "destructive" });
            return;
        }
    
        setUploading(true);
        const newPhotoBase64s: string[] = [];
    
        try {
            for (const file of files) {
                const compressionOptions = {
                    maxSizeMB: 0.2,
                    maxWidthOrHeight: 1080,
                    useWebWorker: true,
                };
                const compressedFile = await imageCompression(file, compressionOptions);
                const photoDataUri = await fileToDataUri(compressedFile);
                newPhotoBase64s.push(photoDataUri);
            }
    
            if (newPhotoBase64s.length > 0) {
                const userDocRef = doc(firestore, 'users', authUser.uid);
                await updateDoc(userDocRef, {
                    photos: [...userData.photos, ...newPhotoBase64s]
                });
                await refreshUserData();
                toast({ title: `${newPhotoBase64s.length} photo(s) uploaded successfully!` });
            }
    
        } catch (error: any) {
            toast({
                title: "Upload failed",
                description: error.message || "Could not upload photos. Please try again.",
                variant: "destructive"
            });
        } finally {
            setUploading(false);
            if (fileInputRef.current) {
                fileInputRef.current.value = "";
            }
        }
    };
    
    const handleDeletePhoto = async (photoUrlToDelete: string) => {
        if (!firestore || !authUser || !userData) return;

        const updatedPhotos = userData.photos.filter(url => url !== photoUrlToDelete);
        const userDocRef = doc(firestore, 'users', authUser.uid);

        try {
            await updateDoc(userDocRef, { photos: updatedPhotos });
            await refreshUserData();
            toast({ title: "Photo removed." });
        } catch (error) {
            toast({ title: "Error", description: "Could not remove photo.", variant: "destructive" });
        }
    };

    const handleSetMainPhoto = async (photoUrlToSetAsMain: string) => {
        if (!firestore || !authUser || !userData) return;

        const otherPhotos = userData.photos.filter(url => url !== photoUrlToSetAsMain);
        const newPhotoOrder = [photoUrlToSetAsMain, ...otherPhotos];
        const userDocRef = doc(firestore, 'users', authUser.uid);

        try {
            await updateDoc(userDocRef, { photos: newPhotoOrder });
            await refreshUserData();
            toast({ title: "Main photo updated." });
        } catch (error) {
            toast({ title: "Error", description: "Could not update main photo.", variant: "destructive" });
        }
    };

    const handleDeleteAccount = async () => {
        if (!authUser || !firestore) return;
        const auth = getAuth();
        const userDocRef = doc(firestore, 'users', authUser.uid);
        
        try {
            // First, delete the user's document from Firestore
            await deleteDoc(userDocRef);

            // Then, delete the user from Firebase Authentication
            await deleteUser(auth.currentUser!);
            
            toast({ title: "Account Deleted", description: "Your account has been permanently deleted." });
            router.push('/signup'); // Redirect to a public page

        } catch (error: any) {
            console.error("Account deletion error:", error);
            let description = "Could not delete your account. Please try again.";
            if (error.code === 'auth/requires-recent-login') {
                description = "This action requires you to have recently logged in. Please log out and log back in to delete your account."
            }
            toast({ title: "Deletion Failed", description, variant: 'destructive', duration: 7000 });
        }
    };


  return (
    <div className="space-y-8">
      <h1 className="font-headline text-3xl font-bold">My Profile</h1>
      <input type="file" ref={fileInputRef} onChange={handlePhotoUpload} accept="image/*" multiple className="hidden" />

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        {/* Left Column */}
        <div className="col-span-1 space-y-8 lg:col-span-2">

            {/* Profile Header Card */}
             <Card className="overflow-hidden">
                <CardContent className="p-6">
                    <div className="flex flex-col items-center gap-6 sm:flex-row">
                        <Avatar className="h-24 w-24 border-4 border-primary">
                            {isValidHttpUrl(userImage) ? (
                               <AvatarImage src={userImage} alt={currentUser.name} />
                            ) : (
                                <AvatarFallback>{currentUser.name.charAt(0)}</AvatarFallback>
                            )}
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
               <Button variant="ghost" size="sm" onClick={() => fileInputRef.current?.click()} disabled={uploading}>
                {uploading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Upload className="mr-2 h-4 w-4" />}
                Add Photo
              </Button>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
                {currentUser.photos.map((photoUrl, index) => (
                    <div key={index} className="group relative aspect-square">
                        {isValidHttpUrl(photoUrl) ? (
                            <Image
                                src={photoUrl}
                                alt={`Profile photo ${index + 1}`}
                                fill
                                className="rounded-lg object-cover"
                            />
                        ) : (
                            <div className="w-full h-full bg-muted rounded-lg flex items-center justify-center">
                            <UserIcon className="w-10 h-10 text-muted-foreground" />
                            </div>
                        )}
                        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center gap-2">
                             <AlertDialog>
                                <AlertDialogTrigger asChild>
                                    <Button variant="destructive" size="icon" className="h-8 w-8">
                                        <Trash2 className="h-4 w-4"/>
                                    </Button>
                                </AlertDialogTrigger>
                                <AlertDialogContent>
                                    <AlertDialogHeader>
                                    <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                                    <AlertDialogDescription>
                                        This will permanently delete this photo from your profile.
                                    </AlertDialogDescription>
                                    </AlertDialogHeader>
                                    <AlertDialogFooter>
                                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                                    <AlertDialogAction onClick={() => handleDeletePhoto(photoUrl)} className={cn(buttonVariants({variant: 'destructive'}))}>Delete</AlertDialogAction>
                                    </AlertDialogFooter>
                                </AlertDialogContent>
                            </AlertDialog>
                            {index > 0 && (
                                <Button variant="secondary" size="icon" className="h-8 w-8" onClick={() => handleSetMainPhoto(photoUrl)}>
                                    <Star className="h-4 w-4"/>
                                </Button>
                            )}
                        </div>
                         {index === 0 && <Badge className="absolute top-2 left-2">Main</Badge>}
                    </div>
                ))}
                 {currentUser.photos.length < 6 && (
                    <div 
                        className="flex aspect-square cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-muted-foreground/50 text-muted-foreground transition-colors hover:bg-muted"
                        onClick={() => fileInputRef.current?.click()}
                    >
                         {uploading ? <Loader2 className="h-8 w-8 animate-spin" /> : <Upload className="h-8 w-8" />}
                        <span className="mt-2 text-sm text-center">
                            {uploading ? 'Uploading...' : 'Add Photo'}
                        </span>
                    </div>
                 )}
              </div>
            </CardContent>
          </Card>

          {/* About Me Card */}
          <Card>
            <CardHeader className="flex-row items-center justify-between">
              <CardTitle>About Me</CardTitle>
              <Button variant="ghost" size="icon" asChild>
                <Link href="/profile/edit"><Edit className="h-4 w-4" /></Link>
              </Button>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">{currentUser.bio}</p>
            </CardContent>
          </Card>
          
          {/* Basics Card */}
           <Card>
            <CardHeader className="flex-row items-center justify-between">
              <CardTitle>Basics</CardTitle>
               <Button variant="ghost" size="icon" asChild>
                <Link href="/profile/edit"><Edit className="h-4 w-4" /></Link>
              </Button>
            </CardHeader>
            <CardContent className="grid grid-cols-2 gap-4">
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
                 <div className="flex items-center gap-3 text-muted-foreground">
                    <Ruler className="h-5 w-5 text-primary" />
                    <span>{currentUser.height}</span>
                </div>
                 <div className="flex items-center gap-3 text-muted-foreground">
                    <HeartHandshake className="h-5 w-5 text-primary" />
                    <span>{currentUser.relationshipGoal}</span>
                </div>
                 <div className="flex items-center gap-3 text-muted-foreground">
                    <Dumbbell className="h-5 w-5 text-primary" />
                    <span>{currentUser.exercise}</span>
                </div>
                 <div className="flex items-center gap-3 text-muted-foreground">
                    <GlassWater className="h-5 w-5 text-primary" />
                    <span>{currentUser.drinking}</span>
                </div>
                 <div className="flex items-center gap-3 text-muted-foreground">
                    <Cigarette className="h-5 w-5 text-primary" />
                    <span>{currentUser.smoking}</span>
                </div>
            </CardContent>
          </Card>


          {/* Interests Card */}
          <Card>
            <CardHeader className="flex-row items-center justify-between">
              <CardTitle>Interests</CardTitle>
              <Button variant="ghost" size="icon" asChild>
                <Link href="/profile/edit"><Edit className="h-4 w-4" /></Link>
              </Button>
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
                        <Switch checked={isVisible} onCheckedChange={setIsVisible} />
                    </div>
                    <p className="text-sm text-muted-foreground mt-2">
                        {isVisible
                          ? "Your profile is visible to other users in feed."
                          : "Your profile is not visible to anyone in the feed."
                        }
                    </p>
                </CardContent>
            </Card>

            {/* Quick Actions Card */}
            <Card>
                <CardHeader>
                    <CardTitle>Quick Actions</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                    <Dialog>
                        <DialogTrigger asChild>
                            <button className="w-full flex items-center justify-between rounded-md p-3 hover:bg-muted">
                                <div className='flex items-center gap-3'>
                                    <ShieldCheck className="h-5 w-5 text-primary" />
                                    <span className='font-medium'>Get Verified</span>
                                </div>
                                <ChevronRight className="h-5 w-5 text-muted-foreground" />
                            </button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-md text-center">
                            <DialogHeader>
                            <DialogTitle className="font-headline text-2xl">Coming Soon!</DialogTitle>
                            <DialogDescription>
                                We're working hard to bring you profile verification. This feature will help you build more trust in the community. Stay tuned!
                            </DialogDescription>
                            </DialogHeader>
                        </DialogContent>
                    </Dialog>
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
                     <AlertDialog>
                        <AlertDialogTrigger asChild>
                            <Button variant="destructive" className="w-full">
                                <Trash2 className="mr-2 h-4 w-4" />
                                Delete Account
                            </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                            <AlertDialogHeader>
                            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                            <AlertDialogDescription>
                                This action cannot be undone. This will permanently delete your
                                account and remove your data from our servers.
                            </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction
                                onClick={handleDeleteAccount}
                                className={cn(buttonVariants({ variant: "destructive" }))}
                            >
                                Delete
                            </AlertDialogAction>
                            </AlertDialogFooter>
                        </AlertDialogContent>
                    </AlertDialog>
                </CardContent>
            </Card>
        </div>
      </div>
    </div>
  );
}

    