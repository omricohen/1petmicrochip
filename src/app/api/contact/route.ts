import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export const dynamic = "force-dynamic";
import { sendContactSMS } from "@/lib/twilio";
import { validateMicrochipId } from "@/lib/utils";

export async function POST(request: NextRequest) {
  try {
    const { microchipId, message, finderPhone, finderEmail, paymentIntentId } =
      await request.json();

    if (!microchipId || !validateMicrochipId(microchipId)) {
      return NextResponse.json(
        { error: "Invalid microchip number" },
        { status: 400 }
      );
    }
    if (!message) {
      return NextResponse.json(
        { error: "Message is required" },
        { status: 400 }
      );
    }

    // Find the pet and owner
    const pet = await prisma.pet.findUnique({
      where: { microchipId },
      include: { owner: true },
    });

    if (!pet) {
      return NextResponse.json(
        { error: "Pet not found" },
        { status: 404 }
      );
    }

    // Send SMS via Twilio
    let twilioSid: string | undefined;
    try {
      twilioSid = await sendContactSMS(pet.owner.phone, pet.name, message);
    } catch (err) {
      console.error("Twilio error:", err);
      // Still record the contact request even if SMS fails
    }

    // Record the contact request
    await prisma.contactRequest.create({
      data: {
        microchipId,
        finderMessage: message,
        finderPhone: finderPhone || null,
        finderEmail: finderEmail || null,
        stripePaymentId: paymentIntentId || null,
        twilioMessageSid: twilioSid || null,
        status: twilioSid ? "sent" : "paid",
      },
    });

    return NextResponse.json({ success: true, messageSent: !!twilioSid });
  } catch (error) {
    console.error("Contact error:", error);
    return NextResponse.json(
      { error: "Failed to send message" },
      { status: 500 }
    );
  }
}
