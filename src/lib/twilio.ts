import twilio from "twilio";

function getClient() {
  return twilio(
    process.env.TWILIO_ACCOUNT_SID || "",
    process.env.TWILIO_AUTH_TOKEN || ""
  );
}

export async function sendContactSMS(
  ownerPhone: string,
  petName: string,
  finderMessage: string
): Promise<string> {
  const client = getClient();
  const message = await client.messages.create({
    body: `🐾 Great news! Someone may have found your pet ${petName}! They said: "${finderMessage}". Reply to this number to connect with them. — 1PetMicrochip.com`,
    from: process.env.TWILIO_PHONE_NUMBER,
    to: ownerPhone,
  });
  return message.sid;
}
