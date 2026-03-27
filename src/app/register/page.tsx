"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { PawPrint, Shield, CheckCircle } from "lucide-react";

function RegisterForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [form, setForm] = useState({
    microchipId: "",
    petName: "",
    species: "dog",
    breed: "",
    color: "",
    ownerName: "",
    ownerEmail: "",
    ownerPhone: "",
    emergencyName: "",
    emergencyPhone: "",
  });

  useEffect(() => {
    const chip = searchParams.get("chip");
    if (chip) {
      setForm((f) => ({ ...f, microchipId: chip }));
    }
  }, [searchParams]);

  const updateField = (field: string, value: string) => {
    setForm((f) => ({ ...f, [field]: value }));
    setError("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Registration failed");
        return;
      }

      router.push(
        `/register/success?token=${data.magicToken}&pet=${encodeURIComponent(form.petName)}`
      );
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-2xl px-4 py-10">
      <div className="text-center mb-8">
        <Badge variant="success" className="mb-4">Free Forever</Badge>
        <h1 className="text-3xl font-bold mb-2">Register Your Pet&apos;s Microchip</h1>
        <p className="text-muted-foreground">
          Takes less than 2 minutes. No account needed. No hidden fees.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <PawPrint className="h-5 w-5 text-primary" />
            Registration Form
          </CardTitle>
          <CardDescription>All fields marked with * are required</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Microchip */}
            <div>
              <Label htmlFor="microchipId">Microchip Number *</Label>
              <Input
                id="microchipId"
                type="text"
                inputMode="numeric"
                placeholder="Enter 9-15 digit microchip number"
                value={form.microchipId}
                onChange={(e) => updateField("microchipId", e.target.value)}
                required
                className="mt-1"
              />
              <p className="text-xs text-muted-foreground mt-1">
                Found on your vet records or microchip paperwork
              </p>
            </div>

            {/* Pet Info */}
            <div className="border-t pt-6">
              <h3 className="font-medium mb-4">Pet Information</h3>
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <Label htmlFor="petName">Pet Name *</Label>
                  <Input
                    id="petName"
                    placeholder="e.g., Buddy"
                    value={form.petName}
                    onChange={(e) => updateField("petName", e.target.value)}
                    required
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="species">Species *</Label>
                  <select
                    id="species"
                    value={form.species}
                    onChange={(e) => updateField("species", e.target.value)}
                    className="mt-1 flex h-11 w-full rounded-lg border border-input bg-background px-4 py-2 text-sm"
                    required
                  >
                    <option value="dog">Dog</option>
                    <option value="cat">Cat</option>
                    <option value="bird">Bird</option>
                    <option value="rabbit">Rabbit</option>
                    <option value="horse">Horse</option>
                    <option value="other">Other</option>
                  </select>
                </div>
                <div>
                  <Label htmlFor="breed">Breed</Label>
                  <Input
                    id="breed"
                    placeholder="e.g., Golden Retriever"
                    value={form.breed}
                    onChange={(e) => updateField("breed", e.target.value)}
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="color">Color</Label>
                  <Input
                    id="color"
                    placeholder="e.g., Golden"
                    value={form.color}
                    onChange={(e) => updateField("color", e.target.value)}
                    className="mt-1"
                  />
                </div>
              </div>
            </div>

            {/* Owner Info */}
            <div className="border-t pt-6">
              <h3 className="font-medium mb-1">Your Information</h3>
              <p className="text-xs text-muted-foreground mb-4 flex items-center gap-1">
                <Shield className="h-3 w-3" /> Your contact info is private and never shown publicly
              </p>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="sm:col-span-2">
                  <Label htmlFor="ownerName">Full Name *</Label>
                  <Input
                    id="ownerName"
                    placeholder="Your full name"
                    value={form.ownerName}
                    onChange={(e) => updateField("ownerName", e.target.value)}
                    required
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="ownerEmail">Email *</Label>
                  <Input
                    id="ownerEmail"
                    type="email"
                    placeholder="your@email.com"
                    value={form.ownerEmail}
                    onChange={(e) => updateField("ownerEmail", e.target.value)}
                    required
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="ownerPhone">Phone *</Label>
                  <Input
                    id="ownerPhone"
                    type="tel"
                    placeholder="+1 (555) 123-4567"
                    value={form.ownerPhone}
                    onChange={(e) => updateField("ownerPhone", e.target.value)}
                    required
                    className="mt-1"
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    Used only for lost pet notifications
                  </p>
                </div>
              </div>
            </div>

            {/* Emergency Contact */}
            <div className="border-t pt-6">
              <h3 className="font-medium mb-4">Emergency Contact (Optional)</h3>
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <Label htmlFor="emergencyName">Name</Label>
                  <Input
                    id="emergencyName"
                    placeholder="Emergency contact name"
                    value={form.emergencyName}
                    onChange={(e) => updateField("emergencyName", e.target.value)}
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="emergencyPhone">Phone</Label>
                  <Input
                    id="emergencyPhone"
                    type="tel"
                    placeholder="+1 (555) 987-6543"
                    value={form.emergencyPhone}
                    onChange={(e) => updateField("emergencyPhone", e.target.value)}
                    className="mt-1"
                  />
                </div>
              </div>
            </div>

            {error && (
              <div className="bg-destructive/10 text-destructive text-sm p-3 rounded-lg">
                {error}
              </div>
            )}

            <Button type="submit" size="lg" className="w-full" disabled={loading}>
              {loading ? (
                <span className="flex items-center gap-2">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white" />
                  Registering...
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5" />
                  Register for Free
                </span>
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

export default function RegisterPage() {
  return (
    <Suspense fallback={<div className="py-20 text-center text-muted-foreground">Loading...</div>}>
      <RegisterForm />
    </Suspense>
  );
}
