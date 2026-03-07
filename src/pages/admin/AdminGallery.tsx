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
import { useToast } from "@/hooks/use-toast";
import { motion } from "framer-motion";
import { Image, Video, Trash2, Upload, GalleryHorizontalEnd, Sparkles, Loader2, Check } from "lucide-react";

export default function AdminGallery() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [uploading, setUploading] = useState(false);
  const [title, setTitle] = useState("");

  // AI generation state
  const [aiPrompt, setAiPrompt] = useState("");
  const [generating, setGenerating] = useState(false);
  const [generatedImages, setGeneratedImages] = useState<{ image: string; crafted_prompt: string }[]>([]);
  const [savingAi, setSavingAi] = useState<number | null>(null);

  const { data: items = [], isLoading } = useQuery({
    queryKey: ["admin-gallery"],
    queryFn: () => galleryService.getAll(),
  });

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files?.length) return;
    setUploading(true);
    try {
      for (const file of Array.from(files)) {
        const isVideo = file.type.startsWith("video/");
        if (isVideo && file.size > 50 * 1024 * 1024) {
          toast({ title: "Video too large", description: "Max 50MB per video", variant: "destructive" });
          continue;
        }
        const processed = isVideo ? file : await compressImage(file);
        const url = await galleryService.uploadFile(processed);
        await galleryService.create({ title: title || undefined, type: isVideo ? "video" : "image", url });
      }
      toast({ title: "Uploaded successfully" });
      queryClient.invalidateQueries({ queryKey: ["admin-gallery"] });
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
      queryClient.invalidateQueries({ queryKey: ["admin-gallery"] });
      toast({ title: "Item deleted" });
    } catch (err: any) {
      toast({ title: "Error", description: err.message, variant: "destructive" });
    }
  };

  const handleGenerateImages = async () => {
    if (!aiPrompt.trim()) {
      toast({ title: "Enter a prompt", variant: "destructive" });
      return;
    }
    setGenerating(true);
    setGeneratedImages([]);
    try {
      const variations = [
        aiPrompt,
        `${aiPrompt}, different angle, vibrant colors`,
        `${aiPrompt}, dramatic lighting, wide shot`,
      ];
      const results: { image: string; crafted_prompt: string }[] = [];
      for (const prompt of variations) {
        const { data, error } = await supabase.functions.invoke("generate-gallery-image", {
          body: { prompt },
        });
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

  const saveGeneratedImage = async (base64: string, index: number) => {
    setSavingAi(index);
    try {
      const raw = base64.includes(",") ? base64.split(",")[1] : base64;
      const byteString = atob(raw);
      const ab = new ArrayBuffer(byteString.length);
      const ia = new Uint8Array(ab);
      for (let i = 0; i < byteString.length; i++) ia[i] = byteString.charCodeAt(i);
      const blob = new Blob([ab], { type: "image/png" });
      const file = new File([blob], `ai-gallery-${Date.now()}.png`, { type: "image/png" });
      const url = await galleryService.uploadFile(file);
      await galleryService.create({ title: aiPrompt.slice(0, 100) || "AI Generated", type: "image", url });
      queryClient.invalidateQueries({ queryKey: ["admin-gallery"] });
      toast({ title: "Image saved to gallery" });
      setGeneratedImages((prev) => prev.filter((_, i) => i !== index));
    } catch (err: any) {
      toast({ title: "Save failed", description: err.message, variant: "destructive" });
    } finally {
      setSavingAi(null);
    }
  };

  return (
    <motion.div className="space-y-6" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <div className="flex items-center gap-2">
        <GalleryHorizontalEnd className="h-5 w-5 text-primary" />
        <span className="font-display text-lg font-semibold text-foreground">Gallery Management</span>
      </div>

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
            <Textarea
              value={aiPrompt}
              onChange={(e) => setAiPrompt(e.target.value)}
              placeholder="e.g. African elephant at sunset in the Serengeti, photorealistic"
              rows={3}
              className="text-sm"
            />
            <Button
              size="sm"
              onClick={handleGenerateImages}
              disabled={generating}
              className="gap-1.5"
            >
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
              {generatedImages.map((img, i) => (
                <div key={i} className="group relative overflow-hidden rounded-lg border border-border/50 transition-all hover:border-primary/50">
                  <img
                    src={img.startsWith("data:") ? img : `data:image/png;base64,${img}`}
                    alt={`Generated ${i + 1}`}
                    className="aspect-video w-full object-cover"
                  />
                  <div className="absolute inset-0 flex items-center justify-center bg-background/60 opacity-0 transition-opacity group-hover:opacity-100">
                    <Button
                      size="sm"
                      className="gap-1.5"
                      disabled={savingAi === i}
                      onClick={() => saveGeneratedImage(img, i)}
                    >
                      {savingAi === i ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Check className="h-3.5 w-3.5" />}
                      {savingAi === i ? "Saving…" : "Add to Gallery"}
                    </Button>
                  </div>
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
          <p className="col-span-full py-10 text-center text-muted-foreground">No gallery items yet.</p>
        ) : (
          items.map((item) => (
            <Card key={item.id} className="overflow-hidden border-border/50">
              <div className="relative aspect-video">
                {item.type === "video" ? (
                  <video src={item.url} muted loop className="h-full w-full object-cover" />
                ) : (
                  <img src={item.url} alt={item.title || "Gallery"} className="h-full w-full object-cover" />
                )}
                <div className="absolute left-2 top-2">
                  {item.type === "video" ? <Video className="h-4 w-4 text-primary-foreground drop-shadow" /> : <Image className="h-4 w-4 text-primary-foreground drop-shadow" />}
                </div>
              </div>
              <CardContent className="flex items-center justify-between p-3">
                <span className="text-sm font-medium text-foreground truncate">{item.title || "Untitled"}</span>
                <Button variant="ghost" size="icon" className="h-7 w-7 text-destructive" onClick={() => handleDelete(item.id)}>
                  <Trash2 className="h-4 w-4" />
                </Button>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </motion.div>
  );
}
