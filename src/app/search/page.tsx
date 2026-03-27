import { Suspense } from "react";
import { buildMetadata } from "@/lib/seo";
import { SearchResults } from "./search-results";

export const metadata = buildMetadata({
  title: "Microchip Lookup Results",
  description:
    "Search results for pet microchip lookup across US, European, and UK databases.",
  path: "/search",
});

export default function SearchPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-10">
      <Suspense
        fallback={
          <div className="text-center py-20">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4" />
            <p className="text-muted-foreground">Searching databases...</p>
          </div>
        }
      >
        <SearchResults />
      </Suspense>
    </div>
  );
}
