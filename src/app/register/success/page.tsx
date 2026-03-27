"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle, ExternalLink, Home } from "lucide-react";

function SuccessContent() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const petName = searchParams.get("pet");

  return (
    <div className="mx-auto max-w-xl px-4 py-16 text-center">
      <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-emerald-100 mb-6">
        <CheckCircle className="h-10 w-10 text-emerald-600" />
      </div>

      <h1 className="text-3xl font-bold mb-3">
        {petName ? `${petName} is Registered!` : "Registration Complete!"}
      </h1>
      <p className="text-muted-foreground text-lg mb-8">
        Your pet&apos;s microchip is now in our free registry. If someone finds your
        pet, they can look up the chip and contact you securely.
      </p>

      <Card className="mb-8 text-left">
        <CardContent className="p-6 space-y-4">
          <h3 className="font-semibold">What happens next?</h3>
          <ul className="space-y-3 text-sm text-muted-foreground">
            <li className="flex gap-2">
              <CheckCircle className="h-4 w-4 text-emerald-600 mt-0.5 shrink-0" />
              Your pet is searchable in the 1PetMicrochip database
            </li>
            <li className="flex gap-2">
              <CheckCircle className="h-4 w-4 text-emerald-600 mt-0.5 shrink-0" />
              If someone finds your pet, they can send you an anonymous message
            </li>
            <li className="flex gap-2">
              <CheckCircle className="h-4 w-4 text-emerald-600 mt-0.5 shrink-0" />
              Your contact info is never shared — we relay messages securely
            </li>
            <li className="flex gap-2">
              <CheckCircle className="h-4 w-4 text-emerald-600 mt-0.5 shrink-0" />
              You can update your info anytime via your dashboard
            </li>
          </ul>
        </CardContent>
      </Card>

      <div className="flex flex-col sm:flex-row gap-3 justify-center">
        {token && (
          <Link href={`/dashboard/${token}`}>
            <Button variant="outline" className="gap-2 w-full sm:w-auto">
              <ExternalLink className="h-4 w-4" />
              Go to Dashboard
            </Button>
          </Link>
        )}
        <Link href="/">
          <Button className="gap-2 w-full sm:w-auto">
            <Home className="h-4 w-4" />
            Back to Home
          </Button>
        </Link>
      </div>

      {token && (
        <p className="text-xs text-muted-foreground mt-6">
          Bookmark your dashboard link to manage your pet&apos;s registration anytime:
          <br />
          <code className="bg-muted px-2 py-1 rounded text-xs break-all">
            {typeof window !== "undefined" ? window.location.origin : ""}/dashboard/{token}
          </code>
        </p>
      )}
    </div>
  );
}

export default function RegisterSuccessPage() {
  return (
    <Suspense fallback={<div className="py-20 text-center text-muted-foreground">Loading...</div>}>
      <SuccessContent />
    </Suspense>
  );
}
