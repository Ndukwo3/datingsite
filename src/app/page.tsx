import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { LandingHeader } from '@/components/LandingHeader';

export default function LandingPage() {
  const heroImage = PlaceHolderImages.find(p => p.id === 'hero-1');
  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground">
      <LandingHeader />
      <main className="flex-1">
        <section className="relative h-screen">
          {heroImage && (
            <Image
              src={heroImage.imageUrl}
              alt={heroImage.description}
              fill
              className="object-cover"
              priority
              data-ai-hint={heroImage.imageHint}
            />
          )}
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/20 to-black/60" />
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="container mx-auto px-4 text-center text-primary-foreground">
              <h1 className="mb-4 font-headline text-4xl font-bold md:text-6xl">
                Connect with Your Perfect Match
              </h1>
              <p className="mx-auto mb-8 max-w-2xl text-lg md:text-xl">
                Join LinkUp9ja and discover meaningful connections with amazing people across Nigeria.
              </p>
              <Button asChild size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground font-bold transition-transform duration-300 hover:scale-105">
                <Link href="/signup">Get Started</Link>
              </Button>
            </div>
          </div>
        </section>
        <section className="container mx-auto px-4 py-16 text-center">
          <h2 className="mb-4 font-headline text-3xl font-bold">Why LinkUp9ja?</h2>
          <p className="mx-auto mb-12 max-w-3xl text-muted-foreground md:text-lg">
            We are dedicated to helping you find genuine relationships. With our advanced features and focus on safety, your journey to love starts here.
          </p>
          <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
            <div className="rounded-lg border bg-card p-6 shadow-sm">
              <h3 className="mb-2 font-headline text-xl font-semibold">Smart Matching</h3>
              <p className="text-muted-foreground">Our algorithm connects you with people who truly fit your vibe.</p>
            </div>
            <div className="rounded-lg border bg-card p-6 shadow-sm">
              <h3 className="mb-2 font-headline text-xl font-semibold">Safe & Secure</h3>
              <p className="text-muted-foreground">We prioritize your safety with profile verification and harassment detection.</p>
            </div>
            <div className="rounded-lg border bg-card p-6 shadow-sm">
              <h3 className="mb-2 font-headline text-xl font-semibold">Real-time Chat</h3>
              <p className="text-muted-foreground">Engage in seamless conversations with your matches instantly.</p>
            </div>
          </div>
        </section>
      </main>
      <footer className="container mx-auto border-t px-4 py-6 text-center text-muted-foreground">
        <p>&copy; {new Date().getFullYear()} LinkUp9ja. All rights reserved.</p>
      </footer>
    </div>
  );
}
