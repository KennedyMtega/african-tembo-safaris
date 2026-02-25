import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import {
  DollarSign, TrendingUp, TrendingDown, Package, CalendarCheck, Clock, Users, Star, Plane,
  ArrowUpRight, ArrowDownRight, Plus, Download, Eye, Send,
} from "lucide-react";
import {
  AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, Legend,
} from "recharts";
import { mockBookings, mockPayments } from "@/data/mockData";
import { mockRevenueData, mockDestinationStats, mockActivityLog } from "@/data/mockAdminData";
import { analyticsService } from "@/services/analyticsService";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

const fadeUp = { hidden: { opacity: 0, y: 16 }, show: { opacity: 1, y: 0, transition: { duration: 0.35 } } };
const stagger = { show: { transition: { staggerChildren: 0.06 } } };

const statusColor: Record<string, string> = {
  confirmed: "bg-safari-green text-primary-foreground",
  pending: "bg-safari-gold text-foreground",
  completed: "bg-primary text-primary-foreground",
  cancelled: "bg-destructive text-destructive-foreground",
};

const activityIcons: Record<string, string> = {
  booking_created: "📋", booking_updated: "✏️", package_created: "📦",
  package_updated: "🔄", payment_received: "💰", user_registered: "👤",
  inquiry_resolved: "✅", review_approved: "⭐",
};

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [kpis, setKpis] = useState<Awaited<ReturnType<typeof analyticsService.getKPIs>> | null>(null);

  useEffect(() => { analyticsService.getKPIs().then(setKpis); }, []);

  if (!kpis) return null;

  const kpiCards = [
    { label: "Total Revenue", value: `$${kpis.totalRevenue.toLocaleString()}`, change: kpis.revenueChange, icon: DollarSign, color: "text-safari-green" },
    { label: "Total Bookings", value: kpis.totalBookings, change: kpis.bookingsChange, icon: CalendarCheck, color: "text-primary" },
    { label: "Active Packages", value: kpis.activePackages, change: null, icon: Package, color: "text-safari-gold" },
    { label: "Pending Bookings", value: kpis.pendingBookings, change: null, icon: Clock, color: "text-destructive" },
    { label: "Avg. Booking Value", value: `$${kpis.avgBookingValue.toLocaleString()}`, change: 5.4, icon: TrendingUp, color: "text-safari-brown-light" },
    { label: "Conversion Rate", value: `${kpis.conversionRate}%`, change: 2.1, icon: ArrowUpRight, color: "text-safari-green" },
    { label: "Customer Rating", value: kpis.customerSatisfaction, change: null, icon: Star, color: "text-safari-gold" },
    { label: "Upcoming Departures", value: kpis.upcomingDepartures, change: null, icon: Plane, color: "text-primary" },
  ];

  return (
    <motion.div className="space-y-6" initial="hidden" animate="show" variants={stagger}>
      {/* KPI Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {kpiCards.map((kpi) => (
          <motion.div key={kpi.label} variants={fadeUp}>
            <Card className="border-border/50 hover:shadow-md transition-shadow">
              <CardContent className="p-5">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-xs font-medium text-muted-foreground">{kpi.label}</p>
                    <p className="mt-1 font-display text-2xl font-bold text-foreground">{kpi.value}</p>
                  </div>
                  <div className={`rounded-lg bg-muted p-2 ${kpi.color}`}>
                    <kpi.icon className="h-4 w-4" />
                  </div>
                </div>
                {kpi.change !== null && (
                  <div className="mt-2 flex items-center gap-1 text-xs">
                    {kpi.change > 0 ? (
                      <><ArrowUpRight className="h-3 w-3 text-safari-green" /><span className="text-safari-green">+{kpi.change.toFixed(1)}%</span></>
                    ) : (
                      <><ArrowDownRight className="h-3 w-3 text-destructive" /><span className="text-destructive">{kpi.change.toFixed(1)}%</span></>
                    )}
                    <span className="text-muted-foreground">vs last period</span>
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Charts Row 1 */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Revenue Area Chart */}
        <motion.div variants={fadeUp}>
          <Card className="border-border/50">
            <CardHeader className="pb-2">
              <CardTitle className="text-base font-semibold">Revenue Over Time</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={260}>
                <AreaChart data={mockRevenueData}>
                  <defs>
                    <linearGradient id="revGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="month" tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 11 }} />
                  <YAxis tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 11 }} tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`} />
                  <Tooltip formatter={(v: number) => [`$${v.toLocaleString()}`, ""]} />
                  <Area type="monotone" dataKey="previousRevenue" stroke="hsl(var(--border))" strokeDasharray="4 4" fillOpacity={0} name="Previous" />
                  <Area type="monotone" dataKey="revenue" stroke="hsl(var(--primary))" fill="url(#revGrad)" strokeWidth={2} name="Current" />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </motion.div>

        {/* Bookings by Destination Pie */}
        <motion.div variants={fadeUp}>
          <Card className="border-border/50">
            <CardHeader className="pb-2">
              <CardTitle className="text-base font-semibold">Bookings by Destination</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={260}>
                <PieChart>
                  <Pie data={mockDestinationStats} dataKey="bookings" nameKey="name" cx="50%" cy="50%" innerRadius={55} outerRadius={90} paddingAngle={4} label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}>
                    {mockDestinationStats.map((d, i) => (
                      <Cell key={i} fill={d.fill} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(v: number) => [v, "Bookings"]} />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Charts Row 2 */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Monthly Bookings Bar */}
        <motion.div variants={fadeUp}>
          <Card className="border-border/50">
            <CardHeader className="pb-2">
              <CardTitle className="text-base font-semibold">Monthly Bookings</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={220}>
                <BarChart data={mockRevenueData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="month" tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 11 }} />
                  <YAxis tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 11 }} />
                  <Tooltip />
                  <Bar dataKey="bookings" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} name="Bookings" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </motion.div>

        {/* Revenue by Package Horizontal Bar */}
        <motion.div variants={fadeUp}>
          <Card className="border-border/50">
            <CardHeader className="pb-2">
              <CardTitle className="text-base font-semibold">Revenue by Package</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={220}>
                <BarChart data={mockDestinationStats} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis type="number" tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 11 }} tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`} />
                  <YAxis dataKey="name" type="category" tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 11 }} width={80} />
                  <Tooltip formatter={(v: number) => [`$${v.toLocaleString()}`, "Revenue"]} />
                  <Bar dataKey="revenue" radius={[0, 4, 4, 0]}>
                    {mockDestinationStats.map((d, i) => (
                      <Cell key={i} fill={d.fill} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Bottom: Recent Bookings + Activity Feed */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Recent Bookings */}
        <motion.div variants={fadeUp} className="lg:col-span-2">
          <Card className="border-border/50">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-base font-semibold">Recent Bookings</CardTitle>
              <Button variant="ghost" size="sm" onClick={() => navigate("/admin/bookings")} className="text-xs text-muted-foreground">
                View All <Eye className="ml-1 h-3 w-3" />
              </Button>
            </CardHeader>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Ref</TableHead><TableHead>Package</TableHead><TableHead>Status</TableHead><TableHead className="text-right">Amount</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {mockBookings.slice(0, 5).map((b) => (
                    <TableRow key={b.id}>
                      <TableCell className="font-mono text-xs">{b.bookingRef}</TableCell>
                      <TableCell className="text-sm">{b.packageTitle}</TableCell>
                      <TableCell><Badge className={statusColor[b.status] ?? ""}>{b.status}</Badge></TableCell>
                      <TableCell className="text-right font-semibold">${b.totalAmount.toLocaleString()}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </motion.div>

        {/* Activity Feed */}
        <motion.div variants={fadeUp}>
          <Card className="border-border/50">
            <CardHeader className="pb-2">
              <CardTitle className="text-base font-semibold">Recent Activity</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {mockActivityLog.slice(0, 6).map((act) => (
                <div key={act.id} className="flex items-start gap-2.5">
                  <span className="mt-0.5 text-base">{activityIcons[act.action] ?? "📌"}</span>
                  <div className="min-w-0 flex-1">
                    <p className="text-xs text-foreground leading-snug">{act.description}</p>
                    <p className="mt-0.5 text-[10px] text-muted-foreground">{new Date(act.createdAt).toLocaleDateString()}</p>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Quick Actions */}
      <motion.div variants={fadeUp}>
        <Card className="border-border/50">
          <CardContent className="flex flex-wrap gap-3 p-5">
            <Button onClick={() => navigate("/admin/packages")} className="gap-2"><Plus className="h-4 w-4" /> New Package</Button>
            <Button variant="outline" onClick={() => navigate("/admin/reports")} className="gap-2"><Download className="h-4 w-4" /> Export Reports</Button>
            <Button variant="outline" onClick={() => navigate("/admin/bookings")} className="gap-2"><Eye className="h-4 w-4" /> All Bookings</Button>
            <Button variant="outline" onClick={() => navigate("/admin/inquiries")} className="gap-2"><Send className="h-4 w-4" /> Inquiries</Button>
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  );
}
