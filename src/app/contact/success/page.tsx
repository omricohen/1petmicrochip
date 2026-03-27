import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle, Home, Heart } from "lucide-react";
import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({
  title: "Message Sent",
  description: "Your message has been sent to the pet owner.",
  path: "/contact/success",
  noIndex: true,
});

export default function ContactSuccessPage() {
  return (
    <div className="mx-auto max-w-xl px-4 py-16 text-center">
      <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-emerald-100 mb-6">
        <CheckCircle className="h-10 w-10 text-emerald-600" />
      </div>

      <h1 className="text-3xl font-bold mb-3">Message Sent!</h1>
      <p className="text-muted-foreground text-lg mb-8">
        The pet owner has been notified via SMS. They can reply directly to
        connect with you. Thank you for helping reunite a pet with their family!
      </p>

      <Card className="mb-8 text-left">
        <CardContent className="p-6 space-y-3">
          <h3 className="font-semibold flex items-center gap-2">
            <Heart className="h-4 w-4 text-red-500" />
            What happens now?
          </h3>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li>• The owner received your message via text</li>
            <li>• They can reply through our secure relay — no numbers shared</li>
            <li>• Most owners respond within minutes to hours</li>
            <li>• Keep the pet safe and comfortable while you wait</li>
          </ul>
        </CardContent>
      </Card>

      <Link href="/">
        <Button className="gap-2">
          <Home className="h-4 w-4" />
          Back to Home
        </Button>
      </Link>
    </div>
  );
}
