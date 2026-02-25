import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { mockDestinations } from "@/data/mockData";
import type { Destination } from "@/types";
import { useToast } from "@/hooks/use-toast";
import { Plus, Edit, MapPin } from "lucide-react";
import { motion } from "framer-motion";

export default function AdminDestinations() {
  const { toast } = useToast();
  const [destinations, setDestinations] = useState<Destination[]>(mockDestinations);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Destination | null>(null);

  const handleSave = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const name = fd.get("name") as string;
    if (editing) {
      setDestinations((prev) => prev.map((d) => d.id === editing.id ? { ...d, name, country: fd.get("country") as string, description: fd.get("description") as string, image: fd.get("image") as string } : d));
      toast({ title: "Destination updated" });
    } else {
      const newDest: Destination = { id: `d${Date.now()}`, name, country: fd.get("country") as string, description: fd.get("description") as string, image: fd.get("image") as string, packageCount: 0 };
      setDestinations((prev) => [...prev, newDest]);
      toast({ title: "Destination created" });
    }
    setOpen(false);
    setEditing(null);
  };

  const openEdit = (d: Destination) => { setEditing(d); setOpen(true); };

  return (
    <motion.div className="space-y-6" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <MapPin className="h-5 w-5 text-primary" />
          <span className="font-display text-lg font-semibold text-foreground">Destinations</span>
        </div>
        <Dialog open={open} onOpenChange={(v) => { setOpen(v); if (!v) setEditing(null); }}>
          <DialogTrigger asChild><Button size="sm" className="gap-1.5"><Plus className="h-4 w-4" /> Add Destination</Button></DialogTrigger>
          <DialogContent>
            <DialogHeader><DialogTitle>{editing ? "Edit" : "Add"} Destination</DialogTitle></DialogHeader>
            <form onSubmit={handleSave} className="space-y-4">
              <div><Label>Name</Label><Input name="name" required defaultValue={editing?.name} /></div>
              <div><Label>Country</Label><Input name="country" required defaultValue={editing?.country} /></div>
              <div><Label>Image URL</Label><Input name="image" defaultValue={editing?.image} /></div>
              <div><Label>Description</Label><Textarea name="description" defaultValue={editing?.description} /></div>
              <Button type="submit" className="w-full">{editing ? "Update" : "Create"}</Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {destinations.map((d) => (
          <Card key={d.id} className="border-border/50 overflow-hidden hover:shadow-md transition-shadow">
            <div className="h-36 overflow-hidden">
              <img src={d.image} alt={d.name} className="h-full w-full object-cover" />
            </div>
            <CardContent className="p-4">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-display text-sm font-semibold text-foreground">{d.name}</h3>
                  <p className="text-xs text-muted-foreground">{d.country} · {d.packageCount} packages</p>
                </div>
                <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => openEdit(d)}>
                  <Edit className="h-3.5 w-3.5" />
                </Button>
              </div>
              <p className="mt-2 text-xs text-muted-foreground line-clamp-2">{d.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </motion.div>
  );
}
