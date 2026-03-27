# Pet Microchip Registry — Build Spec

## Overview
A free pet microchip registry website. Users can register their pet's microchip for free forever. 
The site also searches major international databases (AAHA/petmicrochiplookup.org, Europetnet, Check-a-Chip UK, and South American databases).

The ONLY revenue: $1 fee to contact the owner of a found/lost pet via Twilio (SMS/call). The finder never sees the owner's phone number — Twilio handles it anonymously.

## Tech Stack
- **Framework**: Next.js 14 (App Router, TypeScript)
- **Styling**: Tailwind CSS + shadcn/ui
- **Database**: SQLite (via Prisma) — simple, no external DB needed
- **Payments**: Stripe ($1 charge)
- **Messaging**: Twilio (SMS to owner)
- **Deployment**: Vercel

## Core Features

### 1. Microchip Lookup (Home Page)
- Big search box: "Enter microchip number"
- Searches our LOCAL database first
- Then searches external databases via scraping/API:
  - **AAHA Universal Pet Microchip Lookup** (petmicrochiplookup.org) — US/Canada
  - **Europetnet** (europetnet.com) — Europe
  - **Check-a-Chip** (checkachip.com) — UK
- Shows results: which database(s) the chip is registered in
- If found in our DB: shows pet name, species, breed, photo (NOT owner contact info)
- If NOT found anywhere: prompt to register for free

### 2. Free Registration
- Microchip number (required, 9-15 digit ISO standard)
- Owner info: name, email, phone (private — never shown publicly)
- Pet info: name, species (dog/cat/other), breed, color, photo (optional)
- Emergency contact (optional second contact)
- Confirmation email sent
- Owner can update info anytime via email link

### 3. Contact Owner ($1)
- When someone finds a lost pet and looks up the chip:
  - "This pet is registered! Contact the owner for $1"
  - Stripe payment ($1)
  - After payment: form to enter finder's message + their phone number
  - Twilio sends SMS to the registered owner:
    "Someone found your pet [name]! They said: [message]. Reply to this number to connect."
  - Owner's phone number is NEVER exposed to the finder
  - Twilio acts as relay — both parties communicate through Twilio number

### 4. Owner Dashboard (via magic link)
- Update pet info, phone number, email
- Add/remove pets
- See lookup history (how many times your chip was searched)
- Transfer ownership

## External Database Integration

### AAHA / petmicrochiplookup.org
- URL: https://www.petmicrochiplookup.org/
- They have a search form — we'll scrape/proxy the results
- Returns which database the chip is registered in (HomeAgain, Found.org, 24PetWatch, etc.)
- Does NOT return owner info — just confirmation it's registered

### Europetnet
- URL: https://europetnet.com
- Search endpoint for microchip lookup
- Returns registration status across European databases

### Check-a-Chip (UK)
- URL: https://checkachip.com
- Returns which UK DEFRA-compliant database holds the registration

### For databases that block scraping:
- Show a "Check on [database name]" link that opens in new tab
- Pre-fill the microchip number in the URL if possible

## Database Schema

```prisma
model Pet {
  id            String   @id @default(cuid())
  microchipId   String   @unique
  name          String
  species       String   // dog, cat, bird, rabbit, other
  breed         String?
  color         String?
  photoUrl      String?
  createdAt     DateTime @default(now())
  updatedAt     DateTime @updatedAt
  owner         Owner    @relation(fields: [ownerId], references: [id])
  ownerId       String
  lookups       Lookup[]
}

model Owner {
  id              String   @id @default(cuid())
  name            String
  email           String
  phone           String   // E.164 format
  emergencyName   String?
  emergencyPhone  String?
  magicToken      String   @unique @default(cuid())
  pets            Pet[]
  createdAt       DateTime @default(now())
  updatedAt       DateTime @updatedAt
}

model Lookup {
  id          String   @id @default(cuid())
  petId       String?
  microchipId String
  foundInDb   String?  // "local", "aaha", "europetnet", "checkachip"
  ip          String?
  createdAt   DateTime @default(now())
  pet         Pet?     @relation(fields: [petId], references: [id])
}

model ContactRequest {
  id            String   @id @default(cuid())
  microchipId   String
  finderMessage String
  finderPhone   String?
  finderEmail   String?
  stripePaymentId String?
  twilioMessageSid String?
  status        String   @default("pending") // pending, paid, sent, delivered
  createdAt     DateTime @default(now())
}
```

## Pages
- `/` — Home: search box + hero
- `/search?chip=XXXXX` — Results page
- `/register` — Free registration form
- `/register/success` — Confirmation
- `/contact/[microchipId]` — Contact owner flow (Stripe + message)
- `/contact/success` — Confirmation that message was sent
- `/dashboard/[magicToken]` — Owner dashboard
- `/about` — About page (free forever, privacy policy)

