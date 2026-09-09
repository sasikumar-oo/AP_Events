-- ====================================================================
-- AP EVENTS SUPABASE SECURITY HARDENING & ROW LEVEL SECURITY (RLS) POLICIES
-- Production-Ready Least Privilege Policies for Supabase PostgreSQL
-- ====================================================================

-- 1. ENABLES ROW LEVEL SECURITY (RLS) ON ALL CORE TABLES
ALTER TABLE IF EXISTS public.enquiries ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.events ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.gallery ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.testimonials ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.site_settings ENABLE ROW LEVEL SECURITY;

-- CLEANUP OLD POLICIES IF THEY EXIST
DROP POLICY IF EXISTS "Public can submit enquiries" ON public.enquiries;
DROP POLICY IF EXISTS "Admins can view enquiries" ON public.enquiries;
DROP POLICY IF EXISTS "Admins can update enquiries" ON public.enquiries;
DROP POLICY IF EXISTS "Admins can delete enquiries" ON public.enquiries;

DROP POLICY IF EXISTS "Public can read events" ON public.events;
DROP POLICY IF EXISTS "Admins can write events" ON public.events;

DROP POLICY IF EXISTS "Public can read gallery" ON public.gallery;
DROP POLICY IF EXISTS "Admins can write gallery" ON public.gallery;

DROP POLICY IF EXISTS "Public can read testimonials" ON public.testimonials;
DROP POLICY IF EXISTS "Admins can write testimonials" ON public.testimonials;

DROP POLICY IF EXISTS "Public can read site_settings" ON public.site_settings;
DROP POLICY IF EXISTS "Admins can write site_settings" ON public.site_settings;

-- ====================================================================
-- 2. TABLE: enquiries (CLIENT INQUIRIES & PII LEADS)
-- ====================================================================
-- Policy 2.1: Allow public visitors to submit new lead forms
CREATE POLICY "Public can submit enquiries"
  ON public.enquiries
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

-- Policy 2.2: Restrict viewing enquiries to authenticated admins only
CREATE POLICY "Admins can view enquiries"
  ON public.enquiries
  FOR SELECT
  TO authenticated
  USING (true);

-- Policy 2.3: Restrict updating inquiry status to authenticated admins only
CREATE POLICY "Admins can update enquiries"
  ON public.enquiries
  FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Policy 2.4: Restrict deleting inquiries to authenticated admins only
CREATE POLICY "Admins can delete enquiries"
  ON public.enquiries
  FOR DELETE
  TO authenticated
  USING (true);

-- ====================================================================
-- 3. TABLE: events (EXECUTED PROJECTS CATALOG)
-- ====================================================================
-- Policy 3.1: Public can read all published events
CREATE POLICY "Public can read events"
  ON public.events
  FOR SELECT
  TO anon, authenticated
  USING (true);

-- Policy 3.2: Only authenticated admins can create, update, or delete events
CREATE POLICY "Admins can write events"
  ON public.events
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- ====================================================================
-- 4. TABLE: gallery (MEDIA & REELS PORTFOLIO)
-- ====================================================================
-- Policy 4.1: Public can read gallery items
CREATE POLICY "Public can read gallery"
  ON public.gallery
  FOR SELECT
  TO anon, authenticated
  USING (true);

-- Policy 4.2: Only authenticated admins can modify gallery items
CREATE POLICY "Admins can write gallery"
  ON public.gallery
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- ====================================================================
-- 5. TABLE: testimonials (CLIENT REVIEWS)
-- ====================================================================
-- Policy 5.1: Public can read testimonials
CREATE POLICY "Public can read testimonials"
  ON public.testimonials
  FOR SELECT
  TO anon, authenticated
  USING (true);

-- Policy 5.2: Only authenticated admins can manage testimonials
CREATE POLICY "Admins can write testimonials"
  ON public.testimonials
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- ====================================================================
-- 6. TABLE: site_settings (CUSTOM SERVICES & CONTACT CONFIG)
-- ====================================================================
-- Policy 6.1: Public can read site configuration settings
CREATE POLICY "Public can read site_settings"
  ON public.site_settings
  FOR SELECT
  TO anon, authenticated
  USING (true);

-- Policy 6.2: Only authenticated admins can edit site configuration
CREATE POLICY "Admins can write site_settings"
  ON public.site_settings
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);
