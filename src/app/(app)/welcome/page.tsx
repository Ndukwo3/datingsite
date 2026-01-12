
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

const rules = [
    "Be respectful to all members.",
    "No harassment, hate speech, or bullying.",
    "Post authentic photos and information about yourself.",
    "No spam, scams, or commercial solicitation.",
    "Report any suspicious or harmful behavior to our team.",
    "Have fun and make genuine connections!"
];

export default function WelcomePage() {
    return (
        <div className="max-w-3xl mx-auto py-8">
            <Card className="bg-card">
                <CardHeader className="text-center">
                    <CardTitle className="font-headline text-3xl font-bold">Welcome to LinkUp9ja!</CardTitle>
                    <CardDescription className="text-lg">We're excited to have you join our community.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div>
                        <h2 className="font-semibold text-xl mb-4 text-center">Our Community Guidelines</h2>
                        <p className="text-muted-foreground mb-6 text-center">To ensure a safe and positive experience for everyone, please follow these rules:</p>
                        <ul className="space-y-4">
                            {rules.map((rule, index) => (
                                <li key={index} className="flex items-start gap-3">
                                    <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 shrink-0" />
                                    <span>{rule}</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                    <div className="text-center pt-4">
                        <Button asChild size="lg">
                            <Link href="/discover">Start Swiping</Link>
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
