import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { analyticsService } from "@/services/analyticsService";
import { TrendingUp, ArrowUpRight } from "lucide-react";
import { motion } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";

export default function AdminAnalytics() {
  const [period, setPeriod] = useState("12m");
  const { data: kpis } = useQuery({ queryKey: ["admin-kpis"], queryFn: () => analyticsService.getKPIs() });
  const { data: revenueData = [] } = useQuery({ queryKey: ["admin-revenue"], queryFn: () => analyticsService.getRevenueData() });

  return (
    <motion.div className="space-y-6" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
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

      {kpis && (
        <div className="grid gap-4 sm:grid-cols-4">
          <Card className="border-border/50"><CardContent className="p-4">
            <p className="text-xs text-muted-foreground">Total Revenue</p>
            <p className="font-display text-xl font-bold text-foreground">${kpis.totalRevenue.toLocaleString()}</p>
          </CardContent></Card>
          <Card className="border-border/50"><CardContent className="p-4">
            <p className="text-xs text-muted-foreground">Total Bookings</p>
            <p className="font-display text-xl font-bold text-foreground">{kpis.totalBookings}</p>
          </CardContent></Card>
          <Card className="border-border/50"><CardContent className="p-4">
            <p className="text-xs text-muted-foreground">Active Packages</p>
            <p className="font-display text-xl font-bold text-foreground">{kpis.activePackages}</p>
          </CardContent></Card>
          <Card className="border-border/50"><CardContent className="p-4">
            <p className="text-xs text-muted-foreground">Avg. Rating</p>
            <p className="font-display text-xl font-bold text-safari-gold">{kpis.customerSatisfaction || "–"} ⭐</p>
          </CardContent></Card>
        </div>
      )}

      {revenueData.length > 0 && (
        <Card className="border-border/50">
          <CardHeader className="pb-2"><CardTitle className="text-base">Revenue Over Time</CardTitle></CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={revenueData}>
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
                <Area type="monotone" dataKey="revenue" stroke="hsl(var(--primary))" fill="url(#analyticGrad)" strokeWidth={2} name="Revenue" />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      )}
    </motion.div>
  );
}
