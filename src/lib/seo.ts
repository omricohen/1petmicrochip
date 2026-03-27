import { Metadata } from "next";

const SITE_NAME = "1PetMicrochip";
const SITE_URL = "https://1petmicrochip.com";
const DEFAULT_DESCRIPTION =
  "Free forever pet microchip registry. Look up any microchip number across US, European, and UK databases. Register your pet's microchip in seconds.";

export function buildMetadata(opts: {
  title?: string;
  description?: string;
  path?: string;
  noIndex?: boolean;
}): Metadata {
  const title = opts.title
    ? `${opts.title} | ${SITE_NAME}`
    : `${SITE_NAME} — Free Pet Microchip Registry | Look Up & Register`;
  const description = opts.description || DEFAULT_DESCRIPTION;
  const url = `${SITE_URL}${opts.path || ""}`;

  return {
    title,
    description,
    keywords: [
      "pet microchip lookup",
      "free microchip registry",
      "find pet owner microchip",
      "register pet microchip free",
      "lost pet microchip search",
      "microchip number lookup",
      "dog microchip registry",
      "cat microchip registry",
      "pet microchip database",
      "AAHA microchip lookup",
    ],
    openGraph: {
      title,
      description,
      url,
      siteName: SITE_NAME,
      type: "website",
      locale: "en_US",
      images: [
        {
          url: `${SITE_URL}/og-image.png`,
          width: 1200,
          height: 630,
          alt: "1PetMicrochip — Free Pet Microchip Registry",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [`${SITE_URL}/og-image.png`],
    },
    alternates: {
      canonical: url,
    },
    ...(opts.noIndex ? { robots: { index: false, follow: false } } : {}),
  };
}

export function organizationJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "1PetMicrochip",
    url: "https://1petmicrochip.com",
    logo: "https://1petmicrochip.com/logo.png",
    description: DEFAULT_DESCRIPTION,
    sameAs: [],
    contactPoint: {
      "@type": "ContactPoint",
      contactType: "customer support",
      url: "https://1petmicrochip.com/about",
    },
  };
}

export function searchActionJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "1PetMicrochip",
    url: "https://1petmicrochip.com",
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate:
          "https://1petmicrochip.com/search?chip={search_term_string}",
      },
      "query-input": "required name=search_term_string",
    },
  };
}

export function faqJsonLd(
  faqs: { question: string; answer: string }[]
) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((f) => ({
      "@type": "Question",
      name: f.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: f.answer,
      },
    })),
  };
}
