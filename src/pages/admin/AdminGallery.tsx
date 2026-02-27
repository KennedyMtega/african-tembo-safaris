import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { galleryService } from "@/services/galleryService";
import { compressImage } from "@/lib/compressImage";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { motion } from "framer-motion";
import { Image, Video, Trash2, Upload, GalleryHorizontalEnd } from "lucide-react";

export default function AdminGallery() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [uploading, setUploading] = useState(false);
  const [title, setTitle] = useState("");

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

  return (
    <motion.div className="space-y-6" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <div className="flex items-center gap-2">
        <GalleryHorizontalEnd className="h-5 w-5 text-primary" />
        <span className="font-display text-lg font-semibold text-foreground">Gallery Management</span>
      </div>

      <Card className="border-border/50">
        <CardHeader><CardTitle className="text-base">Upload Media</CardTitle></CardHeader>
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
