# 🐾 1PetMicrochip — Free Pet Microchip Registry

**Free forever** pet microchip registry. Look up any microchip number across US, European, and UK databases. Register your pet's microchip in seconds.

🌐 **Live:** [1petmicrochip.com](https://1petmicrochip.com)

## Features

- **Free Registration** — Register your pet's microchip at no cost, forever
- **Global Lookup** — Search across AAHA (US/Canada), Europetnet (Europe), and Check-a-Chip (UK)
- **Privacy First** — Owner contact info is never exposed; messages are relayed anonymously
- **$1 Contact Fee** — Found a pet? Pay $1 to send the owner an anonymous SMS. That's our only revenue.
- **Owner Dashboard** — Update your info anytime via a magic link (no password needed)
- **Mobile First** — Built for the scenario: you find a lost pet and need to look up the chip on your phone
- **AI Agent Ready** — `/llms.txt` and `/.well-known/ai-plugin.json` for AI discoverability
- **AAHA API** — Ready for integration as a participating registry

## Tech Stack

- **Framework:** Next.js 14 (App Router, TypeScript)
- **Styling:** Tailwind CSS + shadcn/ui components
- **Database:** SQLite via Prisma (no external DB needed)
- **Payments:** Stripe ($1 contact fee)
- **Messaging:** Twilio (anonymous SMS relay)
- **Deployment:** Vercel (zero config)

## Quick Start

```bash
# Clone and install
git clone https://github.com/yourusername/pet-chip-registry.git
cd pet-chip-registry
npm install

# Set up environment
cp .env.example .env
# Edit .env with your Stripe and Twilio credentials

# Set up database
npx prisma migrate dev

# Run development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `DATABASE_URL` | SQLite database path | Yes (default: `file:./dev.db`) |
| `STRIPE_SECRET_KEY` | Stripe secret key | Yes (for contact flow) |
| `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | Stripe publishable key | Yes (for contact flow) |
| `TWILIO_ACCOUNT_SID` | Twilio Account SID | Yes (for SMS) |
| `TWILIO_AUTH_TOKEN` | Twilio Auth Token | Yes (for SMS) |
| `TWILIO_PHONE_NUMBER` | Twilio phone number | Yes (for SMS) |
| `NEXT_PUBLIC_APP_URL` | App URL for magic links | Recommended |

## API Endpoints

### Public (No Auth)

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/lookup?chip=XXX` | Look up a microchip in our database |
| `GET` | `/api/lookup/external?chip=XXX` | Get links to external databases |
| `GET` | `/api/aaha/lookup?microchip_id=XXX` | AAHA-compatible lookup endpoint |
| `POST` | `/api/register` | Register a new pet microchip |

### Payment Required

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/stripe/create-payment-intent` | Create Stripe payment for contact |
| `POST` | `/api/contact` | Send anonymous message to pet owner |

## Project Structure

```
src/
├── app/
│   ├── page.tsx              # Home page with hero + search
│   ├── search/               # Search results
│   ├── register/             # Free registration form
│   ├── contact/              # Contact owner ($1 flow)
│   ├── dashboard/            # Owner dashboard (magic link)
│   ├── faq/                  # FAQ page (SEO)
│   ├── about/                # About + privacy + terms
│   ├── sitemap.ts            # Dynamic sitemap
│   ├── robots.ts             # Robots.txt
│   └── api/                  # API routes
├── components/               # UI components
├── lib/                      # Utilities, DB, Stripe, Twilio
public/
├── llms.txt                  # AI agent discoverability
├── .well-known/
│   └── ai-plugin.json        # OpenAI plugin manifest
└── openapi.yaml              # OpenAPI spec
docs/
└── registry-plan.md          # Plan to join AAHA, Europetnet, etc.
```

## Deploy to Vercel

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/yourusername/pet-chip-registry)

1. Push to GitHub
2. Import in Vercel
3. Add environment variables
4. Deploy — that's it!

**Note:** SQLite works on Vercel with some limitations. For production with high traffic, consider migrating to PostgreSQL (just change the Prisma provider).

## Registry Integration

We're applying to be a participating registry in major lookup systems. See [docs/registry-plan.md](docs/registry-plan.md) for the full plan.

The AAHA-compatible API endpoint (`/api/aaha/lookup`) is already built and ready for their integration.

## SEO

- Sitemap at `/sitemap.xml`
- Robots.txt at `/robots.txt`
- JSON-LD structured data (Organization, SearchAction, FAQPage)
- Open Graph + Twitter Card meta on all pages
- Target keywords throughout

## License

MIT
