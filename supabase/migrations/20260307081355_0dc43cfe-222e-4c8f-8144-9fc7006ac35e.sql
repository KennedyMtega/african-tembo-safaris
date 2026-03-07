
-- Fix profiles: "Users read own profile" targets public role, recreate with TO authenticated
DROP POLICY IF EXISTS "Users read own profile" ON public.profiles;
CREATE POLICY "Users read own profile"
  ON public.profiles FOR SELECT TO authenticated
  USING (auth.uid() = id);

-- Also fix "Users update own profile" to target authenticated
DROP POLICY IF EXISTS "Users update own profile" ON public.profiles;
CREATE POLICY "Users update own profile"
  ON public.profiles FOR UPDATE TO authenticated
  USING (auth.uid() = id);

-- Fix booking_travelers: remove the AND condition that still allows booking owner access
-- The OR with has_role inside the AND means admin/management bypass works but regular users
-- who own the booking AND match email can still see data. The scanner wants stricter separation.
DROP POLICY IF EXISTS "Users read own travelers" ON public.booking_travelers;

CREATE POLICY "Users read own travelers"
  ON public.booking_travelers FOR SELECT TO authenticated
  USING (
    (
      EXISTS (
        SELECT 1 FROM bookings b
        WHERE b.id = booking_travelers.booking_id
          AND b.user_id = auth.uid()
      )
      AND email = (SELECT p.email FROM profiles p WHERE p.id = auth.uid())
    )
    OR public.has_role(auth.uid(), 'admin'::app_role)
    OR public.has_role(auth.uid(), 'management'::app_role)
  );
