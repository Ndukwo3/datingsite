
'use client';

import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import Link from 'next/link';
import { ArrowLeft, Loader2 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { interestOptions } from '@/lib/data';
import { useRouter } from 'next/navigation';
import { useUser, useFirestore, useDoc } from '@/firebase';
import { doc, setDoc } from 'firebase/firestore';
import type { User } from '@/lib/types';

const profileSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters.'),
  job: z.string().min(2, 'Job title must be at least 2 characters.'),
  education: z.string().min(2, 'Education must be at least 2 characters.'),
  bio: z.string().min(20, 'Bio must be at least 20 characters.').max(500, 'Bio cannot exceed 500 characters.'),
  interests: z.array(z.string()).min(3, "Please select at least 3 interests.").max(10),
});

type ProfileFormData = z.infer<typeof profileSchema>;

export default function EditProfilePage() {
  const { toast } = useToast();
  const router = useRouter();
  const { user: authUser } = useUser();
  const firestore = useFirestore();

  const userDocRef = authUser ? doc(firestore, 'users', authUser.uid) : null;
  const { data: currentUser, loading } = useDoc<User>(userDocRef);

  const { control, handleSubmit, formState: { errors, isSubmitting }, getValues, setValue, watch, reset } = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: '',
      job: '',
      education: '',
      bio: '',
      interests: [],
    },
  });
  
  // When currentUser data loads, reset the form with the fetched data.
  React.useEffect(() => {
    if (currentUser) {
      reset({
        name: currentUser.name,
        job: currentUser.job,
        education: currentUser.education,
        bio: currentUser.bio,
        interests: currentUser.interests,
      });
    }
  }, [currentUser, reset]);

  const onSubmit = async (data: ProfileFormData) => {
    if (!userDocRef) return;
    
    try {
      await setDoc(userDocRef, data, { merge: true });
      toast({
        title: 'Profile Updated!',
        description: 'Your changes have been saved successfully.',
      });
      router.push('/profile');
    } catch (error) {
      console.error("Error updating profile: ", error);
      toast({
        title: 'Update Failed',
        description: 'Could not save your changes. Please try again.',
        variant: 'destructive',
      });
    }
  };

  const interests = watch('interests', []);

  const toggleInterest = (interest: string) => {
    const currentInterests = getValues('interests') || [];
    const isSelected = currentInterests.includes(interest);
    let newInterests;
    if (isSelected) {
      newInterests = currentInterests.filter(i => i !== interest);
    } else {
        if(currentInterests.length >= 10) {
            toast({ title: 'You can select up to 10 interests.', variant: 'destructive' });
            return;
        }
      newInterests = [...currentInterests, interest];
    }
    setValue('interests', newInterests, { shouldValidate: true });
  };

  if (loading) {
    return <div className="flex h-full items-center justify-center"><Loader2 className="h-8 w-8 animate-spin" /></div>;
  }

  return (
    <div className="max-w-3xl mx-auto">
        <div className="flex items-center gap-4 mb-8">
            <Button asChild variant="ghost" size="icon">
                <Link href="/profile"><ArrowLeft /></Link>
            </Button>
            <h1 className="font-headline text-3xl font-bold">Edit Profile</h1>
        </div>
      
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
        <Card>
          <CardHeader>
            <CardTitle>Basic Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="name">Name</Label>
              <Controller
                name="name"
                control={control}
                render={({ field }) => <Input id="name" {...field} />}
              />
              {errors.name && <p className="text-sm text-destructive mt-1">{errors.name.message}</p>}
            </div>
            <div>
              <Label htmlFor="job">Job</Label>
              <Controller
                name="job"
                control={control}
                render={({ field }) => <Input id="job" {...field} />}
              />
              {errors.job && <p className="text-sm text-destructive mt-1">{errors.job.message}</p>}
            </div>
            <div>
              <Label htmlFor="education">Education</Label>
              <Controller
                name="education"
                control={control}
                render={({ field }) => <Input id="education" {...field} />}
              />
              {errors.education && <p className="text-sm text-destructive mt-1">{errors.education.message}</p>}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>About Me</CardTitle>
          </CardHeader>
          <CardContent>
            <Label htmlFor="bio">Bio</Label>
            <Controller
              name="bio"
              control={control}
              render={({ field }) => <Textarea id="bio" rows={5} {...field} />}
            />
             {errors.bio && <p className="text-sm text-destructive mt-1">{errors.bio.message}</p>}
          </CardContent>
        </Card>

        <Card>
            <CardHeader>
                <CardTitle>Interests</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="flex flex-wrap gap-2">
                {interestOptions.map(interest => (
                    <Badge
                        key={interest}
                        variant={interests.includes(interest) ? 'default' : 'secondary'}
                        onClick={() => toggleInterest(interest)}
                        className="cursor-pointer transition-colors"
                    >
                        {interest}
                    </Badge>
                ))}
                </div>
                {errors.interests && <p className="text-sm text-destructive mt-1">{errors.interests.message as string}</p>}
            </CardContent>
        </Card>

        <div className="flex justify-end gap-2">
          <Button variant="ghost" asChild>
            <Link href="/profile">Cancel</Link>
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Save Changes
          </Button>
        </div>
      </form>
    </div>
  );
}
