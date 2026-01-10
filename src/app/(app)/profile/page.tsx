import { currentUser } from '@/lib/data';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import Image from 'next/image';
import { Save, Upload } from 'lucide-react';

export default function ProfilePage() {
  return (
    <div className="mx-auto max-w-4xl space-y-8">
      <div>
        <h1 className="font-headline text-3xl font-bold">Your Profile</h1>
        <p className="text-muted-foreground">This is how others will see you. Make it count!</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Edit Photos</CardTitle>
          <CardDescription>Add, remove, or reorder your photos.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
            {currentUser.photos.map((photoId, index) => {
              const photo = PlaceHolderImages.find(p => p.id === photoId);
              return (
                <div key={index} className="group relative aspect-square">
                  {photo && (
                    <Image
                      src={photo.imageUrl}
                      alt={`Profile photo ${index + 1}`}
                      fill
                      className="rounded-lg object-cover"
                    />
                  )}
                  <div className="absolute inset-0 flex items-center justify-center rounded-lg bg-black/50 opacity-0 transition-opacity group-hover:opacity-100">
                    <Button variant="destructive" size="sm">Remove</Button>
                  </div>
                </div>
              );
            })}
             <div className="flex aspect-square cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-muted-foreground/50 text-muted-foreground transition-colors hover:bg-muted">
                <Upload className="h-8 w-8" />
                <span className="mt-2 text-sm">Add Photo</span>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Edit Details</CardTitle>
          <CardDescription>Update your personal information.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="name">Name</Label>
            <Input id="name" defaultValue={currentUser.name} />
          </div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="age">Age</Label>
              <Input id="age" type="number" defaultValue={currentUser.age} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="location">Location</Label>
              <Input id="location" defaultValue={currentUser.location} />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="bio">Bio</Label>
            <Textarea id="bio" defaultValue={currentUser.bio} className="min-h-[120px]" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="interests">Interests</Label>
            <Input id="interests" defaultValue={currentUser.interests.join(', ')} />
            <p className="text-sm text-muted-foreground">Separate interests with a comma.</p>
          </div>
          <div className="flex justify-end">
            <Button className="bg-primary text-primary-foreground hover:bg-primary/90">
              <Save className="mr-2 h-4 w-4" /> Save Changes
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
