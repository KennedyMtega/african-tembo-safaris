import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { mockPayments } from "@/data/mockData";

const payColor: Record<string, string> = { paid: "bg-safari-green text-primary-foreground", pending: "bg-safari-gold text-foreground", refunded: "bg-secondary text-secondary-foreground" };

export default function AdminPayments() {
  const paid = mockPayments.filter((p) => p.status === "paid").reduce((s, p) => s + p.amount, 0);
  const pending = mockPayments.filter((p) => p.status === "pending").reduce((s, p) => s + p.amount, 0);

  return (
    <div className="space-y-6">
      <h1 className="font-display text-2xl font-bold text-foreground">Payments</h1>

      <div className="grid gap-4 sm:grid-cols-3">
        <Card className="border-border/50"><CardContent className="p-5"><p className="text-sm text-muted-foreground">Total Received</p><p className="mt-1 font-display text-2xl font-bold text-safari-green">${paid.toLocaleString()}</p></CardContent></Card>
        <Card className="border-border/50"><CardContent className="p-5"><p className="text-sm text-muted-foreground">Pending</p><p className="mt-1 font-display text-2xl font-bold text-safari-gold">${pending.toLocaleString()}</p></CardContent></Card>
        <Card className="border-border/50"><CardContent className="p-5"><p className="text-sm text-muted-foreground">Total</p><p className="mt-1 font-display text-2xl font-bold text-foreground">${(paid + pending).toLocaleString()}</p></CardContent></Card>
      </div>

      <Card className="border-border/50">
        <CardContent className="p-0">
          <Table>
            <TableHeader><TableRow>
              <TableHead>Booking Ref</TableHead><TableHead>Method</TableHead><TableHead>Status</TableHead><TableHead>Date</TableHead><TableHead className="text-right">Amount</TableHead>
            </TableRow></TableHeader>
            <TableBody>
              {mockPayments.map((p) => (
                <TableRow key={p.id}>
                  <TableCell className="font-mono text-sm">{p.bookingRef}</TableCell>
                  <TableCell>{p.method}</TableCell>
                  <TableCell><Badge className={payColor[p.status] ?? ""}>{p.status}</Badge></TableCell>
                  <TableCell className="text-sm">{p.paidAt ?? p.createdAt}</TableCell>
                  <TableCell className="text-right font-semibold">${p.amount.toLocaleString()}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
