import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { knowledgeBaseService, type KBArticle } from "@/services/knowledgeBaseService";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { motion } from "framer-motion";
import { BookOpen, Plus, Pencil, Trash2, Search } from "lucide-react";

export default function AdminKnowledgeBase() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [search, setSearch] = useState("");
  const [editOpen, setEditOpen] = useState(false);
  const [editing, setEditing] = useState<KBArticle | null>(null);
  const [saving, setSaving] = useState(false);

  const { data: articles = [], isLoading } = useQuery({
    queryKey: ["knowledge-base"],
    queryFn: () => knowledgeBaseService.getAll(),
  });

  const filtered = articles.filter(
    (a) =>
      a.title.toLowerCase().includes(search.toLowerCase()) ||
      a.category?.toLowerCase().includes(search.toLowerCase()) ||
      a.content.toLowerCase().includes(search.toLowerCase()),
  );

  const handleSave = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSaving(true);
    const fd = new FormData(e.currentTarget);
    const payload = {
      title: fd.get("title") as string,
      content: fd.get("content") as string,
      category: (fd.get("category") as string) || undefined,
      tags: (fd.get("tags") as string)?.split(",").map((t) => t.trim()).filter(Boolean) || [],
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
      setEditOpen(false);
      setEditing(null);
    } catch (err: any) {
      toast({ title: "Error", description: err.message, variant: "destructive" });
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await knowledgeBaseService.remove(id);
      queryClient.invalidateQueries({ queryKey: ["knowledge-base"] });
      toast({ title: "Deleted" });
    } catch (err: any) {
      toast({ title: "Error", description: err.message, variant: "destructive" });
    }
  };

  const openNew = () => { setEditing(null); setEditOpen(true); };
  const openEdit = (a: KBArticle) => { setEditing(a); setEditOpen(true); };

  return (
    <motion.div className="space-y-6" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <BookOpen className="h-5 w-5 text-primary" />
          <span className="font-display text-lg font-semibold text-foreground">Knowledge Base</span>
        </div>
        <Dialog open={editOpen} onOpenChange={setEditOpen}>
          <DialogTrigger asChild>
            <Button size="sm" className="gap-1.5" onClick={openNew}><Plus className="h-4 w-4" /> Add Article</Button>
          </DialogTrigger>
          <DialogContent className="max-w-lg">
            <DialogHeader><DialogTitle>{editing ? "Edit Article" : "New Article"}</DialogTitle></DialogHeader>
            <form onSubmit={handleSave} className="space-y-4">
              <div><Label>Title</Label><Input name="title" required defaultValue={editing?.title || ""} /></div>
              <div><Label>Category</Label><Input name="category" placeholder="e.g. FAQ, Destinations" defaultValue={editing?.category || ""} /></div>
              <div><Label>Tags (comma separated)</Label><Input name="tags" placeholder="safari, booking" defaultValue={editing?.tags.join(", ") || ""} /></div>
              <div><Label>Content</Label><Textarea name="content" required rows={8} defaultValue={editing?.content || ""} /></div>
              <Button type="submit" className="w-full" disabled={saving}>{saving ? "Saving…" : "Save"}</Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input className="pl-9" placeholder="Search articles…" value={search} onChange={(e) => setSearch(e.target.value)} />
      </div>

      {isLoading ? (
        <p className="py-10 text-center text-muted-foreground">Loading…</p>
      ) : filtered.length === 0 ? (
        <p className="py-10 text-center text-muted-foreground">No articles found.</p>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((a) => (
            <Card key={a.id} className="border-border/50">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm">{a.title}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <p className="text-xs text-muted-foreground line-clamp-3">{a.content}</p>
                <div className="flex flex-wrap gap-1">
                  {a.category && <Badge variant="secondary" className="text-[10px]">{a.category}</Badge>}
                  {a.tags.map((t) => <Badge key={t} variant="outline" className="text-[10px]">{t}</Badge>)}
                </div>
                <div className="flex gap-1 pt-1">
                  <Button variant="ghost" size="sm" className="h-7 text-xs" onClick={() => openEdit(a)}><Pencil className="mr-1 h-3 w-3" /> Edit</Button>
                  <Button variant="ghost" size="sm" className="h-7 text-xs text-destructive" onClick={() => handleDelete(a.id)}><Trash2 className="mr-1 h-3 w-3" /> Delete</Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </motion.div>
  );
}
