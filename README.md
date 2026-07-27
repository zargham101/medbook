
<img src="https://img.shields.io/badge/status-active-success.svg" alt="Status" />
<img src="https://img.shields.io/badge/React-18.3-61DAFB?logo=react" alt="React" />
<img src="https://img.shields.io/badge/Vite-5-646CFF?logo=vite" alt="Vite" />
<img src="https://img.shields.io/badge/Express-4-000000?logo=express" alt="Express" />
<img src="https://img.shields.io/badge/Tailwind_CSS-3.4-06B6D4?logo=tailwindcss" alt="Tailwind" />
<img src="https://img.shields.io/badge/PostgreSQL-16-4169E1?logo=postgresql" alt="PostgreSQL" />
<img src="https://img.shields.io/badge/Resend-000000?logo=resend" alt="Resend" />
<img src="https://img.shields.io/badge/Vercel-000000?logo=vercel" alt="Vercel" />

<br />

<div align="center">
  <img src="https://img.shields.io/badge/MedBook-%230891B2?style=for-the-badge" alt="MedBook" />
  <h1 align="center">Your Health, One Click Away</h1>
  <p align="center">
    A full-stack doctor appointment scheduling platform with email notifications, automated reminders, and a premium Bento Grid design system.
    <br />
    <a href="https://medbook-gamma.vercel.app"><strong>🌐 Live Demo »</strong></a>
    <br />
    <br />
  </p>
</div>

---

## 📋 Table of Contents

