import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { destinationService } from "@/services/destinationService";
import type { Destination } from "@/types";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { Plus, Edit, MapPin, Trash2, ChevronDown, ChevronRight, Package, Upload, ImageIcon } from "lucide-react";
import { motion } from "framer-motion";
import { useQuery, useQueryClient } from "@tanstack/react-query";

export default function AdminDestinations() {
  const { toast } = useToast();
  const { userRole } = useAuth();
  const queryClient = useQueryClient();
  const { data: destinations = [], isLoading } = useQuery({ queryKey: ["admin-destinations"], queryFn: () => destinationService.getAll() });
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Destination | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleSave = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSaving(true);
    try {
      const fd = new FormData(e.currentTarget);
      let imageUrl = editing?.imageUrl || "";

      if (imageFile) {
        imageUrl = await destinationService.uploadImage(imageFile);
      }

      const dest = {
        name: fd.get("name") as string,
        country: fd.get("country") as string,
        description: fd.get("description") as string,
        imageUrl,
      };

      if (editing) {
        await destinationService.update(editing.id, dest);
        toast({ title: "Destination updated" });
      } else {
        await destinationService.create(dest);
        toast({ title: "Destination created" });
      }
      queryClient.invalidateQueries({ queryKey: ["admin-destinations"] });
      setOpen(false);
      setEditing(null);
      setImageFile(null);
      setImagePreview(null);
    } catch (err: any) {
      toast({ title: "Error", description: err.message, variant: "destructive" });
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    await destinationService.deleteDestination(id);
    queryClient.invalidateQueries({ queryKey: ["admin-destinations"] });
    toast({ title: "Destination deleted" });
  };

  const openEdit = (d: Destination) => {
    setEditing(d);
    setImageFile(null);
    setImagePreview(d.imageUrl || null);
    setOpen(true);
  };

  const openNew = () => {
    setEditing(null);
    setImageFile(null);
    setImagePreview(null);
    setOpen(true);
  };

  return (
    <motion.div className="space-y-6" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <MapPin className="h-5 w-5 text-primary" />
          <span className="font-display text-lg font-semibold text-foreground">Destinations</span>
        </div>
        <Dialog open={open} onOpenChange={(v) => { setOpen(v); if (!v) { setEditing(null); setImageFile(null); setImagePreview(null); } }}>
          <DialogTrigger asChild><Button size="sm" className="gap-1.5" onClick={openNew}><Plus className="h-4 w-4" /> Add Destination</Button></DialogTrigger>
          <DialogContent>
            <DialogHeader><DialogTitle>{editing ? "Edit" : "Add"} Destination</DialogTitle></DialogHeader>
            <form onSubmit={handleSave} className="space-y-4">
              <div><Label>Name</Label><Input name="name" required defaultValue={editing?.name} /></div>
              <div><Label>Country</Label><Input name="country" required defaultValue={editing?.country} /></div>
              <div>
                <Label>Image</Label>
                <div className="mt-1 space-y-2">
                  {imagePreview && (
                    <img src={imagePreview} alt="Preview" className="h-32 w-full rounded-md object-cover border border-border" />
                  )}
                  <label className="flex cursor-pointer items-center gap-2 rounded-md border border-dashed border-border px-4 py-3 text-sm text-muted-foreground hover:bg-muted/50 transition-colors">
                    <Upload className="h-4 w-4" />
                    <span>{imageFile ? imageFile.name : "Choose image file…"}</span>
                    <input type="file" accept="image/*" className="hidden" onChange={handleFileChange} />
                  </label>
                </div>
              </div>
              <div><Label>Description</Label><Textarea name="description" defaultValue={editing?.description} /></div>
              <Button type="submit" className="w-full" disabled={saving}>
                {saving ? "Saving…" : editing ? "Update" : "Create"}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {isLoading ? (
        <p className="py-10 text-center text-muted-foreground">Loading...</p>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {destinations.map((d) => (
            <Card key={d.id} className="border-border/50 overflow-hidden hover:shadow-md transition-shadow">
              <div className="h-36 overflow-hidden">
                <img src={d.imageUrl || "/placeholder.svg"} alt={d.name} className="h-full w-full object-cover" />
              </div>
              <CardContent className="p-4 space-y-2">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-display text-sm font-semibold text-foreground">{d.name}</h3>
                    <p className="text-xs text-muted-foreground">{d.country} · {d.packageCount} packages</p>
                  </div>
                  <div className="flex gap-1">
                    <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => openEdit(d)}>
                      <Edit className="h-3.5 w-3.5" />
                    </Button>
                    {userRole === "admin" && (
                      <Button variant="ghost" size="icon" className="h-7 w-7 text-destructive" onClick={() => handleDelete(d.id)}>
                        <Trash2 className="h-3.5 w-3.5" />
                      </Button>
                    )}
                  </div>
                </div>
                <p className="text-xs text-muted-foreground line-clamp-2">{d.description}</p>

                {d.packageCount > 0 && (
                  <Collapsible open={expandedId === d.id} onOpenChange={(open) => setExpandedId(open ? d.id : null)}>
                    <CollapsibleTrigger asChild>
                      <Button variant="ghost" size="sm" className="h-7 gap-1 px-2 text-xs text-muted-foreground">
                        <Package className="h-3 w-3" />
                        View Packages
                        {expandedId === d.id ? <ChevronDown className="h-3 w-3" /> : <ChevronRight className="h-3 w-3" />}
                      </Button>
                    </CollapsibleTrigger>
                    <CollapsibleContent>
                      <DestinationPackages destinationId={d.id} />
                    </CollapsibleContent>
                  </Collapsible>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </motion.div>
  );
}

function DestinationPackages({ destinationId }: { destinationId: string }) {
  const { data: packages = [], isLoading } = useQuery({
    queryKey: ["destination-packages", destinationId],
    queryFn: () => destinationService.getPackagesForDestination(destinationId),
  });

  if (isLoading) return <p className="py-2 text-xs text-muted-foreground">Loading…</p>;
  if (packages.length === 0) return <p className="py-2 text-xs text-muted-foreground">No packages</p>;

  const statusColor: Record<string, string> = {
    published: "bg-safari-green text-primary-foreground",
    draft: "bg-muted text-muted-foreground",
    archived: "bg-secondary text-secondary-foreground",
  };

  return (
    <div className="mt-2 space-y-1.5">
      {packages.map((pkg: any) => (
        <div key={pkg.id} className="flex items-center justify-between rounded-md bg-muted/50 px-3 py-2">
          <div className="min-w-0 flex-1">
            <p className="truncate text-xs font-medium text-foreground">{pkg.title}</p>
            <p className="text-[10px] text-muted-foreground">{pkg.duration} days · ${pkg.price_min?.toLocaleString()}{pkg.price_max > pkg.price_min ? ` – $${pkg.price_max?.toLocaleString()}` : ""}</p>
          </div>
          <Badge className={`ml-2 text-[10px] ${statusColor[pkg.status] || ""}`}>{pkg.status}</Badge>
        </div>
      ))}
    </div>
  );
}
