import { motion } from "framer-motion";
import { Footprints, Heart, Leaf, Eye, Users, ArrowRight } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import SEOHead from "@/components/SEOHead";

import heroSafari from "@/assets/hero-safari.jpg";
import savannaBg from "@/assets/about-savanna-bg.jpg";
import connectionImg from "@/assets/about-connection.png";
import footprintImg from "@/assets/about-footprint.png";
import expertiseImg from "@/assets/about-expertise.png";
import ecolodgeImg from "@/assets/about-ecolodge.png";
import communityImg from "@/assets/about-community.png";
import wildlifeImg from "@/assets/about-wildlife.png";

const fallback = "/placeholder.svg";

const slideLeft = {
  hidden: { opacity: 0, x: -60 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.7, ease: [0, 0, 0.2, 1] as const } },
};
const slideRight = {
  hidden: { opacity: 0, x: 60 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.7, ease: [0, 0, 0.2, 1] as const } },
};
const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.15, duration: 0.6, ease: [0, 0, 0.2, 1] as const },
  }),
};
const scaleIn = {
  hidden: { opacity: 0, scale: 0.85 },
  visible: (i: number) => ({
    opacity: 1,
    scale: 1,
    transition: { delay: i * 0.12, duration: 0.5, ease: [0, 0, 0.2, 1] as const },
  }),
};

const pillars = [
  {
    icon: Heart,
    title: "Deep Connection",
    desc: "We don't just show you the 'Big Five.' We introduce you to the heartbeat of Africa — the local cultures, the hidden trails, and the stories that don't make it into the guidebooks.",
    img: connectionImg,
  },
  {
    icon: Footprints,
    title: "A Gentle Footprint",
    desc: "Like the elephant, we believe in moving through the wild with respect. Sustainable tourism isn't just a buzzword for us; it's our commitment to preserving these landscapes for generations.",
    img: footprintImg,
  },
  {
    icon: Eye,
    title: "Unrivaled Expertise",
    desc: "Our guides are more than just drivers; they are naturalists and storytellers who bring the wilderness to life with every track and every call.",
    img: expertiseImg,
  },
];

const conservation = [
  {
    icon: Leaf,
    title: "Low-Impact Travel",
    desc: "We partner with eco-conscious lodges and camps that prioritize renewable energy and waste reduction.",
    img: ecolodgeImg,
  },
  {
    icon: Users,
    title: "Supporting Communities",
    desc: "A portion of every safari goes toward local Tanzanian community initiatives, ensuring the protectors of the land are supported.",
    img: communityImg,
  },
  {
    icon: Eye,
    title: "Wildlife First",
    desc: "Our guides are trained in ethical viewing practices. We observe, we admire, but we never disturb. We are guests in their home.",
    img: wildlifeImg,
  },
];