- [About The Project](#-about-the-project)
- [Built With](#-built-with)
- [Architecture](#-architecture)
- [Features](#-features)
- [Design System](#-design-system)
- [Email System](#-email-system)
- [Cron Job System](#-cron-job-system)
- [Getting Started](#-getting-started)
- [Environment Variables](#-environment-variables)
- [Deployment](#-deployment)
- [Screenshots](#-screenshots)

---

## 🏥 About The Project

MedBook is a **full-stack doctor appointment scheduling platform** that lets patients browse verified specialists, book appointments in real-time, and manage their healthcare journey — all from a beautiful, modern interface.

### Why MedBook?

Traditional healthcare booking is broken: phone tag with receptionists, long wait times, and no visibility into doctor availability. MedBook eliminates all that friction by providing:

- **Real-time availability** — See exactly when a doctor is free
- **Instant booking** — Reserve your slot in under 60 seconds
- **Automated emails** — Get notified for bookings, changes, and cancellations
- **Reminder system** — Never miss an appointment with 1-hour reminder emails
- **Patient reviews** — Make informed decisions with transparent ratings

---

## 🛠 Built With

| Layer | Technology |
|-------|-----------|
| **Frontend** | React 18, TypeScript, Vite 5, Tailwind CSS 3, react-router-dom v7 |
| **Backend** | Node.js, Express 4, TypeScript |
| **Database** | PostgreSQL 16 (Neon Serverless) |
| **Email** | Resend API |
| **Auth** | JWT (bcryptjs + jsonwebtoken) |
| **Icons** | Lucide React |
| **Deployment** | Vercel (serverless functions + cron jobs) |
| **Design** | Bento Grids, Glassmorphism, Figtree typography |

---

## 🏗 Architecture

MedBook follows a **monorepo architecture** with two main runtimes:

```
medbook/
├── src/                    # React frontend (Vite SPA)
│   ├── components/         # Reusable UI components
│   │   ├── ui.tsx          # Button, Card, Badge, Modal primitives
│   │   ├── shared.tsx      # Avatar, Logo, StatTile, SectionHeader
│   │   └── Layout.tsx      # Navbar + Footer shell
│   ├── pages/              # Page-level components
│   │   ├── LandingPage.tsx
│   │   ├── DoctorsDirectory.tsx
│   │   ├── DoctorProfilePage.tsx
│   │   ├── PatientDashboard.tsx
│   │   ├── DoctorDashboard.tsx
│   │   ├── AuthPages.tsx
│   │   ├── AboutUs.tsx
│   │   ├── ContactUs.tsx
│   │   └── BlogPage.tsx
│   ├── context/            # AuthContext (React Context)
│   └── lib/                # API client & type definitions
├── api/                    # Serverless Express API (Vercel function)
│   └── index.ts            # All routes + email service + cron
├── server/                 # Local development server
│   ├── src/                # Express routes, DB, migrations
│   └── migrations/         # SQL schema + seed data
├── vercel.json             # Vercel config (rewrites, crons, env)
└── scripts/                # Build-time scripts
```

### Key Decision: Single-File Serverless API

The entire API lives in a **single `api/index.ts` file** (772 lines). This was an intentional trade-off: Vercel's serverless builder optimizes a single entry point better than multiple lambdas, and it keeps deployment simple. The local development server (`server/src/index.ts`) mirrors the same routes using Express Router for a better dev experience.

### How Routing Works

Vercel's `vercel.json` rewrites catch-all API requests:

```json
{
  "rewrites": [
    { "source": "/api/(.*)", "destination": "/api" },
    { "source": "/(.*)", "destination": "/index.html" }
  ]
}
```

All `/api/*` requests are forwarded to the Express app in `api/index.ts`. The Express app then handles URL reconstruction from Vercel's proxy headers using `x-vercel-forwarded-url`, and routes requests to the appropriate handlers. The second rewrite sends everything else to the Vite SPA.

### Database

PostgreSQL hosted on **Neon Serverless**. Schema is managed via versioned SQL migrations in `server/migrations/`:

| Migration | Contents |
|-----------|----------|
| `001_schema.sql` | Tables: profiles, doctor_profiles, appointments, reviews |
| `002_seed.sql` | Demo data: 6 doctors across 4 specialties |
| `003_reminder_sent.sql` | Adds reminder_sent & reminded_at columns |

Migrations run automatically during Vercel deployments via `scripts/prebuild.mjs`.

---

## ✨ Features

### 👨‍👩‍👧‍👦 Public Pages

| Route | Page | Description |
|-------|------|-------------|
| `/` | Landing Page | Bento Grid hero, testimonials, stats, dual CTA |
| `/doctors` | Doctor Directory | Search + filter by specialty, glass card grid |
| `/doctors/:id` | Doctor Profile | Full profile + availability calendar + booking |
| `/about` | About Us | Team, mission, values, company stats |
| `/contact` | Contact Us | Contact form, info cards, FAQ accordion |
| `/blog` | Health Blog | Featured article + grid of health articles |
| `/login` | Sign In | Email + password auth |
| `/signup` | Sign Up | Role selection + registration form |

### 🔒 Authenticated Pages

| Route | Role | Description |
|-------|------|-------------|
| `/patient` | PATIENT | Dashboard with stats, upcoming/history, reschedule, reviews |
| `/doctor` | DOCTOR | Tabs for Requests/Upcoming/History, confirm/decline |

### 🎯 Core Functionality

- **Doctor Search** — Real-time filtering by name, specialty, or location
- **Appointment Booking** — Interactive weekly calendar with 30-min time slots
- **Patient Dashboard** — Overview stats, cancel/reschedule/review actions
- **Doctor Dashboard** — Manage incoming requests, confirm/decline, track history
- **Review System** — 5-star ratings with optional comments per appointment
- **JWT Auth** — Sign up/in/out with role-based route protection
- **Responsive Design** — Works on mobile (375px) through desktop (1440px+)

---

## 🎨 Design System

MedBook uses a premium healthcare design system generated by the **UI/UX Pro Max** design intelligence skill.

### Color Palette

| Token | Hex | Usage |
|-------|-----|-------|
| Primary | `#0891B2` | Buttons, links, active states, brand elements |
| Secondary | `#22D3EE` | Accent gradients, highlights |
| Background | `#F0FDFA` | Page backgrounds, card tints |
| Foreground | `#134E4A` | Primary text |
| Success | `#16A34A` | Confirmed states, CTAs |
| Warning | `#F59E0B` | Pending states, star ratings |

### Typography

- **Headings & Body**: Figtree (Google Fonts) — clean, medical, trustworthy
- **Fallback**: Inter, system-ui stack

### Key Effects

- **Glassmorphism**: Backdrop-blur cards with subtle borders (`bg-white/70 backdrop-blur-xl`)
- **Gradient Text**: Brand-to-cyan on key headlines
- **Bento Grids**: Modular card layouts for features, testimonials
- **Hover Animations**: 1.02 scale, shadow expansion, 300ms transitions
- **Float Animations**: Floating elements in hero section
- **Page Transitions**: CSS fade-in/slide-up on route changes

### Component Library

All UI primitives are in `src/components/ui.tsx`:

| Component | Variants |
|-----------|----------|
| `Button` | primary (gradient), secondary, outline, ghost, danger; sm/md/lg |
| `Card` | Default, `CardSolid`, `GlassCard` |
| `Badge` | neutral, success, warning, danger, info, teal |
| `StatusBadge` | Maps appointment status to badge variant |
| `Spinner` | Animated teal spinner |
| `EmptyState` | Icon + title + description + action |
| `StarRating` | Read-only or interactive 5-star display |
| `GradientText` | Brand-to-cyan gradient span |

---

## 📧 Email System

MedBook sends **transactional emails** via the [Resend](https://resend.com) API for every appointment lifecycle event.

### Email Triggers

| Event | Recipients | Content |
|-------|-----------|---------|
| **Appointment Booked** | Patient + Doctor | Confirmation with date, time, clinic, specialty |
| **Appointment Rescheduled** | Patient + Doctor | Old vs. new date/time comparison |
| **Appointment Cancelled** | Patient + Doctor | Cancellation notice with reason |
| **1-Hour Reminder** | Patient + Doctor | Upcoming appointment alert |

### Email Architecture

```
api/index.ts
├── sendEmail(to, subject, html)        # Calls Resend API
├── emailLayout(title, body)            # Wraps content in branded HTML template
├── bookingPatientEmail(d)              # Patient booking notification
├── bookingDoctorEmail(d)              # Doctor booking notification
├── reschedulePatientEmail(d)          # Patient reschedule notification
├── rescheduleDoctorEmail(d)           # Doctor reschedule notification
├── cancellationPatientEmail(d)        # Patient cancellation notification
├── cancellationDoctorEmail(d)         # Doctor cancellation notification
├── reminderPatientEmail(d)            # Patient reminder
├── reminderDoctorEmail(d)             # Doctor reminder
└── sendAppointmentNotification(type)  # Dispatcher for booked/rescheduled/cancelled
```

### Email Design

All emails use a mobile-responsive HTML template with:
- Branded header bar with gradient background
- Detail cards for appointment info
- Status badges (Confirmed/Pending/Cancelled)
- Clean typography and generous spacing

### Testing Emails

The `TEST_EMAIL_OVERRIDE` environment variable redirects ALL emails to a single test address:

```env
TEST_EMAIL_OVERRIDE=your@email.com  # All emails go here
```

This is useful for development and staging environments. Set it in `vercel.json` or Vercel dashboard.

---

## ⏰ Cron Job System

MedBook uses **Vercel Cron Jobs** to send appointment reminders automatically.

### Reminder Flow

```
Daily at 9:00 AM UTC
        │
        ▼
POST /api/cron/remind
    │
    ├── Authenticate via CRON_SECRET header
    │
    ├── Query upcoming appointments within 1 hour
    │   WHERE scheduled_at BETWEEN NOW() AND NOW() + interval '1 hour'
    │   AND reminder_sent IS NULL OR reminder_sent = FALSE
    │
    ├── For each appointment:
    │   ├── Build EmailData object
    │   ├── Send reminderPatientEmail to patient
    │   ├── Send reminderDoctorEmail to doctor
    │   └── UPDATE appointments SET reminder_sent = TRUE, reminded_at = NOW()
    │
    └── Response: { reminded: <count> }
```

### Cron Schedule

```json
{
  "crons": [
    { "path": "/api/cron/remind", "schedule": "0 9 * * *" }
  ]
}
```

- **Schedule**: Once daily at 9:00 AM UTC
- **Platform**: Vercel Cron (Hobby plan limitation — Pro plan supports per-minute intervals)
- **Security**: Protected by `CRON_SECRET` environment variable passed as `x-cron-secret` header
- **Idempotent**: Uses `reminder_sent` flag to prevent duplicate reminders

### Why `*/15 * * * *` Was Changed to `0 9 * * *`

The original schedule ran every 15 minutes, but **Vercel's Hobby plan only allows daily cron jobs**. The schedule was changed to once daily at 9:00 AM UTC to comply with the plan limits. Upgrading to a Vercel Pro plan would allow reverting to more frequent intervals.

---

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- PostgreSQL 16 (local or [Neon](https://neon.tech) for remote)
- A [Resend](https://resend.com) API key (for email)

### 1. Clone & Install

```bash
git clone https://github.com/yourusername/medbook.git
cd medbook
npm install
cd server && npm install && cd ..
```

### 2. Set Up Environment

Copy `.env` and fill in your values:

```bash
# Required
DATABASE_URL=postgresql://user:pass@localhost:5432/medbook

# Optional (for Vercel deployment)
RESEND_API_KEY=re_xxxxxxxxxxxx
FROM_EMAIL=MedBook <your@verified-domain.com>
CRON_SECRET=your-random-secret
```

### 3. Run Database Migrations

```bash
npm run migrate
```

This runs all SQL files from `server/migrations/` in order, creating the schema and seeding demo data.

### 4. Start Development

```bash
npm run dev:all
```

This runs both the Vite dev server (port 5173) and Express API (port 3001) concurrently.

### 5. Open the App

Visit **http://localhost:5173** in your browser.

**Demo credentials**: `demo+chen@medbook.dev` / `demoPassword123`

---

## 🔐 Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `DATABASE_URL` | ✅ | PostgreSQL connection string |
| `JWT_SECRET` | ✅ | Secret key for JWT token signing |
| `VITE_API_URL` | Developer | API base URL for Vite proxy (`http://localhost:3001/api`) |
| `RESEND_API_KEY` | Email | Resend API key for sending emails |
| `FROM_EMAIL` | Email | Sender email address (must be verified in Resend) |
| `CRON_SECRET` | Cron | Secret for authenticating cron job requests |
| `TEST_EMAIL_OVERRIDE` | Testing | Redirect all emails to a single address |

---

## 🌐 Deployment

MedBook is deployed on **Vercel** as a serverless application.

### Deploy Your Own

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new)

1. Fork or clone this repository
2. Create a new Vercel project connected to your Git repository
3. If Vercel detects the project as "Vite", **re-import** the project to ensure the `api/` directory is recognized
4. Set all environment variables in Vercel Dashboard → Settings → Environment Variables
5. Deploy

### Important Deployment Notes

- **Framework Detection**: If Vercel detects "Vite" as the framework, it may ignore the `api/` directory. If your API routes return 404, re-import the project from the Vercel dashboard.
- **Cron Jobs**: The Hobby plan only allows **daily** cron schedules. For per-minute or per-hour intervals, upgrade to Pro.
- **Redeploying**: When pushing to `main`, use **"Trigger Deployment → Deploy Latest Code"** in Vercel dashboard. The "Redeploy" button reuses the same commit and won't pick up new changes.
- **Serverless Function URL**: The single `api/index.ts` file is deployed as a single serverless function by `@vercel/node`. All API routes are contained within it.

### Build Process

```mermaid
graph LR
    A[git push] --> B[Vercel Build]
    B --> C[prebuild.mjs]
    C --> D[Run SQL Migrations]
    D --> E[Vite Build]
    E --> F[Deploy Dist + API]
```

---

## 📸 Screenshots

### Landing Page

<img src="https://via.placeholder.com/1440x900/0891B2/FFFFFF?text=Landing+Page+-+Bento+Grid+Hero" alt="Landing Page" />

*Gradient hero section with floating appointment card, trust badges, and animated stat counters.*

### Doctor Directory

<img src="https://via.placeholder.com/1440x900/0E7490/FFFFFF?text=Doctor+Directory" alt="Doctor Directory" />

*Glass card grid with search/filter, specialty badges, and rating display.*

### Doctor Profile & Booking

<img src="https://via.placeholder.com/1440x900/155E75/FFFFFF?text=Doctor+Profile+%26+Booking" alt="Doctor Profile" />

*Profile with gradient banner, info tiles, weekly calendar, and time slot selection.*

### Patient Dashboard

<img src="https://via.placeholder.com/1440x900/164E63/FFFFFF?text=Patient+Dashboard" alt="Patient Dashboard" />

*Stats overview, upcoming appointments with actions, and appointment history.*

### Doctor Dashboard

<img src="https://via.placeholder.com/1440x900/0F766E/FFFFFF?text=Doctor+Dashboard" alt="Doctor Dashboard" />

*Request management with confirm/decline, tabs for upcoming/history, and performance stats.*

### Sign In

<img src="https://via.placeholder.com/1440x900/115E59/FFFFFF?text=Sign+In" alt="Sign In" />

*Split layout with gradient side panel and glass form.*

### About Us

<img src="https://via.placeholder.com/1440x900/0891B2/FFFFFF?text=About+Us" alt="About Us" />

*Mission, team grid, value cards, and company stats.*

### Contact Us

<img src="https://via.placeholder.com/1440x900/0E7490/FFFFFF?text=Contact+Us" alt="Contact Us" />

*Contact form, info cards, and FAQ accordion.*

### Health Blog

<img src="https://via.placeholder.com/1440x900/155E75/FFFFFF?text=Health+Blog" alt="Health Blog" />

*Featured article hero, article grid with category badges, and newsletter CTA.*

---

## 🧪 Local Development Notes

### Running the Server Separately

```bash
# Terminal 1: Vite frontend
npm run dev

# Terminal 2: Express API
npm run dev:server
```

### Running Both Concurrently

```bash
npm run dev:all
```

### Lint & Type Check

```bash
npm run lint
npm run typecheck
```

### API Health Check

```bash
curl http://localhost:3001/api/health
# → { "status": "ok", "timestamp": "2026-07-26T..." }
```

---

## 📁 Project Structure (Complete)

```
medbook/
├── api/
│   ├── index.ts           # Serverless Express API (all routes + email + cron)
│   └── ping.ts            # Standalone health check
├── server/
│   ├── migrations/        # SQL migration files
│   │   ├── 001_schema.sql
│   │   ├── 002_seed.sql
│   │   └── 003_reminder_sent.sql
│   ├── src/
│   │   ├── index.ts       # Local dev server entry
│   │   ├── db.ts          # Database pool
│   │   ├── migrate.ts     # Migration runner
│   │   ├── email/         # Email service (local server)
│   │   └── routes/        # Express route modules
│   └── package.json
├── src/
│   ├── main.tsx           # React entry point
│   ├── App.tsx            # Router + layout
│   ├── index.css          # Tailwind + custom utilities
│   ├── context/
│   │   └── AuthContext.tsx
│   ├── components/
│   │   ├── ui.tsx         # UI primitives
│   │   ├── shared.tsx     # Shared components
│   │   ├── Layout.tsx     # Navbar + Footer
│   │   └── ProtectedRoute.tsx
│   ├── pages/
│   │   ├── LandingPage.tsx
│   │   ├── DoctorsDirectory.tsx
│   │   ├── DoctorProfilePage.tsx
│   │   ├── PatientDashboard.tsx
│   │   ├── DoctorDashboard.tsx
│   │   ├── AuthPages.tsx
│   │   ├── AboutUs.tsx
│   │   ├── ContactUs.tsx
│   │   └── BlogPage.tsx
│   └── lib/
│       ├── api.ts         # Fetch-based API client
│       └── types.ts       # Domain types + formatters
├── scripts/
│   └── prebuild.mjs       # Vercel build hook
├── vercel.json            # Vercel deployment config
├── tailwind.config.js     # Tailwind configuration
└── package.json
```

---

## 📄 License

This project is for **demonstration purposes only** — not a real medical service. All data is fictional.

---

## 🙏 Acknowledgments

- [UI/UX Pro Max](https://github.com/anomalyco/opencode) — Design intelligence for the Bento Grid system
- [Resend](https://resend.com) — Email delivery
- [Neon](https://neon.tech) — Serverless PostgreSQL
- [Vercel](https://vercel.com) — Hosting + serverless functions + cron
- [Lucide](https://lucide.dev) — Beautiful icons
- [Figtree](https://fonts.google.com/specimen/Figtree) — Clean medical typography

---

<p align="center">Built with ❤️ for better healthcare access</p>
