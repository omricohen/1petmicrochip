"use client";

import { useState, useEffect } from "react";
import { useParams, useSearchParams } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { MessageSquare, Shield, CreditCard, Heart, Loader2 } from "lucide-react";

export default function ContactOwnerPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const microchipId = params.microchipId as string;
  const cancelled = searchParams.get("cancelled");

  const [petName, setPetName] = useState("");
  const [message, setMessage] = useState("");
  const [finderPhone, setFinderPhone] = useState("");
  const [finderEmail, setFinderEmail] = useState("");
  const [error, setError] = useState(cancelled ? "Payment was cancelled. You can try again." : "");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetch(`/api/lookup?chip=${microchipId}`)
      .then((r) => r.json())
      .then((data) => {
        if (data.found) setPetName(data.pet.name);
        else setError("This microchip is not registered in our database.");
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
    setSubmitting(true);
    setError("");

    try {
      const res = await fetch("/api/stripe/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ microchipId, message: message.trim(), finderPhone, finderEmail }),
      });

      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      } else {
        setError(data.error || "Payment setup failed. Please try again.");
        setSubmitting(false);
      }
    } catch {
      setError("Something went wrong. Please try again.");
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-teal-50 to-white py-12 px-4">
      <div className="max-w-lg mx-auto">
        <Card className="shadow-lg">
          <CardHeader className="text-center">
            <div className="mx-auto mb-3 h-14 w-14 rounded-full bg-teal-100 flex items-center justify-center">
              <Heart className="h-7 w-7 text-teal-600" />
            </div>
            <CardTitle className="text-2xl">Contact {petName ? `${petName}&#39;s` : "Pet"} Owner</CardTitle>
            <CardDescription>
              Send an anonymous message to help reunite this pet with their family.
              Your contact info is never shared — all communication goes through our secure relay.
            </CardDescription>
          </CardHeader>
          <CardContent>
            {error && (
              <div className="mb-4 p-3 rounded-lg bg-red-50 text-red-700 text-sm">{error}</div>
            )}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="message">Your message to the owner *</Label>
                <Textarea
                  id="message"
                  placeholder={`Hi! I think I found ${petName || "your pet"}. I&apos;m at...`}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  rows={4}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Your phone number (optional)</Label>
                <Input
                  id="phone"
                  type="tel"
                  placeholder="+1 (555) 123-4567"
                  value={finderPhone}
                  onChange={(e) => setFinderPhone(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Your email (optional)</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="you@example.com"
                  value={finderEmail}
                  onChange={(e) => setFinderEmail(e.target.value)}
                />
              </div>

              <div className="bg-gray-50 rounded-lg p-4 space-y-2">
                <div className="flex items-center gap-2 text-sm font-medium">
                  <CreditCard className="h-4 w-4 text-teal-600" />
                  <span>$1.00 — Pet Reunification Fee</span>
                </div>
                <p className="text-xs text-muted-foreground">
                  This small fee covers the cost of sending an anonymous SMS to the pet owner.
                  100% of proceeds go toward keeping this registry free for everyone.
                </p>
              </div>

              <div className="flex items-start gap-2 text-xs text-muted-foreground">
                <Shield className="h-4 w-4 mt-0.5 shrink-0 text-teal-600" />
                <span>The owner&apos;s phone number is never revealed. All messages are relayed anonymously through our secure system.</span>
              </div>

              <Button type="submit" className="w-full h-12 text-base bg-teal-600 hover:bg-teal-700" disabled={submitting || !petName}>
                {submitting ? (
                  <><Loader2 className="h-4 w-4 mr-2 animate-spin" /> Redirecting to payment...</>
                ) : (
                  <><MessageSquare className="h-4 w-4 mr-2" /> Pay $1 & Send Message</>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
