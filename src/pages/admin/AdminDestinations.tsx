import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { destinationService } from "@/services/destinationService";
import type { Destination } from "@/types";
import { useToast } from "@/hooks/use-toast";
import { Plus, Edit, MapPin, Trash2 } from "lucide-react";
import { motion } from "framer-motion";
import { useQuery, useQueryClient } from "@tanstack/react-query";

export default function AdminDestinations() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { data: destinations = [], isLoading } = useQuery({ queryKey: ["admin-destinations"], queryFn: () => destinationService.getAll() });
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Destination | null>(null);

  const handleSave = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const dest = {
      name: fd.get("name") as string,
      country: fd.get("country") as string,
      description: fd.get("description") as string,
      imageUrl: fd.get("imageUrl") as string,
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
  };

  const handleDelete = async (id: string) => {
    await destinationService.deleteDestination(id);
    queryClient.invalidateQueries({ queryKey: ["admin-destinations"] });
    toast({ title: "Destination deleted" });
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
              <div><Label>Image URL</Label><Input name="imageUrl" defaultValue={editing?.imageUrl} /></div>
              <div><Label>Description</Label><Textarea name="description" defaultValue={editing?.description} /></div>
              <Button type="submit" className="w-full">{editing ? "Update" : "Create"}</Button>
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
              <CardContent className="p-4">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-display text-sm font-semibold text-foreground">{d.name}</h3>
                    <p className="text-xs text-muted-foreground">{d.country} · {d.packageCount} packages</p>
                  </div>
                  <div className="flex gap-1">
                    <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => openEdit(d)}>
                      <Edit className="h-3.5 w-3.5" />
                    </Button>
                    <Button variant="ghost" size="icon" className="h-7 w-7 text-destructive" onClick={() => handleDelete(d.id)}>
                      <Trash2 className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                </div>
                <p className="mt-2 text-xs text-muted-foreground line-clamp-2">{d.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </motion.div>
  );
}
