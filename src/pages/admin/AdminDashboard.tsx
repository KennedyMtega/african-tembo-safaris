import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { mockBookings, mockPackages, mockPayments } from "@/data/mockData";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

const metrics = [
  { label: "Total Bookings", value: mockBookings.length },
  { label: "Revenue", value: `$${mockPayments.filter((p) => p.status === "paid").reduce((s, p) => s + p.amount, 0).toLocaleString()}` },
  { label: "Active Packages", value: mockPackages.filter((p) => p.status === "published").length },
  { label: "Pending Bookings", value: mockBookings.filter((b) => b.status === "pending").length },
];

const chartData = [
  { month: "Jan", bookings: 1, revenue: 2200 },
  { month: "Feb", bookings: 0, revenue: 0 },
  { month: "Mar", bookings: 0, revenue: 0 },
  { month: "Apr", bookings: 2, revenue: 9100 },
];

const statusColor: Record<string, string> = { confirmed: "bg-safari-green text-primary-foreground", pending: "bg-safari-gold text-foreground", completed: "bg-primary text-primary-foreground", cancelled: "bg-destructive text-destructive-foreground" };

export default function AdminDashboard() {
  return (
    <div className="space-y-6">
      <h1 className="font-display text-2xl font-bold text-foreground">Dashboard</h1>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {metrics.map((m) => (
          <Card key={m.label} className="border-border/50">
            <CardContent className="p-5">
              <p className="text-sm text-muted-foreground">{m.label}</p>
              <p className="mt-1 font-display text-2xl font-bold text-foreground">{m.value}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Chart */}
      <Card className="border-border/50">
        <CardContent className="p-5">
          <h2 className="mb-4 font-display text-lg font-semibold text-foreground">Bookings & Revenue</h2>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="month" tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }} />
              <YAxis tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }} />
              <Tooltip />
              <Bar dataKey="bookings" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Recent Bookings */}
      <Card className="border-border/50">
        <CardContent className="p-5">
          <h2 className="mb-4 font-display text-lg font-semibold text-foreground">Recent Bookings</h2>
          <Table>
            <TableHeader><TableRow>
              <TableHead>Ref</TableHead><TableHead>Package</TableHead><TableHead>Status</TableHead><TableHead className="text-right">Amount</TableHead>
            </TableRow></TableHeader>
            <TableBody>
              {mockBookings.slice(0, 5).map((b) => (
                <TableRow key={b.id}>
                  <TableCell className="font-mono text-sm">{b.bookingRef}</TableCell>
                  <TableCell>{b.packageTitle}</TableCell>
                  <TableCell><Badge className={statusColor[b.status] ?? ""}>{b.status}</Badge></TableCell>
                  <TableCell className="text-right font-semibold">${b.totalAmount.toLocaleString()}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
