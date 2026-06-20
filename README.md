# AP Events - Luxury Event Management Portal

AP Events is a bespoke, luxury event management web application crafted using React, Vite, Tailwind CSS, Framer Motion, and Supabase. The portal features a modern parallax landing design, dynamic SEO tags, filterable portfolio gallery with responsive lightbox capabilities, and a secure administrative dashboard for catalog adjustments.

---

## 💎 Features Overview

* **Luxury Parallax Landing**: Sleek black & gold theme with card reveals using Framer Motion.
* **14 Services Portfolio**: Configured card categories covering Weddings, DJ setup, Chenda Melam, security etc.
* **Filterable Media Gallery**: Responsive grid supporting photos, raw video files, YouTube streams, and Instagram Reels.
* **Enquiry Management System**: Real-time customer form submissions connected directly to the database.
* **Secure Admin Control Panel**: Protected routes managed by Supabase Authentication to create/edit/delete events and media files.

---

## 🛠️ Tech Stack & Dependencies

* **Frontend Framework**: React + Vite (ES modules compilation)
* **CSS Framework**: Tailwind CSS (with customized HSL gold palettes and glassmorphism templates)
* **Router**: React Router DOM (v6 layout divisions)
* **Animations**: Framer Motion
* **Database & Authentication**: Supabase client SDK
* **SEO Management**: React Helmet Async (Dynamic header injection & JSON-LD events metadata)
* **Icons Library**: Lucide React

---

## 🗄️ Database Setup (Supabase)

1. Create a new project inside the **[Supabase Dashboard](https://supabase.com)**.
2. Navigate to the **SQL Editor** tab in the sidebar.
3. Paste the contents of `supabase/schema.sql` into the SQL editor workspace and click **Run**.
4. The schema setup will:
   * Create `events`, `gallery`, `testimonials`, `enquiries`, and `site_settings` tables.
   * Configure **Row Level Security (RLS)** policies.
   * Grant public read access to active details.
   * Restrict inserts/updates/deletes to authorized administrator accounts only.
   * Populate starting seeds for pages content and initial catalog articles.
5. Create your administrator account under **Authentication > Users** inside your Supabase project (Email + password).

---

## ⚙️ Environment Variables

Create a file named `.env` at the root of the project and populate it with your Supabase credentials:

```env
VITE_SUPABASE_URL=https://your-supabase-url.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.your-anon-key-here
```

---

## 🚀 Local Installation & Execution

1. Clone or extract this codebase into your working directory.
2. Install npm dependencies:
   ```bash
   npm install
   ```
3. Run the hot-reloading development server:
   ```bash
   npm run dev
   ```
4. Access the workspace at `http://localhost:3000`.

---

## ☁️ Deployment Instructions

### Frontend (Vercel)

1. Connect your repository to **[Vercel](https://vercel.com)**.
2. Set the **Framework Preset** to `Vite`.
3. Add the two environment variables (`VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`) in the Vercel project settings panel.
4. Click **Deploy**. Vercel will automatically compile the production assets and support standard HTTPS and custom domains.

### Custom Subdomain Configs

To map a custom domain (e.g. `apevents.com`) to your Vercel deployment:
1. Navigate to **Project Settings > Domains** in Vercel dashboard.
2. Enter your domain name and follow the DNS CNAME/A-record alignment instructions.
