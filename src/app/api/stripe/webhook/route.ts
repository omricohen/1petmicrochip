import { NextRequest, NextResponse } from "next/server";
import { getStripe } from "@/lib/stripe";
import { prisma } from "@/lib/db";
import { sendContactSMS } from "@/lib/twilio";

export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  try {
    const body = await request.text();
    const sig = request.headers.get("stripe-signature");

    // In production, verify webhook signature
    // For now, parse the event directly
    const event = JSON.parse(body);

    if (event.type === "checkout.session.completed") {
      const session = event.data.object;
      const contactId = session.metadata?.contactRequestId;
      const microchipId = session.metadata?.microchipId;
      const petName = session.metadata?.petName;

      if (contactId) {
        const contactReq = await prisma.contactRequest.findUnique({ where: { id: contactId } });
        if (contactReq) {
          // Get owner phone
          const pet = await prisma.pet.findUnique({
            where: { microchipId: contactReq.microchipId },
            include: { owner: true },
          });

          if (pet) {
            try {
              const sid = await sendContactSMS(pet.owner.phone, pet.name, contactReq.finderMessage);
              await prisma.contactRequest.update({
                where: { id: contactId },
                data: { status: "sent", stripePaymentId: session.payment_intent, twilioMessageSid: sid },
              });
            } catch (e) {
              await prisma.contactRequest.update({
                where: { id: contactId },
                data: { status: "paid", stripePaymentId: session.payment_intent },
              });
            }
          }
        }
      }
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error("Stripe webhook error:", error);
    return NextResponse.json({ error: "Webhook failed" }, { status: 400 });
  }
}
