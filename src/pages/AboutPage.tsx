import { motion } from "framer-motion";
import { Footprints, Heart, Leaf, Eye, Users } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import SEOHead from "@/components/SEOHead";

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({ opacity: 1, y: 0, transition: { delay: i * 0.1, duration: 0.5 } }),
};

export default function AboutPage() {
  return (
    <>
    <SEOHead title="About Us" description="Learn the story behind African Tembo Safari — born from the red earth of Tanzania. Authentic, community-driven safari experiences since day one." />
    <section className="bg-background py-12 md:py-20">
      <div className="container max-w-4xl">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <p className="text-sm font-semibold uppercase tracking-wider text-primary">Our Story</p>
          <h1 className="mt-2 font-display text-3xl font-bold text-foreground md:text-4xl">Born from the Red Earth</h1>
        </motion.div>

        <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }} className="mt-6 text-muted-foreground leading-relaxed">
          African Tembo Safaris wasn't created in a boardroom; it was born in the dust of the savannah and the quiet moments of a sunrise over the horizon. Our founder's deep-rooted love for the African wilderness led to a single vision: to share the continent's most majestic landscapes with the world, while honoring the "Tembo" — the elephant — a symbol of wisdom, family, and an unbreakable bond with the land.
        </motion.p>

        {/* The Tembo Philosophy */}
        <div className="mt-14">
          <h2 className="mb-2 font-display text-2xl font-bold text-foreground">The "Tembo" Philosophy</h2>
          <p className="text-muted-foreground mb-8">Just as the elephant creates paths for others to follow, we pride ourselves on being pioneers of authentic travel. Our approach is built on three pillars:</p>
          <div className="grid gap-6 sm:grid-cols-3">
            {[
              { icon: Heart, title: "Deep Connection", desc: "We don't just show you the 'Big Five.' We introduce you to the heartbeat of Africa — the local cultures, the hidden trails, and the stories that don't make it into the guidebooks." },
              { icon: Footprints, title: "A Gentle Footprint", desc: "Like the elephant, we believe in moving through the wild with respect. Sustainable tourism isn't just a buzzword for us; it's our commitment to preserving these landscapes for generations." },
              { icon: Eye, title: "Unrivaled Expertise", desc: "Our guides are more than just drivers; they are naturalists and storytellers who bring the wilderness to life with every track and every call." },
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
        </div>

        {/* Vision & Mission */}
        <div className="mt-16 grid gap-6 sm:grid-cols-2">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <Card className="border-border/50 h-full">
              <CardContent className="p-6">
                <h3 className="font-display text-lg font-bold text-foreground mb-2">Our Vision</h3>
                <p className="text-sm text-muted-foreground italic">
                  "To be the premier gateway to the soul of Africa, recognized globally for transforming the safari from a mere sightseeing tour into a profound, life-altering connection with the wild."
                </p>
              </CardContent>
            </Card>
          </motion.div>
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.1 }}>
            <Card className="border-border/50 h-full">
              <CardContent className="p-6">
                <h3 className="font-display text-lg font-bold text-foreground mb-2">Our Mission</h3>
                <p className="text-sm text-muted-foreground italic">
                  "To curate authentic, expert-led journeys through the heart of Tanzania. We are dedicated to providing immersive wilderness experiences that honor the majesty of the 'Tembo' — by prioritizing ethical wildlife viewing, empowering local communities, and delivering uncompromising service to every traveler who joins our herd."
                </p>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Conservation */}
        <div className="mt-16">
          <h2 className="mb-6 font-display text-2xl font-bold text-foreground">Protecting the Giants</h2>
          <p className="text-muted-foreground mb-6">At African Tembo Safaris, our name is our promise. The Tembo is the architect of the African wild, and we believe it is our duty to ensure their paths remain open and safe.</p>
          <div className="grid gap-6 sm:grid-cols-3">
            {[
              { icon: Leaf, title: "Low-Impact Travel", desc: "We partner with eco-conscious lodges and camps that prioritize renewable energy and waste reduction." },
              { icon: Users, title: "Supporting Communities", desc: "A portion of every safari goes toward local Tanzanian community initiatives, ensuring the protectors of the land are supported." },
              { icon: Eye, title: "Wildlife First", desc: "Our guides are trained in ethical viewing practices. We observe, we admire, but we never disturb. We are guests in their home." },
            ].map((item, i) => (
              <motion.div key={item.title} custom={i} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}>
                <Card className="border-border/50 h-full">
                  <CardContent className="p-5">
                    <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                      <item.icon className="h-4 w-4 text-primary" />
                    </div>
                    <h3 className="font-display font-semibold text-foreground">{item.title}</h3>
                    <p className="mt-2 text-sm text-muted-foreground">{item.desc}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Meet the Founder */}
        <div className="mt-16">
          <h2 className="mb-6 font-display text-2xl font-bold text-foreground">Meet the Founder</h2>
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <Card className="border-border/50">
              <CardContent className="p-6">
                <h3 className="font-display text-lg font-semibold text-foreground">Mohamedi Shabani Mgomi</h3>
                <p className="text-sm font-medium text-primary">Founder &amp; CEO</p>
                <p className="mt-3 text-sm text-muted-foreground italic leading-relaxed">
                  "My journey didn't start in an office; it started under the vast African sky. Growing up with the red dust of the Savannah under my feet, I learned early on that the wild isn't just a place — it's a feeling. I founded African Tembo Safaris to bridge the gap between the luxury of a modern holiday and the raw, untamed spirit of my home. To me, every guest is more than a traveler; you are a storyteller in the making."
                </p>
                <p className="mt-2 text-xs text-muted-foreground">Based in Arusha, Tanzania</p>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* CTA */}
        <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} className="mt-16 text-center">
          <p className="font-display text-xl font-bold text-foreground">The wild is calling. Will you answer?</p>
          <p className="mt-2 text-sm text-muted-foreground">Whether you seek the thundering adrenaline of the Great Migration or the quiet luxury of a starlit bush dinner, we curate experiences that linger long after the dust has settled.</p>
        </motion.div>
      </div>
    </section>
  );
}
