import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { crmService, type CRMContact, type CRMInteraction } from "@/services/crmService";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { motion } from "framer-motion";
import { Users, Plus, Search, UserCheck, UserPlus, TrendingUp, MessageSquare, Trash2, ArrowRight } from "lucide-react";
import { format } from "date-fns";

const statusColors: Record<string, string> = {
  lead: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200",
  prospect: "bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200",
  customer: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
  inactive: "bg-muted text-muted-foreground",
};

export default function AdminCRM() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [sourceFilter, setSourceFilter] = useState<string>("all");
  const [selectedContact, setSelectedContact] = useState<CRMContact | null>(null);
  const [addOpen, setAddOpen] = useState(false);
  const [adding, setAdding] = useState(false);
  const [noteText, setNoteText] = useState("");

  const { data: stats } = useQuery({ queryKey: ["crm-stats"], queryFn: () => crmService.getStats() });
  const { data: contacts = [], isLoading } = useQuery({
    queryKey: ["crm-contacts", search, statusFilter, sourceFilter],
    queryFn: () =>
      crmService.getContacts({
        search: search || undefined,
        status: statusFilter === "all" ? undefined : statusFilter,
        source: sourceFilter === "all" ? undefined : sourceFilter,
      }),
  });
  const { data: interactions = [] } = useQuery({
    queryKey: ["crm-interactions", selectedContact?.id],
    queryFn: () => (selectedContact ? crmService.getInteractions(selectedContact.id) : Promise.resolve([])),
    enabled: !!selectedContact,
  });

  const handleAdd = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setAdding(true);
    const fd = new FormData(e.currentTarget);
    try {
      await crmService.createContact({
        name: fd.get("name") as string,
        email: fd.get("email") as string,
        phone: (fd.get("phone") as string) || undefined,
        source: (fd.get("source") as string) || "manual",
        notes: (fd.get("notes") as string) || undefined,
      });
      toast({ title: "Contact added" });
      queryClient.invalidateQueries({ queryKey: ["crm-contacts"] });
      queryClient.invalidateQueries({ queryKey: ["crm-stats"] });
      setAddOpen(false);
    } catch (err: any) {
      toast({ title: "Error", description: err.message, variant: "destructive" });
    } finally {
      setAdding(false);
    }
  };

  const handleStatusChange = async (id: string, status: string) => {
    try {
      await crmService.updateContact(id, { status });
      queryClient.invalidateQueries({ queryKey: ["crm-contacts"] });
      queryClient.invalidateQueries({ queryKey: ["crm-stats"] });
      if (selectedContact?.id === id) setSelectedContact({ ...selectedContact, status });
      toast({ title: `Status changed to ${status}` });
    } catch (err: any) {
      toast({ title: "Error", description: err.message, variant: "destructive" });
    }
  };

  const handleAddNote = async () => {
    if (!selectedContact || !noteText.trim()) return;
    try {
      await crmService.addInteraction(selectedContact.id, "note", noteText.trim());
      queryClient.invalidateQueries({ queryKey: ["crm-interactions", selectedContact.id] });
      setNoteText("");
      toast({ title: "Note added" });
    } catch (err: any) {
      toast({ title: "Error", description: err.message, variant: "destructive" });
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await crmService.deleteContact(id);
      queryClient.invalidateQueries({ queryKey: ["crm-contacts"] });
      queryClient.invalidateQueries({ queryKey: ["crm-stats"] });
      if (selectedContact?.id === id) setSelectedContact(null);
      toast({ title: "Contact deleted" });
    } catch (err: any) {
      toast({ title: "Error", description: err.message, variant: "destructive" });
    }
  };

  const kpis = [
    { label: "Total Contacts", value: stats?.total ?? 0, icon: Users, color: "text-primary" },
    { label: "Leads", value: stats?.leads ?? 0, icon: UserPlus, color: "text-blue-600" },
    { label: "Customers", value: stats?.customers ?? 0, icon: UserCheck, color: "text-green-600" },
    { label: "New This Month", value: stats?.newThisMonth ?? 0, icon: TrendingUp, color: "text-amber-600" },
  ];

  return (
    <motion.div className="space-y-6" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Users className="h-5 w-5 text-primary" />
          <span className="font-display text-lg font-semibold text-foreground">CRM</span>
        </div>
        <Dialog open={addOpen} onOpenChange={setAddOpen}>
          <DialogTrigger asChild>
            <Button size="sm" className="gap-1.5"><Plus className="h-4 w-4" /> Add Contact</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader><DialogTitle>New Contact</DialogTitle></DialogHeader>
            <form onSubmit={handleAdd} className="space-y-4">
              <div><Label>Name</Label><Input name="name" required /></div>
              <div><Label>Email</Label><Input name="email" type="email" required /></div>
              <div><Label>Phone</Label><Input name="phone" /></div>
              <div>
                <Label>Source</Label>
                <select name="source" defaultValue="manual" className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm">
                  <option value="manual">Manual</option>
                  <option value="chat">Chat</option>
                  <option value="inquiry">Inquiry</option>
                  <option value="booking">Booking</option>
                </select>
              </div>
              <div><Label>Notes</Label><Textarea name="notes" rows={3} /></div>
              <Button type="submit" className="w-full" disabled={adding}>{adding ? "Saving…" : "Add Contact"}</Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* KPIs */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {kpis.map((k) => (
          <Card key={k.label} className="border-border/50">
            <CardContent className="flex items-center gap-3 p-4">
              <div className={`flex h-10 w-10 items-center justify-center rounded-full bg-muted ${k.color}`}>
                <k.icon className="h-5 w-5" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{k.value}</p>
                <p className="text-xs text-muted-foreground">{k.label}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input className="pl-9" placeholder="Search contacts…" value={search} onChange={(e) => setSearch(e.target.value)} />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-[140px]"><SelectValue placeholder="Status" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="lead">Lead</SelectItem>
            <SelectItem value="prospect">Prospect</SelectItem>
            <SelectItem value="customer">Customer</SelectItem>
            <SelectItem value="inactive">Inactive</SelectItem>
          </SelectContent>
        </Select>
        <Select value={sourceFilter} onValueChange={setSourceFilter}>
          <SelectTrigger className="w-[140px]"><SelectValue placeholder="Source" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Sources</SelectItem>
            <SelectItem value="manual">Manual</SelectItem>
            <SelectItem value="chat">Chat</SelectItem>
            <SelectItem value="inquiry">Inquiry</SelectItem>
            <SelectItem value="booking">Booking</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Tabs: Table + Pipeline */}
      <Tabs defaultValue="table">
        <TabsList>
          <TabsTrigger value="table">Table View</TabsTrigger>
          <TabsTrigger value="pipeline">Pipeline</TabsTrigger>
        </TabsList>

        <TabsContent value="table">
          <Card className="border-border/50">
            <CardContent className="p-0">
              {isLoading ? (
                <p className="py-10 text-center text-muted-foreground">Loading…</p>
              ) : contacts.length === 0 ? (
                <p className="py-10 text-center text-muted-foreground">No contacts found.</p>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Source</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Last Interaction</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {contacts.map((c) => (
                      <TableRow key={c.id} className="cursor-pointer hover:bg-muted/50" onClick={() => setSelectedContact(c)}>
                        <TableCell className="font-medium">{c.name}</TableCell>
                        <TableCell className="text-sm text-muted-foreground">{c.email}</TableCell>
                        <TableCell><Badge variant="outline" className="text-[10px]">{c.source}</Badge></TableCell>
                        <TableCell>
                          <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-semibold ${statusColors[c.status] || ""}`}>
                            {c.status}
                          </span>
                        </TableCell>
                        <TableCell className="text-xs text-muted-foreground">
                          {c.lastInteraction ? format(new Date(c.lastInteraction), "MMM d, yyyy") : "—"}
                        </TableCell>
                        <TableCell className="text-right">
                          <Button variant="ghost" size="icon" className="h-7 w-7 text-destructive" onClick={(e) => { e.stopPropagation(); handleDelete(c.id); }}>
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="pipeline">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {(["lead", "prospect", "customer", "inactive"] as const).map((stage) => {
              const stageContacts = contacts.filter((c) => c.status === stage);
              return (
                <Card key={stage} className="border-border/50">
                  <CardHeader className="pb-2">
                    <CardTitle className="flex items-center justify-between text-sm capitalize">
                      {stage}
                      <Badge variant="secondary" className="text-[10px]">{stageContacts.length}</Badge>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2 max-h-[400px] overflow-y-auto">
                    {stageContacts.map((c) => (
                      <div
                        key={c.id}
                        className="cursor-pointer rounded-md border border-border/50 p-2.5 hover:bg-muted/50 transition-colors"
                        onClick={() => setSelectedContact(c)}
                      >
                        <p className="text-sm font-medium text-foreground truncate">{c.name}</p>
                        <p className="text-xs text-muted-foreground truncate">{c.email}</p>
                      </div>
                    ))}
                    {stageContacts.length === 0 && <p className="text-xs text-muted-foreground text-center py-4">Empty</p>}
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </TabsContent>
      </Tabs>

      {/* Contact Detail Sheet */}
      <Sheet open={!!selectedContact} onOpenChange={(o) => !o && setSelectedContact(null)}>
        <SheetContent className="sm:max-w-md overflow-y-auto">
          {selectedContact && (
            <>
              <SheetHeader>
                <SheetTitle className="text-left">{selectedContact.name}</SheetTitle>
              </SheetHeader>
              <div className="mt-4 space-y-4">
                <div className="space-y-1 text-sm">
                  <p><span className="text-muted-foreground">Email:</span> {selectedContact.email}</p>
                  <p><span className="text-muted-foreground">Phone:</span> {selectedContact.phone || "—"}</p>
                  <p><span className="text-muted-foreground">Source:</span> {selectedContact.source}</p>
                  <p><span className="text-muted-foreground">Created:</span> {format(new Date(selectedContact.createdAt), "MMM d, yyyy")}</p>
                </div>

                <div>
                  <Label className="text-xs">Change Status</Label>
                  <div className="mt-1 flex flex-wrap gap-1">
                    {["lead", "prospect", "customer", "inactive"].map((s) => (
                      <Button
                        key={s}
                        variant={selectedContact.status === s ? "default" : "outline"}
                        size="sm"
                        className="h-7 text-xs capitalize"
                        onClick={() => handleStatusChange(selectedContact.id, s)}
                      >
                        {s}
                      </Button>
                    ))}
                  </div>
                </div>

                {selectedContact.notes && (
                  <div>
                    <Label className="text-xs">Notes</Label>
                    <p className="mt-1 text-sm text-muted-foreground">{selectedContact.notes}</p>
                  </div>
                )}

                <div>
                  <Label className="text-xs">Add Note</Label>
                  <div className="mt-1 flex gap-2">
                    <Textarea rows={2} value={noteText} onChange={(e) => setNoteText(e.target.value)} placeholder="Type a note…" className="flex-1" />
                    <Button size="sm" className="self-end" onClick={handleAddNote} disabled={!noteText.trim()}>Add</Button>
                  </div>
                </div>

                <div>
                  <Label className="text-xs">Interaction Timeline</Label>
                  <div className="mt-2 space-y-2">
                    {interactions.length === 0 ? (
                      <p className="text-xs text-muted-foreground">No interactions yet.</p>
                    ) : (
                      interactions.map((int) => (
                        <div key={int.id} className="flex items-start gap-2 rounded-md border border-border/50 p-2">
                          <MessageSquare className="mt-0.5 h-3.5 w-3.5 text-muted-foreground flex-shrink-0" />
                          <div className="min-w-0">
                            <p className="text-xs font-medium text-foreground capitalize">{int.type}</p>
                            {int.summary && <p className="text-xs text-muted-foreground">{int.summary}</p>}
                            <p className="text-[10px] text-muted-foreground">{format(new Date(int.createdAt), "MMM d, h:mm a")}</p>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </div>
            </>
          )}
        </SheetContent>
      </Sheet>
    </motion.div>
  );
}
