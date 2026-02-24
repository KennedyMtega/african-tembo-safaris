import { motion } from "framer-motion";

export default function PrivacyPage() {
  return (
    <section className="bg-background py-12 md:py-20">
      <div className="container max-w-3xl">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <p className="text-sm font-semibold uppercase tracking-wider text-primary">Legal</p>
          <h1 className="mt-2 font-display text-3xl font-bold text-foreground md:text-4xl">Privacy Policy</h1>
        </motion.div>
        <div className="mt-8 space-y-6 text-sm leading-relaxed text-muted-foreground">
          <div><h2 className="font-display text-lg font-bold text-foreground">Information We Collect</h2><p>We collect personal information you provide when booking a safari, including your name, email address, phone number, dietary requirements, and travel preferences. We also collect usage data through cookies and analytics tools.</p></div>
          <div><h2 className="font-display text-lg font-bold text-foreground">How We Use Your Information</h2><p>Your information is used to process bookings, communicate trip details, improve our services, and send promotional materials (with your consent). We never sell your personal data to third parties.</p></div>
          <div><h2 className="font-display text-lg font-bold text-foreground">Data Security</h2><p>We implement industry-standard security measures to protect your personal information, including encryption for data in transit and at rest. Payment information is processed through secure third-party payment processors.</p></div>
          <div><h2 className="font-display text-lg font-bold text-foreground">Your Rights</h2><p>You have the right to access, correct, or delete your personal information. You may opt out of marketing communications at any time. Contact us at privacy@tembosafari.com for any data-related requests.</p></div>
          <div><h2 className="font-display text-lg font-bold text-foreground">Cookies</h2><p>We use essential cookies for site functionality and analytics cookies to understand how visitors use our website. You can manage cookie preferences through your browser settings.</p></div>
        </div>
      </div>
    </section>
  );
}
