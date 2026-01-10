import { OnboardingForm } from './OnboardingForm';
import { Logo } from '@/components/Logo';

export default function OnboardingPage() {
  return (
    <div className="container mx-auto flex min-h-screen max-w-3xl flex-col items-center p-4">
      <header className="w-full py-6">
        <Logo />
      </header>
      <main className="flex w-full flex-1 flex-col justify-center">
        <OnboardingForm />
      </main>
    </div>
  );
}
