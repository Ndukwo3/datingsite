
'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Newspaper } from 'lucide-react';

export default function BlogPage() {
  return (
    <div className="flex h-full items-center justify-center">
      <Card className="w-full max-w-md text-center">
        <CardHeader>
          <div className="mx-auto bg-muted rounded-full p-3 w-fit">
            <Newspaper className="h-8 w-8 text-muted-foreground" />
          </div>
          <CardTitle className="mt-4 font-headline text-2xl">
            Community Blog Coming Soon!
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            We're working on a space for you to share stories, experiences, and connect with the community on a deeper level. Stay tuned!
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
