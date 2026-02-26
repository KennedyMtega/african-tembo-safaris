import { useState, useEffect, useCallback } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { packageService } from "@/services/packageService";
import { destinationService } from "@/services/destinationService";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { ArrowLeft, Plus, X, Upload, GripVertical, Save, Eye, Trash2, ImagePlus } from "lucide-react";
import type { SafariPackage, ItineraryDay, Destination } from "@/types";

function slugify(text: string) {
  return text.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}

const defaultItineraryDay = (): ItineraryDay => ({
  day: 1, title: "", description: "", meals: [], accommodation: "",
});

const mealOptions = ["Breakfast", "Lunch", "Dinner"];

export default function AdminPackageForm() {
  const { id } = useParams();
  const isEdit = !!id;
  const navigate = useNavigate();
  const { toast } = useToast();

  const { data: destinations = [] } = useQuery<Destination[]>({
    queryKey: ["destinations"],
    queryFn: () => destinationService.getAll(),
  });

  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);

  // Form state
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [shortDescription, setShortDescription] = useState("");
  const [description, setDescription] = useState("");
  const [destinationId, setDestinationId] = useState("");
  const [duration, setDuration] = useState(1);
  const [difficulty, setDifficulty] = useState<"easy" | "moderate" | "challenging">("moderate");
  const [maxGroupSize, setMaxGroupSize] = useState(10);
  const [priceMin, setPriceMin] = useState(0);
  const [priceMax, setPriceMax] = useState(0);
  const [groupPriceMin, setGroupPriceMin] = useState(0);
  const [groupPriceMax, setGroupPriceMax] = useState(0);
  const [images, setImages] = useState<string[]>([]);
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState("");
  const [highlights, setHighlights] = useState<string[]>([]);
  const [highlightInput, setHighlightInput] = useState("");
  const [includes, setIncludes] = useState<string[]>([]);
  const [includeInput, setIncludeInput] = useState("");
  const [excludes, setExcludes] = useState<string[]>([]);
  const [excludeInput, setExcludeInput] = useState("");
  const [itinerary, setItinerary] = useState<ItineraryDay[]>([defaultItineraryDay()]);
  const [status, setStatus] = useState<"draft" | "published" | "archived">("draft");
  const [featured, setFeatured] = useState(false);

  // Load existing package for edit
  useEffect(() => {
    if (!isEdit) return;
    packageService.getById(id!).then((pkg) => {
      if (!pkg) { navigate("/admin/packages"); return; }
      setTitle(pkg.title);
      setSlug(pkg.slug);
      setShortDescription(pkg.shortDescription);
      setDescription(pkg.description);
      setDestinationId(pkg.destinationId || "");
      setDuration(pkg.duration);
      setDifficulty(pkg.difficulty);
      setMaxGroupSize(pkg.maxGroupSize);
      setPriceMin(pkg.priceMin);
      setPriceMax(pkg.priceMax);
      setGroupPriceMin(pkg.groupPriceMin || 0);
      setGroupPriceMax(pkg.groupPriceMax || 0);
      setImages(pkg.images);
      setTags(pkg.tags);
      setHighlights(pkg.highlights);
      setIncludes(pkg.includes);
      setExcludes(pkg.excludes);
      setItinerary(pkg.itinerary.length > 0 ? pkg.itinerary : [defaultItineraryDay()]);
      setStatus(pkg.status);
      setFeatured(pkg.featured);
    });
  }, [id, isEdit, navigate]);

  // Auto-slug from title
  useEffect(() => {
    if (!isEdit) setSlug(slugify(title));
  }, [title, isEdit]);

  // Image upload
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    setUploading(true);
    const newImages: string[] = [];
    for (const file of Array.from(files)) {
      const ext = file.name.split(".").pop();
      const path = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
      const { error } = await supabase.storage.from("package-images").upload(path, file);
      if (!error) {
        const { data: urlData } = supabase.storage.from("package-images").getPublicUrl(path);
        newImages.push(urlData.publicUrl);
      }
    }
    setImages((prev) => [...prev, ...newImages]);
    setUploading(false);
  };

  const removeImage = (idx: number) => setImages((prev) => prev.filter((_, i) => i !== idx));

  // Chip helpers
  const addChip = (value: string, list: string[], setList: (v: string[]) => void, setInput: (v: string) => void) => {
    const trimmed = value.trim();
    if (trimmed && !list.includes(trimmed)) setList([...list, trimmed]);
    setInput("");
  };
  const removeChip = (idx: number, list: string[], setList: (v: string[]) => void) => setList(list.filter((_, i) => i !== idx));

  // Itinerary helpers
  const addDay = () => setItinerary((prev) => [...prev, { ...defaultItineraryDay(), day: prev.length + 1 }]);
  const removeDay = (idx: number) => setItinerary((prev) => prev.filter((_, i) => i !== idx).map((d, i) => ({ ...d, day: i + 1 })));
  const updateDay = (idx: number, field: keyof ItineraryDay, value: any) => {
    setItinerary((prev) => prev.map((d, i) => i === idx ? { ...d, [field]: value } : d));
  };
  const toggleMeal = (idx: number, meal: string) => {
    setItinerary((prev) => prev.map((d, i) => {
      if (i !== idx) return d;
      const meals = d.meals.includes(meal) ? d.meals.filter((m) => m !== meal) : [...d.meals, meal];
      return { ...d, meals };
    }));
  };

  // Save
  const handleSave = async (saveStatus?: "draft" | "published") => {
    if (!title.trim()) { toast({ title: "Title is required", variant: "destructive" }); return; }
    setSaving(true);
    const payload: Partial<SafariPackage> = {
      title, slug, shortDescription, description,
      destinationId: destinationId || undefined, duration, difficulty, maxGroupSize,
      priceMin, priceMax, groupPriceMin, groupPriceMax,
      images, tags, highlights, includes, excludes, itinerary,
      status: saveStatus || status, featured,
    };
    try {
      if (isEdit) {
        await packageService.update(id!, payload);
        toast({ title: "Package updated" });
      } else {
        await packageService.create(payload);
        toast({ title: "Package created" });
      }
      navigate("/admin/packages");
    } catch (err: any) {
      toast({ title: "Error", description: err.message, variant: "destructive" });
    } finally {
      setSaving(false);
    }
  };

  return (
    <motion.div className="space-y-6 pb-24" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="icon" onClick={() => navigate("/admin/packages")}><ArrowLeft className="h-4 w-4" /></Button>
        <h1 className="font-display text-xl font-bold text-foreground">{isEdit ? "Edit Package" : "Create New Package"}</h1>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          {/* Basic Info */}
          <Card className="border-border/50">
            <CardHeader><CardTitle className="text-base">Basic Information</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">Title</Label>
                <Input id="title" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="e.g. Serengeti Migration Safari" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="slug">Slug</Label>
                <Input id="slug" value={slug} onChange={(e) => setSlug(e.target.value)} placeholder="auto-generated-from-title" className="text-muted-foreground" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="short">Short Description</Label>
                <Textarea id="short" value={shortDescription} onChange={(e) => setShortDescription(e.target.value)} rows={2} placeholder="Brief summary for cards" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="desc">Full Description</Label>
                <Textarea id="desc" value={description} onChange={(e) => setDescription(e.target.value)} rows={5} placeholder="Detailed package description…" />
              </div>
            </CardContent>
          </Card>

          {/* Destination & Details */}
          <Card className="border-border/50">
            <CardHeader><CardTitle className="text-base">Destination & Details</CardTitle></CardHeader>
            <CardContent className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label>Destination</Label>
                <Select value={destinationId} onValueChange={setDestinationId}>
                  <SelectTrigger><SelectValue placeholder="Select destination" /></SelectTrigger>
                  <SelectContent>
                    {destinations.map((d) => <SelectItem key={d.id} value={d.id}>{d.name}, {d.country}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Duration (days)</Label>
                <Input type="number" min={1} value={duration} onChange={(e) => setDuration(Number(e.target.value))} />
              </div>
              <div className="space-y-2">
                <Label>Difficulty</Label>
                <Select value={difficulty} onValueChange={(v) => setDifficulty(v as any)}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="easy">Easy</SelectItem>
                    <SelectItem value="moderate">Moderate</SelectItem>
                    <SelectItem value="challenging">Challenging</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Max Group Size</Label>
                <Input type="number" min={1} value={maxGroupSize} onChange={(e) => setMaxGroupSize(Number(e.target.value))} />
              </div>
            </CardContent>
          </Card>

          {/* Pricing */}
          <Card className="border-border/50">
            <CardHeader><CardTitle className="text-base">Pricing</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label>Price Min ($)</Label>
                  <Input type="number" min={0} value={priceMin} onChange={(e) => setPriceMin(Number(e.target.value))} />
                </div>
                <div className="space-y-2">
                  <Label>Price Max ($)</Label>
                  <Input type="number" min={0} value={priceMax} onChange={(e) => setPriceMax(Number(e.target.value))} />
                </div>
              </div>
              {priceMin > 0 && priceMax > 0 && (
                <div className="rounded-lg bg-secondary/50 p-3 text-sm text-foreground">
                  Display: <span className="font-semibold">${priceMin.toLocaleString()} – ${priceMax.toLocaleString()}</span> per person
                </div>
              )}
              <Separator />
              <p className="text-xs font-medium text-muted-foreground">Group Pricing (optional)</p>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label>Group Price Min ($)</Label>
                  <Input type="number" min={0} value={groupPriceMin} onChange={(e) => setGroupPriceMin(Number(e.target.value))} />
                </div>
                <div className="space-y-2">
                  <Label>Group Price Max ($)</Label>
                  <Input type="number" min={0} value={groupPriceMax} onChange={(e) => setGroupPriceMax(Number(e.target.value))} />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Images */}
          <Card className="border-border/50">
            <CardHeader><CardTitle className="text-base">Images</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                {images.map((img, i) => (
                  <div key={i} className="group relative aspect-video overflow-hidden rounded-lg border border-border">
                    <img src={img} alt="" className="h-full w-full object-cover" />
                    <button onClick={() => removeImage(i)} className="absolute right-1 top-1 rounded-full bg-destructive p-1 text-destructive-foreground opacity-0 transition-opacity group-hover:opacity-100">
                      <X className="h-3 w-3" />
                    </button>
                  </div>
                ))}
                <label className="flex aspect-video cursor-pointer flex-col items-center justify-center gap-1 rounded-lg border-2 border-dashed border-border text-muted-foreground transition-colors hover:border-primary hover:text-primary">
                  <ImagePlus className="h-6 w-6" />
                  <span className="text-xs">{uploading ? "Uploading…" : "Add Image"}</span>
                  <input type="file" accept="image/*" multiple className="hidden" onChange={handleImageUpload} disabled={uploading} />
                </label>
              </div>
            </CardContent>
          </Card>

          {/* Tags & Highlights */}
          <Card className="border-border/50">
            <CardHeader><CardTitle className="text-base">Tags & Highlights</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Tags</Label>
                <div className="flex flex-wrap gap-1.5 mb-2">
                  {tags.map((t, i) => (
                    <Badge key={i} variant="secondary" className="gap-1 pl-2 pr-1">
                      {t}
                      <button onClick={() => removeChip(i, tags, setTags)} className="rounded-full p-0.5 hover:bg-destructive/20"><X className="h-2.5 w-2.5" /></button>
                    </Badge>
                  ))}
                </div>
                <div className="flex gap-2">
                  <Input value={tagInput} onChange={(e) => setTagInput(e.target.value)} placeholder="Add tag…" className="flex-1"
                    onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); addChip(tagInput, tags, setTags, setTagInput); } }} />
                  <Button type="button" variant="outline" size="sm" onClick={() => addChip(tagInput, tags, setTags, setTagInput)}>Add</Button>
                </div>
              </div>
              <Separator />
              <div className="space-y-2">
                <Label>Highlights</Label>
                <div className="space-y-1.5 mb-2">
                  {highlights.map((h, i) => (
                    <div key={i} className="flex items-center gap-2 rounded-md bg-secondary/40 px-3 py-1.5 text-sm">
                      <span className="flex-1">{h}</span>
                      <button onClick={() => removeChip(i, highlights, setHighlights)} className="text-muted-foreground hover:text-destructive"><X className="h-3.5 w-3.5" /></button>
                    </div>
                  ))}
                </div>
                <div className="flex gap-2">
                  <Input value={highlightInput} onChange={(e) => setHighlightInput(e.target.value)} placeholder="Add highlight…" className="flex-1"
                    onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); addChip(highlightInput, highlights, setHighlights, setHighlightInput); } }} />
                  <Button type="button" variant="outline" size="sm" onClick={() => addChip(highlightInput, highlights, setHighlights, setHighlightInput)}>Add</Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Includes / Excludes */}
          <Card className="border-border/50">
            <CardHeader><CardTitle className="text-base">Includes / Excludes</CardTitle></CardHeader>
            <CardContent className="grid gap-6 sm:grid-cols-2">
              <div className="space-y-2">
                <Label className="text-savanna-green">Included</Label>
                <div className="space-y-1.5 mb-2">
                  {includes.map((item, i) => (
                    <div key={i} className="flex items-center gap-2 rounded-md bg-secondary/40 px-3 py-1.5 text-sm">
                      <span className="flex-1">✓ {item}</span>
                      <button onClick={() => removeChip(i, includes, setIncludes)} className="text-muted-foreground hover:text-destructive"><X className="h-3.5 w-3.5" /></button>
                    </div>
                  ))}
                </div>
                <div className="flex gap-2">
                  <Input value={includeInput} onChange={(e) => setIncludeInput(e.target.value)} placeholder="Add item…" className="flex-1"
                    onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); addChip(includeInput, includes, setIncludes, setIncludeInput); } }} />
                  <Button type="button" variant="outline" size="icon" className="h-9 w-9" onClick={() => addChip(includeInput, includes, setIncludes, setIncludeInput)}><Plus className="h-4 w-4" /></Button>
                </div>
              </div>
              <div className="space-y-2">
                <Label className="text-destructive">Excluded</Label>
                <div className="space-y-1.5 mb-2">
                  {excludes.map((item, i) => (
                    <div key={i} className="flex items-center gap-2 rounded-md bg-secondary/40 px-3 py-1.5 text-sm">
                      <span className="flex-1">✗ {item}</span>
                      <button onClick={() => removeChip(i, excludes, setExcludes)} className="text-muted-foreground hover:text-destructive"><X className="h-3.5 w-3.5" /></button>
                    </div>
                  ))}
                </div>
                <div className="flex gap-2">
                  <Input value={excludeInput} onChange={(e) => setExcludeInput(e.target.value)} placeholder="Add item…" className="flex-1"
                    onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); addChip(excludeInput, excludes, setExcludes, setExcludeInput); } }} />
                  <Button type="button" variant="outline" size="icon" className="h-9 w-9" onClick={() => addChip(excludeInput, excludes, setExcludes, setExcludeInput)}><Plus className="h-4 w-4" /></Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Itinerary Builder */}
          <Card className="border-border/50">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-base">Itinerary</CardTitle>
              <Button variant="outline" size="sm" className="gap-1" onClick={addDay}><Plus className="h-3.5 w-3.5" /> Add Day</Button>
            </CardHeader>
            <CardContent className="space-y-4">
              {itinerary.map((day, idx) => (
                <div key={idx} className="space-y-3 rounded-lg border border-border p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <GripVertical className="h-4 w-4 text-muted-foreground" />
                      <span className="font-display text-sm font-semibold text-foreground">Day {day.day}</span>
                    </div>
                    {itinerary.length > 1 && (
                      <Button variant="ghost" size="icon" className="h-7 w-7 text-destructive" onClick={() => removeDay(idx)}><Trash2 className="h-3.5 w-3.5" /></Button>
                    )}
                  </div>
                  <div className="grid gap-3 sm:grid-cols-2">
                    <div className="space-y-1">
                      <Label className="text-xs">Title</Label>
                      <Input value={day.title} onChange={(e) => updateDay(idx, "title", e.target.value)} placeholder="Day title" className="h-8 text-sm" />
                    </div>
                    <div className="space-y-1">
                      <Label className="text-xs">Accommodation</Label>
                      <Input value={day.accommodation} onChange={(e) => updateDay(idx, "accommodation", e.target.value)} placeholder="Lodge / Camp name" className="h-8 text-sm" />
                    </div>
                  </div>
                  <div className="space-y-1">
                    <Label className="text-xs">Description</Label>
                    <Textarea value={day.description} onChange={(e) => updateDay(idx, "description", e.target.value)} rows={2} placeholder="Day activities…" className="text-sm" />
                  </div>
                  <div className="space-y-1">
                    <Label className="text-xs">Meals</Label>
                    <div className="flex gap-3">
                      {mealOptions.map((meal) => (
                        <label key={meal} className="flex items-center gap-1.5 text-xs">
                          <input type="checkbox" checked={day.meals.includes(meal)} onChange={() => toggleMeal(idx, meal)} className="rounded border-border" />
                          {meal}
                        </label>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Sidebar - Settings */}
        <div className="space-y-6">
          <Card className="border-border/50">
            <CardHeader><CardTitle className="text-base">Settings</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Status</Label>
                <Select value={status} onValueChange={(v) => setStatus(v as any)}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="draft">Draft</SelectItem>
                    <SelectItem value="published">Published</SelectItem>
                    <SelectItem value="archived">Archived</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-center justify-between">
                <Label>Featured</Label>
                <Switch checked={featured} onCheckedChange={setFeatured} />
              </div>
            </CardContent>
          </Card>

          {/* Summary preview */}
          {title && (
            <Card className="border-border/50">
              <CardHeader><CardTitle className="text-base">Preview</CardTitle></CardHeader>
              <CardContent className="space-y-2 text-sm">
                <p className="font-display font-semibold text-foreground">{title}</p>
                <p className="text-xs text-muted-foreground">{shortDescription || "No short description yet"}</p>
                {priceMin > 0 && <p className="font-semibold text-primary">${priceMin.toLocaleString()} – ${priceMax.toLocaleString()}</p>}
                <p className="text-xs text-muted-foreground">{duration} days · {difficulty} · Up to {maxGroupSize} guests</p>
                {tags.length > 0 && <div className="flex flex-wrap gap-1">{tags.map((t) => <Badge key={t} variant="secondary" className="text-[10px]">{t}</Badge>)}</div>}
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      {/* Sticky action bar */}
      <div className="fixed bottom-0 left-0 right-0 z-50 border-t border-border bg-card/95 backdrop-blur px-6 py-3">
        <div className="mx-auto flex max-w-7xl items-center justify-between">
          <Button variant="ghost" onClick={() => navigate("/admin/packages")}>Cancel</Button>
          <div className="flex gap-2">
            <Button variant="outline" disabled={saving} onClick={() => handleSave("draft")}>
              <Save className="mr-1.5 h-4 w-4" /> Save Draft
            </Button>
            <Button disabled={saving} onClick={() => handleSave("published")}>
              <Eye className="mr-1.5 h-4 w-4" /> Publish
            </Button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
