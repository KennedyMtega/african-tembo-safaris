import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import type { CompanySettings } from "@/types/admin";
import { useToast } from "@/hooks/use-toast";
import { userService } from "@/services/userService";
import { siteSettingsService, type HeroMedia } from "@/services/siteSettingsService";
import { compressImage } from "@/lib/compressImage";
import { Settings, Save, Users, Plus, Shield, ShieldCheck, UserMinus, Image, Video, Bot, Eye, EyeOff } from "lucide-react";
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

  // Hero media state
  const [heroMode, setHeroMode] = useState<"image" | "video">("image");
  const [heroImageUrl, setHeroImageUrl] = useState("");
  const [heroVideoUrl, setHeroVideoUrl] = useState("");
  const [heroUploading, setHeroUploading] = useState(false);

  // AI config state
  const [claudeKey, setClaudeKey] = useState("");
  const [geminiKey, setGeminiKey] = useState("");
  const [aiProvider, setAiProvider] = useState<"claude" | "gemini">("claude");
  const [showClaude, setShowClaude] = useState(false);
  const [showGemini, setShowGemini] = useState(false);
  const [aiSaving, setAiSaving] = useState(false);

  // Load hero media and AI config from site_settings
  useEffect(() => {
    siteSettingsService.get<HeroMedia>("hero_media").then((val) => {
      if (val) {
        setHeroMode(val.mode || "image");
        setHeroImageUrl(val.imageUrl || "");
        setHeroVideoUrl(val.videoUrl || "");
      }
    });
    siteSettingsService.get<{ key: string }>("ai_claude_key").then((val) => {
      if (val?.key) setClaudeKey(val.key);
    });
    siteSettingsService.get<{ key: string }>("ai_gemini_key").then((val) => {
      if (val?.key) setGeminiKey(val.key);
    });
    siteSettingsService.get<{ provider: string }>("ai_provider").then((val) => {
      if (val?.provider) setAiProvider(val.provider as "claude" | "gemini");
    });
  }, []);

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

      {/* Hero Media Management */}
      <Card className="border-border/50">
        <CardHeader><CardTitle className="flex items-center gap-2 text-base"><Image className="h-4 w-4" /> Hero Section Media</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label>Display Mode</Label>
            <RadioGroup value={heroMode} onValueChange={(v) => setHeroMode(v as "image" | "video")} className="flex gap-4 mt-1">
              <div className="flex items-center gap-2"><RadioGroupItem value="image" id="hero-img" /><Label htmlFor="hero-img">Image</Label></div>
              <div className="flex items-center gap-2"><RadioGroupItem value="video" id="hero-vid" /><Label htmlFor="hero-vid">Video</Label></div>
            </RadioGroup>
          </div>
          <div>
            <Label>Hero Image</Label>
            {heroImageUrl && <img src={heroImageUrl} alt="Hero preview" className="mt-1 h-32 w-full rounded-md object-cover" />}
            <Input
              type="file"
              accept="image/*"
              className="mt-2"
              disabled={heroUploading}
              onChange={async (e) => {
                const file = e.target.files?.[0];
                if (!file) return;
                setHeroUploading(true);
                try {
                  const compressed = await compressImage(file);
                  const url = await siteSettingsService.uploadMedia(compressed, `hero/image-${Date.now()}.jpg`);
                  setHeroImageUrl(url);
                  toast({ title: "Image uploaded" });
                } catch (err: any) {
                  toast({ title: "Upload failed", description: err.message, variant: "destructive" });
                } finally {
                  setHeroUploading(false);
                }
              }}
            />
          </div>
          <div>
            <Label>Hero Video</Label>
            {heroVideoUrl && <video src={heroVideoUrl} muted loop className="mt-1 h-32 w-full rounded-md object-cover" />}
            <Input
              type="file"
              accept="video/*"
              className="mt-2"
              disabled={heroUploading}
              onChange={async (e) => {
                const file = e.target.files?.[0];
                if (!file) return;
                if (file.size > 50 * 1024 * 1024) {
                  toast({ title: "Video too large", description: "Max 50MB", variant: "destructive" });
                  return;
                }
                setHeroUploading(true);
                try {
                  const url = await siteSettingsService.uploadMedia(file, `hero/video-${Date.now()}.${file.name.split(".").pop()}`);
                  setHeroVideoUrl(url);
                  toast({ title: "Video uploaded" });
                } catch (err: any) {
                  toast({ title: "Upload failed", description: err.message, variant: "destructive" });
                } finally {
                  setHeroUploading(false);
                }
              }}
            />
          </div>
          <Button
            size="sm"
            disabled={heroUploading}
            onClick={async () => {
              try {
                await siteSettingsService.set("hero_media", { mode: heroMode, imageUrl: heroImageUrl, videoUrl: heroVideoUrl });
                toast({ title: "Hero media saved" });
              } catch (err: any) {
                toast({ title: "Error", description: err.message, variant: "destructive" });
              }
            }}
          >
            <Save className="mr-1 h-4 w-4" /> Save Hero Settings
          </Button>
        </CardContent>
      </Card>

      {/* AI Configuration */}
      <Card className="border-border/50">
        <CardHeader><CardTitle className="flex items-center gap-2 text-base"><Bot className="h-4 w-4" /> AI Chatbot Configuration</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label>Primary Provider</Label>
            <RadioGroup value={aiProvider} onValueChange={(v) => setAiProvider(v as "claude" | "gemini")} className="flex gap-4 mt-1">
              <div className="flex items-center gap-2"><RadioGroupItem value="claude" id="ai-claude" /><Label htmlFor="ai-claude">Claude (Anthropic)</Label></div>
              <div className="flex items-center gap-2"><RadioGroupItem value="gemini" id="ai-gemini" /><Label htmlFor="ai-gemini">Gemini (Google)</Label></div>
            </RadioGroup>
          </div>
          <div>
            <Label>Claude API Key</Label>
            <div className="flex gap-2 mt-1">
              <Input
                type={showClaude ? "text" : "password"}
                value={claudeKey}
                onChange={(e) => setClaudeKey(e.target.value)}
                placeholder="sk-ant-…"
                className="flex-1"
              />
              <Button variant="ghost" size="icon" onClick={() => setShowClaude(!showClaude)}>
                {showClaude ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </Button>
            </div>
          </div>
          <div>
            <Label>Gemini API Key</Label>
            <div className="flex gap-2 mt-1">
              <Input
                type={showGemini ? "text" : "password"}
                value={geminiKey}
                onChange={(e) => setGeminiKey(e.target.value)}
                placeholder="AIza…"
                className="flex-1"
              />
              <Button variant="ghost" size="icon" onClick={() => setShowGemini(!showGemini)}>
                {showGemini ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </Button>
            </div>
          </div>
          <Button
            size="sm"
            disabled={aiSaving}
            onClick={async () => {
              setAiSaving(true);
              try {
                await siteSettingsService.set("ai_claude_key", { key: claudeKey });
                await siteSettingsService.set("ai_gemini_key", { key: geminiKey });
                await siteSettingsService.set("ai_provider", { provider: aiProvider });
                toast({ title: "AI configuration saved" });
              } catch (err: any) {
                toast({ title: "Error", description: err.message, variant: "destructive" });
              } finally {
                setAiSaving(false);
              }
            }}
          >
            <Save className="mr-1 h-4 w-4" /> {aiSaving ? "Saving…" : "Save AI Settings"}
          </Button>
        </CardContent>
      </Card>

      <Button className="gap-2" onClick={handleSave}><Save className="h-4 w-4" /> Save Settings</Button>
    </motion.div>
  );
}
