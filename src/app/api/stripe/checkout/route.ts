import { NextRequest, NextResponse } from "next/server";
import { getStripe, CONTACT_FEE_CENTS } from "@/lib/stripe";
import { prisma } from "@/lib/db";
import { validateMicrochipId } from "@/lib/utils";

export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  try {
    const { microchipId, message, finderPhone, finderEmail } = await request.json();

    if (!microchipId || !validateMicrochipId(microchipId)) {
      return NextResponse.json({ error: "Invalid microchip number" }, { status: 400 });
    }
    if (!message) {
      return NextResponse.json({ error: "Message is required" }, { status: 400 });
    }

    const pet = await prisma.pet.findUnique({
      where: { microchipId },
      include: { owner: { select: { name: true } } },
    });

    if (!pet) {
      return NextResponse.json({ error: "Pet not found" }, { status: 404 });
    }

    const contactReq = await prisma.contactRequest.create({
      data: {
        microchipId,
        finderMessage: message,
        finderPhone: finderPhone || null,
        finderEmail: finderEmail || null,
        status: "pending",
      },
    });

    const origin = request.headers.get("origin") || "https://1petmicrochip.com";

    const session = await getStripe().checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [{
        price_data: {
          currency: "usd",
          product_data: {
            name: `Contact ${pet.name}'s owner`,
            description: `Send an anonymous message to reunite with ${pet.name}`,
          },
          unit_amount: CONTACT_FEE_CENTS,
        },
        quantity: 1,
      }],
      mode: "payment",
      success_url: `${origin}/contact/success?session_id={CHECKOUT_SESSION_ID}&contact_id=${contactReq.id}`,
      cancel_url: `${origin}/contact/${microchipId}?cancelled=true`,
      metadata: {
        contactRequestId: contactReq.id,
        microchipId,
        petName: pet.name,
      },
    });

    return NextResponse.json({ url: session.url });
  } catch (error) {
    console.error("Stripe checkout error:", error);
    return NextResponse.json({ error: "Payment setup failed. Please try again." }, { status: 500 });
  }
}
