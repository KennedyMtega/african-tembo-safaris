import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { mockPackages } from "@/data/mockData";
import { mockPackagePerformance } from "@/data/mockAdminData";
import { packageService } from "@/services/packageService";
import type { SafariPackage } from "@/types";
import { useToast } from "@/hooks/use-toast";
import { Search, Plus, Grid3X3, List, Copy, Eye, BarChart3 } from "lucide-react";
import { motion } from "framer-motion";

const statusColor: Record<string, string> = { published: "bg-safari-green text-primary-foreground", draft: "bg-muted text-muted-foreground", archived: "bg-secondary text-secondary-foreground" };

export default function AdminPackages() {
  const { toast } = useToast();
  const [packages, setPackages] = useState<SafariPackage[]>(mockPackages);
  const [open, setOpen] = useState(false);
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
    setPackages((prev) => prev.map((p) => p.id === id ? { ...p, status: next as SafariPackage["status"] } : p));
    toast({ title: `Package ${next}` });
  };

  const duplicatePackage = (pkg: SafariPackage) => {
    const dup = { ...pkg, id: `p${Date.now()}`, title: `${pkg.title} (Copy)`, slug: `${pkg.slug}-copy`, status: "draft" as const, createdAt: new Date().toISOString() };
    setPackages((prev) => [...prev, dup]);
    toast({ title: "Package duplicated" });
  };

  const bulkAction = (action: "publish" | "archive") => {
    const status = action === "publish" ? "published" : "archived";
    setPackages((prev) => prev.map((p) => selected.has(p.id) ? { ...p, status: status as SafariPackage["status"] } : p));
    setSelected(new Set());
    toast({ title: `${selected.size} packages ${status}` });
  };

  const handleCreate = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    toast({ title: "Package created", description: fd.get("title") as string });
    setOpen(false);
  };

  const perf = (id: string) => mockPackagePerformance.find((p) => p.id === id);

  return (
    <motion.div className="space-y-6" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      {/* Header */}
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
          {selected.size > 0 && (
            <>
              <Button variant="outline" size="sm" onClick={() => bulkAction("publish")}>Publish ({selected.size})</Button>
              <Button variant="outline" size="sm" onClick={() => bulkAction("archive")}>Archive ({selected.size})</Button>
            </>
          )}
          <Button variant="ghost" size="icon" className="h-9 w-9" onClick={() => setViewMode(viewMode === "list" ? "grid" : "list")}>
            {viewMode === "list" ? <Grid3X3 className="h-4 w-4" /> : <List className="h-4 w-4" />}
          </Button>
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild><Button size="sm" className="gap-1.5"><Plus className="h-4 w-4" /> New Package</Button></DialogTrigger>
            <DialogContent className="max-w-lg">
              <DialogHeader><DialogTitle>Create Package</DialogTitle></DialogHeader>
              <form onSubmit={handleCreate} className="space-y-4">
                <div><Label>Title</Label><Input name="title" required /></div>
                <div><Label>Destination</Label><Input name="destination" required /></div>
                <div className="grid grid-cols-2 gap-4">
                  <div><Label>Duration (days)</Label><Input name="duration" type="number" min={1} required /></div>
                  <div><Label>Price (USD)</Label><Input name="price" type="number" min={0} required /></div>
                </div>
                <div><Label>Difficulty</Label>
                  <Select name="difficulty" defaultValue="moderate">
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent><SelectItem value="easy">Easy</SelectItem><SelectItem value="moderate">Moderate</SelectItem><SelectItem value="challenging">Challenging</SelectItem></SelectContent>
                  </Select>
                </div>
                <div><Label>Image URLs (comma separated)</Label><Input name="images" /></div>
                <div><Label>Description</Label><Textarea name="description" /></div>
                <Button type="submit" className="w-full">Create</Button>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Grid View */}
      {viewMode === "grid" ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((p) => {
            const stats = perf(p.id);
            return (
              <Card key={p.id} className="border-border/50 hover:shadow-md transition-shadow cursor-pointer" onClick={() => setDetailPkg(p)}>
                <div className="h-32 overflow-hidden rounded-t-lg">
                  <img src={p.images[0]} alt={p.title} className="h-full w-full object-cover" />
                </div>
                <CardContent className="p-4 space-y-2">
                  <div className="flex items-start justify-between">
                    <h3 className="font-display text-sm font-semibold text-foreground">{p.title}</h3>
                    <Badge className={statusColor[p.status] ?? ""} >{p.status}</Badge>
                  </div>
                  <p className="text-xs text-muted-foreground">{p.destination} · {p.duration} days · ${p.price.toLocaleString()}</p>
                  {stats && (
                    <div className="flex gap-3 text-[10px] text-muted-foreground">
                      <span>{stats.bookings} bookings</span>
                      <span>${stats.revenue.toLocaleString()} rev</span>
                      <span>⭐ {stats.rating}</span>
                    </div>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>
      ) : (
        /* List View */
        <Card className="border-border/50">
          <CardContent className="p-0">
            <Table>
              <TableHeader><TableRow>
                <TableHead className="w-8"></TableHead>
                <TableHead>Title</TableHead><TableHead>Destination</TableHead><TableHead>Duration</TableHead><TableHead>Price</TableHead><TableHead>Bookings</TableHead><TableHead>Revenue</TableHead><TableHead>Status</TableHead><TableHead className="text-right">Actions</TableHead>
              </TableRow></TableHeader>
              <TableBody>
                {filtered.map((p) => {
                  const stats = perf(p.id);
                  return (
                    <TableRow key={p.id}>
                      <TableCell>
                        <input type="checkbox" checked={selected.has(p.id)} onChange={() => toggleSelect(p.id)} className="rounded border-border" />
                      </TableCell>
                      <TableCell className="font-medium">{p.title}</TableCell>
                      <TableCell>{p.destination}</TableCell>
                      <TableCell>{p.duration}d</TableCell>
                      <TableCell>${p.price.toLocaleString()}</TableCell>
                      <TableCell>{stats?.bookings ?? "–"}</TableCell>
                      <TableCell>{stats ? `$${stats.revenue.toLocaleString()}` : "–"}</TableCell>
                      <TableCell><Badge className={statusColor[p.status] ?? ""}>{p.status}</Badge></TableCell>
                      <TableCell className="text-right space-x-1">
                        <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => setDetailPkg(p)}><Eye className="h-3.5 w-3.5" /></Button>
                        <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => duplicatePackage(p)}><Copy className="h-3.5 w-3.5" /></Button>
                        <Button variant="ghost" size="sm" className="h-7 text-xs" onClick={() => toggleStatus(p.id, p.status)}>
                          {p.status === "published" ? "Archive" : "Publish"}
                        </Button>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}

      {/* Detail Sheet */}
      <Sheet open={!!detailPkg} onOpenChange={() => setDetailPkg(null)}>
        <SheetContent className="overflow-y-auto sm:max-w-lg">
          {detailPkg && (
            <>
              <SheetHeader>
                <SheetTitle className="font-display">{detailPkg.title}</SheetTitle>
              </SheetHeader>
              <div className="mt-4 space-y-4">
                <img src={detailPkg.images[0]} alt="" className="h-40 w-full rounded-lg object-cover" />
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div><span className="text-muted-foreground">Destination:</span> {detailPkg.destination}</div>
                  <div><span className="text-muted-foreground">Duration:</span> {detailPkg.duration} days</div>
                  <div><span className="text-muted-foreground">Price:</span> ${detailPkg.price.toLocaleString()}</div>
                  <div><span className="text-muted-foreground">Difficulty:</span> {detailPkg.difficulty}</div>
                  <div><span className="text-muted-foreground">Rating:</span> ⭐ {detailPkg.rating}</div>
                  <div><span className="text-muted-foreground">Reviews:</span> {detailPkg.reviewCount}</div>
                </div>
                <div>
                  <p className="text-sm font-semibold text-foreground mb-1">Description</p>
                  <p className="text-sm text-muted-foreground">{detailPkg.description}</p>
                </div>
                <div>
                  <p className="text-sm font-semibold text-foreground mb-1">Highlights</p>
                  <ul className="list-disc pl-4 text-sm text-muted-foreground space-y-0.5">
                    {detailPkg.highlights.map((h) => <li key={h}>{h}</li>)}
                  </ul>
                </div>
                <div>
                  <p className="text-sm font-semibold text-foreground mb-1">Itinerary</p>
                  {detailPkg.itinerary.map((d) => (
                    <div key={d.day} className="mb-2">
                      <p className="text-xs font-semibold text-foreground">Day {d.day}: {d.title}</p>
                      <p className="text-xs text-muted-foreground">{d.description}</p>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}
        </SheetContent>
      </Sheet>
    </motion.div>
  );
}
