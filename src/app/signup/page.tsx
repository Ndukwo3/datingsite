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
  const signupImage = PlaceHolderImages.find(p => p.id === 'signup-hero');

  return (
    <div className="w-full lg:grid lg:min-h-screen lg:grid-cols-2">
      <div className="flex items-center justify-center py-12 px-4 relative">
        <ThemeToggle className="absolute top-4 right-4 lg:top-6 lg:right-6" />
        <div className="w-full max-w-md space-y-6">
            <div className="flex justify-center lg:justify-start">
                <Logo />
            </div>
            <Card>
              <CardHeader className="space-y-1 text-center lg:text-left">
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
      <div className="hidden lg:block relative">
        {signupImage && (
            <Image
              src={signupImage.imageUrl}
              alt={signupImage.description}
              fill
              className="object-cover"
              data-ai-hint={signupImage.imageHint}
            />
        )}
        <div className="absolute inset-0 bg-black/30" />
      </div>
    </div>
  );
}

    