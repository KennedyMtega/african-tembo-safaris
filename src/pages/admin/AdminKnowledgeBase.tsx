import { useState, useMemo } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { knowledgeBaseService, type KBArticle } from "@/services/knowledgeBaseService";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { useToast } from "@/hooks/use-toast";
import { motion, AnimatePresence } from "framer-motion";
import {
  BookOpen, Plus, Pencil, Trash2, Search, X, Sparkles, Wand2,
  Lightbulb, FileText, Clock, Hash, ArrowLeft, Loader2, Check,
  Upload,
} from "lucide-react";
import { format } from "date-fns";

const CATEGORIES = ["All", "FAQ", "Destinations", "Policies", "Safety", "Wildlife", "Accommodation", "Transportation", "Booking", "General"];

interface TopicSuggestion {
  title: string;
  description: string;
  category: string;
  priority: "high" | "medium" | "low";
}

export default function AdminKnowledgeBase() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [saving, setSaving] = useState(false);

  // Editor state
  const [editorOpen, setEditorOpen] = useState(false);
  const [editing, setEditing] = useState<KBArticle | null>(null);
  const [formTitle, setFormTitle] = useState("");
  const [formContent, setFormContent] = useState("");
  const [formCategory, setFormCategory] = useState("");
  const [formTags, setFormTags] = useState("");

  // AI state
  const [aiLoading, setAiLoading] = useState(false);
  const [aiPrompt, setAiPrompt] = useState("");
  const [suggestions, setSuggestions] = useState<TopicSuggestion[]>([]);
  const [docUploading, setDocUploading] = useState(false);

  // Delete state
  const [deleteTarget, setDeleteTarget] = useState<KBArticle | null>(null);

  const { data: articles = [], isLoading } = useQuery({
    queryKey: ["knowledge-base"],
    queryFn: () => knowledgeBaseService.getAll(),
  });

  const filtered = useMemo(() => {
    return articles.filter((a) => {
      const matchesSearch =
        !search ||
        a.title.toLowerCase().includes(search.toLowerCase()) ||
        a.category?.toLowerCase().includes(search.toLowerCase()) ||
        a.content.toLowerCase().includes(search.toLowerCase());
      const matchesCategory =
        categoryFilter === "All" || a.category === categoryFilter;
      return matchesSearch && matchesCategory;
    });
  }, [articles, search, categoryFilter]);

  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = { All: articles.length };
    articles.forEach((a) => {
      const cat = a.category || "General";
      counts[cat] = (counts[cat] || 0) + 1;
    });
    return counts;
  }, [articles]);

  const wordCount = (text: string) => text.split(/\s+/).filter(Boolean).length;

  // --- Editor actions ---
  const openNew = () => {
    setEditing(null);
    setFormTitle("");
    setFormContent("");
    setFormCategory("");
    setFormTags("");
    setSuggestions([]);
    setEditorOpen(true);
  };

  const openEdit = (a: KBArticle) => {
    setEditing(a);
    setFormTitle(a.title);
    setFormContent(a.content);
    setFormCategory(a.category || "");
    setFormTags(a.tags.join(", "));
    setSuggestions([]);
    setEditorOpen(true);
  };

  const closeEditor = () => {
    setEditorOpen(false);
    setEditing(null);
  };

  const handleSave = async () => {
    if (!formTitle.trim() || !formContent.trim()) {
      toast({ title: "Title and content are required", variant: "destructive" });
      return;
    }
    setSaving(true);
    const payload = {
      title: formTitle.trim(),
      content: formContent.trim(),
      category: formCategory || undefined,
      tags: formTags.split(",").map((t) => t.trim()).filter(Boolean),
    };
    try {
      if (editing) {
        await knowledgeBaseService.update(editing.id, payload);
        toast({ title: "Article updated" });
      } else {
        await knowledgeBaseService.create(payload);
        toast({ title: "Article created" });
      }
      queryClient.invalidateQueries({ queryKey: ["knowledge-base"] });
      closeEditor();
    } catch (err: any) {
      toast({ title: "Error", description: err.message, variant: "destructive" });
    } finally {
      setSaving(false);
    }
  };

  const confirmDelete = async () => {
    if (!deleteTarget) return;
    try {
      await knowledgeBaseService.remove(deleteTarget.id);
      queryClient.invalidateQueries({ queryKey: ["knowledge-base"] });
      toast({ title: "Article deleted" });
      if (editing?.id === deleteTarget.id) closeEditor();
    } catch (err: any) {
      toast({ title: "Error", description: err.message, variant: "destructive" });
    }
    setDeleteTarget(null);
  };

  // --- AI actions ---
  const callKbAssistant = async (action: string, extra: Record<string, any> = {}) => {
    setAiLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke("kb-assistant", {
        body: { action, ...extra },
      });
      if (error) throw error;
      return data;
    } catch (err: any) {
      toast({ title: "AI Error", description: err.message || "Failed to reach AI assistant", variant: "destructive" });
      return null;
    } finally {
      setAiLoading(false);
    }
  };

  const handleGenerate = async () => {
    if (!aiPrompt.trim()) {
      toast({ title: "Enter a topic or prompt", variant: "destructive" });
      return;
    }
    const data = await callKbAssistant("generate", { prompt: aiPrompt });
    if (data?.article) {
      setFormTitle(data.article.title);
      setFormContent(data.article.content);
      setFormCategory(data.article.category || "");
      setFormTags((data.article.tags || []).join(", "));
      toast({ title: "Article generated! Review and save." });
    }
  };

  const handleImprove = async () => {
    if (!formContent.trim()) {
      toast({ title: "Write some content first", variant: "destructive" });
      return;
    }
    const data = await callKbAssistant("improve", {
      content: formContent,
      title: formTitle,
      category: formCategory,
      tags: formTags.split(",").map((t) => t.trim()).filter(Boolean),
    });
    if (data?.article) {
      setFormTitle(data.article.title);
      setFormContent(data.article.content);
      setFormCategory(data.article.category || formCategory);
      setFormTags((data.article.tags || []).join(", "));
      toast({ title: "Content improved! Review the changes." });
    }
  };

  const handleSuggestTopics = async () => {
    const data = await callKbAssistant("suggest");
    if (data?.suggestions) {
      setSuggestions(data.suggestions);
    }
  };

  const useSuggestion = (s: TopicSuggestion) => {
    setAiPrompt(`Write a comprehensive article about: ${s.title}. ${s.description}`);
    setSuggestions([]);
  };

  const handleDocumentUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setDocUploading(true);
    try {
      let text = "";
      if (file.name.endsWith(".txt") || file.name.endsWith(".md")) {
        text = await file.text();
      } else {
        text = await file.text();
      }
      if (!text.trim()) {
        toast({ title: "Empty document", variant: "destructive" });
        return;
      }
      const data = await callKbAssistant("from_document", { documentText: text });
      if (data?.article) {
        setFormTitle(data.article.title);
        setFormContent(data.article.content);
        setFormCategory(data.article.category || "");
        setFormTags((data.article.tags || []).join(", "));
        toast({ title: "Document processed! Review and save." });
      }
    } catch (err: any) {
      toast({ title: "Processing failed", description: err.message, variant: "destructive" });
    } finally {
      setDocUploading(false);
      e.target.value = "";
    }
  };

  return (
    <motion.div className="h-full" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <div className="flex h-full gap-0">
        {/* LEFT: Article List */}
        <div className={`flex flex-col ${editorOpen ? "hidden lg:flex lg:w-[400px] xl:w-[440px]" : "w-full"} shrink-0 border-r border-border/50`}>
          {/* Header */}
          <div className="flex items-center justify-between border-b border-border/50 px-4 py-3">
            <div className="flex items-center gap-2">
              <BookOpen className="h-5 w-5 text-primary" />
              <span className="font-display text-lg font-semibold text-foreground">Knowledge Base</span>
              <Badge variant="secondary" className="ml-1 text-xs">{articles.length}</Badge>
            </div>
            <Button size="sm" className="gap-1.5" onClick={openNew}>
              <Plus className="h-4 w-4" /> Add Article
            </Button>
          </div>

          {/* Search */}
          <div className="px-4 pt-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input className="pl-9" placeholder="Search articles…" value={search} onChange={(e) => setSearch(e.target.value)} />
            </div>
          </div>

          {/* Category Filter Chips */}
          <div className="flex flex-wrap gap-1.5 px-4 py-3">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => setCategoryFilter(cat)}
                className={`rounded-full px-2.5 py-1 text-xs font-medium transition-colors ${
                  categoryFilter === cat
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                }`}
              >
                {cat} {categoryCounts[cat] ? `(${categoryCounts[cat]})` : ""}
              </button>
            ))}
          </div>

          {/* Article List */}
          <div className="flex-1 overflow-y-auto px-4 pb-4">
            {isLoading ? (
              <p className="py-10 text-center text-sm text-muted-foreground">Loading…</p>
            ) : filtered.length === 0 ? (
              <p className="py-10 text-center text-sm text-muted-foreground">No articles found.</p>
            ) : (
              <div className="space-y-2">
                {filtered.map((a) => (
                  <Card
                    key={a.id}
                    className={`cursor-pointer border-border/50 transition-all hover:border-primary/30 hover:shadow-sm ${
                      editing?.id === a.id ? "border-primary/50 bg-accent/30" : ""
                    }`}
                    onClick={() => openEdit(a)}
                  >
                    <CardContent className="p-3">
                      <div className="flex items-start justify-between gap-2">
                        <div className="min-w-0 flex-1">
                          <h4 className="truncate text-sm font-medium text-foreground">{a.title}</h4>
                          <p className="mt-1 line-clamp-2 text-xs text-muted-foreground">{a.content}</p>
                        </div>
                      </div>
                      <div className="mt-2 flex items-center gap-2 text-[10px] text-muted-foreground">
                        <span className="flex items-center gap-0.5"><Clock className="h-3 w-3" /> {format(new Date(a.updatedAt), "MMM d, yyyy")}</span>
                        <span className="flex items-center gap-0.5"><Hash className="h-3 w-3" /> {wordCount(a.content)} words</span>
                      </div>
                      <div className="mt-2 flex flex-wrap gap-1">
                        {a.category && <Badge variant="secondary" className="text-[10px]">{a.category}</Badge>}
                        {a.tags.slice(0, 3).map((t) => <Badge key={t} variant="outline" className="text-[10px]">{t}</Badge>)}
                        {a.tags.length > 3 && <Badge variant="outline" className="text-[10px]">+{a.tags.length - 3}</Badge>}
                      </div>
                      <div className="mt-2 flex gap-1">
                        <Button variant="ghost" size="sm" className="h-6 px-2 text-xs" onClick={(e) => { e.stopPropagation(); openEdit(a); }}>
                          <Pencil className="mr-1 h-3 w-3" /> Edit
                        </Button>
                        <Button variant="ghost" size="sm" className="h-6 px-2 text-xs text-destructive" onClick={(e) => { e.stopPropagation(); setDeleteTarget(a); }}>
                          <Trash2 className="mr-1 h-3 w-3" /> Delete
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* RIGHT: Editor Panel */}
        <AnimatePresence>
          {editorOpen && (
            <motion.div
              className="flex flex-1 flex-col overflow-hidden"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.2 }}
            >
              {/* Editor Header */}
              <div className="flex items-center justify-between border-b border-border/50 px-4 py-3">
                <div className="flex items-center gap-2">
                  <Button variant="ghost" size="sm" className="h-7 w-7 p-0 lg:hidden" onClick={closeEditor}>
                    <ArrowLeft className="h-4 w-4" />
                  </Button>
                  <FileText className="h-4 w-4 text-primary" />
                  <span className="text-sm font-semibold text-foreground">
                    {editing ? "Edit Article" : "New Article"}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Button size="sm" onClick={handleSave} disabled={saving} className="gap-1.5">
                    {saving ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Check className="h-3.5 w-3.5" />}
                    {saving ? "Saving…" : "Save"}
                  </Button>
                  <Button variant="ghost" size="sm" className="h-7 w-7 p-0" onClick={closeEditor}>
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              <Tabs defaultValue="write" className="flex flex-1 flex-col overflow-hidden">
                <div className="border-b border-border/50 px-4">
                  <TabsList className="h-9">
                    <TabsTrigger value="write" className="gap-1.5 text-xs">
                      <Pencil className="h-3 w-3" /> Write
                    </TabsTrigger>
                    <TabsTrigger value="ai" className="gap-1.5 text-xs">
                      <Sparkles className="h-3 w-3" /> AI Assistant
                    </TabsTrigger>
                  </TabsList>
                </div>

                {/* Write Tab */}
                <TabsContent value="write" className="flex-1 overflow-y-auto p-4">
                  <div className="mx-auto max-w-2xl space-y-4">
                    <div>
                      <Label className="text-xs font-medium">Title</Label>
                      <Input value={formTitle} onChange={(e) => setFormTitle(e.target.value)} placeholder="Article title…" className="mt-1" />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <Label className="text-xs font-medium">Category</Label>
                        <select
                          value={formCategory}
                          onChange={(e) => setFormCategory(e.target.value)}
                          className="mt-1 flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                        >
                          <option value="">Select category…</option>
                          {CATEGORIES.filter((c) => c !== "All").map((c) => (
                            <option key={c} value={c}>{c}</option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <Label className="text-xs font-medium">Tags (comma separated)</Label>
                        <Input value={formTags} onChange={(e) => setFormTags(e.target.value)} placeholder="safari, booking" className="mt-1" />
                      </div>
                    </div>
                    <div>
                      <div className="flex items-center justify-between">
                        <Label className="text-xs font-medium">Content</Label>
                        <span className="text-[10px] text-muted-foreground">{wordCount(formContent)} words</span>
                      </div>
                      <Textarea
                        value={formContent}
                        onChange={(e) => setFormContent(e.target.value)}
                        placeholder="Write your article content here…"
                        className="mt-1 min-h-[300px] font-mono text-sm"
                        rows={16}
                      />
                    </div>
                  </div>
                </TabsContent>

                {/* AI Assistant Tab */}
                <TabsContent value="ai" className="flex-1 overflow-y-auto p-4">
                  <div className="mx-auto max-w-2xl space-y-6">
                    {/* Generate */}
                    <Card className="border-border/50">
                      <CardHeader className="pb-2">
                        <CardTitle className="flex items-center gap-2 text-sm">
                          <Wand2 className="h-4 w-4 text-primary" /> Generate Article
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        <p className="text-xs text-muted-foreground">
                          Describe a topic and the AI will generate a complete article with title, content, category, and tags.
                        </p>
                        <Textarea
                          value={aiPrompt}
                          onChange={(e) => setAiPrompt(e.target.value)}
                          placeholder="e.g. Write an article about our cancellation and refund policy…"
                          rows={3}
                          className="text-sm"
                        />
                        <Button size="sm" onClick={handleGenerate} disabled={aiLoading} className="gap-1.5">
                          {aiLoading ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Sparkles className="h-3.5 w-3.5" />}
                          Generate
                        </Button>
                      </CardContent>
                    </Card>

                    {/* Improve */}
                    <Card className="border-border/50">
                      <CardHeader className="pb-2">
                        <CardTitle className="flex items-center gap-2 text-sm">
                          <Pencil className="h-4 w-4 text-primary" /> Improve Content
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        <p className="text-xs text-muted-foreground">
                          Enhance your current article with better structure, more detail, and professional tone.
                        </p>
                        <Button size="sm" variant="secondary" onClick={handleImprove} disabled={aiLoading || !formContent.trim()} className="gap-1.5">
                          {aiLoading ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Wand2 className="h-3.5 w-3.5" />}
                          Improve Current Content
                        </Button>
                      </CardContent>
                    </Card>

                    {/* Suggest Topics */}
                    <Card className="border-border/50">
                      <CardHeader className="pb-2">
                        <CardTitle className="flex items-center gap-2 text-sm">
                          <Lightbulb className="h-4 w-4 text-primary" /> Suggest Topics
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        <p className="text-xs text-muted-foreground">
                          AI analyzes your existing articles and suggests missing topics your business should cover.
                        </p>
                        <Button size="sm" variant="secondary" onClick={handleSuggestTopics} disabled={aiLoading} className="gap-1.5">
                          {aiLoading ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Lightbulb className="h-3.5 w-3.5" />}
                          Get Suggestions
                        </Button>

                        {suggestions.length > 0 && (
                          <div className="mt-3 space-y-2">
                            <p className="text-xs font-medium text-foreground">Suggested topics:</p>
                            {suggestions.map((s, i) => (
                              <div
                                key={i}
                                className="flex items-start justify-between gap-2 rounded-lg border border-border/50 p-3"
                              >
                                <div className="min-w-0 flex-1">
                                  <p className="text-sm font-medium text-foreground">{s.title}</p>
                                  <p className="mt-0.5 text-xs text-muted-foreground">{s.description}</p>
                                  <div className="mt-1.5 flex gap-1.5">
                                    <Badge variant="secondary" className="text-[10px]">{s.category}</Badge>
                                    <Badge
                                      variant="outline"
                                      className={`text-[10px] ${
                                        s.priority === "high"
                                          ? "border-destructive/50 text-destructive"
                                          : s.priority === "medium"
                                          ? "border-primary/50 text-primary"
                                          : ""
                                      }`}
                                    >
                                      {s.priority}
                                    </Badge>
                                  </div>
                                </div>
                                <Button size="sm" variant="ghost" className="h-7 shrink-0 text-xs" onClick={() => useSuggestion(s)}>
                                  Use
                                </Button>
                              </div>
                            ))}
                          </div>
                        )}
                      </CardContent>
                    </Card>

                    {/* Upload Document */}
                    <Card className="border-border/50">
                      <CardHeader className="pb-2">
                        <CardTitle className="flex items-center gap-2 text-sm">
                          <Upload className="h-4 w-4 text-primary" /> Upload Document
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        <p className="text-xs text-muted-foreground">
                          Upload a .txt or .md file. The AI will process it into a structured KB article, only cleaning up when necessary.
                        </p>
                        <Input
                          type="file"
                          accept=".txt,.md"
                          onChange={handleDocumentUpload}
                          disabled={docUploading || aiLoading}
                        />
                        {docUploading && (
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <Loader2 className="h-3.5 w-3.5 animate-spin" /> Processing document…
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  </div>
                </TabsContent>
              </Tabs>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Empty state when no editor open on large screens */}
        {!editorOpen && (
          <div className="hidden flex-1 items-center justify-center lg:flex">
            <div className="text-center">
              <BookOpen className="mx-auto h-12 w-12 text-muted-foreground/30" />
              <p className="mt-3 text-sm text-muted-foreground">Select an article to edit or create a new one</p>
            </div>
          </div>
        )}
      </div>

      {/* Delete Confirmation */}
      <AlertDialog open={!!deleteTarget} onOpenChange={(open) => !open && setDeleteTarget(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Article</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete "{deleteTarget?.title}"? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </motion.div>
  );
}
