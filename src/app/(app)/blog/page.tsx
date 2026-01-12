
'use client';

import { useMemo } from 'react';
import Link from 'next/link';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { formatDistanceToNow } from 'date-fns';
import { useCollection, useFirestore, useDoc } from '@/firebase';
import { collection, query, orderBy, doc } from 'firebase/firestore';
import type { Post, User } from '@/lib/types';
import { Loader2, MessageSquare, PlusCircle } from 'lucide-react';
import { isValidHttpUrl } from '@/lib/is-valid-url';

function PostCard({ post }: { post: Post }) {
  const firestore = useFirestore();
  const { data: author, loading } = useDoc<User>(doc(firestore, 'users', post.authorId));

  if (loading || !author) {
    return (
      <Card className="animate-pulse">
        <CardHeader>
          <div className="h-6 w-3/4 rounded bg-muted" />
        </CardHeader>
        <CardContent>
          <div className="h-4 w-full rounded bg-muted" />
          <div className="h-4 w-5/6 rounded bg-muted mt-2" />
        </CardContent>
        <CardFooter className="flex items-center gap-2">
          <div className="h-10 w-10 rounded-full bg-muted" />
          <div className="space-y-1">
            <div className="h-4 w-24 rounded bg-muted" />
            <div className="h-3 w-16 rounded bg-muted" />
          </div>
        </CardFooter>
      </Card>
    );
  }

  const authorImage = author.photos?.[0];

  return (
    <Card className="transition-all hover:shadow-md">
      <CardHeader>
        <CardTitle className="font-headline text-xl">
          <Link href={`/blog/${post.id}`}>{post.title}</Link>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="line-clamp-3 text-muted-foreground">{post.content}</p>
      </CardContent>
      <CardFooter className="flex justify-between">
        <div className="flex items-center gap-3">
          <Avatar className="h-10 w-10">
            {isValidHttpUrl(authorImage) ? (
              <AvatarImage src={authorImage} alt={author.name} />
            ) : (
              <AvatarFallback>{author.name.charAt(0)}</AvatarFallback>
            )}
          </Avatar>
          <div>
            <p className="font-semibold text-sm">{author.name}</p>
            <p className="text-xs text-muted-foreground">
              Posted {formatDistanceToNow(post.createdAt.toDate(), { addSuffix: true })}
            </p>
          </div>
        </div>
        <Button variant="ghost" size="sm" asChild>
            <Link href={`/blog/${post.id}`}>
                <MessageSquare className='mr-2 h-4 w-4' />
                Comment
            </Link>
        </Button>
      </CardFooter>
    </Card>
  );
}

export default function BlogPage() {
  const firestore = useFirestore();

  const postsQuery = useMemo(() => {
    if (!firestore) return null;
    return query(collection(firestore, 'posts'), orderBy('createdAt', 'desc'));
  }, [firestore]);

  const { data: posts, loading } = useCollection<Post>(postsQuery);

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="flex items-center justify-between">
        <div>
            <h1 className="font-headline text-3xl font-bold">Community Blog</h1>
            <p className="text-muted-foreground">Catch up on the latest stories from the community.</p>
        </div>
        <Button asChild>
          <Link href="/blog/create">
            <PlusCircle className="mr-2 h-4 w-4" />
            Create Post
          </Link>
        </Button>
      </div>

      {loading && <div className="flex justify-center p-8"><Loader2 className="h-8 w-8 animate-spin" /></div>}

      {!loading && posts?.length === 0 && (
        <div className="text-center bg-card p-12 rounded-lg border">
            <h2 className='text-xl font-semibold'>No posts yet!</h2>
            <p className='text-muted-foreground mt-2'>Why not be the first to share something with the community?</p>
             <Button asChild className='mt-4'>
                <Link href="/blog/create">
                    <PlusCircle className="mr-2 h-4 w-4" />
                    Write a Post
                </Link>
            </Button>
        </div>
      )}

      <div className="grid gap-6">
        {posts?.map((post) => (
          <PostCard key={post.id} post={post} />
        ))}
      </div>
    </div>
  );
}
