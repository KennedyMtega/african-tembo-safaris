
-- ============================================================
-- ENUMS
-- ============================================================
CREATE TYPE public.app_role AS ENUM ('admin', 'user');
CREATE TYPE public.package_status AS ENUM ('draft', 'published', 'archived');
CREATE TYPE public.booking_status AS ENUM ('pending', 'confirmed', 'completed', 'cancelled');
CREATE TYPE public.payment_status AS ENUM ('pending', 'paid', 'refunded');
CREATE TYPE public.inquiry_status AS ENUM ('new', 'in_progress', 'resolved');
CREATE TYPE public.inquiry_priority AS ENUM ('low', 'medium', 'high');
CREATE TYPE public.review_status AS ENUM ('pending', 'approved', 'rejected');
CREATE TYPE public.difficulty_level AS ENUM ('easy', 'moderate', 'challenging');

-- ============================================================
-- PROFILES
-- ============================================================
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT,
  email TEXT,
  phone TEXT,
  avatar_url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- ============================================================
-- USER ROLES
-- ============================================================
CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role public.app_role NOT NULL,
  UNIQUE (user_id, role)
);
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Security definer function
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role public.app_role)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = _user_id AND role = _role
  )
$$;

-- ============================================================
-- DESTINATIONS
-- ============================================================
CREATE TABLE public.destinations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  country TEXT NOT NULL,
  description TEXT,
  image_url TEXT,
  package_count INT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.destinations ENABLE ROW LEVEL SECURITY;

-- ============================================================
-- PACKAGES
-- ============================================================
CREATE TABLE public.packages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT,
  short_description TEXT,
  destination_id UUID REFERENCES public.destinations(id),
  duration INT NOT NULL DEFAULT 1,
  difficulty public.difficulty_level NOT NULL DEFAULT 'moderate',
  price_min NUMERIC NOT NULL DEFAULT 0,
  price_max NUMERIC NOT NULL DEFAULT 0,
  group_price_min NUMERIC,
  group_price_max NUMERIC,
  max_group_size INT NOT NULL DEFAULT 10,
  images TEXT[] DEFAULT '{}',
  highlights TEXT[] DEFAULT '{}',
  tags TEXT[] DEFAULT '{}',
  includes TEXT[] DEFAULT '{}',
  excludes TEXT[] DEFAULT '{}',
  status public.package_status NOT NULL DEFAULT 'draft',
  rating NUMERIC NOT NULL DEFAULT 0,
  review_count INT NOT NULL DEFAULT 0,
  featured BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.packages ENABLE ROW LEVEL SECURITY;

-- ============================================================
-- PACKAGE ITINERARY
-- ============================================================
CREATE TABLE public.package_itinerary (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  package_id UUID REFERENCES public.packages(id) ON DELETE CASCADE NOT NULL,
  day_number INT NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  meals TEXT[] DEFAULT '{}',
  accommodation TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.package_itinerary ENABLE ROW LEVEL SECURITY;

-- ============================================================
-- BOOKINGS
-- ============================================================
CREATE TABLE public.bookings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  booking_ref TEXT UNIQUE NOT NULL,
  package_id UUID REFERENCES public.packages(id) NOT NULL,
  user_id UUID REFERENCES auth.users(id) NOT NULL,
  status public.booking_status NOT NULL DEFAULT 'pending',
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  total_amount NUMERIC NOT NULL DEFAULT 0,
  payment_status public.payment_status NOT NULL DEFAULT 'pending',
  special_requests TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;

-- ============================================================
-- BOOKING TRAVELERS
-- ============================================================
CREATE TABLE public.booking_travelers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  booking_id UUID REFERENCES public.bookings(id) ON DELETE CASCADE NOT NULL,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  dietary_needs TEXT,
  special_needs TEXT
);
ALTER TABLE public.booking_travelers ENABLE ROW LEVEL SECURITY;

-- ============================================================
-- PAYMENTS
-- ============================================================
CREATE TABLE public.payments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  booking_id UUID REFERENCES public.bookings(id) NOT NULL,
  booking_ref TEXT,
  amount NUMERIC NOT NULL DEFAULT 0,
  currency TEXT NOT NULL DEFAULT 'USD',
  status public.payment_status NOT NULL DEFAULT 'pending',
  method TEXT,
  paid_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;

