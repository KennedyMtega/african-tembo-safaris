-- Mark contact_info as publicly readable so the footer and Contact page
-- can fetch it for anonymous (non-authenticated) visitors.
UPDATE public.site_settings
  SET is_public = true
  WHERE key = 'contact_info';

-- Also insert a default row if it doesn't exist yet so new installs
-- don't show null until an admin saves for the first time.
INSERT INTO public.site_settings (key, value, is_public)
VALUES (
  'contact_info',
  '{"name":"African Tembo Safaris","email":"info@africantembo.com","phone":"+255 123 456 789","address":"Serengeti Road, Arusha\nTanzania, East Africa","officeHours":"Monday \u2013 Friday: 8:00 AM \u2013 6:00 PM (EAT)\nSaturday: 9:00 AM \u2013 1:00 PM\nSunday: Closed"}'::jsonb,
  true
)
ON CONFLICT (key) DO UPDATE SET is_public = true;
