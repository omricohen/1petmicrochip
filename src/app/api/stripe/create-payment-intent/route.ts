import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";
import { getStripe, CONTACT_FEE_CENTS } from "@/lib/stripe";
import { prisma } from "@/lib/db";
import { validateMicrochipId } from "@/lib/utils";

export async function POST(request: NextRequest) {
  try {
    const { microchipId } = await request.json();

    if (!microchipId || !validateMicrochipId(microchipId)) {
      return NextResponse.json(
        { error: "Invalid microchip number" },
        { status: 400 }
      );
    }

    // Verify pet exists
    const pet = await prisma.pet.findUnique({
      where: { microchipId },
      include: { owner: { select: { name: true } } },
    });

    if (!pet) {
      return NextResponse.json(
        { error: "Pet not found in our database" },
        { status: 404 }
      );
    }

    const paymentIntent = await getStripe().paymentIntents.create({
      amount: CONTACT_FEE_CENTS,
      currency: "usd",
      metadata: {
        microchipId,
        petName: pet.name,
      },
      description: `Contact pet owner — ${pet.name} (chip: ${microchipId})`,
    });

    return NextResponse.json({
      clientSecret: paymentIntent.client_secret,
      petName: pet.name,
    });
  } catch (error) {
    console.error("Stripe error:", error);
    return NextResponse.json(
      { error: "Payment setup failed" },
      { status: 500 }
    );
  }
}
