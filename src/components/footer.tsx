import Link from "next/link";
import { PawPrint, Heart } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t bg-muted/30 mt-auto">
      <div className="mx-auto max-w-6xl px-4 py-12">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <Link href="/" className="flex items-center gap-2 mb-4">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                <PawPrint className="h-4 w-4" />
              </div>
              <span className="text-lg font-bold">
                1Pet<span className="text-primary">Microchip</span>
              </span>
            </Link>
            <p className="text-sm text-muted-foreground">
              Free forever pet microchip registry. Helping reunite lost pets with their families.
            </p>
          </div>

          <div>
            <h3 className="font-semibold mb-3">Services</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link href="/" className="hover:text-primary transition-colors">Microchip Lookup</Link></li>
              <li><Link href="/register" className="hover:text-primary transition-colors">Register Your Pet</Link></li>
              <li><Link href="/faq" className="hover:text-primary transition-colors">FAQ</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-3">External Databases</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><a href="https://www.petmicrochiplookup.org" target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors">AAHA (US/Canada)</a></li>
              <li><a href="https://www.europetnet.com" target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors">Europetnet (Europe)</a></li>
              <li><a href="https://www.checkachip.com" target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors">Check a Chip (UK)</a></li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-3">About</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link href="/about" className="hover:text-primary transition-colors">About Us</Link></li>
              <li><Link href="/about#privacy" className="hover:text-primary transition-colors">Privacy Policy</Link></li>
              <li><Link href="/about#terms" className="hover:text-primary transition-colors">Terms of Service</Link></li>
            </ul>
          </div>
        </div>

        <div className="mt-10 border-t pt-6 flex flex-col sm:flex-row items-center justify-between gap-2 text-sm text-muted-foreground">
          <p>© {new Date().getFullYear()} 1PetMicrochip. All rights reserved.</p>
          <p className="flex items-center gap-1">
            Made with <Heart className="h-3 w-3 text-red-500 fill-red-500" /> for pets everywhere
          </p>
        </div>
      </div>
    </footer>
  );
}
