import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { mockBookings } from "@/data/mockData";
import { bookingService } from "@/services/bookingService";
import type { Booking } from "@/types";
import { useToast } from "@/hooks/use-toast";
import { Search, Download, ChevronDown, ChevronRight, Mail } from "lucide-react";
import { motion } from "framer-motion";

const statusColor: Record<string, string> = { confirmed: "bg-safari-green text-primary-foreground", pending: "bg-safari-gold text-foreground", completed: "bg-primary text-primary-foreground", cancelled: "bg-destructive text-destructive-foreground" };
const payColor: Record<string, string> = { paid: "bg-safari-green text-primary-foreground", pending: "bg-safari-gold text-foreground", refunded: "bg-secondary text-secondary-foreground" };

export default function AdminBookings() {
  const { toast } = useToast();
  const [bookings, setBookings] = useState<Booking[]>(mockBookings);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [expanded, setExpanded] = useState<Set<string>>(new Set());
  const [detailBooking, setDetailBooking] = useState<Booking | null>(null);

  const filtered = bookings.filter((b) => {
    if (statusFilter !== "all" && b.status !== statusFilter) return false;
    if (search && !b.bookingRef.toLowerCase().includes(search.toLowerCase()) && !b.packageTitle.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  const toggleExpand = (id: string) => {
    setExpanded((prev) => { const n = new Set(prev); n.has(id) ? n.delete(id) : n.add(id); return n; });
  };

  const updateStatus = async (id: string, status: Booking["status"]) => {
    await bookingService.updateStatus(id, status);
    setBookings((prev) => prev.map((b) => b.id === id ? { ...b, status } : b));
    toast({ title: `Booking ${status}` });
  };

  const exportCSV = () => {
    const csv = "Ref,Package,Date,Status,Amount\n" + filtered.map((b) => `${b.bookingRef},${b.packageTitle},${b.startDate},${b.status},${b.totalAmount}`).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a"); a.href = url; a.download = "bookings.csv"; a.click();
    toast({ title: "CSV exported" });
  };

  const summary = {
    total: bookings.length,
    pending: bookings.filter((b) => b.status === "pending").length,
    confirmed: bookings.filter((b) => b.status === "confirmed").length,
    revenue: bookings.filter((b) => b.paymentStatus === "paid").reduce((s, b) => s + b.totalAmount, 0),
  };

  return (
    <motion.div className="space-y-6" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      {/* Summary cards */}
      <div className="grid gap-4 sm:grid-cols-4">
        <Card className="border-border/50"><CardContent className="p-4"><p className="text-xs text-muted-foreground">Total</p><p className="font-display text-xl font-bold text-foreground">{summary.total}</p></CardContent></Card>
        <Card className="border-border/50"><CardContent className="p-4"><p className="text-xs text-muted-foreground">Pending</p><p className="font-display text-xl font-bold text-safari-gold">{summary.pending}</p></CardContent></Card>
        <Card className="border-border/50"><CardContent className="p-4"><p className="text-xs text-muted-foreground">Confirmed</p><p className="font-display text-xl font-bold text-safari-green">{summary.confirmed}</p></CardContent></Card>
        <Card className="border-border/50"><CardContent className="p-4"><p className="text-xs text-muted-foreground">Revenue</p><p className="font-display text-xl font-bold text-foreground">${summary.revenue.toLocaleString()}</p></CardContent></Card>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="relative">
          <Search className="absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
          <Input placeholder="Search ref or package…" value={search} onChange={(e) => setSearch(e.target.value)} className="h-9 w-56 pl-8 text-sm" />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="h-9 w-36"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="confirmed">Confirmed</SelectItem>
            <SelectItem value="completed">Completed</SelectItem>
            <SelectItem value="cancelled">Cancelled</SelectItem>
          </SelectContent>
        </Select>
        <Button variant="outline" size="sm" className="gap-1.5 ml-auto" onClick={exportCSV}>
          <Download className="h-3.5 w-3.5" /> Export CSV
        </Button>
      </div>

      {/* Table */}
      <Card className="border-border/50">
        <CardContent className="p-0">
          <Table>
            <TableHeader><TableRow>
              <TableHead className="w-8"></TableHead>
              <TableHead>Ref</TableHead><TableHead>Package</TableHead><TableHead>Date</TableHead><TableHead>Travelers</TableHead><TableHead>Status</TableHead><TableHead>Payment</TableHead><TableHead className="text-right">Amount</TableHead><TableHead>Update</TableHead><TableHead></TableHead>
            </TableRow></TableHeader>
            <TableBody>
              {filtered.map((b) => (
                <>
                  <TableRow key={b.id}>
                    <TableCell>
                      <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => toggleExpand(b.id)}>
                        {expanded.has(b.id) ? <ChevronDown className="h-3.5 w-3.5" /> : <ChevronRight className="h-3.5 w-3.5" />}
                      </Button>
                    </TableCell>
                    <TableCell className="font-mono text-xs">{b.bookingRef}</TableCell>
                    <TableCell className="text-sm">{b.packageTitle}</TableCell>
                    <TableCell className="text-xs">{b.startDate}</TableCell>
                    <TableCell>{b.travelers.length}</TableCell>
                    <TableCell><Badge className={statusColor[b.status] ?? ""}>{b.status}</Badge></TableCell>
                    <TableCell><Badge className={payColor[b.paymentStatus] ?? ""}>{b.paymentStatus}</Badge></TableCell>
                    <TableCell className="text-right font-semibold">${b.totalAmount.toLocaleString()}</TableCell>
                    <TableCell>
                      <Select value={b.status} onValueChange={(v) => updateStatus(b.id, v as Booking["status"])}>
                        <SelectTrigger className="h-7 w-28 text-xs"><SelectValue /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="pending">Pending</SelectItem>
                          <SelectItem value="confirmed">Confirmed</SelectItem>
                          <SelectItem value="completed">Completed</SelectItem>
                          <SelectItem value="cancelled">Cancelled</SelectItem>
                        </SelectContent>
                      </Select>
                    </TableCell>
                    <TableCell>
                      <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => setDetailBooking(b)}>
                        <Mail className="h-3.5 w-3.5" />
                      </Button>
                    </TableCell>
                  </TableRow>
                  {expanded.has(b.id) && (
                    <TableRow key={`${b.id}-exp`}>
                      <TableCell colSpan={10} className="bg-muted/30 p-4">
                        <div className="space-y-2">
                          <p className="text-xs font-semibold text-foreground">Travelers</p>
                          {b.travelers.map((t, i) => (
                            <div key={i} className="text-xs text-muted-foreground">
                              {t.firstName} {t.lastName} · {t.email} · {t.phone}
                              {t.dietaryNeeds && ` · Diet: ${t.dietaryNeeds}`}
                            </div>
                          ))}
                          {b.specialRequests && (
                            <div className="mt-2">
                              <p className="text-xs font-semibold text-foreground">Special Requests</p>
                              <p className="text-xs text-muted-foreground">{b.specialRequests}</p>
                            </div>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  )}
                </>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Detail Sheet */}
      <Sheet open={!!detailBooking} onOpenChange={() => setDetailBooking(null)}>
        <SheetContent className="overflow-y-auto sm:max-w-md">
          {detailBooking && (
            <>
              <SheetHeader>
                <SheetTitle className="font-display">Booking {detailBooking.bookingRef}</SheetTitle>
              </SheetHeader>
              <div className="mt-4 space-y-4 text-sm">
                <div className="grid grid-cols-2 gap-2">
                  <div><span className="text-muted-foreground">Package:</span> {detailBooking.packageTitle}</div>
                  <div><span className="text-muted-foreground">Status:</span> <Badge className={statusColor[detailBooking.status] ?? ""}>{detailBooking.status}</Badge></div>
                  <div><span className="text-muted-foreground">Dates:</span> {detailBooking.startDate} → {detailBooking.endDate}</div>
                  <div><span className="text-muted-foreground">Amount:</span> ${detailBooking.totalAmount.toLocaleString()}</div>
                  <div><span className="text-muted-foreground">Payment:</span> <Badge className={payColor[detailBooking.paymentStatus] ?? ""}>{detailBooking.paymentStatus}</Badge></div>
                  <div><span className="text-muted-foreground">Created:</span> {detailBooking.createdAt}</div>
                </div>
                <div>
                  <p className="font-semibold text-foreground mb-1">Travelers ({detailBooking.travelers.length})</p>
                  {detailBooking.travelers.map((t, i) => (
                    <div key={i} className="rounded-md border border-border p-2 mb-2">
                      <p className="font-medium">{t.firstName} {t.lastName}</p>
                      <p className="text-xs text-muted-foreground">{t.email} · {t.phone}</p>
                    </div>
                  ))}
                </div>
                <Button variant="outline" className="w-full gap-2" onClick={() => { toast({ title: "Notification sent (mock)" }); setDetailBooking(null); }}>
                  <Mail className="h-4 w-4" /> Send Status Notification
                </Button>
              </div>
            </>
          )}
        </SheetContent>
      </Sheet>
    </motion.div>
  );
}
