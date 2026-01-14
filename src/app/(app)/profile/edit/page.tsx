
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
import { interestOptions, lifestyleOptions, nigerianStates } from '@/lib/data';
import { useRouter } from 'next/navigation';
import { useUser, useFirestore, useDoc } from '@/firebase';
import { doc, setDoc } from 'firebase/firestore';
import type { User } from '@/lib/types';
import * as React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { errorEmitter } from '@/firebase/error-emitter';
import { FirestorePermissionError } from '@/firebase/errors';

const profileSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters.'),
  job: z.string().min(2, 'Job title must be at least 2 characters.').optional().or(z.literal('')),
  education: z.string().min(2, 'Education must be at least 2 characters.').optional().or(z.literal('')),
  bio: z.string().min(20, 'Bio must be at least 20 characters.').max(500, 'Bio cannot exceed 500 characters.'),
  interests: z.array(z.string()).min(3, "Please select at least 3 interests.").max(10),
  relationshipGoal: z.string().optional().or(z.literal('')),
  height: z.string().optional().or(z.literal('')),
  exercise: z.string().optional().or(z.literal('')),
  drinking: z.string().optional().or(z.literal('')),
  smoking: z.string().optional().or(z.literal('')),
  state: z.string({ required_error: "Please select your state." }),
  city: z.string().min(2, "Please enter your city."),
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
      relationshipGoal: '',
      height: '',
      exercise: '',
      drinking: '',
      smoking: '',
      state: '',
      city: ''
    },
  });
  
  React.useEffect(() => {
    if (currentUser) {
      const [city, state] = currentUser.location?.split(', ') || ['', ''];
      reset({
        name: currentUser.name || '',
        job: currentUser.job || '',
        education: currentUser.education || '',
        bio: currentUser.bio || '',
        interests: currentUser.interests || [],
        relationshipGoal: currentUser.relationshipGoal || '',
        height: currentUser.height || '',
        exercise: currentUser.exercise || '',
        drinking: currentUser.drinking || '',
        smoking: currentUser.smoking || '',
        state: state || '',
        city: city || ''
      });
    }
  }, [currentUser, reset]);

  const onSubmit = async (data: ProfileFormData) => {
    if (!userDocRef) return;

    const { city, state, ...restOfData } = data;
    const profileData = {
      ...restOfData,
      location: `${city}, ${state}`
    };
    
    setDoc(userDocRef, profileData, { merge: true })
    .then(() => {
      toast({
        title: 'Profile Updated!',
        description: 'Your changes have been saved successfully.',
      });
      router.push('/profile');
    })
    .catch(error => {
      const permissionError = new FirestorePermissionError({
          path: userDocRef.path,
          operation: 'update',
          requestResourceData: profileData
      });
      errorEmitter.emit('permission-error', permissionError);
    });
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
                <Label htmlFor="state">State</Label>
                <Controller
                    name="state"
                    control={control}
                    render={({ field }) => (
                        <Select onValueChange={field.onChange} value={field.value}>
                            <SelectTrigger>
                                <SelectValue placeholder="Select your state" />
                            </SelectTrigger>
                            <SelectContent>
                                {nigerianStates.map(state => (
                                    <SelectItem key={state} value={state}>{state}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    )}
                />
                {errors.state && <p className="text-sm text-destructive mt-1">{errors.state.message}</p>}
            </div>
             <div>
                <Label htmlFor="city">City</Label>
                <Controller name="city" control={control} render={({ field }) => <Input id="city" {...field} />} />
                {errors.city && <p className="text-sm text-destructive mt-1">{errors.city.message}</p>}
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
             <div>
                <Label htmlFor="height">Height</Label>
                <Controller name="height" control={control} render={({ field }) => <Input id="height" placeholder="e.g., 5' 10''" {...field} />} />
                {errors.height && <p className="text-sm text-destructive mt-1">{errors.height.message}</p>}
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
        
        <Card>
            <CardHeader>
                <CardTitle>Lifestyle</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                 <div>
                    <Label htmlFor="relationshipGoal">I'm looking for...</Label>
                    <Controller
                        name="relationshipGoal"
                        control={control}
                        render={({ field }) => (
                            <Select onValueChange={field.onChange} value={field.value}>
                                <SelectTrigger id="relationshipGoal">
                                    <SelectValue placeholder="Select your goal" />
                                </SelectTrigger>
                                <SelectContent>
                                    {lifestyleOptions.relationshipGoal.map(opt => <SelectItem key={opt} value={opt}>{opt}</SelectItem>)}
                                </SelectContent>
                            </Select>
                        )}
                    />
                    {errors.relationshipGoal && <p className="text-sm text-destructive mt-1">{errors.relationshipGoal.message}</p>}
                </div>
                 <div>
                    <Label htmlFor="exercise">Exercise</Label>
                    <Controller
                        name="exercise"
                        control={control}
                        render={({ field }) => (
                            <Select onValueChange={field.onChange} value={field.value}>
                                <SelectTrigger id="exercise">
                                    <SelectValue placeholder="How often do you exercise?" />
                                </SelectTrigger>
                                <SelectContent>
                                    {lifestyleOptions.exercise.map(opt => <SelectItem key={opt} value={opt}>{opt}</SelectItem>)}
                                </SelectContent>
                            </Select>
                        )}
                    />
                    {errors.exercise && <p className="text-sm text-destructive mt-1">{errors.exercise.message}</p>}
                </div>
                 <div>
                    <Label htmlFor="drinking">Drinking</Label>
                    <Controller
                        name="drinking"
                        control={control}
                        render={({ field }) => (
                            <Select onValueChange={field.onChange} value={field.value}>
                                <SelectTrigger id="drinking">
                                    <SelectValue placeholder="Do you drink?" />
                                </SelectTrigger>
                                <SelectContent>
                                    {lifestyleOptions.drinking.map(opt => <SelectItem key={opt} value={opt}>{opt}</SelectItem>)}
                                </SelectContent>
                            </Select>
                        )}
                    />
                    {errors.drinking && <p className="text-sm text-destructive mt-1">{errors.drinking.message}</p>}
                </div>
                 <div>
                    <Label htmlFor="smoking">Smoking</Label>
                    <Controller
                        name="smoking"
                        control={control}
                        render={({ field }) => (
                            <Select onValueChange={field.onChange} value={field.value}>
                                <SelectTrigger id="smoking">
                                    <SelectValue placeholder="Do you smoke?" />
                                </SelectTrigger>
                                <SelectContent>
                                    {lifestyleOptions.smoking.map(opt => <SelectItem key={opt} value={opt}>{opt}</SelectItem>)}
                                </SelectContent>
                            </Select>
                        )}
                    />
                    {errors.smoking && <p className="text-sm text-destructive mt-1">{errors.smoking.message}</p>}
                </div>
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
