import { buildMetadata, faqJsonLd } from "@/lib/seo";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { HelpCircle } from "lucide-react";

const faqs = [
  {
    question: "Is 1PetMicrochip really free?",
    answer:
      "Yes, 100% free. Registering your pet's microchip costs nothing — not now, not ever. There are no annual fees, no premium tiers, and no hidden charges. The only fee on our platform is a $1 charge for someone who finds a lost pet and wants to contact the owner.",
  },
  {
    question: "What is a pet microchip?",
    answer:
      "A pet microchip is a tiny electronic chip (about the size of a grain of rice) that's implanted under your pet's skin, usually between the shoulder blades. Each chip has a unique identification number that can be read with a special scanner. Veterinarians, shelters, and animal control officers use these scanners to identify found pets.",
  },
  {
    question: "How do I find my pet's microchip number?",
    answer:
      "Your pet's microchip number is usually on the paperwork from your veterinarian or the microchip company. It's typically a 15-digit number (ISO standard), though some older chips may be 9-10 digits. If you've lost the paperwork, your vet can scan your pet to read the chip number.",
  },
  {
    question: "Why should I register my pet's microchip?",
    answer:
      "A microchip is only useful if it's registered with current contact information. Without registration, a found pet's chip can be scanned but there's no way to identify the owner. Registration links your contact info to the chip number so you can be reached if your pet is found.",
  },
  {
    question: "My pet is already registered with another database. Should I also register here?",
    answer:
      "Yes! Registering with multiple databases increases the chances your pet will be found. Many registries charge annual fees that can lapse, leaving gaps in coverage. Since 1PetMicrochip is free forever, it's an extra layer of protection at no cost.",
  },
  {
    question: "How does the $1 contact fee work?",
    answer:
      "When someone finds a pet and looks up its microchip on our site, they can pay $1 to send the registered owner an anonymous SMS message. The finder never sees the owner's phone number, and the owner never sees the finder's number. Both parties communicate through our secure relay. This small fee keeps registrations free and prevents spam.",
  },
  {
    question: "Is my personal information safe?",
    answer:
      "Yes. Your name, phone number, and email are never shown in search results or shared with anyone. When someone contacts you about a found pet, the message is relayed anonymously — neither party sees the other's phone number. We don't sell data or show ads.",
  },
  {
    question: "What databases does 1PetMicrochip search?",
    answer:
      "We search our own growing database and provide direct links to check three major international registries: AAHA Universal Pet Microchip Lookup (covering 100+ US and Canadian registries), Europetnet (all EU member states), and Check a Chip (UK DEFRA-compliant databases).",
  },
  {
    question: "Can I update my information after registering?",
    answer:
      "Yes! When you register, you receive a unique dashboard link. Bookmark it to update your contact info, pet details, or emergency contacts anytime. No account or password needed.",
  },
  {
    question: "What types of pets can I register?",
    answer:
      "Any pet with a microchip can be registered — dogs, cats, birds, rabbits, horses, reptiles, and more. If it has a microchip, we'll register it.",
  },
  {
    question: "What microchip formats are supported?",
    answer:
      "We support all standard microchip formats: 15-digit ISO 11784/11785 chips (the international standard), as well as older 9-digit and 10-digit formats used by some manufacturers.",
  },
  {
    question: "I found a pet with a microchip. What should I do?",
    answer:
      "Enter the microchip number on our homepage. We'll check our database and show you links to search international registries. If the pet is registered with us, you can pay $1 to send the owner a message. You should also take the pet to a local veterinarian or shelter — they can scan the chip and may have access to additional databases.",
  },
];

export const metadata = buildMetadata({
  title: "Frequently Asked Questions",
  description:
    "Common questions about pet microchip registration, lookup, and how 1PetMicrochip works. Free forever microchip registry.",
  path: "/faq",
});

export default function FAQPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-10">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(faqJsonLd(faqs)),
        }}
      />

      <div className="text-center mb-12">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-primary/10 mb-4">
          <HelpCircle className="h-7 w-7 text-primary" />
        </div>
        <h1 className="text-4xl font-bold mb-4">Frequently Asked Questions</h1>
        <p className="text-lg text-muted-foreground">
          Everything you need to know about pet microchip registration
        </p>
      </div>

      <div className="space-y-4">
        {faqs.map((faq, i) => (
          <Card key={i}>
            <CardContent className="p-6">
              <h2 className="text-lg font-semibold mb-3">{faq.question}</h2>
              <p className="text-muted-foreground text-sm leading-relaxed">
                {faq.answer}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="text-center mt-12">
        <h2 className="text-2xl font-bold mb-4">Still have questions?</h2>
        <p className="text-muted-foreground mb-6">
          Check our About page or register your pet — it only takes 2 minutes.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link href="/register">
            <Button size="lg">Register Your Pet Free</Button>
          </Link>
          <Link href="/about">
            <Button size="lg" variant="outline">
              Learn More
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
