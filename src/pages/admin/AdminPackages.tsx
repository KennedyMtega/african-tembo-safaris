import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { packageService } from "@/services/packageService";
import type { SafariPackage } from "@/types";
import { useToast } from "@/hooks/use-toast";
import { Search, Plus, Grid3X3, List, Copy, Eye } from "lucide-react";
import { motion } from "framer-motion";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";

const statusColor: Record<string, string> = { published: "bg-safari-green text-primary-foreground", draft: "bg-muted text-muted-foreground", archived: "bg-secondary text-secondary-foreground" };

function formatPrice(min: number, max: number): string {
  if (min === max || max === 0) return `$${min.toLocaleString()}`;
  return `$${min.toLocaleString()} – $${max.toLocaleString()}`;
}

export default function AdminPackages() {
  const { toast } = useToast();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { data: packages = [], isLoading } = useQuery({ queryKey: ["admin-packages"], queryFn: () => packageService.getAllAdmin() });
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [viewMode, setViewMode] = useState<"list" | "grid">("list");
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [detailPkg, setDetailPkg] = useState<SafariPackage | null>(null);

  const filtered = packages.filter((p) => {
    if (statusFilter !== "all" && p.status !== statusFilter) return false;
    if (search && !p.title.toLowerCase().includes(search.toLowerCase()) && !p.destination.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  const toggleSelect = (id: string) => {
    setSelected((prev) => { const n = new Set(prev); n.has(id) ? n.delete(id) : n.add(id); return n; });
  };

  const toggleStatus = async (id: string, current: string) => {
    const next = current === "published" ? "archived" : "published";
    await packageService.update(id, { status: next as SafariPackage["status"] });
    queryClient.invalidateQueries({ queryKey: ["admin-packages"] });
    toast({ title: `Package ${next}` });
  };

  const duplicatePackage = async (pkg: SafariPackage) => {
    await packageService.create({
      ...pkg,
      title: `${pkg.title} (Copy)`,
      slug: `${pkg.slug}-copy-${Date.now()}`,
      status: "draft",
    });
    queryClient.invalidateQueries({ queryKey: ["admin-packages"] });
    toast({ title: "Package duplicated" });
  };

  return (
    <motion.div className="space-y-6" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
            <Input placeholder="Search packages…" value={search} onChange={(e) => setSearch(e.target.value)} className="h-9 w-56 pl-8 text-sm" />
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="h-9 w-32"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="published">Published</SelectItem>
              <SelectItem value="draft">Draft</SelectItem>
              <SelectItem value="archived">Archived</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" className="h-9 w-9" onClick={() => setViewMode(viewMode === "list" ? "grid" : "list")}>
            {viewMode === "list" ? <Grid3X3 className="h-4 w-4" /> : <List className="h-4 w-4" />}
          </Button>
          <Button size="sm" className="gap-1.5" onClick={() => navigate("/admin/packages/new")}>
            <Plus className="h-4 w-4" /> New Package
          </Button>
        </div>
      </div>

      {isLoading ? (
        <p className="py-20 text-center text-muted-foreground">Loading packages...</p>
      ) : viewMode === "grid" ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((p) => (
            <Card key={p.id} className="border-border/50 hover:shadow-md transition-shadow cursor-pointer" onClick={() => setDetailPkg(p)}>
              <div className="h-32 overflow-hidden rounded-t-lg">
                <img src={p.images[0] || "/placeholder.svg"} alt={p.title} className="h-full w-full object-cover" />
              </div>
              <CardContent className="p-4 space-y-2">
                <div className="flex items-start justify-between">
                  <h3 className="font-display text-sm font-semibold text-foreground">{p.title}</h3>
                  <Badge className={statusColor[p.status] ?? ""}>{p.status}</Badge>
                </div>
                <p className="text-xs text-muted-foreground">{p.destination} · {p.duration} days · {formatPrice(p.priceMin, p.priceMax)}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card className="border-border/50">
          <CardContent className="p-0">
            <Table>
              <TableHeader><TableRow>
                <TableHead>Title</TableHead><TableHead>Destination</TableHead><TableHead>Duration</TableHead><TableHead>Price Range</TableHead><TableHead>Status</TableHead><TableHead className="text-right">Actions</TableHead>
              </TableRow></TableHeader>
              <TableBody>
                {filtered.map((p) => (
                  <TableRow key={p.id}>
                    <TableCell className="font-medium">{p.title}</TableCell>
                    <TableCell>{p.destination}</TableCell>
                    <TableCell>{p.duration}d</TableCell>
                    <TableCell>{formatPrice(p.priceMin, p.priceMax)}</TableCell>
                    <TableCell><Badge className={statusColor[p.status] ?? ""}>{p.status}</Badge></TableCell>
                    <TableCell className="text-right space-x-1">
                      <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => setDetailPkg(p)}><Eye className="h-3.5 w-3.5" /></Button>
                      <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => duplicatePackage(p)}><Copy className="h-3.5 w-3.5" /></Button>
                      <Button variant="ghost" size="sm" className="h-7 text-xs" onClick={() => navigate(`/admin/packages/${p.id}/edit`)}>Edit</Button>
                      <Button variant="ghost" size="sm" className="h-7 text-xs" onClick={() => toggleStatus(p.id, p.status)}>
                        {p.status === "published" ? "Archive" : "Publish"}
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}

      <Sheet open={!!detailPkg} onOpenChange={() => setDetailPkg(null)}>
        <SheetContent className="overflow-y-auto sm:max-w-lg">
          {detailPkg && (
            <>
              <SheetHeader><SheetTitle className="font-display">{detailPkg.title}</SheetTitle></SheetHeader>
              <div className="mt-4 space-y-4">
                <img src={detailPkg.images[0] || "/placeholder.svg"} alt="" className="h-40 w-full rounded-lg object-cover" />
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div><span className="text-muted-foreground">Destination:</span> {detailPkg.destination}</div>
                  <div><span className="text-muted-foreground">Duration:</span> {detailPkg.duration} days</div>
                  <div><span className="text-muted-foreground">Price:</span> {formatPrice(detailPkg.priceMin, detailPkg.priceMax)}</div>
                  <div><span className="text-muted-foreground">Difficulty:</span> {detailPkg.difficulty}</div>
                  <div><span className="text-muted-foreground">Rating:</span> ⭐ {detailPkg.rating}</div>
                  <div><span className="text-muted-foreground">Reviews:</span> {detailPkg.reviewCount}</div>
                </div>
                <div>
                  <p className="text-sm font-semibold text-foreground mb-1">Description</p>
                  <p className="text-sm text-muted-foreground">{detailPkg.description}</p>
                </div>
                {detailPkg.highlights.length > 0 && (
                  <div>
                    <p className="text-sm font-semibold text-foreground mb-1">Highlights</p>
                    <ul className="list-disc pl-4 text-sm text-muted-foreground space-y-0.5">
                      {detailPkg.highlights.map((h) => <li key={h}>{h}</li>)}
                    </ul>
                  </div>
                )}
                {detailPkg.itinerary.length > 0 && (
                  <div>
                    <p className="text-sm font-semibold text-foreground mb-1">Itinerary</p>
                    {detailPkg.itinerary.map((d) => (
                      <div key={d.day} className="mb-2">
                        <p className="text-xs font-semibold text-foreground">Day {d.day}: {d.title}</p>
                        <p className="text-xs text-muted-foreground">{d.description}</p>
                      </div>
                    ))}
                  </div>
                )}
                <Button className="w-full" onClick={() => { setDetailPkg(null); navigate(`/admin/packages/${detailPkg.id}/edit`); }}>Edit Package</Button>
              </div>
            </>
          )}
        </SheetContent>
      </Sheet>
    </motion.div>
  );
}
