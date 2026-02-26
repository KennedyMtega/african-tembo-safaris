import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import type { CompanySettings } from "@/types/admin";
import { useToast } from "@/hooks/use-toast";
import { userService } from "@/services/userService";
import { Settings, Save, Users, Plus, Shield, ShieldCheck, UserMinus } from "lucide-react";
import { motion } from "framer-motion";
import { useQuery, useQueryClient } from "@tanstack/react-query";

const defaultSettings: CompanySettings = {
  name: "Tembo Safari Co.",
  email: "info@tembo.safari",
  phone: "+255 123 456 789",
  address: "123 Safari Drive, Arusha, Tanzania",
  currency: "USD",
  timezone: "Africa/Dar_es_Salaam",
  logoUrl: "",
  notifyOnBooking: true,
  notifyOnPayment: true,
  notifyOnInquiry: true,
};

export default function AdminSettings() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [settings, setSettings] = useState<CompanySettings>(defaultSettings);
  const [inviteOpen, setInviteOpen] = useState(false);
  const [inviting, setInviting] = useState(false);

  const { data: employees = [], isLoading: loadingEmployees } = useQuery({
    queryKey: ["employees"],
    queryFn: () => userService.getEmployees(),
  });

  const update = (key: keyof CompanySettings, value: string | boolean) => {
    setSettings((prev) => ({ ...prev, [key]: value }));
  };

  const handleSave = () => {
    toast({ title: "Settings saved" });
  };

  const handleInvite = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setInviting(true);
    try {
      const fd = new FormData(e.currentTarget);
      await userService.createEmployee(
        fd.get("email") as string,
        fd.get("password") as string,
        fd.get("fullName") as string,
        fd.get("role") as string,
      );
      toast({ title: "Employee created successfully" });
      queryClient.invalidateQueries({ queryKey: ["employees"] });
      setInviteOpen(false);
    } catch (err: any) {
      toast({ title: "Error", description: err.message, variant: "destructive" });
    } finally {
      setInviting(false);
    }
  };

  const handleChangeRole = async (userId: string, newRole: string) => {
    try {
      await userService.updateRole(userId, newRole);
      queryClient.invalidateQueries({ queryKey: ["employees"] });
      toast({ title: `Role updated to ${newRole}` });
    } catch (err: any) {
      toast({ title: "Error", description: err.message, variant: "destructive" });
    }
  };

  const handleRemoveAccess = async (userId: string) => {
    try {
      await userService.removeRole(userId);
      queryClient.invalidateQueries({ queryKey: ["employees"] });
      toast({ title: "Access revoked" });
    } catch (err: any) {
      toast({ title: "Error", description: err.message, variant: "destructive" });
    }
  };

  return (
    <motion.div className="space-y-6" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <div className="flex items-center gap-2">
        <Settings className="h-5 w-5 text-primary" />
        <span className="font-display text-lg font-semibold text-foreground">Settings</span>
      </div>

      {/* Team Management */}
      <Card className="border-border/50">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <CardTitle className="flex items-center gap-2 text-base">
            <Users className="h-4 w-4" /> Team Management
          </CardTitle>
          <Dialog open={inviteOpen} onOpenChange={setInviteOpen}>
            <DialogTrigger asChild>
              <Button size="sm" className="gap-1.5"><Plus className="h-4 w-4" /> Invite Employee</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader><DialogTitle>Invite Employee</DialogTitle></DialogHeader>
              <form onSubmit={handleInvite} className="space-y-4">
                <div><Label>Full Name</Label><Input name="fullName" required /></div>
                <div><Label>Email</Label><Input name="email" type="email" required /></div>
                <div><Label>Password</Label><Input name="password" type="password" required minLength={8} /></div>
                <div>
                  <Label>Role</Label>
                  <select name="role" defaultValue="management" className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
                    <option value="admin">Admin — Full access</option>
                    <option value="management">Management — Edit & create only</option>
                  </select>
                </div>
                <Button type="submit" className="w-full" disabled={inviting}>
                  {inviting ? "Creating…" : "Create Employee"}
                </Button>
              </form>
            </DialogContent>
          </Dialog>
        </CardHeader>
        <CardContent>
          {loadingEmployees ? (
            <p className="py-4 text-center text-sm text-muted-foreground">Loading team…</p>
          ) : employees.length === 0 ? (
            <p className="py-4 text-center text-sm text-muted-foreground">No team members yet</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {employees.map((emp) => (
                  <TableRow key={emp.id}>
                    <TableCell className="font-medium">{emp.fullName || "—"}</TableCell>
                    <TableCell className="text-sm text-muted-foreground">{emp.email}</TableCell>
                    <TableCell>
                      <Badge variant={emp.role === "admin" ? "default" : "secondary"} className="gap-1">
                        {emp.role === "admin" ? <ShieldCheck className="h-3 w-3" /> : <Shield className="h-3 w-3" />}
                        {emp.role}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right space-x-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-7 text-xs"
                        onClick={() => handleChangeRole(emp.id, emp.role === "admin" ? "management" : "admin")}
                      >
                        Switch to {emp.role === "admin" ? "Management" : "Admin"}
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-7 text-xs text-destructive"
                        onClick={() => handleRemoveAccess(emp.id)}
                      >
                        <UserMinus className="h-3 w-3 mr-1" /> Revoke
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="border-border/50">
          <CardHeader><CardTitle className="text-base">Company Profile</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div><Label>Company Name</Label><Input value={settings.name} onChange={(e) => update("name", e.target.value)} /></div>
            <div><Label>Email</Label><Input value={settings.email} onChange={(e) => update("email", e.target.value)} /></div>
            <div><Label>Phone</Label><Input value={settings.phone} onChange={(e) => update("phone", e.target.value)} /></div>
            <div><Label>Address</Label><Input value={settings.address} onChange={(e) => update("address", e.target.value)} /></div>
          </CardContent>
        </Card>

        <Card className="border-border/50">
          <CardHeader><CardTitle className="text-base">System</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div><Label>Currency</Label>
              <Select value={settings.currency} onValueChange={(v) => update("currency", v)}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="USD">USD ($)</SelectItem>
                  <SelectItem value="EUR">EUR (€)</SelectItem>
                  <SelectItem value="GBP">GBP (£)</SelectItem>
                  <SelectItem value="TZS">TZS</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div><Label>Timezone</Label>
              <Select value={settings.timezone} onValueChange={(v) => update("timezone", v)}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="Africa/Dar_es_Salaam">East Africa Time</SelectItem>
                  <SelectItem value="UTC">UTC</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        <Card className="border-border/50 lg:col-span-2">
          <CardHeader><CardTitle className="text-base">Notifications</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div><Label>New Booking Notifications</Label><p className="text-xs text-muted-foreground">Receive alerts for new bookings</p></div>
              <Switch checked={settings.notifyOnBooking} onCheckedChange={(v) => update("notifyOnBooking", v)} />
            </div>
            <div className="flex items-center justify-between">
              <div><Label>Payment Notifications</Label><p className="text-xs text-muted-foreground">Receive alerts for payments</p></div>
              <Switch checked={settings.notifyOnPayment} onCheckedChange={(v) => update("notifyOnPayment", v)} />
            </div>
            <div className="flex items-center justify-between">
              <div><Label>Inquiry Notifications</Label><p className="text-xs text-muted-foreground">Receive alerts for new inquiries</p></div>
              <Switch checked={settings.notifyOnInquiry} onCheckedChange={(v) => update("notifyOnInquiry", v)} />
            </div>
          </CardContent>
        </Card>
      </div>

      <Button className="gap-2" onClick={handleSave}><Save className="h-4 w-4" /> Save Settings</Button>
    </motion.div>
  );
}
