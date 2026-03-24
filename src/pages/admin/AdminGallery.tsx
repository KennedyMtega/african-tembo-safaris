import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { galleryService } from "@/services/galleryService";
import { compressImage } from "@/lib/compressImage";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { motion } from "framer-motion";
import {
  Image, Video, Trash2, Upload, GalleryHorizontalEnd, Sparkles,
  Loader2, Check, Pencil, LayoutTemplate, User, X,
} from "lucide-react";

/* ---------- Inline Title Editor ---------- */
function InlineTitleEditor({ id, currentTitle, onSaved }: { id: string; currentTitle: string; onSaved: () => void }) {
  const { toast } = useToast();
  const [editing, setEditing] = useState(false);
  const [value, setValue] = useState(currentTitle);
  const [saving, setSaving] = useState(false);

  const save = async () => {
    if (value === currentTitle) { setEditing(false); return; }
    setSaving(true);
    try {
      await galleryService.updateTitle(id, value);
      toast({ title: "Title updated" });
      onSaved();
    } catch (err: any) {
      toast({ title: "Error", description: err.message, variant: "destructive" });
    } finally {
      setSaving(false);
      setEditing(false);
    }
  };

  if (!editing) {
    return (
      <button
        className="flex items-center gap-1.5 text-sm font-medium text-foreground truncate hover:text-primary transition-colors"
        onClick={() => { setValue(currentTitle); setEditing(true); }}
        title="Click to rename"
      >
        <span className="truncate">{currentTitle || "Untitled"}</span>
        <Pencil className="h-3 w-3 shrink-0 opacity-50" />
      </button>
    );
  }

  return (
    <form className="flex items-center gap-1.5" onSubmit={(e) => { e.preventDefault(); save(); }}>
      <Input value={value} onChange={(e) => setValue(e.target.value)} className="h-7 text-xs" autoFocus onBlur={save} disabled={saving} />
    </form>
  );
}

/* ---------- Usage Badge ---------- */
function UsageBadge({ usage }: { usage: "hero" | "founder" | null }) {
  if (usage === "hero") return <Badge className="gap-1 bg-primary/20 text-primary border-primary/30 text-[10px]"><LayoutTemplate className="h-2.5 w-2.5" />Hero</Badge>;
  if (usage === "founder") return <Badge className="gap-1 bg-amber-500/20 text-amber-700 border-amber-400/30 text-[10px]"><User className="h-2.5 w-2.5" />Founder</Badge>;
  return null;
}