export default function AboutPage() {
  return (
    <>
      <SEOHead
        title="About Us"
        description="Learn the story behind African Tembo Safari — born from the red earth of Tanzania. Authentic, community-driven safari experiences since day one."
      />

      {/* ─── HERO ─── */}
      <section className="relative min-h-[70vh] flex items-center justify-center overflow-hidden">
        <img
          src={heroSafari}
          alt="African savanna at golden hour"
          onError={(e) => { (e.target as HTMLImageElement).src = fallback; }}
          className="absolute inset-0 h-full w-full object-cover blur-[2px] scale-105"
          loading="eager"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[hsl(var(--deep-black)/0.6)] via-[hsl(var(--deep-black)/0.4)] to-[hsl(var(--deep-black)/0.7)]" />

        <motion.div
          initial={{ opacity: 0, y: 30, scale: 0.97 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="relative z-10 mx-auto max-w-3xl px-6 text-center"
        >
          <div className="rounded-2xl bg-background/10 p-8 backdrop-blur-lg border border-white/10 md:p-12">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-primary-foreground/80">
              Our Story
            </p>
            <h1 className="mt-3 font-display text-4xl font-bold text-primary-foreground md:text-5xl lg:text-6xl">
              Born from the Red Earth
            </h1>
            <p className="mt-6 text-base leading-relaxed text-primary-foreground/85 md:text-lg">
              African Tembo Safaris wasn't created in a boardroom; it was born in the dust of the
              savannah and the quiet moments of a sunrise over the horizon. Our founder's deep-rooted
              love for the African wilderness led to a single vision: to share the continent's most
              majestic landscapes with the world, while honoring the "Tembo" — the elephant — a
              symbol of wisdom, family, and an unbreakable bond with the land.
            </p>
          </div>
        </motion.div>
      </section>

      {/* ─── TEMBO PHILOSOPHY ─── */}
      <section className="bg-background py-20 md:py-28">
        <div className="container max-w-6xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.5 }}
            className="mb-16 text-center"
          >
            <h2 className="font-display text-3xl font-bold text-foreground md:text-4xl">
              The "Tembo" Philosophy
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-muted-foreground">
              Just as the elephant creates paths for others to follow, we pride ourselves on being
              pioneers of authentic travel. Our approach is built on three pillars:
            </p>
          </motion.div>

          <div className="space-y-20 md:space-y-28">
            {pillars.map((p, i) => {
              const isReversed = i % 2 !== 0;
              return (
                <div
                  key={p.title}
                  className={`flex flex-col items-center gap-10 md:flex-row md:gap-16 ${
                    isReversed ? "md:flex-row-reverse" : ""
                  }`}
                >
                  {/* Image */}
                  <motion.div
                    variants={isReversed ? slideRight : slideLeft}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, margin: "-100px" }}
                    className="w-full md:w-1/2"
                  >
                    <div className="relative overflow-hidden rounded-2xl bg-secondary/50">
                      <img
                        src={p.img}
                        alt={p.title}
                        onError={(e) => { (e.target as HTMLImageElement).src = fallback; }}
                        className="h-72 w-full object-contain md:h-80 lg:h-96"
                        loading="lazy"
                      />
                    </div>
                  </motion.div>

                  {/* Text */}
                  <motion.div
                    variants={isReversed ? slideLeft : slideRight}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, margin: "-100px" }}
                    className="w-full md:w-1/2"
                  >
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                      <p.icon className="h-5 w-5 text-primary" />
                    </div>
                    <h3 className="mt-4 font-display text-2xl font-bold text-foreground">
                      {p.title}
                    </h3>
                    <p className="mt-3 text-muted-foreground leading-relaxed">{p.desc}</p>
                  </motion.div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ─── VISION & MISSION ─── */}
      <section className="relative py-20 md:py-28 overflow-hidden">
        <img
          src={savannaBg}
          alt="Savanna landscape"
          onError={(e) => { (e.target as HTMLImageElement).src = fallback; }}
          className="absolute inset-0 h-full w-full object-cover blur-[3px] scale-105"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[hsl(var(--deep-black)/0.65)] to-[hsl(var(--deep-black)/0.75)]" />

        <div className="container relative z-10 max-w-5xl">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-10 text-center font-display text-3xl font-bold text-primary-foreground md:text-4xl"
          >
            Our Vision &amp; Mission
          </motion.h2>

          <div className="grid gap-6 sm:grid-cols-2">
            <motion.div
              custom={0}
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
            >
              <Card className="h-full border-white/10 bg-background/15 backdrop-blur-lg">
                <CardContent className="p-8">
                  <h3 className="font-display text-xl font-bold text-primary-foreground mb-3">
                    Our Vision
                  </h3>
                  <p className="text-sm text-primary-foreground/80 italic leading-relaxed">
                    "To be the premier gateway to the soul of Africa, recognized globally for
                    transforming the safari from a mere sightseeing tour into a profound,
                    life-altering connection with the wild."
                  </p>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div
              custom={1}
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
            >
              <Card className="h-full border-white/10 bg-background/15 backdrop-blur-lg">
                <CardContent className="p-8">
                  <h3 className="font-display text-xl font-bold text-primary-foreground mb-3">
                    Our Mission
                  </h3>
                  <p className="text-sm text-primary-foreground/80 italic leading-relaxed">
                    "To curate authentic, expert-led journeys through the heart of Tanzania. We are
                    dedicated to providing immersive wilderness experiences that honor the majesty of
                    the 'Tembo' — by prioritizing ethical wildlife viewing, empowering local
                    communities, and delivering uncompromising service to every traveler who joins our
                    herd."
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ─── CONSERVATION ─── */}
      <section className="bg-background py-20 md:py-28">
        <div className="container max-w-6xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.5 }}
            className="mb-14 text-center"
          >
            <h2 className="font-display text-3xl font-bold text-foreground md:text-4xl">
              Protecting the Giants
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-muted-foreground">
              At African Tembo Safaris, our name is our promise. The Tembo is the architect of the
              African wild, and we believe it is our duty to ensure their paths remain open and safe.
            </p>
          </motion.div>

          <div className="grid gap-8 sm:grid-cols-3">
            {conservation.map((item, i) => (
              <motion.div
                key={item.title}
                custom={i}
                variants={scaleIn}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-60px" }}
              >
                <Card className="group h-full overflow-hidden border-border/50 transition-shadow duration-300 hover:shadow-lg">
                  <div className="overflow-hidden bg-secondary/30">
                    <img
                      src={item.img}
                      alt={item.title}
                      onError={(e) => { (e.target as HTMLImageElement).src = fallback; }}
                      className="h-52 w-full object-contain transition-transform duration-500 group-hover:scale-105"
                      loading="lazy"
                    />
                  </div>
                  <CardContent className="p-6">
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
      </section>

      {/* ─── FOUNDER ─── */}
      <section className="bg-secondary/40 py-20 md:py-28">
        <div className="container max-w-5xl">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-10 text-center font-display text-3xl font-bold text-foreground md:text-4xl"
          >
            Meet the Founder
          </motion.h2>

          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.7 }}
          >
            <Card className="overflow-hidden border-border/50">
              <div className="flex flex-col md:flex-row">
                <div className="relative w-full md:w-2/5">
                  <img
                    src={savannaBg}
                    alt="Savanna backdrop"
                    onError={(e) => { (e.target as HTMLImageElement).src = fallback; }}
                    className="h-64 w-full object-cover md:h-full"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[hsl(var(--deep-black)/0.5)] to-transparent md:bg-gradient-to-r" />
                  <div className="absolute bottom-4 left-4 md:bottom-6 md:left-6">
                    <h3 className="font-display text-xl font-semibold text-primary-foreground">
                      Mohamedi Shabani Mgomi
                    </h3>
                    <p className="text-sm font-medium text-primary-foreground/80">
                      Founder &amp; CEO
                    </p>
                  </div>
                </div>
                <div className="flex flex-col justify-center p-8 md:w-3/5 md:p-10">
                  <p className="text-sm text-muted-foreground italic leading-relaxed">
                    "My journey didn't start in an office; it started under the vast African sky.
                    Growing up with the red dust of the Savannah under my feet, I learned early on
                    that the wild isn't just a place — it's a feeling. I founded African Tembo
                    Safaris to bridge the gap between the luxury of a modern holiday and the raw,
                    untamed spirit of my home. To me, every guest is more than a traveler; you are a
                    storyteller in the making."
                  </p>
                  <p className="mt-4 text-xs text-muted-foreground">Based in Arusha, Tanzania</p>
                </div>
              </div>
            </Card>
          </motion.div>
        </div>
      </section>

      {/* ─── CTA ─── */}
      <section className="relative py-20 md:py-28 overflow-hidden">
        <img
          src={heroSafari}
          alt="Safari landscape"
          onError={(e) => { (e.target as HTMLImageElement).src = fallback; }}
          className="absolute inset-0 h-full w-full object-cover blur-[3px] scale-105"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[hsl(var(--deep-black)/0.65)] to-[hsl(var(--deep-black)/0.8)]" />

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="container relative z-10 max-w-3xl text-center"
        >
          <p className="font-display text-2xl font-bold text-primary-foreground md:text-3xl">
            The wild is calling. Will you answer?
          </p>
          <p className="mt-4 text-sm text-primary-foreground/80 md:text-base">
            Whether you seek the thundering adrenaline of the Great Migration or the quiet luxury of
            a starlit bush dinner, we curate experiences that linger long after the dust has settled.
          </p>
          <Button asChild size="lg" className="mt-8 gap-2">
            <Link to="/packages">
              Start Your Journey <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        </motion.div>
      </section>
    </>
  );
}
