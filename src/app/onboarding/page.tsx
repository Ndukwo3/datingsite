
'use client';

import { OnboardingForm } from './OnboardingForm';
import { Logo } from '@/components/Logo';
import { Button } from '@/components/ui/button';
import { useUser, useFirestore } from '@/firebase';
import { doc, setDoc } from 'firebase/firestore';
import { useRouter } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';
import { useState } from 'react';


export default function OnboardingPage() {
  const { user: authUser } = useUser();
  const firestore = useFirestore();
  const router = useRouter();
  const { toast } = useToast();
  const [isSkipping, setIsSkipping] = useState(false);

  const handleSkip = () => {
    if (!authUser || !firestore) {
      toast({
        title: 'An error occurred',
        description: 'Could not skip onboarding. Please try again.',
        variant: 'destructive',
      });
      return;
    }

    setIsSkipping(true);
    const userDocRef = doc(firestore, 'users', authUser.uid);
    
    setDoc(userDocRef, { onboardingComplete: true }, { merge: true })
      .then(() => {
        router.push('/feed');
      })
      .catch(() => {
        toast({
          title: 'Could not skip onboarding.',
          description: 'Please check your connection and try again.',
          variant: 'destructive',
        });
        setIsSkipping(false);
      });
  };

  return (
    <div className="container mx-auto flex min-h-screen max-w-lg flex-col items-center p-4">
      <header className="w-full py-4 flex justify-between items-center">
        <Logo className="text-2xl font-bold font-headline" />
         <Button variant="ghost" onClick={handleSkip} disabled={isSkipping}>
            {isSkipping && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Skip for now
          </Button>
      </header>
      <main className="flex w-full flex-1 flex-col justify-center">
        <OnboardingForm />
      </main>
    </div>
  );
}
