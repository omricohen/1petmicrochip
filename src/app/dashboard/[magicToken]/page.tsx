"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  PawPrint,
  User,
  Search,
  Save,
  Shield,
  Eye,
} from "lucide-react";

interface Pet {
  id: string;
  microchipId: string;
  name: string;
  species: string;
  breed: string | null;
  color: string | null;
  lookupCount: number;
  recentLookups: { date: string; foundInDb: string | null }[];
}

interface DashboardData {
  owner: {
    name: string;
    email: string;
    phone: string;
    emergencyName: string | null;
    emergencyPhone: string | null;
  };
  pets: Pet[];
}

export default function DashboardPage() {
  const params = useParams();
  const magicToken = params.magicToken as string;

  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Editable owner fields
  const [ownerName, setOwnerName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [emergencyName, setEmergencyName] = useState("");
  const [emergencyPhone, setEmergencyPhone] = useState("");

  useEffect(() => {
    fetch(`/api/dashboard?token=${magicToken}`)
      .then((r) => {
        if (!r.ok) throw new Error("Invalid link");
        return r.json();
      })
      .then((d: DashboardData) => {
        setData(d);
        setOwnerName(d.owner.name);
        setEmail(d.owner.email);
        setPhone(d.owner.phone);
        setEmergencyName(d.owner.emergencyName || "");
        setEmergencyPhone(d.owner.emergencyPhone || "");
      })
      .catch(() => setError("Invalid or expired dashboard link."))
      .finally(() => setLoading(false));
  }, [magicToken]);

  const handleSave = async () => {
    setSaving(true);
    setSuccess("");
    setError("");

    try {
      const res = await fetch("/api/dashboard", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          token: magicToken,
          ownerName,
          email,
          phone,
          emergencyName,
          emergencyPhone,
        }),
      });

      if (!res.ok) {
        const d = await res.json();
        setError(d.error || "Update failed");
      } else {
        setSuccess("Changes saved successfully!");
      }
    } catch {
      setError("Failed to save changes.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="text-center py-20">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4" />
        <p className="text-muted-foreground">Loading dashboard...</p>
      </div>
    );
  }

  if (error && !data) {
    return (
      <div className="mx-auto max-w-xl px-4 py-16 text-center">
        <h1 className="text-2xl font-bold mb-4">Dashboard Unavailable</h1>
        <p className="text-muted-foreground">{error}</p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-10">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Owner Dashboard</h1>
        <p className="text-muted-foreground">
          Manage your pet registrations and contact info
        </p>
      </div>

      {/* Pets */}
      <div className="space-y-4 mb-8">
        <h2 className="text-xl font-semibold flex items-center gap-2">
          <PawPrint className="h-5 w-5 text-primary" />
          Your Pets
        </h2>
        {data?.pets.map((pet) => (
          <Card key={pet.id}>
            <CardContent className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-lg font-semibold">{pet.name}</h3>
                  <p className="text-sm text-muted-foreground capitalize">
                    {pet.species}
                    {pet.breed ? ` · ${pet.breed}` : ""}
                    {pet.color ? ` · ${pet.color}` : ""}
                  </p>
                </div>
                <Badge variant="secondary" className="shrink-0">
                  Chip: {pet.microchipId}
                </Badge>
              </div>

              <div className="flex items-center gap-6 text-sm">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Eye className="h-4 w-4" />
                  <span>
                    {pet.lookupCount} lookup{pet.lookupCount !== 1 ? "s" : ""}
                  </span>
                </div>
                {pet.recentLookups.length > 0 && (
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Search className="h-4 w-4" />
                    <span>
                      Last searched:{" "}
                      {new Date(
                        pet.recentLookups[0].date
                      ).toLocaleDateString()}
                    </span>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Owner Info */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="h-5 w-5 text-primary" />
            Your Information
          </CardTitle>
          <CardDescription className="flex items-center gap-1">
            <Shield className="h-3 w-3" />
            Private — never shown publicly
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <Label htmlFor="ownerName">Full Name</Label>
              <Input
                id="ownerName"
                value={ownerName}
                onChange={(e) => setOwnerName(e.target.value)}
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="phone">Phone</Label>
              <Input
                id="phone"
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="mt-1"
              />
            </div>
          </div>

          <div className="border-t pt-4">
            <h3 className="text-sm font-medium mb-3">
              Emergency Contact
            </h3>
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <Label htmlFor="emergencyName">Name</Label>
                <Input
                  id="emergencyName"
                  value={emergencyName}
                  onChange={(e) => setEmergencyName(e.target.value)}
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="emergencyPhone">Phone</Label>
                <Input
                  id="emergencyPhone"
                  type="tel"
                  value={emergencyPhone}
                  onChange={(e) => setEmergencyPhone(e.target.value)}
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
          {success && (
            <div className="bg-emerald-50 text-emerald-700 text-sm p-3 rounded-lg">
              {success}
            </div>
          )}

          <Button onClick={handleSave} disabled={saving} className="gap-2">
            {saving ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white" />
                Saving...
              </>
            ) : (
              <>
                <Save className="h-4 w-4" />
                Save Changes
              </>
            )}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
