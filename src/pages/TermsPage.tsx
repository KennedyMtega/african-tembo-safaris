import { motion } from "framer-motion";

export default function TermsPage() {
  return (
    <section className="bg-background py-12 md:py-20">
      <div className="container max-w-3xl prose prose-sm text-muted-foreground">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <p className="text-sm font-semibold uppercase tracking-wider text-primary not-prose">Legal</p>
          <h1 className="mt-2 font-display text-3xl font-bold text-foreground md:text-4xl not-prose">Terms of Service</h1>
        </motion.div>
        <div className="mt-8 space-y-6 text-sm leading-relaxed">
          <div><h2 className="font-display text-lg font-bold text-foreground">1. Booking & Payment</h2><p>A 30% non-refundable deposit is required to confirm your safari booking. The remaining balance is due 60 days prior to the departure date. All prices are quoted in USD unless otherwise stated.</p></div>
          <div><h2 className="font-display text-lg font-bold text-foreground">2. Cancellation Policy</h2><p>Cancellations made 90+ days before departure: full refund minus deposit. 60–89 days: 50% refund. Less than 60 days: no refund. We strongly recommend comprehensive travel insurance.</p></div>
          <div><h2 className="font-display text-lg font-bold text-foreground">3. Travel Insurance</h2><p>Travel insurance covering trip cancellation, medical expenses, and emergency evacuation is mandatory for all travelers. Proof of insurance must be provided prior to departure.</p></div>
          <div><h2 className="font-display text-lg font-bold text-foreground">4. Health & Safety</h2><p>Travelers are responsible for ensuring they have the necessary vaccinations and medications. Our guides are trained in first aid and wildlife safety, but all safaris carry inherent risks associated with wilderness activities.</p></div>
          <div><h2 className="font-display text-lg font-bold text-foreground">5. Liability</h2><p>African Tembo Safari acts as an agent for accommodation providers, airlines, and other service suppliers. We are not liable for any injury, loss, or damage arising from the acts or omissions of these third-party suppliers.</p></div>
        </div>
      </div>
    </section>
  );
}
