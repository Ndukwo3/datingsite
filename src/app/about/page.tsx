
import { LandingHeader } from "@/components/LandingHeader";
import { LandingFooter } from "@/components/LandingFooter";
import { Users, Heart, Shield } from "lucide-react";
import Image from "next/image";
import { PlaceHolderImages } from "@/lib/placeholder-images";

export default function AboutPage() {
  const missionImage = PlaceHolderImages.find(p => p.id === 'about-mission');
  const storyImage = PlaceHolderImages.find(p => p.id === 'about-story');

  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground">
      <LandingHeader theme="light" />
      <main className="flex-1 pt-24 pb-20">
        <div className="container mx-auto px-4">
          <section className="text-center">
            <h1 className="font-headline text-4xl font-bold md:text-5xl dark:text-pink-500">
              About LinkUp9ja
            </h1>
            <p className="mx-auto mt-4 max-w-3xl text-lg text-muted-foreground">
              Forging Genuine Connections for Nigerians, Everywhere.
            </p>
          </section>

          <section className="mt-16 space-y-16">
            <div className="mx-auto max-w-5xl">
              <div className="flex flex-col md:flex-row items-center gap-12">
                <div className="w-full md:w-1/2">
                  <h2 className="mb-4 font-headline text-3xl font-bold dark:text-pink-500">Our Mission</h2>
                  <p className="text-muted-foreground">
                    In a world of fleeting digital interactions, our mission is to build a trusted and vibrant online community where Nigerians can form deep, meaningful, and lasting relationships. We believe in celebrating our unique culture and creating a space where genuine connections can flourish, whether you're looking for a life partner, a cherished friend, or a beautiful new beginning.
                  </p>
                </div>
                {missionImage && (
                  <div className="w-full md:w-1/2 relative aspect-video">
                    <Image src={missionImage.imageUrl} alt={missionImage.description} fill className="rounded-lg object-cover shadow-md" data-ai-hint={missionImage.imageHint} />
                  </div>
                )}
              </div>
            </div>

            <div className="mx-auto max-w-5xl">
               <div className="flex flex-col md:flex-row items-center gap-12">
                {storyImage && (
                    <div className="w-full md:w-1/2 relative aspect-video order-last md:order-first">
                      <Image src={storyImage.imageUrl} alt={storyImage.description} fill className="rounded-lg object-cover shadow-md" data-ai-hint={storyImage.imageHint} />
                    </div>
                  )}
                <div className="w-full md:w-1/2">
                  <h2 className="mb-4 font-headline text-3xl font-bold dark:text-pink-500">Our Story</h2>
                  <p className="text-muted-foreground">
                  LinkUp9ja was born from a simple idea: dating should be easier and more authentic for Nigerians. Our founders, a group of friends who navigated the challenges of modern dating themselves, saw a need for a platform that understood the nuances of Nigerian culture, values, and aspirations. We set out to create more than just an app—we wanted to build a community founded on respect, authenticity, and the shared goal of finding happiness. Today, LinkUp9ja is a testament to that vision, helping thousands of people connect every single day.
                  </p>
                </div>
              </div>
            </div>
            
            <div className="mx-auto max-w-5xl">
                <h2 className="mb-8 font-headline text-3xl font-bold text-center">Why Choose Us?</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
                    <div className="rounded-lg border bg-card p-6 shadow-sm">
                        <Heart className="mx-auto h-12 w-12 text-primary mb-4" />
                        <h3 className="font-semibold text-xl mb-2">Culturally Attuned</h3>
                        <p className="text-muted-foreground">We understand Nigerian dating culture, making it easier to find someone who shares your values.</p>
                    </div>
                    <div className="rounded-lg border bg-card p-6 shadow-sm">
                        <Shield className="mx-auto h-12 w-12 text-primary mb-4" />
                        <h3 className="font-semibold text-xl mb-2">Safety First</h3>
                        <p className="text-muted-foreground">With advanced safety features like AI-powered harassment detection and profile verification, you can connect with confidence.</p>
                    </div>
                    <div className="rounded-lg border bg-card p-6 shadow-sm">
                        <Users className="mx-auto h-12 w-12 text-primary mb-4" />
                        <h3 className="font-semibold text-xl mb-2">Vibrant Community</h3>
                        <p className="text-muted-foreground">Join a growing community of genuine singles who are ready to find a real connection.</p>
                    </div>
                </div>
            </div>

          </section>
        </div>
      </main>
      <LandingFooter />
    </div>
  );
}
