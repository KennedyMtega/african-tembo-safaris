
-- 1) Add is_public column to site_settings (default false = restricted)
ALTER TABLE public.site_settings ADD COLUMN IF NOT EXISTS is_public boolean NOT NULL DEFAULT false;

-- Mark public settings
UPDATE public.site_settings SET is_public = true WHERE key IN ('hero_media', 'social_links');

-- 2) Drop the overly permissive public read policy
DROP POLICY IF EXISTS "Public read site_settings" ON public.site_settings;

-- 3) Create scoped public read (only public settings)
CREATE POLICY "Public read public site_settings"
  ON public.site_settings FOR SELECT
  USING (is_public = true);

-- 4) Management can read all settings
CREATE POLICY "Management reads site_settings"
  ON public.site_settings FOR SELECT TO authenticated
  USING (public.has_role(auth.uid(), 'management'::app_role));

-- 5) Fix chat_messages: drop the overly permissive policy
DROP POLICY IF EXISTS "Public read own chat_messages" ON public.chat_messages;

-- 6) Scoped chat_messages policies
CREATE POLICY "Users read own chat_messages"
  ON public.chat_messages FOR SELECT TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.chat_conversations c
      WHERE c.id = chat_messages.conversation_id AND c.user_id = auth.uid()
    )
  );

CREATE POLICY "Management reads all chat_messages"
  ON public.chat_messages FOR SELECT TO authenticated
  USING (public.has_role(auth.uid(), 'management'::app_role));
