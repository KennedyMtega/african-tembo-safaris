import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { mockRevenueData, mockPackagePerformance, mockDestinationStats } from "@/data/mockAdminData";
import { TrendingUp, ArrowUpRight, Download } from "lucide-react";
import { motion } from "framer-motion";

const funnelData = [
  { stage: "Website Visits", value: 4200, fill: "hsl(var(--muted))" },
  { stage: "Package Views", value: 1800, fill: "hsl(var(--border))" },
  { stage: "Inquiries", value: 420, fill: "hsl(var(--gold-accent))" },
  { stage: "Bookings", value: 49, fill: "hsl(var(--primary))" },
  { stage: "Completed", value: 38, fill: "hsl(var(--savanna-green))" },
];

export default function AdminAnalytics() {
  const [period, setPeriod] = useState("12m");

  const totalRevenue = mockRevenueData.reduce((s, d) => s + d.revenue, 0);
  const prevRevenue = mockRevenueData.reduce((s, d) => s + (d.previousRevenue ?? 0), 0);
  const growthPct = ((totalRevenue - prevRevenue) / prevRevenue * 100).toFixed(1);

  return (
    <motion.div className="space-y-6" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      {/* Period Selector */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <TrendingUp className="h-5 w-5 text-primary" />
          <span className="font-display text-lg font-semibold text-foreground">Analytics</span>
        </div>
        <Select value={period} onValueChange={setPeriod}>
          <SelectTrigger className="h-9 w-32"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="7d">Last 7 days</SelectItem>
            <SelectItem value="30d">Last 30 days</SelectItem>
            <SelectItem value="90d">Last 90 days</SelectItem>
            <SelectItem value="12m">Last 12 months</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* KPI Row */}
      <div className="grid gap-4 sm:grid-cols-4">
        <Card className="border-border/50"><CardContent className="p-4">
          <p className="text-xs text-muted-foreground">Total Revenue</p>
          <p className="font-display text-xl font-bold text-foreground">${totalRevenue.toLocaleString()}</p>
          <div className="mt-1 flex items-center gap-1 text-xs text-safari-green"><ArrowUpRight className="h-3 w-3" /> +{growthPct}%</div>
        </CardContent></Card>
        <Card className="border-border/50"><CardContent className="p-4">
          <p className="text-xs text-muted-foreground">Total Bookings</p>
          <p className="font-display text-xl font-bold text-foreground">{mockRevenueData.reduce((s, d) => s + d.bookings, 0)}</p>
        </CardContent></Card>
        <Card className="border-border/50"><CardContent className="p-4">
          <p className="text-xs text-muted-foreground">Avg. Conversion</p>
          <p className="font-display text-xl font-bold text-foreground">11.3%</p>
        </CardContent></Card>
        <Card className="border-border/50"><CardContent className="p-4">
          <p className="text-xs text-muted-foreground">Avg. Rating</p>
          <p className="font-display text-xl font-bold text-safari-gold">4.8 ⭐</p>
        </CardContent></Card>
      </div>

      <Tabs defaultValue="revenue" className="space-y-4">
        <TabsList>
          <TabsTrigger value="revenue">Revenue</TabsTrigger>
          <TabsTrigger value="funnel">Booking Funnel</TabsTrigger>
          <TabsTrigger value="packages">Package Performance</TabsTrigger>
        </TabsList>

        <TabsContent value="revenue">
          <Card className="border-border/50">
            <CardHeader className="pb-2">
              <CardTitle className="text-base">Revenue Comparison</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={mockRevenueData}>
                  <defs>
                    <linearGradient id="analyticGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="month" tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 11 }} />
                  <YAxis tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 11 }} tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`} />
                  <Tooltip formatter={(v: number) => [`$${v.toLocaleString()}`, ""]} />
                  <Area type="monotone" dataKey="previousRevenue" stroke="hsl(var(--border))" strokeDasharray="4 4" fillOpacity={0} name="Previous Period" />
                  <Area type="monotone" dataKey="revenue" stroke="hsl(var(--primary))" fill="url(#analyticGrad)" strokeWidth={2} name="Current Period" />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="funnel">
          <Card className="border-border/50">
            <CardHeader className="pb-2"><CardTitle className="text-base">Booking Funnel</CardTitle></CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={funnelData} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis type="number" tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 11 }} />
                  <YAxis dataKey="stage" type="category" tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 11 }} width={100} />
                  <Tooltip />
                  <Bar dataKey="value" radius={[0, 4, 4, 0]}>
                    {funnelData.map((d, i) => (
                      <motion.rect key={i} fill={d.fill} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="packages">
          <Card className="border-border/50">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-base">Top Performing Packages</CardTitle>
              <Button variant="ghost" size="sm" className="gap-1 text-xs"><Download className="h-3.5 w-3.5" /> Export</Button>
            </CardHeader>
            <CardContent className="p-0">
              <Table>
                <TableHeader><TableRow>
                  <TableHead>Package</TableHead><TableHead>Bookings</TableHead><TableHead>Revenue</TableHead><TableHead>Rating</TableHead><TableHead>Conversion</TableHead>
                </TableRow></TableHeader>
                <TableBody>
                  {mockPackagePerformance.map((p) => (
                    <TableRow key={p.id}>
                      <TableCell className="font-medium">{p.title}</TableCell>
                      <TableCell>{p.bookings}</TableCell>
                      <TableCell className="font-semibold">${p.revenue.toLocaleString()}</TableCell>
                      <TableCell>⭐ {p.rating}</TableCell>
                      <TableCell><Badge variant="secondary">{p.conversionRate}%</Badge></TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </motion.div>
  );
}
