
-- site_settings table
CREATE TABLE public.site_settings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  key text UNIQUE NOT NULL,
  value jsonb NOT NULL DEFAULT '{}'::jsonb,
  updated_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read site_settings" ON public.site_settings FOR SELECT USING (true);
CREATE POLICY "Admin manage site_settings" ON public.site_settings FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- gallery_items table
CREATE TABLE public.gallery_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text,
  type text NOT NULL CHECK (type IN ('image', 'video')),
  url text NOT NULL,
  thumbnail_url text,
  sort_order integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.gallery_items ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read gallery" ON public.gallery_items FOR SELECT USING (true);
CREATE POLICY "Admin manage gallery" ON public.gallery_items FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Management insert gallery" ON public.gallery_items FOR INSERT TO authenticated WITH CHECK (public.has_role(auth.uid(), 'management'));
CREATE POLICY "Management update gallery" ON public.gallery_items FOR UPDATE TO authenticated USING (public.has_role(auth.uid(), 'management'));
CREATE POLICY "Management select gallery" ON public.gallery_items FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'management'));

-- knowledge_base table
CREATE TABLE public.knowledge_base (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  content text NOT NULL,
  category text,
  tags text[] DEFAULT '{}'::text[],
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.knowledge_base ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read knowledge_base" ON public.knowledge_base FOR SELECT USING (true);
CREATE POLICY "Admin manage knowledge_base" ON public.knowledge_base FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Management crud knowledge_base" ON public.knowledge_base FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'management')) WITH CHECK (public.has_role(auth.uid(), 'management'));

-- chat_conversations table
CREATE TABLE public.chat_conversations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid,
  visitor_name text,
  visitor_email text,
  created_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.chat_conversations ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public insert chat_conversations" ON public.chat_conversations FOR INSERT WITH CHECK (true);
CREATE POLICY "Users read own conversations" ON public.chat_conversations FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Admin read all conversations" ON public.chat_conversations FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Management read all conversations" ON public.chat_conversations FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'management'));

-- chat_messages table
CREATE TABLE public.chat_messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation_id uuid NOT NULL REFERENCES public.chat_conversations(id) ON DELETE CASCADE,
  role text NOT NULL CHECK (role IN ('user', 'assistant')),
  content text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.chat_messages ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public insert chat_messages" ON public.chat_messages FOR INSERT WITH CHECK (true);
CREATE POLICY "Public read own chat_messages" ON public.chat_messages FOR SELECT USING (true);
CREATE POLICY "Admin read all chat_messages" ON public.chat_messages FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'admin'));

-- crm_contacts table
CREATE TABLE public.crm_contacts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid,
  name text NOT NULL,
  email text NOT NULL,
  phone text,
  source text NOT NULL DEFAULT 'manual' CHECK (source IN ('chat', 'inquiry', 'booking', 'manual')),
  status text NOT NULL DEFAULT 'lead' CHECK (status IN ('lead', 'prospect', 'customer', 'inactive')),
  notes text,
  tags text[] DEFAULT '{}'::text[],
  last_interaction timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.crm_contacts ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admin manage crm_contacts" ON public.crm_contacts FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Management select crm_contacts" ON public.crm_contacts FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'management'));
CREATE POLICY "Management insert crm_contacts" ON public.crm_contacts FOR INSERT TO authenticated WITH CHECK (public.has_role(auth.uid(), 'management'));
CREATE POLICY "Management update crm_contacts" ON public.crm_contacts FOR UPDATE TO authenticated USING (public.has_role(auth.uid(), 'management'));

-- crm_interactions table
CREATE TABLE public.crm_interactions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  contact_id uuid NOT NULL REFERENCES public.crm_contacts(id) ON DELETE CASCADE,
  type text NOT NULL DEFAULT 'note' CHECK (type IN ('chat', 'inquiry', 'booking', 'note', 'email')),
  summary text,
  created_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.crm_interactions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admin manage crm_interactions" ON public.crm_interactions FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Management select crm_interactions" ON public.crm_interactions FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'management'));
CREATE POLICY "Management insert crm_interactions" ON public.crm_interactions FOR INSERT TO authenticated WITH CHECK (public.has_role(auth.uid(), 'management'));

-- site-media storage bucket
INSERT INTO storage.buckets (id, name, public) VALUES ('site-media', 'site-media', true);

-- Storage policies for site-media
CREATE POLICY "Public read site-media" ON storage.objects FOR SELECT USING (bucket_id = 'site-media');
CREATE POLICY "Admin manage site-media" ON storage.objects FOR ALL TO authenticated USING (bucket_id = 'site-media' AND public.has_role(auth.uid(), 'admin')) WITH CHECK (bucket_id = 'site-media' AND public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Management upload site-media" ON storage.objects FOR INSERT TO authenticated WITH CHECK (bucket_id = 'site-media' AND public.has_role(auth.uid(), 'management'));
