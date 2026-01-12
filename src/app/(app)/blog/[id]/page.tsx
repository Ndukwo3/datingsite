
'use client';

import { useMemo, useState } from 'react';
import { useParams, notFound } from 'next/navigation';
import { useDoc, useCollection, useFirestore, useUser } from '@/firebase';
import { doc, collection, query, orderBy, addDoc, serverTimestamp } from 'firebase/firestore';
import type { Post, Comment, User } from '@/lib/types';
import { Loader2, Send, MessageSquare, ArrowLeft } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent } from '@/components/ui/card';
import { format, formatDistanceToNow } from 'date-fns';
import { isValidHttpUrl } from '@/lib/is-valid-url';
import Link from 'next/link';
import { useToast } from '@/hooks/use-toast';
import { errorEmitter } from '@/firebase/error-emitter';
import { FirestorePermissionError } from '@/firebase/errors';

function CommentItem({ comment }: { comment: Comment }) {
  const firestore = useFirestore();
  const { data: author, loading } = useDoc<User>(doc(firestore, 'users', comment.authorId));

  if (loading || !author) {
    return (
        <div className="flex items-start gap-3 animate-pulse">
          <div className="h-10 w-10 rounded-full bg-muted" />
          <div className="flex-1 space-y-2">
            <div className="h-4 w-1/4 rounded bg-muted" />
            <div className="h-4 w-3/4 rounded bg-muted" />
          </div>
        </div>
    );
  }
  
  const authorImage = author.photos?.[0];

  return (
    <div className="flex items-start gap-3">
      <Avatar className="h-10 w-10">
        {isValidHttpUrl(authorImage) ? (
          <AvatarImage src={authorImage} alt={author.name} />
        ) : (
          <AvatarFallback>{author.name.charAt(0)}</AvatarFallback>
        )}
      </Avatar>
      <div className="flex-1">
        <div className="flex items-baseline gap-2">
          <p className="font-semibold text-sm">{author.name}</p>
          <p className="text-xs text-muted-foreground">
            {formatDistanceToNow(comment.createdAt.toDate(), { addSuffix: true })}
          </p>
        </div>
        <p className="text-sm text-muted-foreground">{comment.text}</p>
      </div>
    </div>
  );
}

export default function PostPage() {
  const params = useParams();
  const postId = params.id as string;
  const firestore = useFirestore();
  const { user: authUser } = useUser();
  const { toast } = useToast();
  const [newComment, setNewComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const postRef = useMemo(() => doc(firestore, 'posts', postId), [firestore, postId]);
  const { data: post, loading: postLoading } = useDoc<Post>(postRef);

  const { data: author, loading: authorLoading } = useDoc<User>(
    post ? doc(firestore, 'users', post.authorId) : null
  );

  const commentsQuery = useMemo(() => {
    return query(collection(firestore, 'posts', postId, 'comments'), orderBy('createdAt', 'asc'));
  }, [firestore, postId]);
  
  const { data: comments, loading: commentsLoading } = useCollection<Comment>(commentsQuery);

  const handleCommentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim() || !authUser || !firestore) return;
    
    setIsSubmitting(true);

    const commentData = {
        text: newComment,
        authorId: authUser.uid,
        postId,
        createdAt: serverTimestamp(),
    };
    
    const commentsCollectionRef = collection(firestore, 'posts', postId, 'comments');

    addDoc(commentsCollectionRef, commentData)
    .then(() => {
        setNewComment('');
        toast({ title: "Comment posted!" });
    })
    .catch((error) => {
        const permissionError = new FirestorePermissionError({
            path: commentsCollectionRef.path,
            operation: 'create',
            requestResourceData: commentData,
        });
        errorEmitter.emit('permission-error', permissionError);
        toast({ title: 'Error', description: 'Could not post comment.', variant: 'destructive' });
    })
    .finally(() => {
        setIsSubmitting(false);
    });
  };

  if (postLoading || authorLoading) {
    return <div className="flex h-full items-center justify-center"><Loader2 className="h-8 w-8 animate-spin" /></div>;
  }

  if (!post) {
    notFound();
  }

  const authorImage = author?.photos?.[0];

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className='flex items-center gap-4'>
         <Button asChild variant="ghost" size="icon">
            <Link href="/blog"><ArrowLeft /></Link>
        </Button>
        <h1 className="font-headline text-3xl font-bold">{post.title}</h1>
      </div>

      <div className="flex items-center gap-3 text-muted-foreground">
         <Avatar className="h-12 w-12">
            {isValidHttpUrl(authorImage) ? (
            <AvatarImage src={authorImage} alt={author?.name} />
            ) : (
            <AvatarFallback>{author?.name?.charAt(0)}</AvatarFallback>
            )}
        </Avatar>
        <div>
            <p className="font-semibold text-foreground">{author?.name}</p>
            <p className="text-sm">Posted on {format(post.createdAt.toDate(), 'MMMM d, yyyy')}</p>
        </div>
      </div>
      
      <article className="prose dark:prose-invert max-w-none text-foreground/90 leading-relaxed whitespace-pre-wrap">
        {post.content}
      </article>
      
      <div className="space-y-6 pt-8">
        <h2 className='font-headline text-2xl font-bold flex items-center gap-2'>
            <MessageSquare /> Comments ({comments?.length || 0})
        </h2>
        
        <Card>
            <CardContent className='pt-6'>
                 <form onSubmit={handleCommentSubmit} className="flex items-start gap-3">
                    <Textarea
                        value={newComment}
                        onChange={(e) => setNewComment(e.target.value)}
                        placeholder="Add your comment..."
                        className="flex-1"
                        rows={2}
                        disabled={isSubmitting}
                    />
                    <Button type="submit" size="icon" disabled={isSubmitting || !newComment.trim()}>
                        {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
                    </Button>
                </form>
            </CardContent>
        </Card>

        {commentsLoading && <div className="flex justify-center p-4"><Loader2 className="h-6 w-6 animate-spin" /></div>}
        
        <div className="space-y-6">
            {comments?.map((comment) => (
                <CommentItem key={comment.id} comment={comment} />
            ))}
            {!commentsLoading && comments?.length === 0 && (
                <p className="text-center text-muted-foreground py-8">No comments yet. Be the first to share your thoughts!</p>
            )}
        </div>
      </div>
    </div>
  );
}
