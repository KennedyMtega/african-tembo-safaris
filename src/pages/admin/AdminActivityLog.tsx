import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";
import { Activity, Search } from "lucide-react";
import { motion } from "framer-motion";
import { useQuery } from "@tanstack/react-query";

const actionLabels: Record<string, string> = {
  booking_created: "Booking Created", booking_updated: "Booking Updated",
  package_created: "Package Created", package_updated: "Package Updated",
  payment_received: "Payment Received", user_registered: "User Registered",
  inquiry_resolved: "Inquiry Resolved", review_approved: "Review Approved",
};

export default function AdminActivityLog() {
  const [search, setSearch] = useState("");
  const [actionFilter, setActionFilter] = useState("all");

  const { data: activities = [] } = useQuery({
    queryKey: ["admin-activity"],
    queryFn: async () => {
      const { data } = await supabase.from("activity_log").select("*").order("created_at", { ascending: false }).limit(50);
      return data || [];
    },
  });

  const filtered = activities.filter((a: any) => {
    if (actionFilter !== "all" && a.action !== actionFilter) return false;
    if (search && !(a.description || "").toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  return (
    <motion.div className="space-y-6" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <div className="flex items-center gap-2">
        <Activity className="h-5 w-5 text-primary" />
        <span className="font-display text-lg font-semibold text-foreground">Activity Log</span>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <div className="relative">
          <Search className="absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
          <Input placeholder="Search activity…" value={search} onChange={(e) => setSearch(e.target.value)} className="h-9 w-56 pl-8 text-sm" />
        </div>
        <Select value={actionFilter} onValueChange={setActionFilter}>
          <SelectTrigger className="h-9 w-40"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Actions</SelectItem>
            {Object.entries(actionLabels).map(([k, v]) => <SelectItem key={k} value={k}>{v}</SelectItem>)}
          </SelectContent>
        </Select>
      </div>

      <Card className="border-border/50">
        <CardContent className="p-4 space-y-4">
          {filtered.length === 0 ? (
            <p className="text-center text-sm text-muted-foreground">No activity recorded yet.</p>
          ) : filtered.map((a: any) => (
            <div key={a.id} className="flex items-start gap-3 border-b border-border/50 pb-3 last:border-0 last:pb-0">
              <div className="mt-0.5 h-2 w-2 rounded-full bg-primary flex-shrink-0" />
              <div className="min-w-0 flex-1">
                <p className="text-sm text-foreground">{a.description}</p>
                <div className="mt-1 flex items-center gap-2">
                  <Badge variant="secondary" className="text-[10px]">{actionLabels[a.action] || a.action}</Badge>
                  <span className="text-[10px] text-muted-foreground">· {new Date(a.created_at).toLocaleString()}</span>
                </div>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </motion.div>
  );
}
