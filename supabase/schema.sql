-- Supabase PostgreSQL Database Schema for AP Events

-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- ========================================================
-- 1. TABLES
-- ========================================================

-- Events Table
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

-- Gallery Table
create table if not exists public.gallery (
    id uuid default gen_random_uuid() primary key,
    title text,
    media_type text not null check (media_type in ('image', 'video', 'youtube', 'instagram')),
    media_url text not null,
    category text not null,
    created_at timestamptz default now()
);

-- Testimonials Table
create table if not exists public.testimonials (
    id uuid default gen_random_uuid() primary key,
    client_name text not null,
    review text not null,
    rating integer default 5 check (rating >= 1 and rating <= 5),
    created_at timestamptz default now()
);

-- Enquiries Table
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

-- Site Settings Table
create table if not exists public.site_settings (
    key text primary key,
    value jsonb not null,
    updated_at timestamptz default now()
);

-- ========================================================
-- 2. ROW LEVEL SECURITY (RLS) POLICIES
-- ========================================================

-- Enable RLS
alter table public.events enable row level security;
alter table public.gallery enable row level security;
alter table public.testimonials enable row level security;
alter table public.enquiries enable row level security;
alter table public.site_settings enable row level security;

-- Events Policies
create policy "Allow public read access to published events"
    on public.events for select
    using (published = true);

create policy "Allow authenticated admin full access to events"
    on public.events for all
    using (auth.role() = 'authenticated')
    with check (auth.role() = 'authenticated');

-- Gallery Policies
create policy "Allow public read access to gallery"
    on public.gallery for select
    using (true);

create policy "Allow authenticated admin full access to gallery"
    on public.gallery for all
    using (auth.role() = 'authenticated')
    with check (auth.role() = 'authenticated');

-- Testimonials Policies
create policy "Allow public read access to testimonials"
    on public.testimonials for select
    using (true);

create policy "Allow authenticated admin full access to testimonials"
    on public.testimonials for all
    using (auth.role() = 'authenticated')
    with check (auth.role() = 'authenticated');

-- Enquiries Policies
create policy "Allow public to create enquiries"
    on public.enquiries for insert
    with check (true);

create policy "Allow authenticated admin full access to enquiries"
    on public.enquiries for all
    using (auth.role() = 'authenticated')
    with check (auth.role() = 'authenticated');

-- Site Settings Policies
create policy "Allow public read access to site settings"
    on public.site_settings for select
    using (true);

create policy "Allow authenticated admin full access to site settings"
    on public.site_settings for all
    using (auth.role() = 'authenticated')
    with check (auth.role() = 'authenticated');

-- ========================================================
-- 3. SEED DATA FOR TESTING
-- ========================================================

