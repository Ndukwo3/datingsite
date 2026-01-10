
'use client';

import { currentUser } from '@/lib/data';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import Image from 'next/image';
import { Save, Sparkles, Upload } from 'lucide-react';
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { suggestPreferences } from '@/ai/flows/suggested-preferences';
import { Loader2 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

export default function ProfilePage() {
  const [bio, setBio] = useState(currentUser.bio);
  const [interests, setInterests] = useState(currentUser.interests.join(', '));
  const [suggested, setSuggested] = useState<string[]>([]);
  const [selectedPrefs, setSelectedPrefs] = useState<string[]>(currentUser.interests);
  const [isLoadingSuggestions, setIsLoadingSuggestions] = useState(false);
  const { toast } = useToast();

  const handleGetSuggestions = async () => {
    if (!bio || !interests) {
      toast({
        title: 'Please fill out your bio and interests.',
        variant: 'destructive',
      });
      return;
    }

    setIsLoadingSuggestions(true);
    try {
      const result = await suggestPreferences({ bio, interests, age: currentUser.age, location: currentUser.location });
      // Filter out suggestions that are already in the user's interests
      const newSuggestions = result.suggestedPreferences.filter(p => !selectedPrefs.find(sp => sp.toLowerCase() === p.toLowerCase()));
      setSuggested(newSuggestions);
    } catch (error) {
      console.error(error);
      toast({
        title: "Couldn't get suggestions",
        description: 'There was an issue with our AI. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsLoadingSuggestions(false);
    }
  };

  const togglePreference = (pref: string) => {
    setSelectedPrefs(prev => {
        const isSelected = prev.find(sp => sp.toLowerCase() === pref.toLowerCase());
        let newPrefs;
        if (isSelected) {
            newPrefs = prev.filter(p => p.toLowerCase() !== pref.toLowerCase());
        } else {
            newPrefs = [...prev, pref];
        }
        setInterests(newPrefs.join(', '));
        return newPrefs;
    });
  };

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
            <Textarea id="bio" value={bio} onChange={(e) => setBio(e.target.value)} className="min-h-[120px]" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="interests">Interests</Label>
            <Input id="interests" value={interests} onChange={(e) => {
                setInterests(e.target.value);
                setSelectedPrefs(e.target.value.split(',').map(s => s.trim()).filter(Boolean));
            }} />
            <div className="flex flex-wrap gap-2 mt-2">
                {selectedPrefs.map((pref) => (
                    <Badge
                    key={pref}
                    variant={"secondary"}
                    onClick={() => togglePreference(pref)}
                    className="cursor-pointer transition-colors"
                    >
                    {pref} &times;
                    </Badge>
                ))}
            </div>
            <p className="text-sm text-muted-foreground">Separate interests with a comma, or use the suggestions below.</p>
          </div>
           <Card>
                <CardContent className="pt-6">
                <div className="flex flex-col md:flex-row items-center gap-4">
                    <div className="flex-1">
                    <h3 className="font-semibold flex items-center gap-2"><Sparkles className="text-accent w-5 h-5"/> AI-Powered Suggestions</h3>
                    <p className="text-sm text-muted-foreground">Get personalized interest suggestions based on your profile.</p>
                    </div>
                    <Button onClick={handleGetSuggestions} disabled={isLoadingSuggestions} variant="outline">
                    {isLoadingSuggestions ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Sparkles className="mr-2 h-4 w-4" />}
                    Suggest Interests
                    </Button>
                </div>
                {suggested.length > 0 && (
                    <div className="mt-4 space-y-2">
                        <p className="text-sm font-medium">Click to add suggestions:</p>
                    <div className="flex flex-wrap gap-2">
                        {suggested.map((pref) => (
                        <Badge
                            key={pref}
                            variant={"outline"}
                            onClick={() => togglePreference(pref)}
                            className="cursor-pointer transition-colors"
                        >
                            + {pref}
                        </Badge>
                        ))}
                    </div>
                    </div>
                )}
                </CardContent>
            </Card>
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