## Design
- Clean, friendly, trustworthy feel (think: veterinary clinic, not crypto)
- Green/teal primary color
- Mobile-first (people find lost pets on their phones)
- Big, clear CTAs
- Dog/cat illustrations or icons
- "Free Forever" badge prominently displayed

## SEO & Agent Discoverability

### SEO Strategy
- Title: "1PetMicrochip — Free Pet Microchip Registry | Look Up & Register"
- Meta description: "Free forever pet microchip registry. Look up any microchip number across US, European, and UK databases. Register your pet's microchip in seconds."
- H1 on homepage: "Free Pet Microchip Registry"
- Target keywords: "pet microchip lookup", "free microchip registry", "find pet owner microchip", "register pet microchip free", "lost pet microchip search"
- Generate a sitemap.xml
- Add structured data (JSON-LD) for:
  - Organization schema
  - WebApplication schema
  - FAQPage schema (common microchip questions)
  - SearchAction schema (so Google shows a search box in results)
- Create `/robots.txt` allowing all crawlers
- Create `/llms.txt` for AI agent discoverability (see below)
- Add Open Graph and Twitter Card meta tags on all pages
- Create a `/faq` page with common questions (great for SEO)

### AI Agent Discoverability
Create `/llms.txt` at the root:
```
# 1PetMicrochip.com
> Free pet microchip registry and lookup service.

## API
- GET /api/lookup?chip=XXXXXXXXXXXXXXX — Look up a microchip number. Returns registration status and which databases it's found in. No auth required.
- POST /api/register — Register a new pet microchip. Body: { microchipId, ownerName, ownerEmail, ownerPhone, petName, species, breed }
- GET /api/lookup/external?chip=XXXXXXXXXXXXXXX — Check external databases (AAHA, Europetnet, Check-a-Chip)

## Info
- Free forever for registration and lookup
- $1 to contact pet owner (anonymous relay via SMS)
- Covers US (AAHA), Europe (Europetnet), UK (Check-a-Chip) databases
```

Also create `/.well-known/ai-plugin.json` (OpenAI plugin format) so AI agents can discover and use the lookup API.

### Registry Application Plan
Include a `/docs/registry-plan.md` in the repo with:

1. **AAHA Universal Pet Microchip Lookup** (US/Canada)
   - Contact: https://petmicrochiplookup.org
   - Apply as a "Participating Database"
   - Requirements: maintain a searchable microchip database, respond to lookup queries
   - We need to expose: GET /api/aaha/lookup?microchip_id=XXX returning { found: boolean, registry_name: string, registry_url: string }
   - Build this API endpoint in the app ready for their integration

2. **Europetnet** (Europe)
   - Contact: https://europetnet.com/about/contact
   - Apply for membership as a registry
   - They aggregate lookups across European databases
   - We need to implement their lookup protocol

3. **Check-a-Chip / Microchip Central** (UK)
   - Contact: https://checkachip.com
   - Must be DEFRA-compliant for UK recognition
   - Apply as a participating database

4. **WSAVA (World Small Animal Veterinary Association)**
   - They maintain a global list of microchip registries
   - Getting listed here adds credibility

5. **Found.org / HomeAgain / 24PetWatch** (US commercial registries)
   - These are competitors but AAHA's lookup aggregates them all
   - Being in AAHA's system means chips registered with us are findable through the universal lookup

6. **South America**
   - Brazil: SINDAN (national registry)
   - Argentina: SENASA
   - Research specific country requirements

### Timeline for Registry Applications
- Week 1: Launch site, submit AAHA application
- Week 2: Submit Europetnet membership application
- Week 3: Submit Check-a-Chip / DEFRA application
- Month 2+: Follow up, complete any compliance requirements
- Build the AAHA-compatible API endpoint NOW so it's ready when they approve

## Environment Variables
```
DATABASE_URL=file:./dev.db
STRIPE_SECRET_KEY=sk_xxx
STRIPE_PUBLISHABLE_KEY=pk_xxx
TWILIO_ACCOUNT_SID=xxx
TWILIO_AUTH_TOKEN=xxx
TWILIO_PHONE_NUMBER=+1xxx
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_xxx
```

## Key Implementation Notes
- Microchip numbers are typically 15 digits (ISO 11784/11785) but some older ones are 9-10 digits
- Validate microchip format on input
- Rate limit searches to prevent scraping
- Never expose owner phone/email in any API response
- The $1 contact fee should feel worth it — emphasize "reunite with your pet"
- Make registration dead simple — minimum fields, no account needed
- Magic link for dashboard access (no password)
