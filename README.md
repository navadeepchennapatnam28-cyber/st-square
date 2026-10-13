# ST² — Student Intelligence & Placement Analytics Platform

<div align="center">

![ST² Banner](public/favicon.svg)

### **Smarter Insights, Brighter Futures.**
*A unified, production-ready institutional intelligence platform for continuous student telemetry, algorithmic growth coaching, and faculty governance.*

[![React 19](https://img.shields.io/badge/React-19.2-61DAFB?logo=react&logoColor=black)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-6.0-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-8.3-646CFF?logo=vite&logoColor=white)](https://vitejs.dev/)
[![Tailwind CSS v4](https://img.shields.io/badge/TailwindCSS-v4-06B6D4?logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![Supabase](https://img.shields.io/badge/Supabase-PostgreSQL-3ECF8E?logo=supabase&logoColor=white)](https://supabase.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-amber.svg)](LICENSE)

</div>

---

## 🌟 Overview

**ST²** is an enterprise-grade university portal designed to bridge the gap between classroom academics, competitive engineering skill development, and institutional placement outcomes. It provides dedicated, role-gated experiences for **Scholars** and **Faculty Mentors** powered by a shared Supabase PostgreSQL backend with Row Level Security (RLS).

Styled in a signature **cinematic dark brown/black theme** (`#100D0B`, `#1A120E`) with **amber/orange liquid-glass morphism** (`#FF7A18`, `#FF8C32`, `#FFB347`), ST² delivers a visually stunning and responsive experience across desktops, tablets, and mobile devices.

---

## 🚀 Key Modules & Capabilities

### 1. 🎓 Student Growth Cockpit
* **Academic Telemetry:** Live tracking of CGPA, SGPA, attendance percentage, backlogs, and semester progression.
* **Pro Code Arena:** In-browser algorithmic challenge workbench with sample test-case runner, complexity analysis, and difficulty breakdown.
* **AI Mock Interviews:** Proctored technical and behavioral mock interview sessions powered by generative AI with automated transcripts, scoring rubrics, and detailed evaluation reports.
* **LMS Course Hub:** Syllabus topic checklist, lecture attendance records, and assignment submissions.
* **Startup Desk & Capstone:** Innovation project submission workflow with mentor review, stage tracking, and tech fest portfolios.

### 2. 🛡️ Faculty Governance & Analytics Cockpit
* **Institutional Overview:** 
  * Total registered scholars (178), active/inactive status breakdown, and department distributions across Computer Science, Information Technology, Data Science, and Electronics.
  * Real-time institutional CGPA spectrum and attendance health monitoring.
  * Automated early intervention watchlist for students falling below the 75% attendance threshold.
* **Placement Analytics Engine:**
  * **Accurate Statistics:** Strictly distinguishes Placed Scholars from Total Eligible Scholars using the verified formula:
    $$\text{Placement Rate} = \left(\frac{\text{Placed Scholars}}{\text{Eligible Scholars}}\right) \times 100$$
  * Package metrics: Highest (44.50 LPA), Average (18.65 LPA), and Median (16.00 LPA).
  * Recruiter leaderboard (Google, Microsoft, Amazon, Goldman Sachs, Qualcomm, Oracle, etc.).
  * Multi-year historical trajectory (AY 2023–24 to AY 2026–27).
  * Internship & PPO tracking (stipends, duration, and conversion ratios).
* **Student Placement Registry & Career Drawer:**
  * Search scholars by name, roll number, or department.
  * Slide-out career profile drawer showing verified offers, internships, skills, and Pro Code problem counts.
  * Modal to record new placement offers with live broadcast updates.
  * One-click CSV export of accreditation-ready placement reports (NAAC/NBA).
* **Academic Performance Matrix:**
  * Subject-wise performance tracking across course codes (`CS601`, `AI702`, `IT503`, `DS401`, `EC602`).
  * Continuous assessment and midterm examination benchmarks.
  * Declining trajectory monitor with direct intervention case logging.
* **Syllabus Manager & Attendance Ledger:**
  * Unit and topic completion toggling with progress percentages.
  * Digital attendance ledger with batch submission.
  * Broadcast notifications and assignment grading queues.

### 3. 🔐 Enterprise Authentication
* **Universal Email Support:** Validates RFC 5322 format for any provider (Gmail, Outlook, Yahoo, university `.edu`/`.ac.in`, and corporate domains).
* **Display Name Independence:** Preserves user-provided full names without forcibly deriving them from email prefixes.
* **Indian Mobile Validation:** Strict 10-digit numeric validation starting with 6, 7, 8, or 9 (`/^[6-9]\d{9}$/`).
* **Password Visibility:** Toggle eye icons on password and confirm-password fields with default masked state.
* **Dual Role Onboarding:** Dedicated login and registration flows for both Students and Faculty.

---

## 🛠️ Technology Stack

| Layer | Technologies |
| :--- | :--- |
| **Frontend Framework** | React 19, TypeScript 6, Vite 8 |
| **Styling & Design** | Vanilla Tailwind CSS v4, Glassmorphic liquid design, Custom CSS tokens |
| **UI Components & Icons** | Custom GlassCard, Badge, Button, Modal, Tabs, Lucide React Icons |
| **Data Visualization** | Recharts (Responsive area charts, bar charts, radar charts) |
| **Backend & Database** | Supabase (PostgreSQL 15, Row Level Security, GoTrue Auth, Realtime) |
| **Edge Functions** | Deno-based Supabase Edge Functions (`mock-interview-ai`) |
| **Linting & Quality** | Oxlint, TypeScript strict mode (`tsc --noEmit`) |

---

## 📂 Project Architecture

```
c:\antigravity
├── public/                     # Static assets and icons
├── src/
│   ├── assets/                 # SVGs and brand assets
│   ├── components/
│   │   ├── charts/             # Recharts components (Attendance, Performance, Skills)
│   │   ├── dashboard/          # MetricCard, WelcomeBanner
│   │   ├── faculty/            # Institutional Cockpit, Placement Analytics, Academic Matrix
│   │   ├── layout/             # Navbar, Sidebar, AppLayout, WaterBubblesBackground
│   │   ├── pro-code/           # ProblemCard, CodeWorkspace
│   │   ├── projects/           # ProjectCard
│   │   ├── startup-desk/       # StartupIdeaCard, SubmitIdeaModal
│   │   └── ui/                 # GlassCard, Button, Badge, Modal, Tabs, Toast
│   ├── context/
│   │   └── AppContext.tsx      # Global app state, theme, session, and toast notifications
│   ├── data/                   # Realistic institutional fallback datasets (178 scholars)
│   ├── features/
│   │   └── mock-interview/     # AI Voice/Text Mock Interview module
│   ├── pages/                  # Route views (Dashboard, Faculty, Placement, LMS, etc.)
│   ├── services/               # API & Supabase services (auth, faculty, placement, coding)
│   ├── types/                  # Strict TypeScript type definitions
│   ├── App.tsx                 # Route declarations & role-based guards
│   ├── index.css               # Design system tokens and liquid glass styling
│   └── main.tsx                # Application bootstrap
├── supabase/
│   ├── functions/              # Edge functions
│   └── migrations/             # 7 safe, non-destructive PostgreSQL migrations
│       ├── 20261012_01_foundation_auth_and_profiles.sql
│       ├── 20261012_02_academic_modules.sql
│       ├── 20261012_03_career_and_coding.sql
│       ├── 20261012_04_faculty_startup_recommendations.sql
│       ├── 20261012_05_faculty_and_syllabus.sql
│       ├── 20261012_06_placement_analytics_and_offers.sql
│       ├── 20261012_07_auth_phone_and_profile_fixes.sql
│       └── 20261012_mock_interviews.sql
├── .env.example                # Sanitized environment template
├── .gitignore                  # Git ignore rules (protects credentials)
├── package.json                # Project dependencies and scripts
├── tsconfig.json               # TypeScript configuration
└── vite.config.ts              # Vite build setup
```

---

## ⚡ Quick Start & Installation

### 1. Prerequisites
* **Node.js**: v18.0.0 or higher
* **npm**: v9.0.0 or higher
* A free [Supabase](https://supabase.com) project (optional for remote cloud backend)

### 2. Clone & Install
```bash
git clone https://github.com/navadeepchennapatnam28-cyber/st-square.git
cd st-square
npm install
```

### 3. Environment Setup
Copy the environment template:
```bash
cp .env.example .env
```

Open `.env` and fill in your Supabase project credentials:
```ini
VITE_API_BASE_URL=http://localhost:5000/api
VITE_ENABLE_API_MODE=false

# Supabase Project Credentials
VITE_SUPABASE_URL=https://your-project-ref.supabase.co
VITE_SUPABASE_ANON_KEY=your-publishable-or-anon-key
```

### 4. Run Locally
Start the development server:
```bash
npm run dev
```

Open [stsquare.netlify.app](stsquare.netlify.app) in your browser.

---

## 🔑 Pre-Configured Test Credentials

For quick evaluation, use the pre-configured credentials directly on the [Login Page](
stsquare.netlify.app)

| Role | Email | Password | Destination |
| :--- | :--- | :--- | :--- |
| **Faculty Mentor** | `dr.arvind@faculty.st2.edu` | `password123` | Redirects to `/faculty` |
| **Student Scholar** | `aarav.sharma@st2.edu` | `password123` | Redirects to `/` |

*Note: You can also register new accounts with any personal email (Gmail, Outlook, Yahoo) using the registration form.*

---

## 🗄️ Database Migrations

To apply the complete database schema to your Supabase project:
1. Open your **Supabase Dashboard** → **SQL Editor**.
2. Run the SQL migration scripts located in `supabase/migrations/` in chronological order (`01` through `07`).
3. All migrations include Row Level Security (RLS) policies ensuring students can only access their personal telemetry while authorized faculty can view aggregate institutional statistics and their assigned cohort.

---

## 📜 Available Scripts

* `npm run dev` — Starts the Vite dev server with Hot Module Replacement.
* `npm run build` — Type-checks and creates an optimized production bundle.
* `npm run lint` — Fast linting via Oxlint.
* `npm run preview` — Locally previews the production build.

---

## 📄 License

This project is licensed under the [MIT License](LICENSE).
Created for byteXL Ecosystem & the ST² Student Growth Hub.
