-- Replace the is_public-gated policy with one that explicitly blocks
-- only the sensitive AI API key rows. Everything else (hero_media,
-- social_links, contact_info, etc.) becomes publicly readable without
-- needing the is_public column to be set manually.

DROP POLICY IF EXISTS "Public read public site_settings" ON public.site_settings;

CREATE POLICY "Public read site_settings"
  ON public.site_settings FOR SELECT
  USING (key NOT IN ('ai_claude_key', 'ai_gemini_key'));

-- Also ensure contact_info has is_public=true for any remaining checks
UPDATE public.site_settings
  SET is_public = true
  WHERE key NOT IN ('ai_claude_key', 'ai_gemini_key');

-- Insert default contact_info if it doesn't exist yet
INSERT INTO public.site_settings (key, value, is_public)
VALUES (
  'contact_info',
  '{"name":"African Tembo Safaris","email":"info@africantembo.com","phone":"+255 123 456 789","address":"Serengeti Road, Arusha\nTanzania, East Africa","officeHours":"Monday \u2013 Friday: 8:00 AM \u2013 6:00 PM (EAT)\nSaturday: 9:00 AM \u2013 1:00 PM\nSunday: Closed"}'::jsonb,
  true
)
ON CONFLICT (key) DO UPDATE SET is_public = true;
