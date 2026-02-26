import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import type { CompanySettings } from "@/types/admin";
import { useToast } from "@/hooks/use-toast";
import { Settings, Save } from "lucide-react";
import { motion } from "framer-motion";

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
  const [settings, setSettings] = useState<CompanySettings>(defaultSettings);

  const update = (key: keyof CompanySettings, value: string | boolean) => {
    setSettings((prev) => ({ ...prev, [key]: value }));
  };

  const handleSave = () => {
    toast({ title: "Settings saved" });
  };

  return (
    <motion.div className="space-y-6" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <div className="flex items-center gap-2">
        <Settings className="h-5 w-5 text-primary" />
        <span className="font-display text-lg font-semibold text-foreground">Settings</span>
      </div>

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
