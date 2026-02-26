import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { paymentService } from "@/services/paymentService";
import { useToast } from "@/hooks/use-toast";
import { Download } from "lucide-react";
import { motion } from "framer-motion";
import { useQuery } from "@tanstack/react-query";

const payColor: Record<string, string> = { paid: "bg-safari-green text-primary-foreground", pending: "bg-safari-gold text-foreground", refunded: "bg-secondary text-secondary-foreground" };

export default function AdminPayments() {
  const { toast } = useToast();
  const { data: payments = [], isLoading } = useQuery({ queryKey: ["admin-payments"], queryFn: () => paymentService.getAll() });
  const [statusFilter, setStatusFilter] = useState("all");

  const filtered = payments.filter((p) => statusFilter === "all" || p.status === statusFilter);
  const paid = payments.filter((p) => p.status === "paid").reduce((s, p) => s + p.amount, 0);
  const pending = payments.filter((p) => p.status === "pending").reduce((s, p) => s + p.amount, 0);

  const exportCSV = () => {
    const csv = "Ref,Method,Status,Amount,Date\n" + filtered.map((p) => `${p.bookingRef},${p.method},${p.status},${p.amount},${p.paidAt ?? p.createdAt}`).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a"); a.href = url; a.download = "payments.csv"; a.click();
    toast({ title: "CSV exported" });
  };

  return (
    <motion.div className="space-y-6" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <div className="grid gap-4 sm:grid-cols-3">
        <Card className="border-border/50"><CardContent className="p-4"><p className="text-xs text-muted-foreground">Total Received</p><p className="font-display text-xl font-bold text-safari-green">${paid.toLocaleString()}</p></CardContent></Card>
        <Card className="border-border/50"><CardContent className="p-4"><p className="text-xs text-muted-foreground">Pending</p><p className="font-display text-xl font-bold text-safari-gold">${pending.toLocaleString()}</p></CardContent></Card>
        <Card className="border-border/50"><CardContent className="p-4"><p className="text-xs text-muted-foreground">Total</p><p className="font-display text-xl font-bold text-foreground">${(paid + pending).toLocaleString()}</p></CardContent></Card>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="h-9 w-32"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="paid">Paid</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="refunded">Refunded</SelectItem>
          </SelectContent>
        </Select>
        <Button variant="outline" size="sm" className="gap-1.5 ml-auto" onClick={exportCSV}>
          <Download className="h-3.5 w-3.5" /> Export
        </Button>
      </div>

      <Card className="border-border/50">
        <CardContent className="p-0">
          {isLoading ? (
            <p className="p-6 text-center text-sm text-muted-foreground">Loading...</p>
          ) : (
            <Table>
              <TableHeader><TableRow>
                <TableHead>Booking Ref</TableHead><TableHead>Method</TableHead><TableHead>Status</TableHead><TableHead>Date</TableHead><TableHead className="text-right">Amount</TableHead>
              </TableRow></TableHeader>
              <TableBody>
                {filtered.map((p) => (
                  <TableRow key={p.id}>
                    <TableCell className="font-mono text-xs">{p.bookingRef}</TableCell>
                    <TableCell className="text-sm">{p.method}</TableCell>
                    <TableCell><Badge className={payColor[p.status] ?? ""}>{p.status}</Badge></TableCell>
                    <TableCell className="text-xs">{p.paidAt ?? p.createdAt}</TableCell>
                    <TableCell className="text-right font-semibold">${p.amount.toLocaleString()}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}
