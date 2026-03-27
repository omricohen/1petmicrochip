"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { validateMicrochipId, formatMicrochipId } from "@/lib/utils";

export function SearchBox({ size = "default" }: { size?: "default" | "hero" }) {
  const [chip, setChip] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const formatted = formatMicrochipId(chip);
    if (!formatted) {
      setError("Please enter a microchip number");
      return;
    }
    if (!validateMicrochipId(formatted)) {
      setError("Microchip numbers are 9-15 digits");
      return;
    }
    setError("");
    router.push(`/search?chip=${formatted}`);
  };

  const isHero = size === "hero";

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-xl mx-auto">
      <div className={`flex gap-2 ${isHero ? "flex-col sm:flex-row" : ""}`}>
        <div className="relative flex-1">
          <Search className={`absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground ${isHero ? "h-5 w-5" : "h-4 w-4"}`} />
          <Input
            type="text"
            inputMode="numeric"
            placeholder="Enter microchip number..."
            value={chip}
            onChange={(e) => {
              setChip(e.target.value);
              setError("");
            }}
            className={`${isHero ? "h-14 text-lg pl-11" : "pl-10"}`}
          />
        </div>
        <Button type="submit" size={isHero ? "lg" : "default"} className={isHero ? "sm:w-auto w-full" : ""}>
          Look Up
        </Button>
      </div>
      {error && <p className="text-destructive text-sm mt-2">{error}</p>}
    </form>
  );
}
