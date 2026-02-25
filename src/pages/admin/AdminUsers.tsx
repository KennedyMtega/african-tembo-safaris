import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { mockUsers, mockBookings } from "@/data/mockData";
import type { User, Booking } from "@/types";
import { useToast } from "@/hooks/use-toast";
import { Search, UserPlus, Eye } from "lucide-react";
import { motion } from "framer-motion";

const roleColor: Record<string, string> = { admin: "bg-primary text-primary-foreground", customer: "bg-secondary text-secondary-foreground" };

export default function AdminUsers() {
  const { toast } = useToast();
  const [users] = useState<User[]>(mockUsers);
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [detailUser, setDetailUser] = useState<User | null>(null);
  const [addOpen, setAddOpen] = useState(false);

  const filtered = users.filter((u) => {
    if (roleFilter !== "all" && u.role !== roleFilter) return false;
    if (search && !u.name.toLowerCase().includes(search.toLowerCase()) && !u.email.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  const getUserBookings = (userId: string): Booking[] => mockBookings.filter((b) => b.userId === userId);
  const getUserSpend = (userId: string) => getUserBookings(userId).filter((b) => b.paymentStatus === "paid").reduce((s, b) => s + b.totalAmount, 0);

  const summary = {
    total: users.length,
    customers: users.filter((u) => u.role === "customer").length,
    newThisMonth: 1,
  };

  const handleAddUser = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    toast({ title: "User created (mock)" });
    setAddOpen(false);
  };

  return (
    <motion.div className="space-y-6" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      {/* Summary */}
      <div className="grid gap-4 sm:grid-cols-3">
        <Card className="border-border/50"><CardContent className="p-4"><p className="text-xs text-muted-foreground">Total Users</p><p className="font-display text-xl font-bold text-foreground">{summary.total}</p></CardContent></Card>
        <Card className="border-border/50"><CardContent className="p-4"><p className="text-xs text-muted-foreground">Customers</p><p className="font-display text-xl font-bold text-primary">{summary.customers}</p></CardContent></Card>
        <Card className="border-border/50"><CardContent className="p-4"><p className="text-xs text-muted-foreground">New This Month</p><p className="font-display text-xl font-bold text-safari-green">{summary.newThisMonth}</p></CardContent></Card>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="relative">
          <Search className="absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
          <Input placeholder="Search name or email…" value={search} onChange={(e) => setSearch(e.target.value)} className="h-9 w-56 pl-8 text-sm" />
        </div>
        <Select value={roleFilter} onValueChange={setRoleFilter}>
          <SelectTrigger className="h-9 w-32"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Roles</SelectItem>
            <SelectItem value="admin">Admin</SelectItem>
            <SelectItem value="customer">Customer</SelectItem>
          </SelectContent>
        </Select>
        <Dialog open={addOpen} onOpenChange={setAddOpen}>
          <DialogTrigger asChild><Button size="sm" className="gap-1.5 ml-auto"><UserPlus className="h-4 w-4" /> Add User</Button></DialogTrigger>
          <DialogContent>
            <DialogHeader><DialogTitle>Add User</DialogTitle></DialogHeader>
            <form onSubmit={handleAddUser} className="space-y-4">
              <div><Label>Name</Label><Input name="name" required /></div>
              <div><Label>Email</Label><Input name="email" type="email" required /></div>
              <div><Label>Phone</Label><Input name="phone" /></div>
              <div><Label>Role</Label>
                <Select name="role" defaultValue="customer">
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent><SelectItem value="customer">Customer</SelectItem><SelectItem value="admin">Admin</SelectItem></SelectContent>
                </Select>
              </div>
              <Button type="submit" className="w-full">Create User</Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Table */}
      <Card className="border-border/50">
        <CardContent className="p-0">
          <Table>
            <TableHeader><TableRow>
              <TableHead>Name</TableHead><TableHead>Email</TableHead><TableHead>Role</TableHead><TableHead>Bookings</TableHead><TableHead>Total Spend</TableHead><TableHead>Joined</TableHead><TableHead className="text-right"></TableHead>
            </TableRow></TableHeader>
            <TableBody>
              {filtered.map((u) => (
                <TableRow key={u.id}>
                  <TableCell className="font-medium">
                    <div className="flex items-center gap-2">
                      <div className="flex h-7 w-7 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-primary-foreground">{u.name.charAt(0)}</div>
                      {u.name}
                    </div>
                  </TableCell>
                  <TableCell className="text-sm">{u.email}</TableCell>
                  <TableCell><Badge className={roleColor[u.role] ?? ""}>{u.role}</Badge></TableCell>
                  <TableCell>{getUserBookings(u.id).length}</TableCell>
                  <TableCell>${getUserSpend(u.id).toLocaleString()}</TableCell>
                  <TableCell className="text-xs">{u.createdAt}</TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => setDetailUser(u)}><Eye className="h-3.5 w-3.5" /></Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Detail Sheet */}
      <Sheet open={!!detailUser} onOpenChange={() => setDetailUser(null)}>
        <SheetContent className="overflow-y-auto sm:max-w-md">
          {detailUser && (
            <>
              <SheetHeader>
                <SheetTitle className="font-display">{detailUser.name}</SheetTitle>
              </SheetHeader>
              <div className="mt-4 space-y-4 text-sm">
                <div className="flex items-center gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary text-lg font-bold text-primary-foreground">{detailUser.name.charAt(0)}</div>
                  <div>
                    <p className="font-semibold">{detailUser.name}</p>
                    <p className="text-xs text-muted-foreground">{detailUser.email}</p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div><span className="text-muted-foreground">Role:</span> <Badge className={roleColor[detailUser.role] ?? ""}>{detailUser.role}</Badge></div>
                  <div><span className="text-muted-foreground">Phone:</span> {detailUser.phone ?? "–"}</div>
                  <div><span className="text-muted-foreground">Joined:</span> {detailUser.createdAt}</div>
                  <div><span className="text-muted-foreground">Total Spend:</span> ${getUserSpend(detailUser.id).toLocaleString()}</div>
                </div>
                <div>
                  <p className="font-semibold text-foreground mb-2">Booking History</p>
                  {getUserBookings(detailUser.id).length === 0 ? (
                    <p className="text-xs text-muted-foreground">No bookings yet.</p>
                  ) : (
                    getUserBookings(detailUser.id).map((b) => (
                      <div key={b.id} className="rounded-md border border-border p-2 mb-2">
                        <div className="flex justify-between">
                          <span className="font-mono text-xs">{b.bookingRef}</span>
                          <Badge className="text-[10px]" variant="secondary">{b.status}</Badge>
                        </div>
                        <p className="text-xs text-muted-foreground">{b.packageTitle} · ${b.totalAmount.toLocaleString()}</p>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </>
          )}
        </SheetContent>
      </Sheet>
    </motion.div>
  );
}
