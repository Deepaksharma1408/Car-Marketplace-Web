# AutoReel — Video-First Dubai Luxury Car Marketplace Prototype

> **Stage 1: Dubai, Supercars & Luxury Cars Only, Zero Monetization / Zero Broker Fees**  
> Built with Next.js 16 (App Router) + TypeScript + Tailwind CSS + Framer Motion + Lucide React + Recharts + Zustand (with LocalStorage persistence) + HTML5 Video & Canvas Quality Verification.

---

## 🏎️ Overview & Architecture

**AutoReel** is a state-of-the-art frontend-only clickable web prototype for Dubai's first video-first luxury car marketplace. Designed around a **Dubai-luxury aesthetic** (dark-first, champagne gold `#D4AF6A` primary accents, electric teal `#2DD4BF` AI assists, and true glassmorphism), it simulates an entire automotive ecosystem in the browser without requiring a backend server or database setup.

All changes (new listings, moderation approvals, dealer verifications, WhatsApp lead clicks, and account settings) persist dynamically in `localStorage` through an asynchronous mock API layer (`/src/lib/mockApi`) with realistic simulated latency.

---

## 🚀 Quick Start (Zero Configuration)

```bash
# 1. Install dependencies
npm install

# 2. Run the development server
npm run dev

# 3. Open your browser
# Navigate to http://localhost:3000
```

`npm i && npm run dev` works with nothing else to configure.

---

## 👥 Demo Accounts & Simulated Roles

AutoReel features a persistent **Demo Mode Bar** at the top of every screen for 1-click role switching, as well as dedicated auth login screens:

| Role | Demo User Account | Email | Capabilities & Privileges |
| :--- | :--- | :--- | :--- |
| **Guest** | Unauthenticated Visitor | *None* | Browses landing page, watches reels, views public listing pages, tests WhatsApp/Call lead triggers. |
| **Individual Seller** | Hamdan Al-Maktoum | `tariq@example.com` | Creates listings, runs 3-step wizard (Paths A, B, C), reviews lead analytics, posts non-sale car videos on "My videos" tab. |
| **Verified Dealer** | Al-Futtaim Prestige Motors | `dealer@alfuttaim-demo.ae` | Manages large inventory, DED trade license inspector, verified dealer gold badge, inventory table. |
| **Admin / Moderator** | Sarah Connor | `admin@autoreel.ae` | Moderates review queue (approve/reject with required reason), reviews dealer DED licenses, manages users & roles, handles reports, monitors video processing jobs, configures feature flags & future roadmap. |

*Universal OTP Test Code:* `123456` or use the random 6-digit code shown in the floating notification toast.

---

## 🗺️ Route Sitemap

- `/` — **Landing Page**: Cinematic hero with looping vertical 9:16 phone mockup, live Dubai stats strip, 3 upload paths visual breakdown, featured live carousel, how it works, dealer verification request trigger, FAQ accordion, footer.
- `/car/[slug]` — **Public Listing Showcase (~40 seeded cars)**: Fullscreen 9:16 vertical video player with sound & progress controls, 10–20 photo gallery with fullscreen lightbox, specs grid, verified dealer badge, WhatsApp and Call lead action buttons with separate logging, JSON-LD structured schema.
- `/dashboard` — **Seller & Dealer Dashboard**:
  - *My Listings Table*: Status badges (Live, Pending Review, Sold, Rejected with reason, Archived), sort, filter, client-side CSV export, Mark as Sold, Relist, Delete.
  - *Lead Breakdown Chart*: WhatsApp vs Call inquiries with Recharts bar visualization.
  - *My Videos Tab*: Individual sellers only (upload, caption, publish, and delete social cold-start videos).
  - *Dealer Portal*: DED trade license verification banner, expiry alerts, upload-document UI.
  - *Settings & Compliance*: Contact preferences, "Download my data" (JSON export), and "Delete my account" flow.
- `/dashboard/new-listing` — **3-Step Listing Creation Wizard (Showpiece)**:
  - *Step 1: Vehicle Details*: Make, dependent model, year, AED price, mileage, body, fuel, transmission, condition, Dubai area, description, contact preference.
  - *Step 2: Media Studio*:
    - **Path A (Ready-made Video)**: Drag-and-drop video, browser validation (MP4/MOV, <60s, 9:16, min 720p, <500MB) via HTML5 video element, format & check animation, thumbnail frame picker.
    - **Path B (Raw Clips + Smart Templates)**: Upload 1–5 raw clips, style selector (Premium, Sport, Cosy) with 9 total smart templates, simulated AI Media Assistant (electric teal accent) auto-sorting angles (Hero exterior, Front, Side, Interior, Exhaust), free animated timeline preview in 9:16 frame, 9 royalty-free music tracks, render counter ("2 of 3 renders left"), and full render simulator.
    - **Path C (Photos Only)**: Static photo listing with explicit guarantee: "Photos never become video".
    - *All Paths*: 10–20 photos required via Photo Quality Gate with canvas-based Laplacian sharpness & resolution checks.
  - *Step 3: Review & Live Feed Preview*: Side-by-side feed card preview & submit for review with celebratory confetti.
