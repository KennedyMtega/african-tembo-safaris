import { useState } from "react";
import { motion } from "framer-motion";
import { Mail, Phone, MapPin, Clock } from "lucide-react";
import SEOHead from "@/components/SEOHead";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { useQuery } from "@tanstack/react-query";
import { siteSettingsService } from "@/services/siteSettingsService";
import { inquiryService } from "@/services/inquiryService";

interface ContactInfo {
  name: string;
  email: string;
  phone: string;
  address: string;
  officeHours: string;
}

const defaultContact: ContactInfo = {
  name: "African Tembo Safaris",
  email: "info@africantembo.com",
  phone: "+255 123 456 789",
  address: "Serengeti Road, Arusha\nTanzania, East Africa",
  officeHours: "Monday – Friday: 8:00 AM – 6:00 PM (EAT)\nSaturday: 9:00 AM – 1:00 PM\nSunday: Closed",
};

export default function ContactPage() {
  const { toast } = useToast();
  const [sending, setSending] = useState(false);

  const { data: contactInfo } = useQuery({
    queryKey: ["contact-info"],
    queryFn: () => siteSettingsService.get<ContactInfo>("contact_info"),
  });

  const info: ContactInfo = { ...defaultContact, ...contactInfo };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSending(true);
    const fd = new FormData(e.currentTarget);
    try {
      await inquiryService.create({
        name: fd.get("name") as string,
        email: fd.get("email") as string,
        subject: fd.get("subject") as string,
        message: fd.get("message") as string,
      });
      toast({ title: "Message sent!", description: "We'll get back to you within 24 hours." });
      (e.target as HTMLFormElement).reset();
    } catch (err: any) {
      toast({ title: "Failed to send", description: err.message, variant: "destructive" });
    } finally {
      setSending(false);
    }
  };

  return (
    <>
    <SEOHead title="Contact Us" description="Get in touch with African Tembo Safari. Plan your dream Tanzania safari — Serengeti, Ngorongoro, Kilimanjaro, Zanzibar. We respond within 24 hours." />
    <section className="bg-background py-12 md:py-20">
      <div className="container max-w-5xl">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <p className="text-sm font-semibold uppercase tracking-wider text-primary">Get in Touch</p>
          <h1 className="mt-2 font-display text-3xl font-bold text-foreground md:text-4xl">Contact Us</h1>
          <p className="mt-2 text-muted-foreground">Ready to start your African adventure? Reach out — we'd love to help you plan the perfect safari.</p>
        </motion.div>

        <div className="mt-10 grid gap-10 lg:grid-cols-2">
          {/* Contact form — saves directly to admin Inquiries */}
          <Card className="border-border/50">
            <CardContent className="p-6">
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div><Label>Name *</Label><Input name="name" required /></div>
                  <div><Label>Email *</Label><Input name="email" type="email" required /></div>
                </div>
                <div><Label>Subject</Label><Input name="subject" /></div>
                <div>
                  <Label>Message *</Label>
                  <Textarea
                    name="message"
                    required
                    rows={5}
                    placeholder="Tell us about your dream safari — when you'd like to travel, how many guests, any special interests..."
                  />
                </div>
                <Button type="submit" className="w-full" disabled={sending}>
                  {sending ? "Sending..." : "Send Message"}
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Dynamic contact info from admin settings */}
          <div className="space-y-6">
            <div>
              <h2 className="font-display text-xl font-bold text-foreground mb-4">Our Office</h2>
              <div className="space-y-3 text-sm text-muted-foreground">
                <div className="flex items-start gap-3">
                  <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                  <p style={{ whiteSpace: "pre-line" }}>{info.address}</p>
                </div>
                <div className="flex items-center gap-3">
                  <Phone className="h-4 w-4 shrink-0 text-primary" />
                  <a href={`tel:${info.phone}`} className="hover:text-primary transition-colors">{info.phone}</a>
                </div>
                <div className="flex items-center gap-3">
                  <Mail className="h-4 w-4 shrink-0 text-primary" />
                  <a href={`mailto:${info.email}`} className="hover:text-primary transition-colors">{info.email}</a>
                </div>
              </div>
            </div>

            <div>
              <div className="flex items-center gap-2 mb-2">
                <Clock className="h-4 w-4 text-primary" />
                <h3 className="font-display text-lg font-semibold text-foreground">Office Hours</h3>
              </div>
              <p className="text-sm text-muted-foreground" style={{ whiteSpace: "pre-line" }}>{info.officeHours}</p>
            </div>

            <div className="rounded-lg bg-secondary/50 p-4">
              <p className="text-sm text-muted-foreground italic">
                "From the moment you step off the plane in Arusha to the final sunset over the Serengeti, my team and I are dedicated to your safety, your comfort, and your inspiration."
              </p>
              <p className="mt-2 text-xs font-medium text-foreground">— Mohamedi Shabani Mgomi, Founder &amp; CEO</p>
            </div>
          </div>
        </div>
      </div>
    </section>
    </>
  );
}