-- ============================================================
-- REVIEWS
-- ============================================================
CREATE TABLE public.reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  package_id UUID REFERENCES public.packages(id) NOT NULL,
  user_id UUID REFERENCES auth.users(id) NOT NULL,
  rating INT NOT NULL DEFAULT 5,
  title TEXT,
  text TEXT,
  status public.review_status NOT NULL DEFAULT 'pending',
  featured BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;

-- ============================================================
-- INQUIRIES
-- ============================================================
CREATE TABLE public.inquiries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id),
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  subject TEXT,
  message TEXT NOT NULL,
  status public.inquiry_status NOT NULL DEFAULT 'new',
  priority public.inquiry_priority NOT NULL DEFAULT 'medium',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  resolved_at TIMESTAMPTZ
);
ALTER TABLE public.inquiries ENABLE ROW LEVEL SECURITY;

-- ============================================================
-- ACTIVITY LOG
-- ============================================================
CREATE TABLE public.activity_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  action TEXT NOT NULL,
  description TEXT,
  user_id UUID REFERENCES auth.users(id),
  entity_id TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.activity_log ENABLE ROW LEVEL SECURITY;

-- ============================================================
-- WISHLISTS
-- ============================================================
CREATE TABLE public.wishlists (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  package_id UUID REFERENCES public.packages(id) ON DELETE CASCADE NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (user_id, package_id)
);
ALTER TABLE public.wishlists ENABLE ROW LEVEL SECURITY;

-- ============================================================
-- NOTIFICATIONS
-- ============================================================
CREATE TABLE public.notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  message TEXT,
  read BOOLEAN NOT NULL DEFAULT false,
  type TEXT,
  entity_id TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

-- ============================================================
-- STORAGE BUCKET
-- ============================================================
INSERT INTO storage.buckets (id, name, public) VALUES ('package-images', 'package-images', true);

-- ============================================================
-- RLS POLICIES
-- ============================================================

-- Profiles
CREATE POLICY "Users read own profile" ON public.profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users update own profile" ON public.profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Admin reads all profiles" ON public.profiles FOR SELECT USING (public.has_role(auth.uid(), 'admin'));

-- User roles: only admin
CREATE POLICY "Admin manages roles" ON public.user_roles FOR ALL USING (public.has_role(auth.uid(), 'admin'));

-- Destinations: public read, admin write
CREATE POLICY "Public read destinations" ON public.destinations FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "Admin manages destinations" ON public.destinations FOR ALL USING (public.has_role(auth.uid(), 'admin'));

-- Packages: public read published, admin all
CREATE POLICY "Public read published packages" ON public.packages FOR SELECT TO anon, authenticated USING (status = 'published');
CREATE POLICY "Admin manages packages" ON public.packages FOR ALL USING (public.has_role(auth.uid(), 'admin'));

-- Package itinerary: public read, admin write
CREATE POLICY "Public read itinerary" ON public.package_itinerary FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "Admin manages itinerary" ON public.package_itinerary FOR ALL USING (public.has_role(auth.uid(), 'admin'));

-- Bookings: users see own, admin sees all
CREATE POLICY "Users read own bookings" ON public.bookings FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users create bookings" ON public.bookings FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Admin manages bookings" ON public.bookings FOR ALL USING (public.has_role(auth.uid(), 'admin'));

-- Booking travelers
CREATE POLICY "Users read own travelers" ON public.booking_travelers FOR SELECT USING (
  EXISTS (SELECT 1 FROM public.bookings b WHERE b.id = booking_id AND b.user_id = auth.uid())
);
CREATE POLICY "Users insert own travelers" ON public.booking_travelers FOR INSERT WITH CHECK (
  EXISTS (SELECT 1 FROM public.bookings b WHERE b.id = booking_id AND b.user_id = auth.uid())
);
CREATE POLICY "Admin manages travelers" ON public.booking_travelers FOR ALL USING (public.has_role(auth.uid(), 'admin'));

