
-- Fix 1: Recreate profiles admin/management policies with TO authenticated
DROP POLICY IF EXISTS "Admin reads all profiles" ON public.profiles;
DROP POLICY IF EXISTS "Management reads all profiles" ON public.profiles;

CREATE POLICY "Admin reads all profiles"
  ON public.profiles FOR SELECT TO authenticated
  USING (public.has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Management reads all profiles"
  ON public.profiles FOR SELECT TO authenticated
  USING (public.has_role(auth.uid(), 'management'::app_role));

-- Fix 2: Tighten booking_travelers user access
DROP POLICY IF EXISTS "Users read own travelers" ON public.booking_travelers;

CREATE POLICY "Users read own travelers"
  ON public.booking_travelers FOR SELECT TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM bookings b
      WHERE b.id = booking_travelers.booking_id
        AND b.user_id = auth.uid()
    )
    AND (
      email = (SELECT p.email FROM profiles p WHERE p.id = auth.uid())
      OR public.has_role(auth.uid(), 'admin'::app_role)
      OR public.has_role(auth.uid(), 'management'::app_role)
    )
  );
