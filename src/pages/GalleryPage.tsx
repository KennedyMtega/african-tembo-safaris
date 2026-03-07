import { useQuery } from "@tanstack/react-query";
import { galleryService, type GalleryItem } from "@/services/galleryService";
import { motion } from "framer-motion";
import { useMemo } from "react";
import SEOHead from "@/components/SEOHead";

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

const itemVariants = {
  hidden: { opacity: 0, scale: 0.9, y: 30 },
  visible: (i: number) => ({
    opacity: 1,
    scale: 1,
    y: 0,
    transition: { delay: i * 0.06, duration: 0.5, ease: "easeOut" as const },
  }),
};

export default function GalleryPage() {
  const { data: items = [] } = useQuery({
    queryKey: ["gallery-public"],
    queryFn: () => galleryService.getAll(),
  });

  const shuffled = useMemo(() => shuffle(items), [items]);
  const videos = shuffled.filter((i) => i.type === "video");
  const images = shuffled.filter((i) => i.type === "image");

  return (
    <>
      <SEOHead title="Gallery" description="Stunning photos and videos from our Tanzania safari adventures. Serengeti wildlife, Ngorongoro landscapes, Kilimanjaro views and Zanzibar beaches." />
      <section className="bg-primary py-16 text-center">
        <div className="container">
          <h1 className="font-display text-4xl font-bold text-primary-foreground md:text-5xl">Gallery</h1>
          <p className="mt-3 text-primary-foreground/80">Moments captured from our African adventures</p>
        </div>
      </section>

      {/* Video overlay section */}
      {videos.length > 0 && (
        <section className="relative bg-foreground/5 py-16 overflow-hidden">
          <div className="container">
            <div className="relative mx-auto flex items-center justify-center" style={{ minHeight: 320 }}>
              {videos.slice(0, 3).map((vid, i) => (
                <motion.div
                  key={vid.id}
                  initial={{ opacity: 0, x: i * 40 - 40, rotate: (i - 1) * 4 }}
                  whileInView={{ opacity: 1, x: i * 30 - 30, rotate: (i - 1) * 3 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.7, delay: i * 0.15 }}
                  className="absolute rounded-xl overflow-hidden shadow-xl border-2 border-background"
                  style={{
                    width: "min(80%, 480px)",
                    zIndex: 3 - i,
                    transform: `translateX(${i * 30 - 30}px) rotate(${(i - 1) * 3}deg)`,
                  }}
                >
                  <video
                    src={vid.url}
                    autoPlay
                    muted
                    loop
                    playsInline
                    className="w-full aspect-video object-cover"
                  />
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Masonry image grid */}
      <section className="bg-background py-16">
        <div className="container">
          {images.length === 0 && videos.length === 0 ? (
            <p className="py-20 text-center text-muted-foreground">No gallery items yet.</p>
          ) : (
            <div className="columns-1 gap-4 sm:columns-2 lg:columns-3 xl:columns-4">
              {images.map((item, i) => (
                <motion.div
                  key={item.id}
                  custom={i}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, margin: "-50px" }}
                  variants={itemVariants}
                  className="mb-4 break-inside-avoid group"
                >
                  <div className="overflow-hidden rounded-lg">
                    <img
                      src={item.url}
                      alt={item.title || "Safari gallery"}
                      loading="lazy"
                      onError={(e) => { (e.target as HTMLImageElement).src = "/placeholder.svg"; }}
                      className="w-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  </div>
                  {item.title && (
                    <p className="mt-1.5 text-sm font-medium text-foreground">{item.title}</p>
                  )}
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  );
}
