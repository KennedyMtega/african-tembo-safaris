import { motion } from "framer-motion";
import { Shield, Heart, Leaf, Award } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({ opacity: 1, y: 0, transition: { delay: i * 0.1, duration: 0.5 } }),
};

const team = [
  { name: "James Mwangi", role: "Founder & Lead Guide", desc: "20+ years guiding safaris across East Africa." },
  { name: "Amina Karume", role: "Operations Manager", desc: "Ensures every safari runs like clockwork." },
  { name: "David Osei", role: "Head of Conservation", desc: "Wildlife biologist passionate about sustainable tourism." },
  { name: "Sarah Kimani", role: "Guest Experience", desc: "Dedicated to creating unforgettable safari memories." },
];

export default function AboutPage() {
  return (
    <section className="bg-background py-12 md:py-20">
      <div className="container max-w-4xl">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <p className="text-sm font-semibold uppercase tracking-wider text-primary">Our Story</p>
          <h1 className="mt-2 font-display text-3xl font-bold text-foreground md:text-4xl">About Tembo Safari</h1>
        </motion.div>

        <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }} className="mt-6 text-muted-foreground leading-relaxed">
          Founded in 2005, African Tembo Safari was born from a deep love for Africa's wild places. "Tembo" means elephant in Swahili — symbolizing the strength, wisdom, and gentle spirit we bring to every adventure. We believe in responsible tourism that benefits local communities and protects the incredible ecosystems we explore.
        </motion.p>

        {/* Mission */}
        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {[
            { icon: Heart, title: "Passion", desc: "Genuine love for Africa's wilderness and wildlife." },
            { icon: Shield, title: "Safety", desc: "Your wellbeing is our top priority on every trip." },
            { icon: Leaf, title: "Sustainability", desc: "Low-impact tourism that preserves nature." },
            { icon: Award, title: "Excellence", desc: "Award-winning service and expert guides." },
          ].map((v, i) => (
            <motion.div key={v.title} custom={i} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} className="text-center">
              <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                <v.icon className="h-5 w-5 text-primary" />
              </div>
              <h3 className="font-display font-semibold text-foreground">{v.title}</h3>
              <p className="mt-1 text-sm text-muted-foreground">{v.desc}</p>
            </motion.div>
          ))}
        </div>

        {/* Team */}
        <div className="mt-16">
          <h2 className="mb-6 font-display text-2xl font-bold text-foreground">Meet the Team</h2>
          <div className="grid gap-6 sm:grid-cols-2">
            {team.map((m, i) => (
              <motion.div key={m.name} custom={i} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}>
                <Card className="border-border/50">
                  <CardContent className="p-5">
                    <h3 className="font-display font-semibold text-foreground">{m.name}</h3>
                    <p className="text-sm font-medium text-primary">{m.role}</p>
                    <p className="mt-2 text-sm text-muted-foreground">{m.desc}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
