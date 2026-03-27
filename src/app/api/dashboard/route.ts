import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  const token = request.nextUrl.searchParams.get("token");
  if (!token) {
    return NextResponse.json({ error: "Missing token" }, { status: 400 });
  }

  const owner = await prisma.owner.findUnique({
    where: { magicToken: token },
    include: {
      pets: {
        include: {
          lookups: {
            orderBy: { createdAt: "desc" },
            take: 20,
          },
          _count: {
            select: { lookups: true },
          },
        },
      },
    },
  });

  if (!owner) {
    return NextResponse.json({ error: "Invalid token" }, { status: 404 });
  }

  return NextResponse.json({
    owner: {
      name: owner.name,
      email: owner.email,
      phone: owner.phone,
      emergencyName: owner.emergencyName,
      emergencyPhone: owner.emergencyPhone,
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    pets: owner.pets.map((pet: any) => ({
      id: pet.id,
      microchipId: pet.microchipId,
      name: pet.name,
      species: pet.species,
      breed: pet.breed,
      color: pet.color,
      lookupCount: pet._count.lookups,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      recentLookups: pet.lookups.map((l: any) => ({
        date: l.createdAt,
        foundInDb: l.foundInDb,
      })),
    })),
  });
}

export async function PUT(request: NextRequest) {
  try {
    const { token, ownerName, email, phone, emergencyName, emergencyPhone, petUpdates } =
      await request.json();

    if (!token) {
      return NextResponse.json({ error: "Missing token" }, { status: 400 });
    }

    const owner = await prisma.owner.findUnique({
      where: { magicToken: token },
    });

    if (!owner) {
      return NextResponse.json({ error: "Invalid token" }, { status: 404 });
    }

    // Update owner info
    await prisma.owner.update({
      where: { id: owner.id },
      data: {
        name: ownerName || owner.name,
        email: email || owner.email,
        phone: phone || owner.phone,
        emergencyName: emergencyName !== undefined ? emergencyName : owner.emergencyName,
        emergencyPhone: emergencyPhone !== undefined ? emergencyPhone : owner.emergencyPhone,
      },
    });

    // Update pets if provided
    if (petUpdates && Array.isArray(petUpdates)) {
      for (const update of petUpdates) {
        if (update.id) {
          await prisma.pet.update({
            where: { id: update.id },
            data: {
              name: update.name,
              species: update.species,
              breed: update.breed,
              color: update.color,
            },
          });
        }
      }
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Dashboard update error:", error);
    return NextResponse.json(
      { error: "Update failed" },
      { status: 500 }
    );
  }
}
