import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { validateMicrochipId, formatMicrochipId } from "@/lib/utils";

export const dynamic = "force-dynamic";

/**
 * AAHA-compatible lookup endpoint.
 * When 1PetMicrochip is approved as a participating registry in the
 * AAHA Universal Pet Microchip Lookup system, this endpoint will be
 * queried by their aggregator to check if a microchip is registered here.
 *
 * GET /api/aaha/lookup?microchip_id=XXXXXXXXXXXXXXX
 *
 * Returns:
 * {
 *   found: boolean,
 *   registry_name: "1PetMicrochip",
 *   registry_url: "https://1petmicrochip.com",
 *   microchip_id: "...",
 *   species?: "dog" | "cat" | ...,
 *   timestamp: "ISO date"
 * }
 */
export async function GET(request: NextRequest) {
  const chip = request.nextUrl.searchParams.get("microchip_id");

  if (!chip || !validateMicrochipId(chip)) {
    return NextResponse.json(
      {
        error: "Invalid or missing microchip_id parameter. Must be 9-15 digits.",
        registry_name: "1PetMicrochip",
      },
      { status: 400 }
    );
  }

  const microchipId = formatMicrochipId(chip);

  const pet = await prisma.pet.findUnique({
    where: { microchipId },
    select: {
      species: true,
      microchipId: true,
    },
  });

  // Log the lookup as coming from AAHA
  await prisma.lookup.create({
    data: {
      microchipId,
      foundInDb: pet ? "local" : null,
      ip: request.headers.get("x-forwarded-for") || undefined,
    },
  });

  if (pet) {
    return NextResponse.json({
      found: true,
      registry_name: "1PetMicrochip",
      registry_url: "https://1petmicrochip.com",
      microchip_id: pet.microchipId,
      species: pet.species,
      timestamp: new Date().toISOString(),
    });
  }

  return NextResponse.json({
    found: false,
    registry_name: "1PetMicrochip",
    registry_url: "https://1petmicrochip.com",
    microchip_id: microchipId,
    timestamp: new Date().toISOString(),
  });
}
