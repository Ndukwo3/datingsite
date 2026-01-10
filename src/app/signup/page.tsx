import Link from "next/link";
import Image from "next/image";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Logo } from "@/components/Logo";
import { ThemeToggle } from "@/components/ThemeToggle";
import { PlaceHolderImages } from "@/lib/placeholder-images";

export default function SignupPage() {
  const bgImage = PlaceHolderImages.find(p => p.id === 'hero-1');

  return (
    <div className="relative min-h-screen w-full">
      {bgImage && (
        <Image
          src={bgImage.imageUrl}
          alt={bgImage.description}
          fill
          className="object-cover opacity-50"
          data-ai-hint={bgImage.imageHint}
        />
      )}
      <ThemeToggle className="absolute top-4 right-4 z-10 text-white" />
      <div className="relative flex min-h-screen items-center justify-center p-4">
        <div className="w-full max-w-md">
          <div className="mb-8 flex justify-center">
            <Logo />
          </div>
          <Card className="bg-card/70 backdrop-blur-lg">
            <CardHeader className="space-y-1 text-center">
              <CardTitle className="font-headline text-2xl">Create an account</CardTitle>
              <CardDescription>
                Enter your information to get started
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="first-name">Name</Label>
                <Input id="first-name" placeholder="Aisha" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="m@example.com"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input id="password" type="password" />
              </div>
              <Button type="submit" className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-bold" asChild>
                <Link href="/onboarding">Create account</Link>
              </Button>
            </CardContent>
            <div className="mt-4 text-center text-sm p-6 pt-0">
              Already have an account?{" "}
              <Link href="/login" className="underline">
                Log in
              </Link>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
