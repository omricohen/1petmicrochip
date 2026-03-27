import { buildMetadata } from "@/lib/seo";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Shield, Heart, DollarSign, Globe } from "lucide-react";

export const metadata = buildMetadata({
  title: "About",
  description:
    "1PetMicrochip is a free forever pet microchip registry. Learn about our mission, privacy policy, and terms of service.",
  path: "/about",
});

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-10">
      <div className="text-center mb-12">
        <Badge variant="success" className="mb-4">Free Forever</Badge>
        <h1 className="text-4xl font-bold mb-4">About 1PetMicrochip</h1>
        <p className="text-lg text-muted-foreground">
          Helping reunite lost pets with their families — for free.
        </p>
      </div>

      <div className="prose prose-lg max-w-none space-y-8">
        <Card>
          <CardContent className="p-8 space-y-4">
            <h2 className="text-2xl font-bold flex items-center gap-2">
              <Heart className="h-6 w-6 text-red-500" />
              Our Mission
            </h2>
            <p className="text-muted-foreground leading-relaxed">
              Every year, millions of pets go missing. Many have microchips, but their
              owners haven&apos;t registered them — or their registration has lapsed because
              other registries charge annual fees.
            </p>
            <p className="text-muted-foreground leading-relaxed">
              <strong className="text-foreground">1PetMicrochip is different.</strong> We believe
              every pet deserves to be found. That&apos;s why registration is free — not
              &quot;free trial&quot; or &quot;free for the first year.&quot; Free forever. No catches.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-8 space-y-4">
            <h2 className="text-2xl font-bold flex items-center gap-2">
              <DollarSign className="h-6 w-6 text-primary" />
              How We Stay Free
            </h2>
            <p className="text-muted-foreground leading-relaxed">
              Our only revenue comes from the $1 contact fee. When someone finds a lost
              pet and wants to reach the owner, they pay $1 to send an anonymous message.
              This small fee covers our operating costs and prevents spam.
            </p>
            <p className="text-muted-foreground leading-relaxed">
              That&apos;s it. No ads. No selling data. No premium tiers. One dollar
              to reunite a pet with their family.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-8 space-y-4">
            <h2 className="text-2xl font-bold flex items-center gap-2">
              <Globe className="h-6 w-6 text-primary" />
              International Coverage
            </h2>
            <p className="text-muted-foreground leading-relaxed">
              In addition to our own database, we link to the world&apos;s major microchip
              registries so you can search everywhere from one place:
            </p>
            <ul className="space-y-2 text-muted-foreground">
              <li>
                <strong className="text-foreground">AAHA Universal Pet Microchip Lookup</strong> — Covers 100+ US and Canadian registries including HomeAgain, Found.org, and 24PetWatch
              </li>
              <li>
                <strong className="text-foreground">Europetnet</strong> — Aggregates pet databases across all EU member states
              </li>
              <li>
                <strong className="text-foreground">Check a Chip (UK)</strong> — Searches all DEFRA-compliant UK databases
              </li>
            </ul>
          </CardContent>
        </Card>

        <Card id="privacy">
          <CardContent className="p-8 space-y-4">
            <h2 className="text-2xl font-bold flex items-center gap-2">
              <Shield className="h-6 w-6 text-primary" />
              Privacy Policy
            </h2>
            <div className="space-y-3 text-muted-foreground text-sm leading-relaxed">
              <p>
                <strong className="text-foreground">Your contact info is private.</strong> We never
                display owner names, phone numbers, or email addresses in search results
                or to any third party.
              </p>
              <p>
                <strong className="text-foreground">Anonymous contact relay.</strong> When someone
                wants to contact a pet owner, we relay the message via SMS. The finder
                never sees the owner&apos;s phone number, and the owner never sees the
                finder&apos;s number. Both communicate through our secure relay.
              </p>
              <p>
                <strong className="text-foreground">Minimal data collection.</strong> We store only
                what&apos;s needed to operate the registry: microchip numbers, pet info, and
                owner contact details. We don&apos;t track you, sell your data, or show ads.
              </p>
              <p>
                <strong className="text-foreground">Data deletion.</strong> Contact us to remove your
                registration at any time.
              </p>
            </div>
          </CardContent>
        </Card>

        <Card id="terms">
          <CardContent className="p-8 space-y-4">
            <h2 className="text-2xl font-bold">Terms of Service</h2>
            <div className="space-y-3 text-muted-foreground text-sm leading-relaxed">
              <p>
                By using 1PetMicrochip, you agree to provide accurate information when
                registering a pet. You must be the legal owner of any pet you register.
              </p>
              <p>
                The $1 contact fee is non-refundable. We do our best to deliver your
                message, but cannot guarantee the owner will respond.
              </p>
              <p>
                We reserve the right to remove registrations that appear fraudulent or
                that violate these terms.
              </p>
              <p>
                This service is provided &quot;as is&quot; without warranty. While we strive
                for accuracy, we cannot guarantee that all microchip data across
                external databases is current or complete.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
