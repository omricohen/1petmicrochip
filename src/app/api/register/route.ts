import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { validateMicrochipId, formatMicrochipId } from "@/lib/utils";

export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      microchipId: rawChip,
      ownerName,
      ownerEmail,
      ownerPhone,
      petName,
      species,
      breed,
      color,
      emergencyName,
      emergencyPhone,
    } = body;

    // Validation
    if (!rawChip || !validateMicrochipId(rawChip)) {
      return NextResponse.json(
        { error: "Invalid microchip number. Must be 9-15 digits." },
        { status: 400 }
      );
    }
    if (!ownerName || !ownerEmail || !ownerPhone || !petName || !species) {
      return NextResponse.json(
        { error: "Missing required fields: ownerName, ownerEmail, ownerPhone, petName, species" },
        { status: 400 }
      );
    }

    const microchipId = formatMicrochipId(rawChip);

    // Check if already registered
    const existing = await prisma.pet.findUnique({
      where: { microchipId },
    });
    if (existing) {
      return NextResponse.json(
        { error: "This microchip is already registered." },
        { status: 409 }
      );
    }

    // Create owner and pet
    const owner = await prisma.owner.create({
      data: {
        name: ownerName,
        email: ownerEmail,
        phone: ownerPhone,
        emergencyName: emergencyName || null,
        emergencyPhone: emergencyPhone || null,
        pets: {
          create: {
            microchipId,
            name: petName,
            species,
            breed: breed || null,
            color: color || null,
          },
        },
      },
      include: {
        pets: true,
      },
    });

    return NextResponse.json({
      success: true,
      petId: owner.pets[0].id,
      magicToken: owner.magicToken,
      dashboardUrl: `/dashboard/${owner.magicToken}`,
    });
  } catch (error) {
    console.error("Registration error:", error);
    return NextResponse.json(
      { error: "Registration failed. Please try again." },
      { status: 500 }
    );
  }
}
