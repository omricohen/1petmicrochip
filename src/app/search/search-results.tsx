"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { SearchBox } from "@/components/search-box";
import {
  ExternalLink,
  AlertCircle,
  PawPrint,
  MessageSquare,
  UserPlus,
} from "lucide-react";

interface LocalResult {
  found: boolean;
  pet?: {
    name: string;
    species: string;
    breed: string | null;
    color: string | null;
    microchipId: string;
  };
}

interface ExternalResult {
  database: string;
  found: boolean | null;
  message: string;
  url: string;
}

export function SearchResults() {
  const searchParams = useSearchParams();
  const chip = searchParams.get("chip") || "";
  const [localResult, setLocalResult] = useState<LocalResult | null>(null);
  const [externalResults, setExternalResults] = useState<ExternalResult[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!chip) return;
    setLoading(true);

    Promise.all([
      fetch(`/api/lookup?chip=${chip}`).then((r) => r.json()),
      fetch(`/api/lookup/external?chip=${chip}`).then((r) => r.json()),
    ])
      .then(([local, external]) => {
        setLocalResult(local);
        setExternalResults(external.results || []);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [chip]);

  if (!chip) {
    return (
      <div className="text-center py-16">
        <h1 className="text-2xl font-bold mb-6">Look Up a Microchip</h1>
        <SearchBox />
      </div>
    );
  }

  if (loading) {
    return (
      <div className="text-center py-20">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4" />
        <p className="text-muted-foreground">
          Searching databases for {chip}...
        </p>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold mb-2">
          Results for Microchip #{chip}
        </h1>
        <p className="text-muted-foreground">
          Searched 1PetMicrochip and linked to international databases
        </p>
      </div>

      {/* Local Result */}
      <Card
        className={`mb-6 ${
          localResult?.found
            ? "border-emerald-300 bg-emerald-50/50"
            : "border-amber-200 bg-amber-50/30"
        }`}
      >
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg flex items-center gap-2">
              <PawPrint className="h-5 w-5 text-primary" />
              1PetMicrochip Database
            </CardTitle>
            {localResult?.found ? (
              <Badge variant="success">✓ Found</Badge>
            ) : (
              <Badge variant="secondary">Not Found</Badge>
            )}
          </div>
        </CardHeader>
        <CardContent>
          {localResult?.found && localResult.pet ? (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-muted-foreground">Pet Name:</span>{" "}
                  <strong>{localResult.pet.name}</strong>
                </div>
                <div>
                  <span className="text-muted-foreground">Species:</span>{" "}
                  <strong className="capitalize">
                    {localResult.pet.species}
                  </strong>
                </div>
                {localResult.pet.breed && (
                  <div>
                    <span className="text-muted-foreground">Breed:</span>{" "}
                    <strong>{localResult.pet.breed}</strong>
                  </div>
                )}
                {localResult.pet.color && (
                  <div>
                    <span className="text-muted-foreground">Color:</span>{" "}
                    <strong>{localResult.pet.color}</strong>
                  </div>
                )}
              </div>
              <div className="pt-2 border-t">
                <Link href={`/contact/${chip}`}>
                  <Button className="gap-2">
                    <MessageSquare className="h-4 w-4" />
                    Contact Owner ($1)
                  </Button>
                </Link>
                <p className="text-xs text-muted-foreground mt-2">
                  Owner info is private. Pay $1 to send them an anonymous
                  message.
                </p>
              </div>
            </div>
          ) : (
            <div className="flex items-start gap-3">
              <AlertCircle className="h-5 w-5 text-amber-600 mt-0.5 shrink-0" />
              <div>
                <p className="text-sm mb-3">
                  This microchip is not yet registered in our database.
                </p>
                <Link href={`/register?chip=${chip}`}>
                  <Button variant="outline" className="gap-2">
                    <UserPlus className="h-4 w-4" />
                    Register This Chip Free
                  </Button>
                </Link>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* External Results */}
      <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
        <ExternalLink className="h-5 w-5" />
        Other Databases
      </h2>
      <div className="space-y-3">
        {externalResults.map((result, i) => (
          <Card key={i}>
            <CardContent className="p-4 flex items-center justify-between">
              <div>
                <h3 className="font-medium">{result.database}</h3>
                <p className="text-sm text-muted-foreground">
                  {result.message}
                </p>
              </div>
              <a href={result.url} target="_blank" rel="noopener noreferrer">
                <Button variant="outline" size="sm" className="gap-2 shrink-0">
                  <ExternalLink className="h-3 w-3" />
                  Check
                </Button>
              </a>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Search Again */}
      <div className="mt-10 pt-8 border-t">
        <h3 className="font-medium mb-4 text-center">Search Another Chip</h3>
        <SearchBox />
      </div>
    </div>
  );
}
