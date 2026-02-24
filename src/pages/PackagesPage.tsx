import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { mockPackages } from "@/data/mockData";
import { PackageCard } from "@/components/PackageCard";
import { PackageFilters } from "@/components/PackageFilters";

export default function PackagesPage() {
  const [search, setSearch] = useState("");
  const [destination, setDestination] = useState("all");
  const [difficulty, setDifficulty] = useState("all");
  const [sortBy, setSortBy] = useState("popular");

  const published = mockPackages.filter((p) => p.status === "published");
  const destinations = [...new Set(published.map((p) => p.destination))];

  const filtered = useMemo(() => {
    let result = published.filter((p) => {
      if (destination !== "all" && p.destination !== destination) return false;
      if (difficulty !== "all" && p.difficulty !== difficulty) return false;
      if (search && !p.title.toLowerCase().includes(search.toLowerCase()) && !p.shortDescription.toLowerCase().includes(search.toLowerCase())) return false;
      return true;
    });
    switch (sortBy) {
      case "price-low": result.sort((a, b) => a.price - b.price); break;
      case "price-high": result.sort((a, b) => b.price - a.price); break;
      case "duration": result.sort((a, b) => a.duration - b.duration); break;
      default: result.sort((a, b) => b.reviewCount - a.reviewCount);
    }
    return result;
  }, [search, destination, difficulty, sortBy]);

  return (
    <section className="bg-background py-12 md:py-20">
      <div className="container">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-10">
          <p className="text-sm font-semibold uppercase tracking-wider text-primary">Our Collection</p>
          <h1 className="mt-2 font-display text-3xl font-bold text-foreground md:text-4xl">Safari Packages</h1>
          <p className="mt-2 max-w-xl text-muted-foreground">Browse our carefully curated selection of African safari experiences.</p>
        </motion.div>
        <div className="mb-8">
          <PackageFilters destination={destination} setDestination={setDestination} difficulty={difficulty} setDifficulty={setDifficulty} sortBy={sortBy} setSortBy={setSortBy} search={search} setSearch={setSearch} destinations={destinations} />
        </div>
        {filtered.length === 0 ? (
          <p className="py-20 text-center text-muted-foreground">No packages match your filters.</p>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map((pkg, i) => <PackageCard key={pkg.id} pkg={pkg} index={i} />)}
          </div>
        )}
      </div>
    </section>
  );
}
