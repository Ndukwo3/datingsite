import { OnboardingForm } from './OnboardingForm';
import { Logo } from '@/components/Logo';
import Link from 'next/link';

export default function OnboardingPage() {
  return (
    <div className="container mx-auto flex min-h-screen max-w-lg flex-col items-center p-4">
      <header className="w-full py-4">
        <Link href="/" className="text-2xl font-bold font-headline">
            <Logo />
        </Link>
      </header>
      <main className="flex w-full flex-1 flex-col justify-center">
        <OnboardingForm />
      </main>
    </div>
  );
}
