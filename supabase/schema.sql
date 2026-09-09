-- ====================================================================
-- Complete Supabase PostgreSQL Database Schema & Hardened RLS Policies for AP Events
-- ====================================================================

-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- ========================================================
-- 1. TABLES DEFINITION
-- ========================================================

-- 1.1 Events Table
create table if not exists public.events (
    id uuid default gen_random_uuid() primary key,
    title text not null,
    slug text not null unique,
    description text,
    category text not null,
    date date not null,
    location text not null,
    image_url text,
    published boolean default true,
    created_at timestamptz default now()
);

-- 1.2 Gallery Table
create table if not exists public.gallery (
    id uuid default gen_random_uuid() primary key,
    title text,
    media_type text not null check (media_type in ('image', 'video', 'youtube', 'instagram')),
    media_url text not null,
    category text not null,
    created_at timestamptz default now()
);

-- 1.3 Testimonials Table
create table if not exists public.testimonials (
    id uuid default gen_random_uuid() primary key,
    client_name text not null,
    review text not null,
    rating integer default 5 check (rating >= 1 and rating <= 5),
    created_at timestamptz default now()
);

-- 1.4 Enquiries Table (Client Leads)
create table if not exists public.enquiries (
    id uuid default gen_random_uuid() primary key,
    name text not null,
    phone text not null,
    event_type text not null,
    event_date date,
    message text,
    contacted boolean default false,
    created_at timestamptz default now()
);

-- 1.5 Site Settings Table
create table if not exists public.site_settings (
    key text primary key,
    value jsonb not null,
    updated_at timestamptz default now()
);

-- ========================================================
-- 2. HARDENED ROW LEVEL SECURITY (RLS) POLICIES
-- ========================================================

-- Enable RLS on all tables
alter table public.events enable row level security;
alter table public.gallery enable row level security;
alter table public.testimonials enable row level security;
alter table public.enquiries enable row level security;
alter table public.site_settings enable row level security;

-- Cleanup existing policies
drop policy if exists "Public can submit enquiries" on public.enquiries;
drop policy if exists "Admins can view enquiries" on public.enquiries;
drop policy if exists "Admins can update enquiries" on public.enquiries;
drop policy if exists "Admins can delete enquiries" on public.enquiries;
drop policy if exists "Allow public to create enquiries" on public.enquiries;
drop policy if exists "Allow authenticated admin full access to enquiries" on public.enquiries;

drop policy if exists "Public can read events" on public.events;
drop policy if exists "Admins can write events" on public.events;
drop policy if exists "Allow public read access to published events" on public.events;
drop policy if exists "Allow authenticated admin full access to events" on public.events;

drop policy if exists "Public can read gallery" on public.gallery;
drop policy if exists "Admins can write gallery" on public.gallery;
drop policy if exists "Allow public read access to gallery" on public.gallery;
drop policy if exists "Allow authenticated admin full access to gallery" on public.gallery;

drop policy if exists "Public can read testimonials" on public.testimonials;
drop policy if exists "Admins can write testimonials" on public.testimonials;
drop policy if exists "Allow public read access to testimonials" on public.testimonials;
drop policy if exists "Allow authenticated admin full access to testimonials" on public.testimonials;

drop policy if exists "Public can read site_settings" on public.site_settings;
drop policy if exists "Admins can write site_settings" on public.site_settings;
drop policy if exists "Allow public read access to site settings" on public.site_settings;
drop policy if exists "Allow authenticated admin full access to site settings" on public.site_settings;

-- 2.1 Enquiries Table Policies (Strict PII Protection)
create policy "Public can submit enquiries"
  on public.enquiries for insert
  to anon, authenticated
  with check (true);

create policy "Admins can view enquiries"
  on public.enquiries for select
  to authenticated
  using (true);

create policy "Admins can update enquiries"
  on public.enquiries for update
  to authenticated
  using (true)
  with check (true);

create policy "Admins can delete enquiries"
  on public.enquiries for delete
  to authenticated
  using (true);

-- 2.2 Events Table Policies
create policy "Public can read events"
  on public.events for select
  to anon, authenticated
  using (published = true);

create policy "Admins can write events"
  on public.events for all
  to authenticated
  using (true)
  with check (true);

-- 2.3 Gallery Table Policies
create policy "Public can read gallery"
  on public.gallery for select
  to anon, authenticated
  using (true);

create policy "Admins can write gallery"
  on public.gallery for all
  to authenticated
  using (true)
  with check (true);

-- 2.4 Testimonials Table Policies
create policy "Public can read testimonials"
  on public.testimonials for select
  to anon, authenticated
  using (true);

create policy "Admins can write testimonials"
  on public.testimonials for all
  to authenticated
  using (true)
  with check (true);

-- 2.5 Site Settings Table Policies
create policy "Public can read site_settings"
  on public.site_settings for select
  to anon, authenticated
  using (true);

create policy "Admins can write site_settings"
  on public.site_settings for all
  to authenticated
  using (true)
  with check (true);

-- ========================================================
-- 3. SEED INITIAL DATA
-- ========================================================

insert into public.events (title, slug, description, category, date, location, image_url, published)
values 
('The Grand Royal Wedding', 'luxury-wedding', 'An opulent traditional wedding ceremony held at the Grand Palace, showcasing intricate gold decor, elegant lighting, and premium hospitality.', 'Weddings', '2026-05-15', 'Grand Palace Hall, Kochi', 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&q=80&w=1200', true),
('Global Tech Summit 2026', 'corporate-event', 'Annual leadership conclave featuring keynote presentations, interactive product demo spaces, and high-end executive dining.', 'Corporate Events', '2026-06-10', 'Crown Plaza Hotel, Bangalore', 'https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&q=80&w=1200', true),
('Luxury Golden Birthday Jubilee', 'birthday-party', 'A magnificent birthday bash featuring custom balloon art, stunning floral arches, and state-of-the-art sound systems.', 'Birthday Parties', '2026-07-02', 'Lakeside Pavilion, Alappuzha', 'https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?auto=format&fit=crop&q=80&w=1200', true)
on conflict (slug) do nothing;

insert into public.gallery (title, media_type, media_url, category)
values
('Royal Wedding Mandap Decoration', 'image', 'https://images.unsplash.com/photo-1519225495810-7512c696505a?auto=format&fit=crop&q=80&w=800', 'Weddings'),
('Traditional Chenda Melam Performance', 'image', 'https://images.unsplash.com/photo-1599733589046-9b8308b5b50d?auto=format&fit=crop&q=80&w=800', 'Chenda Melam'),
('Corporate Stage Setup', 'image', 'https://images.unsplash.com/photo-1475721027785-f74eccf877e2?auto=format&fit=crop&q=80&w=800', 'Corporate Events'),
('Golden DJ Deck & Sound Setup', 'image', 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&q=80&w=800', 'DJ Music');

insert into public.testimonials (client_name, review, rating)
values
('Aravind & Meera', 'AP Events transformed our wedding into a fairy tale. The gold theme decor was breathtaking, and the Chenda Melam team was electrifying!', 5),
('Sarah Jenkins (TechCorp CEO)', 'Flawless execution of our annual summit. Professional welcome hostesses, top-notch security, and prompt coordination.', 5);

insert into public.site_settings (key, value)
values
('contact_info', '{
  "phone": "+91 91502 26356",
  "email": "info@apevents.com",
  "address": "AP Events, Ganapathy Nagar, Vanagaram, Chennai, Tamil Nadu 600095",
  "whatsapp": "919150226356",
  "instagram": "@ap_events_management",
  "facebook": "ap_events_management"
}')
on conflict (key) do update set value = excluded.value;
