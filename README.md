# MassMatter

> **"Speak up about your food. Cook what students eat. Waste less."**

An AI-driven hostel mess intelligence, demand forecasting, and food-waste reduction platform built for the **Rai University Hostel Mess Pilot**.

---

## 1. The Methods

MassMatter transforms subjective, noisy mess complaints and blind cooking into a structured, predictive operating system using five core methods:

1. **Multilingual Speech Ingestion**: Captures natural voice feedback across **Hindi, Gujarati, English, and Hinglish** directly in the browser via the Web Speech API with zero client-side latency.
2. **Strictly Typed LLM Triage (Groq / xAI via OpenAI SDK)**: Processes unstructured conversational speech through `llama-3.3-70b-versatile` / `grok-2-latest` using `response_format: { type: "json_object" }` to extract normalized categories (`HYGIENE`, `TASTE`, `QUANTITY`, `SERVICE`, `OTHER`), urgency levels, sentiment, and linked menu dishes.
3. **Double-Layer Zod Validation & Keyword Fallback**: Validates all inputs and LLM outputs using Zod schemas (`FeedbackOutputSchema`, `DashboardStatsSchema`, `AIWeeklyReportSchema`). If API keys are missing or provider outages occur, an automated rule-based keyword fallback classifier guarantees uninterrupted system operation.
4. **Predictive Cook Headcount Regression**: Forecasts daily and slot-by-slot kitchen preparation volumes by subtracting verified advance meal skips from student enrollment, adjusted by day-of-week moving averages and dish-specific appeal modifiers with calibrated confidence notes.
5. **Gamified Closed-Loop Accountability**: Drives student engagement with a Waste-Free Streak counter shifting dynamic color tiers at **3, 7, and 14 days**, paired with a privacy-preserving campus leaderboard and anti-cheat attendance verification.

---

## 2. The Deadline

- **Hackathon Track**: Hackathon Goa (HH-Goa) — Wispr Flow Voice-Driven Development Challenge
- **Submission Date**: **September 30, 2026**

---

## 3. The Live Demo Link