/* ---------- Main Component ---------- */
export default function AdminGallery() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [uploading, setUploading] = useState(false);
  const [title, setTitle] = useState("");
  const [togglingId, setTogglingId] = useState<string | null>(null);

  // AI generation state
  const [aiPrompt, setAiPrompt] = useState("");
  const [generating, setGenerating] = useState(false);
  const [generatedImages, setGeneratedImages] = useState<{ image: string; crafted_prompt: string }[]>([]);
  const [savingAi, setSavingAi] = useState<number | null>(null);

  const { data: items = [], isLoading } = useQuery({
    queryKey: ["admin-gallery"],
    queryFn: () => galleryService.getAll(),
  });

  const invalidate = () => {
    queryClient.invalidateQueries({ queryKey: ["admin-gallery"] });
    queryClient.invalidateQueries({ queryKey: ["gallery-public"] });
    queryClient.invalidateQueries({ queryKey: ["hero-slides"] });
    queryClient.invalidateQueries({ queryKey: ["founder-photo"] });
  };

  const titleFromFilename = (name: string) => {
    const base = name.replace(/\.[^.]+$/, "");
    return base.replace(/[-_]+/g, " ").replace(/\b\w/g, (c) => c.toUpperCase()).trim();
  };

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files?.length) return;
    setUploading(true);
    const fileArr = Array.from(files);
    try {
      for (let idx = 0; idx < fileArr.length; idx++) {
        const file = fileArr[idx];
        const isVideo = file.type.startsWith("video/");
        if (isVideo && file.size > 50 * 1024 * 1024) {
          toast({ title: "Video too large", description: "Max 50MB per video", variant: "destructive" });
          continue;
        }
        let itemTitle: string;
        if (title) {
          itemTitle = fileArr.length > 1 ? `${title} ${idx + 1}` : title;
        } else {
          itemTitle = titleFromFilename(file.name);
        }
        const processed = isVideo ? file : await compressImage(file);
        const url = await galleryService.uploadFile(processed);
        await galleryService.create({ title: itemTitle, type: isVideo ? "video" : "image", url });
      }
      toast({ title: "Uploaded successfully" });
      invalidate();
      setTitle("");
    } catch (err: any) {
      toast({ title: "Upload failed", description: err.message, variant: "destructive" });
    } finally {
      setUploading(false);
      e.target.value = "";
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await galleryService.remove(id);
      invalidate();
      toast({ title: "Item deleted" });
    } catch (err: any) {
      toast({ title: "Error", description: err.message, variant: "destructive" });
    }
  };

  const handleSetUsage = async (id: string, current: "hero" | "founder" | null, target: "hero" | "founder") => {
    setTogglingId(id);
    try {
      // Toggle off if already set to the same usage
      const next = current === target ? null : target;
      await galleryService.setUsage(id, next);
      invalidate();
      if (next === "hero") toast({ title: "Added to hero slideshow" });
      else if (next === "founder") toast({ title: "Set as founder photo" });
      else toast({ title: "Removed from usage" });
    } catch (err: any) {
      toast({ title: "Error", description: err.message, variant: "destructive" });
    } finally {
      setTogglingId(null);
    }
  };

  const handleGenerateImages = async () => {
    if (!aiPrompt.trim()) { toast({ title: "Enter a prompt", variant: "destructive" }); return; }
    setGenerating(true);
    setGeneratedImages([]);
    try {
      const variations = [aiPrompt, `${aiPrompt}, different angle, vibrant colors`, `${aiPrompt}, dramatic lighting, wide shot`];
      const results: { image: string; crafted_prompt: string }[] = [];
      for (const prompt of variations) {
        const { data, error } = await supabase.functions.invoke("generate-gallery-image", { body: { prompt } });
        if (error) throw error;
        if (data?.image) results.push({ image: data.image, crafted_prompt: data.crafted_prompt || "" });
      }
      setGeneratedImages(results);
      if (results.length > 0) toast({ title: `Generated ${results.length} images` });
      else toast({ title: "No images generated", variant: "destructive" });
    } catch (err: any) {
      toast({ title: "Generation failed", description: err.message, variant: "destructive" });
    } finally {
      setGenerating(false);
    }
  };

  const saveGeneratedImage = async (item: { image: string; crafted_prompt: string }, index: number) => {
    setSavingAi(index);
    try {
      const base64 = item.image;
      const raw = base64.includes(",") ? base64.split(",")[1] : base64;
      const byteString = atob(raw);
      const ab = new ArrayBuffer(byteString.length);
      const ia = new Uint8Array(ab);
      for (let i = 0; i < byteString.length; i++) ia[i] = byteString.charCodeAt(i);
      const blob = new Blob([ab], { type: "image/png" });
      const file = new File([blob], `ai-gallery-${Date.now()}.png`, { type: "image/png" });
      const url = await galleryService.uploadFile(file);
      await galleryService.create({ title: aiPrompt.slice(0, 100) || "AI Generated", type: "image", url });
      invalidate();
      toast({ title: "Image saved to gallery" });
      setGeneratedImages((prev) => prev.filter((_, i) => i !== index));
    } catch (err: any) {
      toast({ title: "Save failed", description: err.message, variant: "destructive" });
    } finally {
      setSavingAi(null);
    }
  };

  const heroCount = items.filter((i) => i.usage === "hero").length;
  const founderSet = items.some((i) => i.usage === "founder");

  return (
    <motion.div className="space-y-6" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <div className="flex items-center gap-2">
        <GalleryHorizontalEnd className="h-5 w-5 text-primary" />
        <span className="font-display text-lg font-semibold text-foreground">Gallery Management</span>
      </div>

      {/* Usage summary */}
      <div className="flex flex-wrap gap-3">
        <div className="flex items-center gap-2 rounded-lg border border-primary/20 bg-primary/5 px-4 py-2 text-sm">
          <LayoutTemplate className="h-4 w-4 text-primary" />
          <span className="font-medium text-primary">{heroCount}</span>
          <span className="text-muted-foreground">hero slide{heroCount !== 1 ? "s" : ""} selected</span>
        </div>
        <div className={`flex items-center gap-2 rounded-lg border px-4 py-2 text-sm ${founderSet ? "border-amber-400/30 bg-amber-500/10" : "border-border/50 bg-muted/40"}`}>
          <User className={`h-4 w-4 ${founderSet ? "text-amber-600" : "text-muted-foreground"}`} />
          <span className={`font-medium ${founderSet ? "text-amber-700" : "text-muted-foreground"}`}>
            {founderSet ? "Founder photo set" : "No founder photo set"}
          </span>
        </div>
      </div>

      {/* Instructions */}
      <Card className="border-primary/20 bg-primary/5">
        <CardContent className="p-4">
          <p className="text-sm text-foreground font-medium mb-1">How to use tags</p>
          <ul className="text-xs text-muted-foreground space-y-1 list-disc list-inside">
            <li><strong>Hero slide</strong> — image appears in the rotating homepage hero slideshow (pick as many as you like)</li>
            <li><strong>Founder photo</strong> — image appears in the circular portrait on the About page (only one at a time)</li>
            <li>Images with no tag appear only in the public gallery</li>
          </ul>
        </CardContent>
      </Card>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Manual Upload */}
        <Card className="border-border/50">
          <CardHeader><CardTitle className="flex items-center gap-2 text-base"><Upload className="h-4 w-4" /> Upload Media</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div><Label>Title (optional)</Label><Input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="E.g. Serengeti Sunset" /></div>
            <div>
              <Label>Select Images or Videos</Label>
              <Input type="file" accept="image/*,video/*" multiple onChange={handleUpload} disabled={uploading} />
              <p className="mt-1 text-xs text-muted-foreground">Images auto-compressed. Videos max 50MB.</p>
            </div>
            {uploading && <p className="text-sm text-muted-foreground">Uploading…</p>}
          </CardContent>
        </Card>

        {/* AI Generation */}
        <Card className="border-border/50">
          <CardHeader><CardTitle className="flex items-center gap-2 text-base"><Sparkles className="h-4 w-4 text-primary" /> Generate with AI</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <p className="text-xs text-muted-foreground">
              Describe an image and AI will generate 3 variations. Select the ones you want to add to the gallery.
            </p>
            <Textarea value={aiPrompt} onChange={(e) => setAiPrompt(e.target.value)} placeholder="e.g. African elephant at sunset in the Serengeti, photorealistic" rows={3} className="text-sm" />
            <Button size="sm" onClick={handleGenerateImages} disabled={generating} className="gap-1.5">
              {generating ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Sparkles className="h-3.5 w-3.5" />}
              {generating ? "Generating…" : "Generate 3 Images"}
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* AI Generated Previews */}
      {generatedImages.length > 0 && (
        <Card className="border-border/50">
          <CardHeader><CardTitle className="text-base">Generated Images — Click to add to gallery</CardTitle></CardHeader>
          <CardContent>
            <div className="grid gap-4 sm:grid-cols-3">
              {generatedImages.map((item, i) => (
                <div key={i} className="group relative overflow-hidden rounded-lg border border-border/50 transition-all hover:border-primary/50">
                  <img src={item.image.startsWith("data:") ? item.image : `data:image/png;base64,${item.image}`} alt={`Generated ${i + 1}`} className="aspect-video w-full object-cover" />
                  <div className="absolute inset-0 flex items-center justify-center bg-background/60 opacity-0 transition-opacity group-hover:opacity-100">
                    <Button size="sm" className="gap-1.5" disabled={savingAi === i} onClick={() => saveGeneratedImage(item, i)}>
                      {savingAi === i ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Check className="h-3.5 w-3.5" />}
                      {savingAi === i ? "Saving…" : "Add to Gallery"}
                    </Button>
                  </div>
                  {item.crafted_prompt && (
                    <div className="p-2 bg-muted/80">
                      <p className="text-[10px] leading-tight text-muted-foreground line-clamp-3">{item.crafted_prompt}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Gallery Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {isLoading ? (
          <p className="col-span-full py-10 text-center text-muted-foreground">Loading…</p>
        ) : items.length === 0 ? (
          <p className="col-span-full py-10 text-center text-muted-foreground">No gallery items yet. Upload some photos above.</p>
        ) : (
          items.map((item) => {
            const isToggling = togglingId === item.id;
            return (
              <Card key={item.id} className={`overflow-hidden border-2 transition-colors ${item.usage === "hero" ? "border-primary/50" : item.usage === "founder" ? "border-amber-400/50" : "border-border/50"}`}>
                {/* Image / Video preview */}
                <div className="relative aspect-video">
                  {item.type === "video" ? (
                    <video src={item.url} muted loop className="h-full w-full object-cover" />
                  ) : (
                    <img src={item.url} alt={item.title || "Gallery"} onError={(e) => { (e.target as HTMLImageElement).src = "/placeholder.svg"; }} className="h-full w-full object-cover" />
                  )}
                  {/* Type icon */}
                  <div className="absolute left-2 top-2">
                    {item.type === "video"
                      ? <Video className="h-4 w-4 text-primary-foreground drop-shadow" />
                      : <Image className="h-4 w-4 text-primary-foreground drop-shadow" />}
                  </div>
                  {/* Usage badge overlay */}
                  {item.usage && (
                    <div className="absolute right-2 top-2">
                      <UsageBadge usage={item.usage} />
                    </div>
                  )}
                </div>

                {/* Title + delete */}
                <CardContent className="p-3 space-y-2">
                  <div className="flex items-center justify-between gap-2">
                    <InlineTitleEditor id={item.id} currentTitle={item.title || ""} onSaved={invalidate} />
                    <Button variant="ghost" size="icon" className="h-7 w-7 shrink-0 text-destructive" onClick={() => handleDelete(item.id)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>

                  {/* Usage tag buttons — images only */}
                  {item.type === "image" && (
                    <div className="flex gap-1.5">
                      <Button
                        size="sm"
                        variant={item.usage === "hero" ? "default" : "outline"}
                        className={`h-7 flex-1 gap-1 text-[11px] ${item.usage === "hero" ? "bg-primary text-primary-foreground" : ""}`}
                        disabled={isToggling}
                        onClick={() => handleSetUsage(item.id, item.usage, "hero")}
                        title="Toggle as hero slideshow image"
                      >
                        {isToggling ? <Loader2 className="h-3 w-3 animate-spin" /> : item.usage === "hero" ? <X className="h-3 w-3" /> : <LayoutTemplate className="h-3 w-3" />}
                        Hero
                      </Button>
                      <Button
                        size="sm"
                        variant={item.usage === "founder" ? "default" : "outline"}
                        className={`h-7 flex-1 gap-1 text-[11px] ${item.usage === "founder" ? "bg-amber-600 text-white hover:bg-amber-700 border-amber-600" : ""}`}
                        disabled={isToggling}
                        onClick={() => handleSetUsage(item.id, item.usage, "founder")}
                        title="Set as founder portrait photo"
                      >
                        {isToggling ? <Loader2 className="h-3 w-3 animate-spin" /> : item.usage === "founder" ? <X className="h-3 w-3" /> : <User className="h-3 w-3" />}
                        Founder
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            );
          })
        )}
      </div>
    </motion.div>
  );
}
