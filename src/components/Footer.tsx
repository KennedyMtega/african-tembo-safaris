import { Link } from "react-router-dom";
import { Mail, Phone, MapPin } from "lucide-react";
import temboLogo from "@/assets/tembo-logo.jpg";

export function Footer() {
  return (
    <footer className="border-t border-border bg-foreground text-primary-foreground">
      <div className="container py-12 md:py-16">
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          {/* Brand */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <img src={temboLogo} alt="Tembo Safari" className="h-10 w-10 rounded-full object-cover" />
              <span className="font-display text-lg font-bold">Tembo Safari</span>
            </div>
            <p className="text-sm text-primary-foreground/70">
              Authentic African safari experiences crafted with passion. Discover the wild beauty of Africa with our expert-guided adventures.
            </p>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h4 className="font-display text-sm font-semibold uppercase tracking-wider">Quick Links</h4>
            <nav className="flex flex-col gap-2 text-sm text-primary-foreground/70">
              <Link to="/packages" className="hover:text-primary-foreground transition-colors">Safari Packages</Link>
              <Link to="/destinations" className="hover:text-primary-foreground transition-colors">Destinations</Link>
              <Link to="/about" className="hover:text-primary-foreground transition-colors">About Us</Link>
              <Link to="/faq" className="hover:text-primary-foreground transition-colors">FAQ</Link>
            </nav>
          </div>

          {/* Legal */}
          <div className="space-y-4">
            <h4 className="font-display text-sm font-semibold uppercase tracking-wider">Legal</h4>
            <nav className="flex flex-col gap-2 text-sm text-primary-foreground/70">
              <Link to="/terms" className="hover:text-primary-foreground transition-colors">Terms of Service</Link>
              <Link to="/privacy" className="hover:text-primary-foreground transition-colors">Privacy Policy</Link>
              <Link to="/contact" className="hover:text-primary-foreground transition-colors">Contact Us</Link>
            </nav>
          </div>

          {/* Contact */}
          <div className="space-y-4">
            <h4 className="font-display text-sm font-semibold uppercase tracking-wider">Contact</h4>
            <div className="space-y-2 text-sm text-primary-foreground/70">
              <div className="flex items-center gap-2"><MapPin className="h-4 w-4 shrink-0" /> Arusha, Tanzania</div>
              <div className="flex items-center gap-2"><Phone className="h-4 w-4 shrink-0" /> +255 123 456 789</div>
              <div className="flex items-center gap-2"><Mail className="h-4 w-4 shrink-0" /> info@tembosafari.com</div>
            </div>
          </div>
        </div>

        <div className="mt-10 border-t border-primary-foreground/10 pt-6 text-center text-xs text-primary-foreground/50">
          © {new Date().getFullYear()} African Tembo Safari. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
