import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { mockInquiries } from "@/data/mockAdminData";
import { inquiryService } from "@/services/inquiryService";
import type { Inquiry } from "@/types/admin";
import { useToast } from "@/hooks/use-toast";
import { MessageSquare, Eye, Send } from "lucide-react";
import { motion } from "framer-motion";

const statusColor: Record<string, string> = { "new": "bg-primary text-primary-foreground", "in-progress": "bg-safari-gold text-foreground", "resolved": "bg-safari-green text-primary-foreground" };
const priorityColor: Record<string, string> = { high: "bg-destructive text-destructive-foreground", medium: "bg-safari-gold text-foreground", low: "bg-secondary text-secondary-foreground" };

export default function AdminInquiries() {
  const { toast } = useToast();
  const [inquiries, setInquiries] = useState<Inquiry[]>(mockInquiries);
  const [statusFilter, setStatusFilter] = useState("all");
  const [detail, setDetail] = useState<Inquiry | null>(null);

  const filtered = inquiries.filter((i) => statusFilter === "all" || i.status === statusFilter);

  const updateStatus = async (id: string, status: Inquiry["status"]) => {
    await inquiryService.updateStatus(id, status);
    setInquiries((prev) => prev.map((i) => i.id === id ? { ...i, status, ...(status === "resolved" ? { resolvedAt: new Date().toISOString() } : {}) } : i));
    toast({ title: `Inquiry ${status}` });
  };

  return (
    <motion.div className="space-y-6" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <MessageSquare className="h-5 w-5 text-primary" />
          <span className="font-display text-lg font-semibold text-foreground">Inquiries</span>
          <Badge variant="secondary" className="ml-2">{inquiries.filter((i) => i.status === "new").length} new</Badge>
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="h-9 w-32"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All</SelectItem>
            <SelectItem value="new">New</SelectItem>
            <SelectItem value="in-progress">In Progress</SelectItem>
            <SelectItem value="resolved">Resolved</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <Card className="border-border/50"><CardContent className="p-4"><p className="text-xs text-muted-foreground">Total</p><p className="font-display text-xl font-bold text-foreground">{inquiries.length}</p></CardContent></Card>
        <Card className="border-border/50"><CardContent className="p-4"><p className="text-xs text-muted-foreground">New</p><p className="font-display text-xl font-bold text-primary">{inquiries.filter((i) => i.status === "new").length}</p></CardContent></Card>
        <Card className="border-border/50"><CardContent className="p-4"><p className="text-xs text-muted-foreground">High Priority</p><p className="font-display text-xl font-bold text-destructive">{inquiries.filter((i) => i.priority === "high").length}</p></CardContent></Card>
      </div>

      <Card className="border-border/50">
        <CardContent className="p-0">
          <Table>
            <TableHeader><TableRow>
              <TableHead>Name</TableHead><TableHead>Subject</TableHead><TableHead>Priority</TableHead><TableHead>Status</TableHead><TableHead>Date</TableHead><TableHead className="text-right">Actions</TableHead>
            </TableRow></TableHeader>
            <TableBody>
              {filtered.map((i) => (
                <TableRow key={i.id}>
                  <TableCell className="text-sm font-medium">{i.name}</TableCell>
                  <TableCell className="text-sm max-w-48 truncate">{i.subject}</TableCell>
                  <TableCell><Badge className={priorityColor[i.priority] ?? ""}>{i.priority}</Badge></TableCell>
                  <TableCell><Badge className={statusColor[i.status] ?? ""}>{i.status}</Badge></TableCell>
                  <TableCell className="text-xs">{new Date(i.createdAt).toLocaleDateString()}</TableCell>
                  <TableCell className="text-right space-x-1">
                    <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => setDetail(i)}><Eye className="h-3.5 w-3.5" /></Button>
                    {i.status !== "resolved" && (
                      <Select value={i.status} onValueChange={(v) => updateStatus(i.id, v as Inquiry["status"])}>
                        <SelectTrigger className="h-7 w-28 text-xs inline-flex"><SelectValue /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="new">New</SelectItem>
                          <SelectItem value="in-progress">In Progress</SelectItem>
                          <SelectItem value="resolved">Resolved</SelectItem>
                        </SelectContent>
                      </Select>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Sheet open={!!detail} onOpenChange={() => setDetail(null)}>
        <SheetContent className="overflow-y-auto sm:max-w-md">
          {detail && (
            <>
              <SheetHeader><SheetTitle className="font-display">{detail.subject}</SheetTitle></SheetHeader>
              <div className="mt-4 space-y-4 text-sm">
                <div className="grid grid-cols-2 gap-2">
                  <div><span className="text-muted-foreground">From:</span> {detail.name}</div>
                  <div><span className="text-muted-foreground">Email:</span> {detail.email}</div>
                  <div><span className="text-muted-foreground">Priority:</span> <Badge className={priorityColor[detail.priority] ?? ""}>{detail.priority}</Badge></div>
                  <div><span className="text-muted-foreground">Status:</span> <Badge className={statusColor[detail.status] ?? ""}>{detail.status}</Badge></div>
                </div>
                <div>
                  <p className="font-semibold text-foreground mb-1">Message</p>
                  <p className="text-muted-foreground bg-muted/50 rounded-md p-3">{detail.message}</p>
                </div>
                <Button variant="outline" className="w-full gap-2" onClick={() => { toast({ title: "Reply sent (mock)" }); setDetail(null); }}>
                  <Send className="h-4 w-4" /> Send Reply
                </Button>
              </div>
            </>
          )}
        </SheetContent>
      </Sheet>
    </motion.div>
  );
}
