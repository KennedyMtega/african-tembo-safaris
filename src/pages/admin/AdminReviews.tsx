import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { mockReviews } from "@/data/mockAdminData";
import { reviewService } from "@/services/reviewService";
import type { Review } from "@/types/admin";
import { useToast } from "@/hooks/use-toast";
import { Star, Check, X, Sparkles } from "lucide-react";
import { motion } from "framer-motion";

const statusColor: Record<string, string> = { approved: "bg-safari-green text-primary-foreground", pending: "bg-safari-gold text-foreground", rejected: "bg-destructive text-destructive-foreground" };

export default function AdminReviews() {
  const { toast } = useToast();
  const [reviews, setReviews] = useState<Review[]>(mockReviews);
  const [statusFilter, setStatusFilter] = useState("all");

  const filtered = reviews.filter((r) => statusFilter === "all" || r.status === statusFilter);

  const updateStatus = async (id: string, status: Review["status"]) => {
    await reviewService.updateStatus(id, status);
    setReviews((prev) => prev.map((r) => r.id === id ? { ...r, status } : r));
    toast({ title: `Review ${status}` });
  };

  const toggleFeatured = async (id: string) => {
    await reviewService.toggleFeatured(id);
    setReviews((prev) => prev.map((r) => r.id === id ? { ...r, featured: !r.featured } : r));
    toast({ title: "Featured toggled" });
  };

  const avgRating = (reviews.reduce((s, r) => s + r.rating, 0) / reviews.length).toFixed(1);

  return (
    <motion.div className="space-y-6" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Star className="h-5 w-5 text-safari-gold" />
          <span className="font-display text-lg font-semibold text-foreground">Reviews</span>
          <Badge variant="secondary" className="ml-2">{avgRating} avg</Badge>
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="h-9 w-32"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="approved">Approved</SelectItem>
            <SelectItem value="rejected">Rejected</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <Card className="border-border/50"><CardContent className="p-4"><p className="text-xs text-muted-foreground">Total Reviews</p><p className="font-display text-xl font-bold text-foreground">{reviews.length}</p></CardContent></Card>
        <Card className="border-border/50"><CardContent className="p-4"><p className="text-xs text-muted-foreground">Pending</p><p className="font-display text-xl font-bold text-safari-gold">{reviews.filter((r) => r.status === "pending").length}</p></CardContent></Card>
        <Card className="border-border/50"><CardContent className="p-4"><p className="text-xs text-muted-foreground">Featured</p><p className="font-display text-xl font-bold text-primary">{reviews.filter((r) => r.featured).length}</p></CardContent></Card>
      </div>

      <Card className="border-border/50">
        <CardContent className="p-0">
          <Table>
            <TableHeader><TableRow>
              <TableHead>Package</TableHead><TableHead>User</TableHead><TableHead>Rating</TableHead><TableHead>Title</TableHead><TableHead>Status</TableHead><TableHead>Featured</TableHead><TableHead className="text-right">Actions</TableHead>
            </TableRow></TableHeader>
            <TableBody>
              {filtered.map((r) => (
                <TableRow key={r.id}>
                  <TableCell className="text-sm">{r.packageTitle}</TableCell>
                  <TableCell className="text-sm">{r.userName}</TableCell>
                  <TableCell>{"⭐".repeat(r.rating)}</TableCell>
                  <TableCell className="text-sm max-w-48 truncate">{r.title}</TableCell>
                  <TableCell><Badge className={statusColor[r.status] ?? ""}>{r.status}</Badge></TableCell>
                  <TableCell>
                    <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => toggleFeatured(r.id)}>
                      <Sparkles className={`h-3.5 w-3.5 ${r.featured ? "text-safari-gold" : "text-muted-foreground"}`} />
                    </Button>
                  </TableCell>
                  <TableCell className="text-right space-x-1">
                    {r.status === "pending" && (
                      <>
                        <Button variant="ghost" size="icon" className="h-7 w-7 text-safari-green" onClick={() => updateStatus(r.id, "approved")}><Check className="h-3.5 w-3.5" /></Button>
                        <Button variant="ghost" size="icon" className="h-7 w-7 text-destructive" onClick={() => updateStatus(r.id, "rejected")}><X className="h-3.5 w-3.5" /></Button>
                      </>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </motion.div>
  );
}
