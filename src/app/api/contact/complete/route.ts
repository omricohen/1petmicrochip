import { NextRequest, NextResponse } from "next/server";
import { getStripe } from "@/lib/stripe";
import { prisma } from "@/lib/db";
import { sendContactSMS } from "@/lib/twilio";

export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  try {
    const { sessionId, contactId } = await request.json();
    if (!sessionId || !contactId) {
      return NextResponse.json({ error: "Missing parameters" }, { status: 400 });
    }

    const session = await getStripe().checkout.sessions.retrieve(sessionId);
    if (session.payment_status !== "paid") {
      return NextResponse.json({ error: "Payment not completed" }, { status: 400 });
    }

    const contactReq = await prisma.contactRequest.findUnique({ where: { id: contactId } });
    if (!contactReq || contactReq.status === "sent") {
      return NextResponse.json({ success: true, alreadySent: true });
    }

    const pet = await prisma.pet.findUnique({
      where: { microchipId: contactReq.microchipId },
      include: { owner: true },
    });

    if (!pet) {
      return NextResponse.json({ error: "Pet not found" }, { status: 404 });
    }

    let sid: string | undefined;
    try {
      sid = await sendContactSMS(pet.owner.phone, pet.name, contactReq.finderMessage);
    } catch (e) {
      console.error("Twilio SMS error:", e);
    }

    await prisma.contactRequest.update({
      where: { id: contactId },
      data: {
        status: sid ? "sent" : "paid",
        stripePaymentId: session.payment_intent as string,
        twilioMessageSid: sid || null,
      },
    });

    return NextResponse.json({ success: true, messageSent: !!sid });
  } catch (error) {
    console.error("Contact complete error:", error);
    return NextResponse.json({ error: "Failed to process" }, { status: 500 });
  }
}