-- Payments
CREATE POLICY "Users read own payments" ON public.payments FOR SELECT USING (
  EXISTS (SELECT 1 FROM public.bookings b WHERE b.id = booking_id AND b.user_id = auth.uid())
);
CREATE POLICY "Admin manages payments" ON public.payments FOR ALL USING (public.has_role(auth.uid(), 'admin'));

-- Reviews: public read approved, users insert own, admin manages
CREATE POLICY "Public read approved reviews" ON public.reviews FOR SELECT TO anon, authenticated USING (status = 'approved');
CREATE POLICY "Users insert own reviews" ON public.reviews FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Admin manages reviews" ON public.reviews FOR ALL USING (public.has_role(auth.uid(), 'admin'));

-- Inquiries
CREATE POLICY "Authenticated insert inquiries" ON public.inquiries FOR INSERT WITH CHECK (true);
CREATE POLICY "Users read own inquiries" ON public.inquiries FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Admin manages inquiries" ON public.inquiries FOR ALL USING (public.has_role(auth.uid(), 'admin'));

-- Activity log: admin only
CREATE POLICY "Admin reads activity log" ON public.activity_log FOR SELECT USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admin inserts activity log" ON public.activity_log FOR INSERT WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- Wishlists: users manage own
CREATE POLICY "Users manage own wishlists" ON public.wishlists FOR ALL USING (auth.uid() = user_id);

-- Notifications: users manage own
CREATE POLICY "Users read own notifications" ON public.notifications FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users update own notifications" ON public.notifications FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "System inserts notifications" ON public.notifications FOR INSERT WITH CHECK (true);

-- Storage: public read, authenticated upload
CREATE POLICY "Public read package images" ON storage.objects FOR SELECT TO anon, authenticated USING (bucket_id = 'package-images');
CREATE POLICY "Authenticated upload package images" ON storage.objects FOR INSERT TO authenticated WITH CHECK (bucket_id = 'package-images');
CREATE POLICY "Admin delete package images" ON storage.objects FOR DELETE USING (bucket_id = 'package-images' AND public.has_role(auth.uid(), 'admin'));

-- ============================================================
-- TRIGGERS
-- ============================================================

-- Auto-create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, email)
  VALUES (NEW.id, COALESCE(NEW.raw_user_meta_data->>'full_name', ''), NEW.email);
  
  INSERT INTO public.user_roles (user_id, role)
  VALUES (NEW.id, 'user');
  
  RETURN NEW;
END;
$$;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Update package counts on destination when packages change
CREATE OR REPLACE FUNCTION public.update_destination_package_count()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF TG_OP = 'DELETE' OR TG_OP = 'UPDATE' THEN
    UPDATE public.destinations SET package_count = (
      SELECT COUNT(*) FROM public.packages WHERE destination_id = OLD.destination_id AND status = 'published'
    ) WHERE id = OLD.destination_id;
  END IF;
  IF TG_OP = 'INSERT' OR TG_OP = 'UPDATE' THEN
    UPDATE public.destinations SET package_count = (
      SELECT COUNT(*) FROM public.packages WHERE destination_id = NEW.destination_id AND status = 'published'
    ) WHERE id = NEW.destination_id;
  END IF;
  RETURN COALESCE(NEW, OLD);
END;
$$;

CREATE TRIGGER on_package_change
  AFTER INSERT OR UPDATE OR DELETE ON public.packages
  FOR EACH ROW EXECUTE FUNCTION public.update_destination_package_count();

-- Update review stats on packages
CREATE OR REPLACE FUNCTION public.update_package_review_stats()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  pkg_id UUID;
BEGIN
  pkg_id := COALESCE(NEW.package_id, OLD.package_id);
  UPDATE public.packages SET
    review_count = (SELECT COUNT(*) FROM public.reviews WHERE package_id = pkg_id AND status = 'approved'),
    rating = COALESCE((SELECT AVG(rating)::NUMERIC(3,1) FROM public.reviews WHERE package_id = pkg_id AND status = 'approved'), 0)
  WHERE id = pkg_id;
  RETURN COALESCE(NEW, OLD);
END;
$$;

CREATE TRIGGER on_review_change
  AFTER INSERT OR UPDATE OR DELETE ON public.reviews
  FOR EACH ROW EXECUTE FUNCTION public.update_package_review_stats();
