import Link from 'next/link';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { conversations } from '@/lib/data';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { formatDistanceToNow } from 'date-fns';

export default function ChatListPage() {
  return (
    <div className="max-w-4xl mx-auto">
      <Card>
        <CardHeader>
          <CardTitle className="font-headline">Conversations</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {conversations.map((convo) => {
              const userImage = PlaceHolderImages.find(p => p.id === convo.participant.photos[0]);
              return (
                <Link
                  href={`/chat/${convo.id}`}
                  key={convo.id}
                  className="block rounded-lg p-4 transition-colors hover:bg-muted"
                >
                  <div className="flex items-center gap-4">
                    <Avatar className="h-12 w-12">
                      {userImage && <AvatarImage src={userImage.imageUrl} alt={convo.participant.name} />}
                      <AvatarFallback>{convo.participant.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <div className="flex items-baseline justify-between">
                        <p className="font-semibold">{convo.participant.name}</p>
                        <p className="text-xs text-muted-foreground">
                          {formatDistanceToNow(convo.lastMessage.timestamp, { addSuffix: true })}
                        </p>
                      </div>
                      <p className="mt-1 truncate text-sm text-muted-foreground">
                        {convo.lastMessage.text}
                      </p>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
