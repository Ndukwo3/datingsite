
'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Newspaper } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';

export default function PostPage() {
  return (
    <div className="flex h-full flex-col items-center justify-center">
        <Card className="w-full max-w-md text-center">
            <CardHeader>
                <div className="mx-auto bg-muted rounded-full p-3 w-fit">
                    <Newspaper className="h-8 w-8 text-muted-foreground" />
                </div>
                <CardTitle className="mt-4 font-headline text-2xl">
                    Coming Soon!
                </CardTitle>
            </CardHeader>
            <CardContent>
                <p className="text-muted-foreground mb-6">
                    This space is reserved for amazing stories from our community. Check back soon!
                </p>
                <Button asChild variant="outline">
                    <Link href="/blog">
                        <ArrowLeft className="mr-2 h-4 w-4" /> Back to Blog
                    </Link>
                </Button>
            </CardContent>
        </Card>
    </div>
  );
}
