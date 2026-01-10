import Link from "next/link";
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

export default function SignupPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4 relative">
       <ThemeToggle className="absolute top-4 right-4" />
       <div className="w-full max-w-md">
        <div className="mb-8 flex justify-center">
            <Logo />
        </div>
        <Card>
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
  );
}
