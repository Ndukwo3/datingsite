
'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import Link from 'next/link';
import { ArrowLeft, Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useUser, useFirestore } from '@/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { errorEmitter } from '@/firebase/error-emitter';
import { FirestorePermissionError } from '@/firebase/errors';

const postSchema = z.object({
  title: z.string().min(5, 'Title must be at least 5 characters long.'),
  content: z.string().min(50, 'Content must be at least 50 characters long.'),
});

type PostFormData = z.infer<typeof postSchema>;

export default function CreatePostPage() {
  const { toast } = useToast();
  const router = useRouter();
  const { user: authUser } = useUser();
  const firestore = useFirestore();

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<PostFormData>({
    resolver: zodResolver(postSchema),
  });

  const onSubmit = async (data: PostFormData) => {
    if (!authUser || !firestore) return;
    
    const postData = {
        ...data,
        authorId: authUser.uid,
        createdAt: serverTimestamp(),
        likes: 0,
    };
    
    const postsCollectionRef = collection(firestore, 'posts');

    addDoc(postsCollectionRef, postData)
    .then((docRef) => {
        toast({
            title: 'Post Published!',
            description: 'Your post is now live for the community to see.',
        });
        router.push(`/blog/${docRef.id}`);
    })
    .catch((error) => {
        const permissionError = new FirestorePermissionError({
            path: postsCollectionRef.path,
            operation: 'create',
            requestResourceData: postData,
        });
        errorEmitter.emit('permission-error', permissionError);
        toast({
            title: 'Failed to Publish',
            description: 'There was an error publishing your post. Please try again.',
            variant: 'destructive',
        });
    });
  };

  return (
    <div className="max-w-3xl mx-auto">
      <div className="flex items-center gap-4 mb-8">
        <Button asChild variant="ghost" size="icon">
          <Link href="/blog"><ArrowLeft /></Link>
        </Button>
        <h1 className="font-headline text-3xl font-bold">Create a New Post</h1>
      </div>
      
      <form onSubmit={handleSubmit(onSubmit)}>
        <Card>
          <CardContent className="space-y-6 pt-6">
            <div className="space-y-2">
              <Label htmlFor="title" className="text-base">Post Title</Label>
              <Input id="title" {...register('title')} placeholder="A catchy title for your post" />
              {errors.title && <p className="text-sm text-destructive mt-1">{errors.title.message}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="content" className="text-base">Your Story</Label>
              <Textarea
                id="content"
                {...register('content')}
                rows={12}
                placeholder="Share your thoughts, experiences, or a story with the community..."
              />
              {errors.content && <p className="text-sm text-destructive mt-1">{errors.content.message}</p>}
            </div>
          </CardContent>
          <CardFooter className="flex justify-end gap-2">
            <Button variant="ghost" asChild>
                <Link href="/blog">Cancel</Link>
            </Button>
            <Button type="submit" disabled={isSubmitting}>
                {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Publish Post
            </Button>
          </CardFooter>
        </Card>
      </form>
    </div>
  );
}