- **Live Production URL**: [https://massmatter.vercel.app](https://massmatter.vercel.app)
- **Interactive Health Check**: [https://massmatter.vercel.app/api/health](https://massmatter.vercel.app/api/health)
- **1-Click Pre-Configured Demo Credentials** (available directly on [/login](https://massmatter.vercel.app/login)):
  - **Student**: `student@massmatter.com` (Access to Student Portal, Voice Feedback, Skip Toggle, Personal Streak Hub)
  - **Mess Manager**: `manage@massmatter.com` (Access to Demand Analytics Dashboard, AI Weekly Briefing, Headcount Forecast)
  - **Chief Admin**: `admin@massmatter.com` (Full Administrative & Executive Dashboard Authority)

---

## 👥 The Team

- **Solo Developer**: **Arya Patel**
- **Development Modality**: **Built 100% entirely with voice using Wispr Flow**.
  Every line of application logic, Next.js 16 App Router code, Prisma schema migrations, Zod validations, Groq LLM pipelines, and Tailwind CSS components was authored and iterated hands-free using continuous Wispr Flow voice dictation.

---

## 🛑 The Problem in the Hostel Mess

In university and collegiate hostels catering to 450+ students three times a day, dining operations suffer from systemic operational failure:

1. **Blind Cooking & Staggering Food Spoilage**: Kitchens prepare fixed portions based on outdated static enrollment lists. When 50–100 students eat out, attend late labs, or skip dinner on Friday nights, **over 80 kg of edible food is thrown into dumpsters daily**.
2. **The "Silent Dinner" Friction**: Feedback collection relies on paper registers, angry WhatsApp chats, or unread suggestion boxes. Students rarely speak up about undercooked rotis or sour dal due to social friction and fear of confrontation.
3. **No Early Warning for Surges & Deficits**: Managers discover shortages only when food runs out mid-service, leading to emergency batch cooking, compromised nutrition, and student dissatisfaction.
4. **Zero Actionable Root-Cause Analysis**: Mess committees cannot differentiate between random taste preferences and systemic operational defects (e.g., understaffed tandoors during Wednesday dinner peak).

---

## 🔄 Why MassMatter was Built as a Multi-Stage System

Hostel mess management cannot be solved with a simple static feedback form. It demands an interconnected, multi-stage operational loop:

```mermaid
flowchart LR
    A[Stage 1: Student Signal & Multilingual Capture] --> B[Stage 2: Operational Demand Intelligence & Waste Elimination]
    B --> C[Stage 3: Institutional Accountability & Continuous Kitchen Improvement]
    C --> A
```

### 3 Core Feature Modules & AI Architectural Overview

#### Feature 1: Multilingual Anonymous Voice Feedback & AI Triage
- **Description**: Students tap a floating microphone and voice their experience in conversational Hindi (*"aaj ka paneer bahut oily tha, aur roti kacchi thi"*), Gujarati, or English. The student's identity is strictly separated from the complaint to guarantee 100% candid, fearless reporting.
- **AI Architectural Overview**:
  ```text
  [Microphone / Web Speech API] 
        ↓ (Live Transcript)
  [Next.js API: /api/feedback] 
        ↓ (Zod Input Validation)
  [Groq LLaMA-3.3-70B / xAI Grok (OpenAI SDK)]
        ↓ (System Prompt with JSON Schema Enforcement)
  [Zod Output Validation: FeedbackOutputSchema]
        ↓ (Success: Category + Urgency + Dish Link | Failure: Rule-based Keyword Fallback)
  [PostgreSQL: Complaint Record (Strictly NO userId)]
  ```

#### Feature 2: Predictive Headcount & Slot-by-Slot Demand Forecasting
- **Description**: Replaces blind cooking with dynamic, slot-by-slot kitchen targets (Breakfast, Lunch, Snacks, Dinner). Predicts meal turnout based on verified advance skips, day-of-week trends, and historical dish appeal.
- **AI Architectural Overview**:
  $$\text{Target Headcount} = \text{Enrolled Students} - \max(\text{Logged Skips}, \text{Historical Baseline}) \pm \text{Dish Factor}$$
  - Enrolled hostel base (450+ students).
  - Advance skips logged before meal cutoff times.
  - Weekend vs. weekday regression (e.g., Friday dinner skip rate = 26%).
  - Dish popularity modifiers (+6% turnout for Paneer Butter Masala; -4% for light Khichdi).
  - Output displays calibrated confidence notes (e.g., *"High (92%): 11 advance skips logged + Friday dinner trend"*).

#### Feature 3: AI Executive Weekly Briefing & Waste-Free Streaks
- **Description**: Generative AI synthesizes thousands of weekly ratings, skip logs, and multilingual complaints into **3 Key Insights** and **3 Recommended Kitchen Directives**. Students earn gamified clean-plate streaks that shift colors at **3, 7, and 14 days**, backed by a top 10 campus leaderboard.
- **AI Architectural Overview**:
  ```text
  [Scheduled DB Aggregator (Zero Student Names)]
  - Ratings Average & Dish Breakdown
  - Total Skips & Prevented Food Waste (kg)
  - Active Waste-Free Streaks Count
  - Unresolved Critical Complaints
        ↓
  [Groq LLaMA-3.3-70B (OpenAI SDK)]
        ↓
  [AIWeeklyReportSchema Zod Validation]
        ↓ (Persisted in WeeklyReport Table)
  [Executive Briefing Dashboard Card + Fallback Template]
  ```

---

## 🛠️ Technology Stack

| Layer | Technology | Function |
|---|---|---|
| **Framework** | Next.js 16 (App Router + Turbopack) | Server and Client React components |
| **Language** | TypeScript | End-to-end type safety |
| **Styling** | Tailwind CSS v4 | Responsive utility design system |
| **UI Components** | shadcn/ui + Lucide React | Accessible accessible interface tokens |
| **Charts** | Recharts | Bar charts, 7-day line trends, category donut charts |
| **Database & ORM** | PostgreSQL + Prisma ORM | Relational models with pooled & direct URLs |
| **Auth** | Auth.js (NextAuth v5) | Google OAuth + Credentials demo logins |
| **AI / LLM** | Groq API (`llama-3.3-70b-versatile`) / xAI | Sub-second structured complaint triage & weekly synthesis |
| **Speech** | Web Speech API | Zero-cost browser speech recognition in EN, HI, GU |
| **Validation** | Zod | Runtime validation for user inputs & AI outputs |

---

## ⚡ API Functions & Endpoints

- `POST /api/feedback`: Anonymous voice and text feedback parsing with Groq AI and Zod validation.
- `GET /api/dashboard`: Aggregated manager analytics, demand stats, charts, and forecasts.
- `GET | POST /api/reports/weekly`: Generates and retrieves the AI weekly executive operations briefing.
- `GET /api/leaderboard`: Top 10 student zero-waste leaderboard (privacy-preserved: first name & block only).
- `GET | POST /api/streak`: Personal student streak tracker with once-per-day enforcement and skip-violation reset.
- `GET | POST /api/skips`: Student meal skip toggle with cutoff-time enforcement.
- `GET | POST /api/ratings`: 1-to-5 star ratings with anti-cheat streak reset if dining after a marked skip.
- `GET /api/menu/today`: Current meal schedule, dish listings, and cutoff countdowns.
- `GET /api/health`: Production diagnostic route verifying database ping, pooled connections, and environment keys.

---

## 💻 Local Setup Instructions

### 1. Clone the Repository
```bash
git clone https://github.com/aryapatel23/HH-Goa-WisprFlow-task.git
cd HH-Goa-WisprFlow-task
npm install
```

### 2. Configure Environment Variables
Copy `.env.example` to `.env`:
```bash
cp .env.example .env
```
Ensure the following keys are provided:
```env
DATABASE_URL="postgresql://postgres:password@localhost:5432/messmeter?schema=public"
DIRECT_URL="postgresql://postgres:password@localhost:5432/messmeter?schema=public"
MIGRATE_DEPLOY_BEFORE_NEXT_JS_BUILD="false"
AUTH_SECRET="dev-secret-key-at-least-32-characters-long"
GROQ_API_KEY="gsk_..."
GROQ_MODEL="llama-3.3-70b-versatile"
XAI_BASE_URL="https://api.groq.com/openai/v1"
```

### 3. Initialize & Seed Database
```bash
npx prisma db push
npx prisma db seed
```

### 4. Run Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser. Visit [http://localhost:3000/login](http://localhost:3000/login) to log in with 1-click demo accounts.

---

## ☁️ Vercel Production Deployment

MassMatter is configured for automatic deployment on Vercel with hosted PostgreSQL (Neon, Supabase, or AWS RDS):

1. **Dual Database Connections**: Set `DATABASE_URL` (pooled / PgBouncer) and `DIRECT_URL` (unpooled direct connection for migrations).
2. **Build Pipeline**: `scripts/build.js` conditionally deploys Prisma migrations when `MIGRATE_DEPLOY_BEFORE_NEXT_JS_BUILD="true"`, executes `prisma generate`, and completes `next build`.
3. **Graceful Auth**: Google OAuth fails gracefully if credentials are not configured, allowing production demo logins to work seamlessly.

---

*Solo Project by Arya Patel | Built 100% with Voice via Wispr Flow for Hackathon Goa 2026*
