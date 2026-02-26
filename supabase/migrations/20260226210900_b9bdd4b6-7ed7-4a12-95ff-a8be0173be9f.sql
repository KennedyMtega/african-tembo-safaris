
-- Create destination-images storage bucket
INSERT INTO storage.buckets (id, name, public)
VALUES ('destination-images', 'destination-images', true)
ON CONFLICT (id) DO NOTHING;

-- Public read on destination-images
CREATE POLICY "Public read destination images"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'destination-images');

-- Admin upload destination images
CREATE POLICY "Admin uploads destination images"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'destination-images'
  AND public.has_role(auth.uid(), 'admin'::app_role)
);

-- Management upload destination images
CREATE POLICY "Management uploads destination images"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'destination-images'
  AND public.has_role(auth.uid(), 'management'::app_role)
);

-- Admin update/delete on destination-images
CREATE POLICY "Admin updates destination images"
ON storage.objects FOR UPDATE
TO authenticated
USING (bucket_id = 'destination-images' AND public.has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admin deletes destination images"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'destination-images' AND public.has_role(auth.uid(), 'admin'::app_role));

-- DESTINATIONS: split ALL into granular
DROP POLICY IF EXISTS "Admin manages destinations" ON public.destinations;
CREATE POLICY "Admin select destinations" ON public.destinations FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Management select destinations" ON public.destinations FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'management'::app_role));
CREATE POLICY "Admin insert destinations" ON public.destinations FOR INSERT TO authenticated WITH CHECK (public.has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Management insert destinations" ON public.destinations FOR INSERT TO authenticated WITH CHECK (public.has_role(auth.uid(), 'management'::app_role));
CREATE POLICY "Admin update destinations" ON public.destinations FOR UPDATE TO authenticated USING (public.has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Management update destinations" ON public.destinations FOR UPDATE TO authenticated USING (public.has_role(auth.uid(), 'management'::app_role));
CREATE POLICY "Admin delete destinations" ON public.destinations FOR DELETE TO authenticated USING (public.has_role(auth.uid(), 'admin'::app_role));

-- PACKAGES: split ALL
DROP POLICY IF EXISTS "Admin manages packages" ON public.packages;
CREATE POLICY "Admin select packages" ON public.packages FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Management select packages" ON public.packages FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'management'::app_role));
CREATE POLICY "Admin insert packages" ON public.packages FOR INSERT TO authenticated WITH CHECK (public.has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Management insert packages" ON public.packages FOR INSERT TO authenticated WITH CHECK (public.has_role(auth.uid(), 'management'::app_role));
CREATE POLICY "Admin update packages" ON public.packages FOR UPDATE TO authenticated USING (public.has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Management update packages" ON public.packages FOR UPDATE TO authenticated USING (public.has_role(auth.uid(), 'management'::app_role));
CREATE POLICY "Admin delete packages" ON public.packages FOR DELETE TO authenticated USING (public.has_role(auth.uid(), 'admin'::app_role));

-- BOOKINGS: split ALL
DROP POLICY IF EXISTS "Admin manages bookings" ON public.bookings;
CREATE POLICY "Admin select bookings" ON public.bookings FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Management select bookings" ON public.bookings FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'management'::app_role));
CREATE POLICY "Admin insert bookings" ON public.bookings FOR INSERT TO authenticated WITH CHECK (public.has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Management insert bookings" ON public.bookings FOR INSERT TO authenticated WITH CHECK (public.has_role(auth.uid(), 'management'::app_role));
CREATE POLICY "Admin update bookings" ON public.bookings FOR UPDATE TO authenticated USING (public.has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Management update bookings" ON public.bookings FOR UPDATE TO authenticated USING (public.has_role(auth.uid(), 'management'::app_role));
CREATE POLICY "Admin delete bookings" ON public.bookings FOR DELETE TO authenticated USING (public.has_role(auth.uid(), 'admin'::app_role));

-- REVIEWS: split ALL
DROP POLICY IF EXISTS "Admin manages reviews" ON public.reviews;
CREATE POLICY "Admin select reviews" ON public.reviews FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Management select reviews" ON public.reviews FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'management'::app_role));
CREATE POLICY "Admin insert reviews" ON public.reviews FOR INSERT TO authenticated WITH CHECK (public.has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Management insert reviews" ON public.reviews FOR INSERT TO authenticated WITH CHECK (public.has_role(auth.uid(), 'management'::app_role));
CREATE POLICY "Admin update reviews" ON public.reviews FOR UPDATE TO authenticated USING (public.has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Management update reviews" ON public.reviews FOR UPDATE TO authenticated USING (public.has_role(auth.uid(), 'management'::app_role));
CREATE POLICY "Admin delete reviews" ON public.reviews FOR DELETE TO authenticated USING (public.has_role(auth.uid(), 'admin'::app_role));

-- INQUIRIES: split ALL
DROP POLICY IF EXISTS "Admin manages inquiries" ON public.inquiries;
CREATE POLICY "Admin select inquiries" ON public.inquiries FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Management select inquiries" ON public.inquiries FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'management'::app_role));
CREATE POLICY "Admin insert inquiries" ON public.inquiries FOR INSERT TO authenticated WITH CHECK (public.has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Management insert inquiries" ON public.inquiries FOR INSERT TO authenticated WITH CHECK (public.has_role(auth.uid(), 'management'::app_role));
CREATE POLICY "Admin update inquiries" ON public.inquiries FOR UPDATE TO authenticated USING (public.has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Management update inquiries" ON public.inquiries FOR UPDATE TO authenticated USING (public.has_role(auth.uid(), 'management'::app_role));
CREATE POLICY "Admin delete inquiries" ON public.inquiries FOR DELETE TO authenticated USING (public.has_role(auth.uid(), 'admin'::app_role));

-- BOOKING_TRAVELERS: split ALL
DROP POLICY IF EXISTS "Admin manages travelers" ON public.booking_travelers;
CREATE POLICY "Admin select travelers" ON public.booking_travelers FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Management select travelers" ON public.booking_travelers FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'management'::app_role));
CREATE POLICY "Admin insert travelers" ON public.booking_travelers FOR INSERT TO authenticated WITH CHECK (public.has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Management insert travelers" ON public.booking_travelers FOR INSERT TO authenticated WITH CHECK (public.has_role(auth.uid(), 'management'::app_role));
CREATE POLICY "Admin update travelers" ON public.booking_travelers FOR UPDATE TO authenticated USING (public.has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Management update travelers" ON public.booking_travelers FOR UPDATE TO authenticated USING (public.has_role(auth.uid(), 'management'::app_role));
CREATE POLICY "Admin delete travelers" ON public.booking_travelers FOR DELETE TO authenticated USING (public.has_role(auth.uid(), 'admin'::app_role));

-- PACKAGE_ITINERARY: split ALL
DROP POLICY IF EXISTS "Admin manages itinerary" ON public.package_itinerary;
CREATE POLICY "Admin select itinerary" ON public.package_itinerary FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Management select itinerary" ON public.package_itinerary FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'management'::app_role));
CREATE POLICY "Admin insert itinerary" ON public.package_itinerary FOR INSERT TO authenticated WITH CHECK (public.has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Management insert itinerary" ON public.package_itinerary FOR INSERT TO authenticated WITH CHECK (public.has_role(auth.uid(), 'management'::app_role));
CREATE POLICY "Admin update itinerary" ON public.package_itinerary FOR UPDATE TO authenticated USING (public.has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Management update itinerary" ON public.package_itinerary FOR UPDATE TO authenticated USING (public.has_role(auth.uid(), 'management'::app_role));
CREATE POLICY "Admin delete itinerary" ON public.package_itinerary FOR DELETE TO authenticated USING (public.has_role(auth.uid(), 'admin'::app_role));

-- PAYMENTS: split ALL
DROP POLICY IF EXISTS "Admin manages payments" ON public.payments;
CREATE POLICY "Admin select payments" ON public.payments FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Management select payments" ON public.payments FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'management'::app_role));
CREATE POLICY "Admin insert payments" ON public.payments FOR INSERT TO authenticated WITH CHECK (public.has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Admin update payments" ON public.payments FOR UPDATE TO authenticated USING (public.has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Admin delete payments" ON public.payments FOR DELETE TO authenticated USING (public.has_role(auth.uid(), 'admin'::app_role));

-- ACTIVITY_LOG: management read
CREATE POLICY "Management reads activity log" ON public.activity_log FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'management'::app_role));

-- PROFILES: management read all
CREATE POLICY "Management reads all profiles" ON public.profiles FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'management'::app_role));

-- NOTIFICATIONS: management insert
CREATE POLICY "Management inserts notifications" ON public.notifications FOR INSERT TO authenticated WITH CHECK (public.has_role(auth.uid(), 'management'::app_role));
