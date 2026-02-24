import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";

interface PackageFiltersProps {
  destination: string;
  setDestination: (v: string) => void;
  difficulty: string;
  setDifficulty: (v: string) => void;
  sortBy: string;
  setSortBy: (v: string) => void;
  search: string;
  setSearch: (v: string) => void;
  destinations: string[];
}

export function PackageFilters({ destination, setDestination, difficulty, setDifficulty, sortBy, setSortBy, search, setSearch, destinations }: PackageFiltersProps) {
  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:flex-wrap">
      <Input placeholder="Search packages..." value={search} onChange={(e) => setSearch(e.target.value)} className="sm:w-56" />
      <Select value={destination} onValueChange={setDestination}>
        <SelectTrigger className="sm:w-44"><SelectValue placeholder="Destination" /></SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Destinations</SelectItem>
          {destinations.map((d) => <SelectItem key={d} value={d}>{d}</SelectItem>)}
        </SelectContent>
      </Select>
      <Select value={difficulty} onValueChange={setDifficulty}>
        <SelectTrigger className="sm:w-36"><SelectValue placeholder="Difficulty" /></SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Levels</SelectItem>
          <SelectItem value="easy">Easy</SelectItem>
          <SelectItem value="moderate">Moderate</SelectItem>
          <SelectItem value="challenging">Challenging</SelectItem>
        </SelectContent>
      </Select>
      <Select value={sortBy} onValueChange={setSortBy}>
        <SelectTrigger className="sm:w-40"><SelectValue placeholder="Sort by" /></SelectTrigger>
        <SelectContent>
          <SelectItem value="popular">Most Popular</SelectItem>
          <SelectItem value="price-low">Price: Low to High</SelectItem>
          <SelectItem value="price-high">Price: High to Low</SelectItem>
          <SelectItem value="duration">Duration</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}
