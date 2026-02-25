import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { mockPayments } from "@/data/mockData";
import type { Payment } from "@/types";
import { useToast } from "@/hooks/use-toast";
import { Download, RefreshCcw } from "lucide-react";
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { motion } from "framer-motion";

const payColor: Record<string, string> = { paid: "bg-safari-green text-primary-foreground", pending: "bg-safari-gold text-foreground", refunded: "bg-secondary text-secondary-foreground" };

const methodData = [
  { name: "Credit Card", value: 5700, fill: "hsl(var(--primary))" },
  { name: "Bank Transfer", value: 5600, fill: "hsl(var(--gold-accent))" },
];

const monthlyPayments = [
  { month: "Jan", amount: 2200 }, { month: "Feb", amount: 0 }, { month: "Mar", amount: 0 },
  { month: "Apr", amount: 9100 },
];

export default function AdminPayments() {
  const { toast } = useToast();
  const [payments] = useState<Payment[]>(mockPayments);
  const [statusFilter, setStatusFilter] = useState("all");
  const [methodFilter, setMethodFilter] = useState("all");

  const filtered = payments.filter((p) => {
    if (statusFilter !== "all" && p.status !== statusFilter) return false;
    if (methodFilter !== "all" && p.method !== methodFilter) return false;
    return true;
  });

  const paid = payments.filter((p) => p.status === "paid").reduce((s, p) => s + p.amount, 0);
  const pending = payments.filter((p) => p.status === "pending").reduce((s, p) => s + p.amount, 0);

  const exportCSV = () => {
    const csv = "Ref,Method,Status,Amount,Date\n" + filtered.map((p) => `${p.bookingRef},${p.method},${p.status},${p.amount},${p.paidAt ?? p.createdAt}`).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a"); a.href = url; a.download = "payments.csv"; a.click();
    toast({ title: "CSV exported" });
  };

  const handleRefund = (id: string) => {
    toast({ title: "Refund initiated (mock)", description: `Payment ${id}` });
  };

  return (
    <motion.div className="space-y-6" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      {/* Summary */}
      <div className="grid gap-4 sm:grid-cols-3">
        <Card className="border-border/50"><CardContent className="p-4"><p className="text-xs text-muted-foreground">Total Received</p><p className="font-display text-xl font-bold text-safari-green">${paid.toLocaleString()}</p></CardContent></Card>
        <Card className="border-border/50"><CardContent className="p-4"><p className="text-xs text-muted-foreground">Pending</p><p className="font-display text-xl font-bold text-safari-gold">${pending.toLocaleString()}</p></CardContent></Card>
        <Card className="border-border/50"><CardContent className="p-4"><p className="text-xs text-muted-foreground">Total</p><p className="font-display text-xl font-bold text-foreground">${(paid + pending).toLocaleString()}</p></CardContent></Card>
      </div>

      {/* Charts */}
      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="border-border/50">
          <CardHeader className="pb-2"><CardTitle className="text-base">By Payment Method</CardTitle></CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie data={methodData} dataKey="value" nameKey="name" cx="50%" cy="50%" innerRadius={40} outerRadius={70} paddingAngle={4} label={({ name }) => name}>
                  {methodData.map((d, i) => <Cell key={i} fill={d.fill} />)}
                </Pie>
                <Tooltip formatter={(v: number) => [`$${v.toLocaleString()}`, "Amount"]} />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
        <Card className="border-border/50">
          <CardHeader className="pb-2"><CardTitle className="text-base">Monthly Revenue</CardTitle></CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={monthlyPayments}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="month" tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 11 }} />
                <YAxis tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 11 }} />
                <Tooltip formatter={(v: number) => [`$${v.toLocaleString()}`, "Revenue"]} />
                <Bar dataKey="amount" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
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
        <Select value={methodFilter} onValueChange={setMethodFilter}>
          <SelectTrigger className="h-9 w-36"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Methods</SelectItem>
            <SelectItem value="Credit Card">Credit Card</SelectItem>
            <SelectItem value="Bank Transfer">Bank Transfer</SelectItem>
          </SelectContent>
        </Select>
        <Button variant="outline" size="sm" className="gap-1.5 ml-auto" onClick={exportCSV}>
          <Download className="h-3.5 w-3.5" /> Export
        </Button>
      </div>

      {/* Table */}
      <Card className="border-border/50">
        <CardContent className="p-0">
          <Table>
            <TableHeader><TableRow>
              <TableHead>Booking Ref</TableHead><TableHead>Method</TableHead><TableHead>Status</TableHead><TableHead>Date</TableHead><TableHead className="text-right">Amount</TableHead><TableHead className="text-right"></TableHead>
            </TableRow></TableHeader>
            <TableBody>
              {filtered.map((p) => (
                <TableRow key={p.id}>
                  <TableCell className="font-mono text-xs">{p.bookingRef}</TableCell>
                  <TableCell className="text-sm">{p.method}</TableCell>
                  <TableCell><Badge className={payColor[p.status] ?? ""}>{p.status}</Badge></TableCell>
                  <TableCell className="text-xs">{p.paidAt ?? p.createdAt}</TableCell>
                  <TableCell className="text-right font-semibold">${p.amount.toLocaleString()}</TableCell>
                  <TableCell className="text-right">
                    {p.status === "paid" && (
                      <Button variant="ghost" size="sm" className="h-7 text-xs gap-1" onClick={() => handleRefund(p.id)}>
                        <RefreshCcw className="h-3 w-3" /> Refund
                      </Button>
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