- `/admin` — **Admin Control Center**:
  - *Overview*: KPIs, 30-day platform views vs leads Recharts graph, recent audit trail.
  - *Listing Review Queue*: Detail drawer, video playback, photo gallery, approve, or reject (with required reason written to audit trail).
  - *Dealer Verification*: Review DED trade licenses, flag expiring/expired licenses, approve/reject/suspend, create dealer accounts. Dealer requests submitted on landing page appear here!
  - *Users*: Search, filter, suspend, and toggle roles.
  - *Moderation & Reports*: Reported listings, comments, users with action logging.
  - *Analytics & Leads*: Private vs public metric separation, watch times, completion rates, top Dubai vehicles.
  - *Operations*: Video processing job monitor, logs, and manual retry flows.
  - *Configuration*: Feature flags, max renders (3), upload limits, 9 music tracks with license notes, lookup data, and read-only Stage 2 / Stage 3 roadmap flags.
- `/login` — Sign in with 1-click demo accounts or mock OTP toasts.
- `/signup` — Onboarding screen for Individual and Dealer accounts.
- `/forgot-password` — Password reset with mock OTP dispatch.
- `/terms` & `/privacy` — Legal pages in English with DIFC governing law and UAE PDPL compliance.
- `/ar/terms` & `/ar/privacy` — Arabic Legal pages rendered with native **RTL (`dir="rtl"`)** layout and typography.

---

## 🔬 Simulation vs. Production Replacement Matrix

| Feature | In this Prototype (Simulated) | What Production Would Replace It With |
| :--- | :--- | :--- |
| **Backend & Database** | Client-side `localStorage` with typed async `/lib/mockApi` calls and artificial network latency. | Node.js / Go microservices with PostgreSQL, Prisma/Drizzle ORM, and Redis cache. |
| **Media Hosting** | High-performance public CDN vertical sample videos and Unsplash HD automotive photo packs + luxury animated SVG/Canvas fallbacks. | AWS S3 / Cloudflare R2 bucket with Cloudflare Stream or Mux video transcoding. |
| **Smart Video Rendering** | Client-side animated timeline preview in 9:16 SVG/HTML5 + async progress simulator. | Server-side FFmpeg / Remotion rendering cluster with GPU acceleration. |
| **AI Angle Classification** | Simulated intelligent heuristic slot sorter with teal badge, blur detection, and camera shake warnings. | Computer Vision model (e.g. CLIP / fine-tuned automotive classification model) analyzing keyframe features. |
| **Authentication & OTP** | Zustand persisted auth store with OTP codes displayed directly in interactive toasts and universal code `123456`. | Supabase Auth, Clerk, or Firebase Auth integrated with Twilio / UAE SMS gateway. |
| **Lead Tracking** | LocalStorage lead counter incrementing on WhatsApp / Call click with `wa.me` & `tel:` protocol generation. | Server-side telemetry events piped to Segment / Mixpanel / BigQuery data warehouse. |
| **DED License Verification**| Upload document simulation and manual compliance approval drawer in `/admin`. | Direct API integration with Dubai Department of Economy & Tourism (DED) Commercial Registry. |

---

## 🎨 Dubai Luxury Design System Tokens

```css
:root {
  --bg: #0A0C10;           /* Jet Obsidian */
  --surface: #12151C;      /* Deep Titanium */
  --surface-2: #1A1E28;    /* Brushed Steel */
  --border: #262B38;       /* Subtle Contour */
  --text: #F4F5F7;         /* Crisp Platinum */
  --muted: #9AA3B2;        /* Silver Metallic */
  --accent: #D4AF6A;       /* Champagne Gold */
  --accent-2: #2DD4BF;     /* Electric Teal (AI Assist) */
  --whatsapp: #25D366;     /* Direct WhatsApp */
  --call: #3B82F6;         /* Cellular Blue */
  --danger: #EF4444;       /* Ruby Red */
  --warning: #F59E0B;      /* Amber Alert */
  --success: #22C55E;      /* Emerald Green */
}
```

---

## 📋 Compliance & Regulatory Notes

- **UAE Federal Decree-Law No. 45 of 2021**: Personal Data Protection Law (PDPL) implemented via cookie consent banner, data export ("Download my data" in JSON), and 30-day retention grace period for account deletion.
- **Photos Never Become Video**: Explicitly enforced on Path C to protect seller photography authenticity.
- **Bilingual Legal Mandate**: English terms/privacy paired with dedicated native Arabic RTL legal pages (`/ar/terms`, `/ar/privacy`).