-- Seed Events
insert into public.events (title, slug, description, category, date, location, image_url, published)
values 
('The Grand Royal Wedding', 'luxury-wedding', 'An opulent traditional wedding ceremony held at the Grand Palace, showcasing intricate gold decor, elegant lighting, and premium hospitality. Over 1000 guests enjoyed a custom menu and live violin orchestra.', 'Weddings', '2026-05-15', 'Grand Palace Hall, Kochi', 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&q=80&w=1200', true),
('Global Tech Summit 2026', 'corporate-event', 'Annual leadership conclave featuring keynote presentations, interactive product demo spaces, and high-end executive dining with professional welcome hosts.', 'Corporate Events', '2026-06-10', 'Crown Plaza Hotel, Bangalore', 'https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&q=80&w=1200', true),
('Luxury Golden Birthday Jubilee', 'birthday-party', 'A magnificent 50th birthday bash featuring custom balloon art, stunning floral arches, an acoustic band, and state-of-the-art sound systems.', 'Birthday Parties', '2026-07-02', 'Lakeside Pavilion, Alappuzha', 'https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?auto=format&fit=crop&q=80&w=1200', true)
on conflict (slug) do nothing;

-- Seed Gallery
insert into public.gallery (title, media_type, media_url, category)
values
('Royal Wedding Mandap Decoration', 'image', 'https://images.unsplash.com/photo-1519225495810-7512c696505a?auto=format&fit=crop&q=80&w=800', 'Weddings'),
('Traditional Chenda Melam Performance', 'image', 'https://images.unsplash.com/photo-1599733589046-9b8308b5b50d?auto=format&fit=crop&q=80&w=800', 'Chenda Melam'),
('Corporate Stage Setup', 'image', 'https://images.unsplash.com/photo-1475721027785-f74eccf877e2?auto=format&fit=crop&q=80&w=800', 'Corporate Events'),
('Golden DJ Deck & Sound Setup', 'image', 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&q=80&w=800', 'DJ Music'),
('Elegant Bridal Makeup Showcase', 'image', 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?auto=format&fit=crop&q=80&w=800', 'Bridal Makeup'),
('Luxury Balloon Arch Backdrop', 'image', 'https://images.unsplash.com/photo-1530103862676-de8c9debad1d?auto=format&fit=crop&q=80&w=800', 'Balloon Decoration'),
('Highlights of Royal Gala', 'youtube', 'https://www.youtube.com/embed/dQw4w9WgXcQ', 'Weddings');

-- Seed Testimonials
insert into public.testimonials (client_name, review, rating)
values
('Aravind & Meera', 'AP Events transformed our wedding into a fairy tale. The gold theme decor was breathtaking, and the Chenda Melam team was absolutely electrifying. Truly a premium experience!', 5),
('Sarah Jenkins (TechCorp CEO)', 'Flawless execution of our annual summit. The welcome hostesses were professional, security was top-notch, and the photography captured every key moment. Highly recommended.', 5),
('Rahul Sharma', 'Organized my father''s 60th birthday with stunning decor and sound systems. The band was outstanding and the catering coordinates were perfect. The best event planner in the state!', 5);

-- Seed Site Settings
insert into public.site_settings (key, value)
values
('hero_banner', '{
  "title": "Crafting Extraordinary Luxury Experiences",
  "subtitle": "AP Events is the premier event planner specializing in royal weddings, grand corporate events, traditional temple festivals, and elite private gatherings.",
  "bg_image": "https://images.unsplash.com/photo-1469371670807-013ccf25f16a?auto=format&fit=crop&q=80&w=1920",
  "cta_text": "Plan Your Event",
  "whatsapp_text": "Hello, I would like to inquire about planning an event."
}'),
('about_content', '{
  "title": "Defining Luxury Event Management",
  "description": "At AP Events, we believe in bringing dreams to life with grandeur and style. Based in the heart of Kerala, we specialize in organizing high-end weddings, high-powered corporate meetings, traditional temple events featuring majestic Chenda Melam, and elegant private functions.",
  "vision": "To be the ultimate benchmark of luxury event execution, blending rich cultural heritage with contemporary modern design.",
  "mission": "Delivering unparalleled events through precision management, opulent designs, and customized client services, making every milestone a timeless memory.",
  "points": [
    "Over 10 Years of Premium Industry Experience",
    "Signature Gold & Black Luxury Art Direction",
    "Comprehensive In-House Event Productions",
    "24/7 Security and VIP Hostess Services"
  ]
}'),
('contact_info', '{
  "phone": "+91 98765 43210",
  "email": "info@apevents.com",
  "address": "AP Luxury Towers, MG Road, Kochi, Kerala - 682016",
  "whatsapp": "919876543210",
  "instagram": "@ap_events_luxury",
  "facebook": "ap.events.luxury",
  "google_map_url": "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3929.800057038965!2d76.27961237583647!3d9.950616176662483!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3b080d38ff3a9fd5%3A0xc3cf9c98bc02140a!2sMG%20Road%2C%20Kochi%2C%20Kerala!5e0!3m2!1sen!2sin!4v1700000000000!5m2!1sen!2sin"
}')
on conflict (key) do update set value = excluded.value;
