"use client";

import { useState } from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { motion, AnimatePresence } from 'framer-motion';
import { Loader2, Sparkles, Upload } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { suggestPreferences } from '@/ai/flows/suggested-preferences';
import { Card, CardContent } from '@/components/ui/card';
import Link from 'next/link';

const formSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters.'),
  age: z.coerce.number().min(18, 'You must be at least 18.').max(99),
  location: z.string().min(2, 'Location is required.'),
  bio: z.string().min(20, 'Bio must be at least 20 characters.').max(300),
  interests: z.string().min(3, 'Please enter at least one interest.'),
  preferences: z.array(z.string()).optional(),
});

type FormData = z.infer<typeof formSchema>;

const steps = [
  { id: 1, title: 'Basic Info', fields: ['name', 'age', 'location'] },
  { id: 2, title: 'About You', fields: ['bio', 'interests'] },
  { id: 3, title: 'Photos', fields: [] },
  { id: 4, title: 'Complete', fields: [] },
];

export function OnboardingForm() {
  const [currentStep, setCurrentStep] = useState(0);
  const [suggested, setSuggested] = useState<string[]>([]);
  const [selectedPrefs, setSelectedPrefs] = useState<string[]>([]);
  const [isLoadingSuggestions, setIsLoadingSuggestions] = useState(false);
  const { toast } = useToast();

  const methods = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      preferences: [],
    },
  });

  const {
    handleSubmit,
    trigger,
    getValues,
    formState: { errors },
  } = methods;

  const handleNext = async () => {
    const fields = steps[currentStep].fields;
    const output = await trigger(fields as (keyof FormData)[]);

    if (!output) return;

    if (currentStep < steps.length - 1) {
      setCurrentStep(step => step + 1);
    }
  };

  const handlePrev = () => {
    if (currentStep > 0) {
      setCurrentStep(step => step - 1);
    }
  };
  
  const handleGetSuggestions = async () => {
    const { bio, interests, age } = getValues();
    if(!bio || !interests || !age) {
        toast({
            title: "Please fill out your bio, interests, and age.",
            variant: "destructive",
        });
        return;
    }

    setIsLoadingSuggestions(true);
    try {
      const result = await suggestPreferences({ bio, interests, age, location: getValues('location') });
      setSuggested(result.suggestedPreferences);
    } catch (error) {
      console.error(error);
      toast({
        title: "Couldn't get suggestions",
        description: "There was an issue with our AI. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoadingSuggestions(false);
    }
  };
  
  const togglePreference = (pref: string) => {
    setSelectedPrefs(prev => 
      prev.includes(pref) ? prev.filter(p => p !== pref) : [...prev, pref]
    );
  };

  const progress = ((currentStep + 1) / steps.length) * 100;

  return (
    <FormProvider {...methods}>
      <div className="w-full space-y-8">
        <Progress value={progress} className="h-2" />
        
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            transition={{ duration: 0.3 }}
          >
            {currentStep === 0 && (
              <div className="space-y-6">
                <h2 className="text-2xl font-headline font-bold">Welcome! Let's start with the basics.</h2>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="name">Full Name</Label>
                    <Input id="name" {...methods.register('name')} />
                    {errors.name && <p className="text-sm text-destructive">{errors.name.message}</p>}
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="age">Age</Label>
                      <Input id="age" type="number" {...methods.register('age')} />
                      {errors.age && <p className="text-sm text-destructive">{errors.age.message}</p>}
                    </div>
                    <div>
                      <Label htmlFor="location">Location</Label>
                      <Input id="location" placeholder="e.g., Lagos, Nigeria" {...methods.register('location')} />
                      {errors.location && <p className="text-sm text-destructive">{errors.location.message}</p>}
                    </div>
                  </div>
                </div>
              </div>
            )}
            
            {currentStep === 1 && (
              <div className="space-y-6">
                <h2 className="text-2xl font-headline font-bold">Tell us a bit about yourself.</h2>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="bio">Your Bio</Label>
                    <Textarea id="bio" placeholder="I love exploring new places, trying new food..." {...methods.register('bio')} />
                    {errors.bio && <p className="text-sm text-destructive">{errors.bio.message}</p>}
                  </div>
                  <div>
                    <Label htmlFor="interests">Interests</Label>
                    <Input id="interests" placeholder="e.g., Music, Travel, Food" {...methods.register('interests')} />
                    <p className="text-sm text-muted-foreground">Separate interests with commas.</p>
                    {errors.interests && <p className="text-sm text-destructive">{errors.interests.message}</p>}
                  </div>
                </div>
                <Card>
                  <CardContent className="pt-6">
                    <div className="flex flex-col md:flex-row items-center gap-4">
                      <div className="flex-1">
                        <h3 className="font-semibold flex items-center gap-2"><Sparkles className="text-accent w-5 h-5"/> AI-Powered Suggestions</h3>
                        <p className="text-sm text-muted-foreground">Get personalized preference suggestions based on your profile.</p>
                      </div>
                      <Button onClick={handleGetSuggestions} disabled={isLoadingSuggestions} variant="outline">
                        {isLoadingSuggestions ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Sparkles className="mr-2 h-4 w-4" />}
                        Suggest Preferences
                      </Button>
                    </div>
                    {suggested.length > 0 && (
                      <div className="mt-4 space-y-2">
                         <p className="text-sm font-medium">Click to select your preferences:</p>
                        <div className="flex flex-wrap gap-2">
                          {suggested.map((pref) => (
                            <Badge
                              key={pref}
                              variant={selectedPrefs.includes(pref) ? "default" : "secondary"}
                              onClick={() => togglePreference(pref)}
                              className="cursor-pointer transition-colors"
                            >
                              {pref}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            )}

            {currentStep === 2 && (
              <div className="space-y-6 text-center">
                 <h2 className="text-2xl font-headline font-bold">Upload your best photos.</h2>
                 <p className="text-muted-foreground">First impressions matter! Add at least one photo to continue.</p>
                 <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {[...Array(6)].map((_, i) => (
                        <div key={i} className="aspect-square rounded-lg border-2 border-dashed border-muted-foreground/50 flex flex-col items-center justify-center text-muted-foreground hover:bg-muted transition-colors cursor-pointer">
                            <Upload className="w-8 h-8"/>
                            <span className="text-sm mt-2">Upload Photo</span>
                        </div>
                    ))}
                 </div>
              </div>
            )}
            
            {currentStep === 3 && (
              <div className="space-y-6 text-center">
                 <Sparkles className="w-16 h-16 text-accent mx-auto animate-pulse" />
                 <h2 className="text-3xl font-headline font-bold">You're all set!</h2>
                 <p className="text-muted-foreground max-w-md mx-auto">Your profile is complete. Get ready to start connecting with amazing people on LinkUp9ja.</p>
                 <Button size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground font-bold" asChild>
                    <Link href="/">Start Swiping</Link>
                 </Button>
              </div>
            )}
          </motion.div>
        </AnimatePresence>

        {currentStep < 3 && (
          <div className="flex justify-between">
            <Button onClick={handlePrev} disabled={currentStep === 0} variant="outline">
              Previous
            </Button>
            <Button onClick={handleNext} className="bg-primary hover:bg-primary/90 text-primary-foreground">
              {currentStep === steps.length - 2 ? 'Finish' : 'Next'}
            </Button>
          </div>
        )}
      </div>
    </FormProvider>
  );
}
