import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { mockBookings } from "@/data/mockData";
import { bookingService } from "@/services/bookingService";
import type { Booking } from "@/types";
import { useToast } from "@/hooks/use-toast";

const statusColor: Record<string, string> = { confirmed: "bg-safari-green text-primary-foreground", pending: "bg-safari-gold text-foreground", completed: "bg-primary text-primary-foreground", cancelled: "bg-destructive text-destructive-foreground" };
const payColor: Record<string, string> = { paid: "bg-safari-green text-primary-foreground", pending: "bg-safari-gold text-foreground", refunded: "bg-secondary text-secondary-foreground" };

export default function AdminBookings() {
  const { toast } = useToast();
  const [bookings, setBookings] = useState<Booking[]>(mockBookings);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const filtered = bookings.filter((b) => {
    if (statusFilter !== "all" && b.status !== statusFilter) return false;
    if (search && !b.bookingRef.toLowerCase().includes(search.toLowerCase()) && !b.packageTitle.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  const updateStatus = async (id: string, status: Booking["status"]) => {
    await bookingService.updateStatus(id, status);
    setBookings((prev) => prev.map((b) => b.id === id ? { ...b, status } : b));
    toast({ title: `Booking ${status}` });
  };

  return (
    <div className="space-y-6">
      <h1 className="font-display text-2xl font-bold text-foreground">Bookings</h1>
      <div className="flex flex-wrap gap-3">
        <Input placeholder="Search by ref or package..." value={search} onChange={(e) => setSearch(e.target.value)} className="sm:w-64" />
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-40"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="confirmed">Confirmed</SelectItem>
            <SelectItem value="completed">Completed</SelectItem>
            <SelectItem value="cancelled">Cancelled</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <Card className="border-border/50">
        <CardContent className="p-0">
          <Table>
            <TableHeader><TableRow>
              <TableHead>Ref</TableHead><TableHead>Package</TableHead><TableHead>Date</TableHead><TableHead>Travelers</TableHead><TableHead>Status</TableHead><TableHead>Payment</TableHead><TableHead className="text-right">Amount</TableHead><TableHead>Update</TableHead>
            </TableRow></TableHeader>
            <TableBody>
              {filtered.map((b) => (
                <TableRow key={b.id}>
                  <TableCell className="font-mono text-sm">{b.bookingRef}</TableCell>
                  <TableCell>{b.packageTitle}</TableCell>
                  <TableCell className="text-sm">{b.startDate}</TableCell>
                  <TableCell>{b.travelers.length}</TableCell>
                  <TableCell><Badge className={statusColor[b.status] ?? ""}>{b.status}</Badge></TableCell>
                  <TableCell><Badge className={payColor[b.paymentStatus] ?? ""}>{b.paymentStatus}</Badge></TableCell>
                  <TableCell className="text-right font-semibold">${b.totalAmount.toLocaleString()}</TableCell>
                  <TableCell>
                    <Select value={b.status} onValueChange={(v) => updateStatus(b.id, v as Booking["status"])}>
                      <SelectTrigger className="h-8 w-28"><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="pending">Pending</SelectItem>
                        <SelectItem value="confirmed">Confirmed</SelectItem>
                        <SelectItem value="completed">Completed</SelectItem>
                        <SelectItem value="cancelled">Cancelled</SelectItem>
                      </SelectContent>
                    </Select>
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
