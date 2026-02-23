import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import temboLogo from "@/assets/tembo-logo.jpg";

const navLinks = [
  { label: "Home", to: "/" },
  { label: "Packages", to: "/packages" },
  { label: "Destinations", to: "/destinations" },
  { label: "About", to: "/about" },
  { label: "Contact", to: "/contact" },
  { label: "FAQ", to: "/faq" },
];

export function Navbar() {
  const [open, setOpen] = useState(false);
  const { pathname } = useLocation();

  return (
    <header className="sticky top-0 z-50 border-b border-border/50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80">
      <div className="container flex h-16 items-center justify-between md:h-20">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2">
          <img src={temboLogo} alt="African Tembo Safari" className="h-10 w-10 rounded-full object-cover md:h-12 md:w-12" />
          <span className="font-display text-lg font-bold text-foreground md:text-xl">
            Tembo Safari
          </span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden items-center gap-1 md:flex">
          {navLinks.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className={`rounded-md px-3 py-2 text-sm font-medium transition-colors hover:bg-primary/10 hover:text-primary ${
                pathname === link.to ? "text-primary" : "text-muted-foreground"
              }`}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* CTA + mobile toggle */}
        <div className="flex items-center gap-2">
          <Button asChild className="hidden md:inline-flex">
            <Link to="/packages">Book Now</Link>
          </Button>
          <button
            className="inline-flex h-10 w-10 items-center justify-center rounded-md text-foreground md:hidden"
            onClick={() => setOpen(!open)}
            aria-label="Toggle menu"
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="border-t border-border md:hidden">
          <nav className="container flex flex-col gap-1 py-4">
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                onClick={() => setOpen(false)}
                className={`rounded-md px-3 py-2 text-sm font-medium transition-colors hover:bg-primary/10 ${
                  pathname === link.to ? "text-primary" : "text-muted-foreground"
                }`}
              >
                {link.label}
              </Link>
            ))}
            <Button asChild className="mt-2">
              <Link to="/packages" onClick={() => setOpen(false)}>Book Now</Link>
            </Button>
          </nav>
        </div>
      )}
    </header>
  );
}
