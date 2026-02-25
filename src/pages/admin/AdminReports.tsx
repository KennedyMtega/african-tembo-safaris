import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { FileText, Download } from "lucide-react";
import { motion } from "framer-motion";

const reports = [
  { id: "revenue", title: "Revenue Report", description: "Detailed revenue breakdown by period, package, and destination." },
  { id: "bookings", title: "Booking Report", description: "All bookings with status, traveler count, and revenue data." },
  { id: "customers", title: "Customer Report", description: "Customer demographics, repeat bookings, and lifetime value." },
  { id: "packages", title: "Package Performance", description: "Conversion rates, ratings, and revenue per package." },
];

export default function AdminReports() {
  const { toast } = useToast();
  const [periods, setPeriods] = useState<Record<string, string>>({});

  const handleExport = (reportId: string, format: "csv" | "pdf") => {
    toast({ title: `${format.toUpperCase()} export started (mock)`, description: reports.find((r) => r.id === reportId)?.title });
  };

  return (
    <motion.div className="space-y-6" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <div className="flex items-center gap-2">
        <FileText className="h-5 w-5 text-primary" />
        <span className="font-display text-lg font-semibold text-foreground">Reports</span>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        {reports.map((report) => (
          <Card key={report.id} className="border-border/50">
            <CardHeader className="pb-2">
              <CardTitle className="text-base">{report.title}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <p className="text-xs text-muted-foreground">{report.description}</p>
              <Select value={periods[report.id] ?? "30d"} onValueChange={(v) => setPeriods((prev) => ({ ...prev, [report.id]: v }))}>
                <SelectTrigger className="h-8 text-xs"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="7d">Last 7 days</SelectItem>
                  <SelectItem value="30d">Last 30 days</SelectItem>
                  <SelectItem value="90d">Last 90 days</SelectItem>
                  <SelectItem value="1y">Last year</SelectItem>
                </SelectContent>
              </Select>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" className="gap-1.5 flex-1 text-xs" onClick={() => handleExport(report.id, "csv")}>
                  <Download className="h-3.5 w-3.5" /> CSV
                </Button>
                <Button variant="outline" size="sm" className="gap-1.5 flex-1 text-xs" onClick={() => handleExport(report.id, "pdf")}>
                  <Download className="h-3.5 w-3.5" /> PDF
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </motion.div>
  );
}
