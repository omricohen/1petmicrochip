"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { MessageSquare, Shield, CreditCard, Heart } from "lucide-react";

export default function ContactOwnerPage() {
  const params = useParams();
  const router = useRouter();
  const microchipId = params.microchipId as string;

  const [step, setStep] = useState<"message" | "payment" | "sending">("message");
  const [petName, setPetName] = useState("");
  const [message, setMessage] = useState("");
  const [finderPhone, setFinderPhone] = useState("");
  const [finderEmail, setFinderEmail] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Verify pet exists
    fetch(`/api/lookup?chip=${microchipId}`)
      .then((r) => r.json())
      .then((data) => {
        if (data.found) {
          setPetName(data.pet.name);
        } else {
          setError("This microchip is not registered in our database.");
        }
      })
      .catch(() => setError("Failed to look up this microchip."))
      .finally(() => setLoading(false));
  }, [microchipId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) {
      setError("Please enter a message for the pet owner.");
      return;
    }
    setStep("sending");
    setError("");

    try {
      // Create payment intent
      const payRes = await fetch("/api/stripe/create-payment-intent", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ microchipId }),
      });

      if (!payRes.ok) {
        const payData = await payRes.json();
        setError(payData.error || "Payment setup failed");
        setStep("message");
        return;
      }

      // In production, this would use Stripe Elements for card input.
      // For now, we simulate a successful payment and send the contact.
      const payData = await payRes.json();

      // Send contact message
      const contactRes = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          microchipId,
          message: message.trim(),
          finderPhone,
          finderEmail,
          paymentIntentId: payData.clientSecret?.split("_secret_")[0],
        }),
      });

      if (!contactRes.ok) {
        const contactData = await contactRes.json();
        setError(contactData.error || "Failed to send message");
        setStep("message");
        return;
      }

      router.push("/contact/success");
    } catch {
      setError("Something went wrong. Please try again.");
      setStep("message");
    }
  };

  if (loading) {
    return (
      <div className="text-center py-20">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4" />
        <p className="text-muted-foreground">Loading...</p>
      </div>
    );
  }

  if (error && !petName) {
    return (
      <div className="mx-auto max-w-xl px-4 py-16 text-center">
        <h1 className="text-2xl font-bold mb-4">Pet Not Found</h1>
        <p className="text-muted-foreground">{error}</p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-xl px-4 py-10">
      <div className="text-center mb-8">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 mb-4">
          <Heart className="h-8 w-8 text-primary" />
        </div>
        <h1 className="text-2xl font-bold mb-2">
          Help Reunite {petName} With Their Owner
        </h1>
        <p className="text-muted-foreground">
          Send an anonymous message to the registered owner for just $1
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <MessageSquare className="h-5 w-5 text-primary" />
            Contact the Owner
          </CardTitle>
          <CardDescription className="flex items-center gap-2">
            <Shield className="h-3 w-3" />
            The owner&apos;s contact info stays private. Your message is relayed anonymously.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <Label htmlFor="message">Your Message *</Label>
              <Textarea
                id="message"
                placeholder={`Hi! I think I found ${petName}. I'm at...`}
                value={message}
                onChange={(e) => {
                  setMessage(e.target.value);
                  setError("");
                }}
                rows={4}
                required
                className="mt-1"
              />
              <p className="text-xs text-muted-foreground mt-1">
                Include your location and how they can reach you
              </p>
            </div>

            <div>
              <Label htmlFor="finderPhone">Your Phone (optional)</Label>
              <Input
                id="finderPhone"
                type="tel"
                placeholder="+1 (555) 123-4567"
                value={finderPhone}
                onChange={(e) => setFinderPhone(e.target.value)}
                className="mt-1"
              />
            </div>

            <div>
              <Label htmlFor="finderEmail">Your Email (optional)</Label>
              <Input
                id="finderEmail"
                type="email"
                placeholder="your@email.com"
                value={finderEmail}
                onChange={(e) => setFinderEmail(e.target.value)}
                className="mt-1"
              />
            </div>

            {error && (
              <div className="bg-destructive/10 text-destructive text-sm p-3 rounded-lg">
                {error}
              </div>
            )}

            <div className="bg-muted/50 rounded-lg p-4 space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span>Contact fee</span>
                <span className="font-semibold">$1.00</span>
              </div>
              <p className="text-xs text-muted-foreground">
                This small fee helps keep registrations free for everyone and prevents spam.
              </p>
            </div>

            <Button
              type="submit"
              size="lg"
              className="w-full gap-2"
              disabled={step === "sending"}
            >
              {step === "sending" ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white" />
                  Sending...
                </>
              ) : (
                <>
                  <CreditCard className="h-5 w-5" />
                  Pay $1 & Send Message
                </>
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
