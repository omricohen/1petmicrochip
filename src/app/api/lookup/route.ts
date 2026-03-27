import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { validateMicrochipId, formatMicrochipId } from "@/lib/utils";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  const chip = request.nextUrl.searchParams.get("chip");
  if (!chip || !validateMicrochipId(chip)) {
    return NextResponse.json(
      { error: "Invalid microchip number. Must be 9-15 digits." },
      { status: 400 }
    );
  }

  const microchipId = formatMicrochipId(chip);

  const pet = await prisma.pet.findUnique({
    where: { microchipId },
    select: {
      name: true,
      species: true,
      breed: true,
      color: true,
      photoUrl: true,
      microchipId: true,
    },
  });

  // Log the lookup
  await prisma.lookup.create({
    data: {
      microchipId,
      petId: pet ? (await prisma.pet.findUnique({ where: { microchipId }, select: { id: true } }))?.id : undefined,
      foundInDb: pet ? "local" : null,
      ip: request.headers.get("x-forwarded-for") || request.headers.get("x-real-ip") || undefined,
    },
  });

  if (pet) {
    return NextResponse.json({ found: true, pet, database: "1PetMicrochip" });
  }

  return NextResponse.json({ found: false });
}
