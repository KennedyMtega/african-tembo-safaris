import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { mockPackages } from "@/data/mockData";
import { packageService } from "@/services/packageService";
import type { SafariPackage } from "@/types";
import { useToast } from "@/hooks/use-toast";

const statusColor: Record<string, string> = { published: "bg-safari-green text-primary-foreground", draft: "bg-muted text-muted-foreground", archived: "bg-secondary text-secondary-foreground" };

export default function AdminPackages() {
  const { toast } = useToast();
  const [packages, setPackages] = useState<SafariPackage[]>(mockPackages);
  const [open, setOpen] = useState(false);

  const toggleStatus = async (id: string, current: string) => {
    const next = current === "published" ? "archived" : "published";
    await packageService.update(id, { status: next as SafariPackage["status"] });
    setPackages(mockPackages.map((p) => p.id === id ? { ...p, status: next as SafariPackage["status"] } : p));
    toast({ title: `Package ${next}` });
  };

  const handleCreate = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const title = fd.get("title") as string;
    toast({ title: "Package created", description: title });
    setOpen(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="font-display text-2xl font-bold text-foreground">Packages</h1>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild><Button>+ New Package</Button></DialogTrigger>
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
              <div><Label>Description</Label><Textarea name="description" /></div>
              <Button type="submit" className="w-full">Create</Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Card className="border-border/50">
        <CardContent className="p-0">
          <Table>
            <TableHeader><TableRow>
              <TableHead>Title</TableHead><TableHead>Destination</TableHead><TableHead>Duration</TableHead><TableHead>Price</TableHead><TableHead>Status</TableHead><TableHead className="text-right">Actions</TableHead>
            </TableRow></TableHeader>
            <TableBody>
              {packages.map((p) => (
                <TableRow key={p.id}>
                  <TableCell className="font-medium">{p.title}</TableCell>
                  <TableCell>{p.destination}</TableCell>
                  <TableCell>{p.duration} days</TableCell>
                  <TableCell>${p.price.toLocaleString()}</TableCell>
                  <TableCell><Badge className={statusColor[p.status] ?? ""}>{p.status}</Badge></TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="sm" onClick={() => toggleStatus(p.id, p.status)}>
                      {p.status === "published" ? "Archive" : "Publish"}
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
