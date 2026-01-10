import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Check } from "lucide-react";

const tiers = [
  {
    name: "LinkUp Gold",
    price: "₦4,000",
    period: "/ month",
    features: [
      "Unlimited Swipes",
      "See who likes you",
      "5 Super Likes a week",
      "1 Profile Boost a month",
      "No ads",
    ],
    isPopular: true,
  },
  {
    name: "LinkUp Platinum",
    price: "₦7,000",
    period: "/ month",
    features: [
      "All Gold features",
      "Message before matching",
      "Priority Likes",
      "See likes from the last 7 days",
    ],
    isPopular: false,
  },
  {
    name: "Basic",
    price: "Free",
    period: "",
    features: [
      "Limited Swipes",
      "Send and receive messages",
      "Set preferences",
    ],
    isPopular: false,
  },
];

export default function PremiumPage() {
  return (
    <div className="container mx-auto max-w-5xl py-8">
      <div className="text-center">
        <h1 className="font-headline text-4xl font-bold">Upgrade Your Experience</h1>
        <p className="mt-2 text-lg text-muted-foreground">
          Choose a plan that works for you and unlock exclusive features to find your match faster.
        </p>
      </div>

      <div className="mt-12 grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
        {tiers.sort((a,b) => (a.price === 'Free' ? 1 : b.price === 'Free' ? -1 : 0)).map((tier) => (
          <Card key={tier.name} className={`flex flex-col ${tier.isPopular ? 'border-2 border-accent shadow-accent/20 shadow-lg' : ''}`}>
            <CardHeader>
              <CardTitle className="font-headline">{tier.name}</CardTitle>
              <CardDescription>
                <span className="text-3xl font-bold text-foreground">{tier.price}</span>
                <span className="text-muted-foreground">{tier.period}</span>
              </CardDescription>
            </CardHeader>
            <CardContent className="flex-1">
              <ul className="space-y-3">
                {tier.features.map((feature) => (
                  <li key={feature} className="flex items-center">
                    <Check className="mr-2 h-5 w-5 text-green-500" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
            <CardFooter>
              <Button disabled={tier.price === 'Free'} className={`w-full ${tier.isPopular ? 'bg-accent text-accent-foreground hover:bg-accent/90' : 'bg-primary text-primary-foreground hover:bg-primary/90'}`}>
                {tier.price === 'Free' ? 'Current Plan' : 'Choose Plan'}
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}
