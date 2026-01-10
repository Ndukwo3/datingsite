import { LandingHeader } from "@/components/LandingHeader";
import { LandingFooter } from "@/components/LandingFooter";

export default function AboutPage() {
  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground">
      <LandingHeader theme="light" />
      <main className="flex-1 py-24">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl font-bold font-headline">About Us</h1>
          <p className="mt-4 text-muted-foreground">This is the about us page. Content to be added.</p>
        </div>
      </main>
      <LandingFooter />
    </div>
  );
}
