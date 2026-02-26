
-- Fix permissive INSERT on inquiries: require authenticated
DROP POLICY "Authenticated insert inquiries" ON public.inquiries;
CREATE POLICY "Authenticated insert inquiries" ON public.inquiries FOR INSERT TO authenticated WITH CHECK (auth.uid() = COALESCE(user_id, auth.uid()));

-- Fix permissive INSERT on notifications: only admin or system can insert
DROP POLICY "System inserts notifications" ON public.notifications;
CREATE POLICY "Admin inserts notifications" ON public.notifications FOR INSERT WITH CHECK (public.has_role(auth.uid(), 'admin'));
