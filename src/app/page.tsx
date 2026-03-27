import { SearchBox } from "@/components/search-box";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import {
  Shield,
  DollarSign,
  Globe,
  PawPrint,
  Heart,
  Zap,
} from "lucide-react";

export default function HomePage() {
  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/20" />
        <div className="relative mx-auto max-w-6xl px-4 py-16 sm:py-24 text-center">
          <Badge variant="success" className="mb-6 text-sm px-4 py-1.5">
            🎉 Free Forever — No hidden fees
          </Badge>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight mb-6">
            Find Any Pet&apos;s{" "}
            <span className="text-primary">Microchip</span>
            <br className="hidden sm:block" /> in Seconds
          </h1>

          <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto mb-10">
            Search across US, European, and UK databases. Register your pet&apos;s
            microchip for free. Help reunite lost pets with their families.
          </p>

          <SearchBox size="hero" />

          <p className="mt-4 text-sm text-muted-foreground">
            Searches 1PetMicrochip, AAHA, Europetnet, and Check-a-Chip databases
          </p>
        </div>
      </section>

      {/* Features */}
      <section className="mx-auto max-w-6xl px-4 py-16">
        <h2 className="text-3xl font-bold text-center mb-12">
          Why 1PetMicrochip?
        </h2>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          <FeatureCard
            icon={<DollarSign className="h-6 w-6" />}
            title="100% Free Registration"
            description="Register your pet's microchip at no cost. No annual fees, no premium tiers. Free today, free forever."
          />
          <FeatureCard
            icon={<Globe className="h-6 w-6" />}
            title="Global Database Search"
            description="One search checks AAHA (US/Canada), Europetnet (Europe), Check-a-Chip (UK), and our own growing database."
          />
          <FeatureCard
            icon={<Shield className="h-6 w-6" />}
            title="Privacy Protected"
            description="Your contact info is never shown publicly. Found-pet contacts go through secure anonymous relay."
          />
          <FeatureCard
            icon={<Zap className="h-6 w-6" />}
            title="Instant Lookup"
            description="Enter any 9-15 digit microchip number and get results in seconds. No account needed to search."
          />
          <FeatureCard
            icon={<Heart className="h-6 w-6" />}
            title="Reunite Lost Pets"
            description="Someone found your pet? For just $1, they can send you an anonymous message. You'll be connected instantly."
          />
          <FeatureCard
            icon={<PawPrint className="h-6 w-6" />}
            title="All Pets Welcome"
            description="Dogs, cats, rabbits, birds, horses — if it has a microchip, we'll register it."
          />
        </div>
      </section>

      {/* How It Works */}
      <section className="bg-muted/30 py-16">
        <div className="mx-auto max-w-6xl px-4">
          <h2 className="text-3xl font-bold text-center mb-12">
            How It Works
          </h2>
          <div className="grid gap-8 sm:grid-cols-3">
            <Step
              number="1"
              title="Look Up"
              description="Enter the microchip number. We search our database and link you to major international registries."
            />
            <Step
              number="2"
              title="Register Free"
              description="Not registered yet? Add your pet's info in under 2 minutes. It's free, forever."
            />
            <Step
              number="3"
              title="Get Reunited"
              description="Found a chipped pet? Pay $1 to send the owner an anonymous message. No phone numbers shared."
            />
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="mx-auto max-w-6xl px-4 py-16 text-center">
        <h2 className="text-3xl font-bold mb-4">
          Protect Your Pet Today
        </h2>
        <p className="text-lg text-muted-foreground mb-8 max-w-xl mx-auto">
          Registration takes less than 2 minutes and it&apos;s completely free.
          Give yourself peace of mind.
        </p>
        <Link href="/register">
          <Button size="lg" className="text-lg px-10">
            Register Your Pet Free →
          </Button>
        </Link>
      </section>
    </>
  );
}

function FeatureCard({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <Card className="transition-shadow hover:shadow-md">
      <CardContent className="p-6">
        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary mb-4">
          {icon}
        </div>
        <h3 className="font-semibold text-lg mb-2">{title}</h3>
        <p className="text-sm text-muted-foreground">{description}</p>
      </CardContent>
    </Card>
  );
}

function Step({
  number,
  title,
  description,
}: {
  number: string;
  title: string;
  description: string;
}) {
  return (
    <div className="text-center">
      <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-primary text-primary-foreground text-xl font-bold mb-4">
        {number}
      </div>
      <h3 className="font-semibold text-lg mb-2">{title}</h3>
      <p className="text-sm text-muted-foreground">{description}</p>
    </div>
  );
}
