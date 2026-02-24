import { motion } from "framer-motion";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

const faqs = [
  { q: "What is the best time to go on safari?", a: "The dry season (June–October) is ideal for wildlife viewing as animals gather around water sources. However, the green season (November–May) offers lush landscapes, fewer crowds, and lower prices." },
  { q: "How fit do I need to be?", a: "Most of our safaris are vehicle-based and suitable for all fitness levels. Walking safaris and the Kruger Wilderness Trail require moderate fitness. We'll advise you during booking." },
  { q: "What should I pack?", a: "Neutral-colored clothing, sun protection, comfortable walking shoes, binoculars, and a good camera. We provide a detailed packing list upon booking confirmation." },
  { q: "Are safaris safe?", a: "Yes! Our experienced guides are trained in wildlife behavior and safety protocols. All our vehicles are equipped with communication equipment and first aid kits." },
  { q: "Can I bring children?", a: "Children aged 6+ are welcome on most safaris. Some lodges offer family-friendly programs. Let us know during booking and we'll recommend the best options." },
  { q: "What about vaccinations and health?", a: "We recommend consulting your doctor 6–8 weeks before travel. Yellow fever, typhoid, and hepatitis A/B vaccinations are commonly advised. Malaria prophylaxis is recommended for most destinations." },
  { q: "How do payments work?", a: "A 30% deposit secures your booking, with the balance due 60 days before departure. We accept credit cards and bank transfers." },
  { q: "What is your cancellation policy?", a: "Free cancellation up to 90 days before departure. 50% refund for 60–89 days. No refund within 60 days. We strongly recommend travel insurance." },
];

export default function FaqPage() {
  return (
    <section className="bg-background py-12 md:py-20">
      <div className="container max-w-3xl">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <p className="text-sm font-semibold uppercase tracking-wider text-primary">Help Center</p>
          <h1 className="mt-2 font-display text-3xl font-bold text-foreground md:text-4xl">Frequently Asked Questions</h1>
          <p className="mt-2 text-muted-foreground">Everything you need to know before your safari.</p>
        </motion.div>

        <Accordion type="single" collapsible className="mt-10 w-full">
          {faqs.map((faq, i) => (
            <AccordionItem key={i} value={`faq-${i}`}>
              <AccordionTrigger className="text-left text-sm font-semibold text-foreground">{faq.q}</AccordionTrigger>
              <AccordionContent className="text-sm text-muted-foreground">{faq.a}</AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
}
