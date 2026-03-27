import Stripe from "stripe";

let _stripe: Stripe | null = null;

export function getStripe(): Stripe {
  if (!_stripe) {
    _stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "", {
      apiVersion: "2025-03-31.basil" as Stripe.LatestApiVersion,
    });
  }
  return _stripe;
}

export const CONTACT_FEE_CENTS = 100; // $1.00
