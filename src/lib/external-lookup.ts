export interface ExternalResult {
  database: string;
  found: boolean | null; // null = couldn't check
  message: string;
  url: string;
}

export async function lookupAAHA(
  _microchipId: string
): Promise<ExternalResult> {
  // AAHA's petmicrochiplookup.org blocks automated requests.
  // We provide a direct link for the user to check manually.
  // Once we're an approved participating registry, this will use their API.
  return {
    database: "AAHA Universal Pet Microchip Lookup",
    found: null,
    message: "Check on AAHA's universal lookup — covers HomeAgain, Found.org, 24PetWatch, and 100+ US/Canadian registries",
    url: `https://www.petmicrochiplookup.org/`,
  };
}

export async function lookupEuropetnet(
  microchipId: string
): Promise<ExternalResult> {
  return {
    database: "Europetnet",
    found: null,
    message: "Search across European pet databases including all EU member states",
    url: `https://www.europetnet.com/pet-search/?chip=${encodeURIComponent(microchipId)}`,
  };
}

export async function lookupCheckAChip(
  microchipId: string
): Promise<ExternalResult> {
  return {
    database: "Check a Chip (UK)",
    found: null,
    message: "Search UK DEFRA-compliant databases for this microchip",
    url: `https://www.checkachip.com/chip-checker?chipNumber=${encodeURIComponent(microchipId)}`,
  };
}

export async function lookupAllExternal(
  microchipId: string
): Promise<ExternalResult[]> {
  const results = await Promise.all([
    lookupAAHA(microchipId),
    lookupEuropetnet(microchipId),
    lookupCheckAChip(microchipId),
  ]);
  return results;
}
