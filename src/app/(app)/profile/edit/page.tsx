
'use client';

import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { currentUser } from '@/lib/data';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { interestOptions } from '@/lib/data';
import { useRouter } from 'next/navigation';

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
  const { control, handleSubmit, formState: { errors }, getValues, setValue, watch } = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: currentUser.name,
      job: currentUser.job,
      education: currentUser.education,
      bio: currentUser.bio,
      interests: currentUser.interests,
    },
  });

  const onSubmit = (data: ProfileFormData) => {
    console.log(data);
    toast({
      title: 'Profile Updated!',
      description: 'Your changes have been saved successfully.',
    });
    router.push('/profile');
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
          <Button type="submit">Save Changes</Button>
        </div>
      </form>
    </div>
  );
}
