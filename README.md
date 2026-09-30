# MassMatter

> **"Speak up about your food. Cook what students eat. Waste less."**

An AI-powered hostel mess feedback, demand forecasting, and food-waste reduction platform built with **Wispr Flow** (voice-driven development) for the **Rai University Hostel Mess Pilot**.

---

## 📌 Problem Statement

Hostel and college messes cater to hundreds of students three times a day, yet operations run almost entirely on guesswork:
- **Blind Cooking & Enormous Food Waste**: Cooking quantities are based on fixed estimates rather than real-time demand. Tons of edible food are thrown away daily, while popular meals occasionally run short.
- **Unheard Feedback**: Paper registers, chaotic WhatsApp groups, and dusty suggestion boxes fail to provide structured data. Complaints regarding taste, hygiene, or undercooked dishes rarely reach mess managers in time to make adjustments.
- **No Early Skip Signals**: Students have no frictionless mechanism to notify the kitchen that they are eating out or skipping dinner before cooking begins.
- **Lack of Actionable Insights**: Managers cannot easily pinpoint which specific dishes suffer high rejection rates or how weekday patterns affect dining attendance.

---

## 💡 The Solution

MassMatter converts hostel mess operations from guess-based cooking to **data-driven precision**:

1. **Voice-First, Multilingual Feedback**: Students tap the microphone and speak in **Hindi, English, Gujarati, or Hinglish** (e.g., *"aaj ka paneer bahut oily tha, aur roti kacchi thi"*). The browser captures speech (Web Speech API), and Claude 3.5 Sonnet translates, categorizes (Hygiene, Taste, Quantity, Service), scores sentiment, and links feedback to the exact dish.
2. **Anonymous Complaint Box**: Student identity is strictly isolated from complaints, fostering honest and fearless feedback.
3. **Headcount Demand Forecasting**: Calculates target preparation headcount in real-time:
   $$\text{Target Headcount} = \text{Enrolled Students} - \text{Logged Meal Skips} \pm \text{AI Weekday Adjustment}$$
4. **The Waste-Free Streak & Gamification**: Students earn streak counters and hostel block leaderboard points for marking meal skips before the cutoff time and finishing their meals with clean plates.
5. **AI Weekly Executive Briefing**: Generative AI synthesizes thousands of ratings, skips, and complaints into **3 Key Insights** and **3 Actionable Kitchen Directives** every week.
6. **Role-Based Access**: Role protection separating **Student** view (`/student`) from **Manager & Admin** dashboard (`/dashboard`).
7. **Real Hostel Pilot**: Pre-seeded with actual timings and menu items from Rai University Hostel Mess (Paneer Butter Masala, Dal Tadka, Jeera Rice, Phulka Roti, Gulab Jamun).

---

## 🔑 Quick Demo Accounts

For rapid evaluation and testing, MassMatter includes 1-click demo login buttons directly on the [/login](http://localhost:3000/login) page:

| Role | Demo Email | Access Permission | Destination Page |
|---|---|---|---|
| **Student** | `student@massmatter.com` | Student Portal (Menu, ratings, skips, voice feedback) | `/student` |
| **Mess Manager** | `manage@massmatter.com` | Manager Analytics Dashboard & Demand Forecast | `/dashboard` |
| **Chief Admin** | `admin@massmatter.com` | Full Administrative & Manager Analytics Dashboard | `/dashboard` |

> **Role Guarding**: If a student attempts to open `/dashboard`, they are automatically intercepted and redirected to `/student` with an access alert.

---

## 🚀 Planned Features & Roadmap

### Core MVP Features
- [x] **Next.js 16 App Router & TypeScript Architecture**: Scalable, type-safe full-stack setup.
- [x] **Tailwind CSS & shadcn/ui Component System**: Responsive, accessible, mobile-first design.
- [x] **Auth.js (NextAuth v5) Authentication**: Google Sign-In and email login with role-based session support (`student`, `manager`, `admin`).
- [x] **Prisma ORM & PostgreSQL Schema**: Relational models for `User`, `Meal`, `Dish`, `Rating`, `Skip`, `Complaint` (anonymous), `Streak`, and `WeeklyReport`.
- [x] **Mobile-First Login Page**: Clean sign-in page with 1-click demo accounts for Student, Manager, and Admin.
- [x] **Role-Based Routing & Middleware**: Strict protection ensuring students can only open `/student` and only managers/admins can open `/dashboard`.
- [x] **Anthropic Claude SDK Integration**: Structured prompt schemas for complaint classification and weekly reporting with automated fallbacks.
- [x] **Zod Validation**: Strict runtime schema validation for feedback submissions and AI structured outputs.
- [x] **Daily Menu & 1-Tap Star Ratings**: Rapid 1-to-5 star rating per dish with emoji reactions.
- [x] **Skip-Meal Toggle**: Instant dinner/lunch skip notification before kitchen preparation cut-off.
- [x] **Voice Feedback Widget**: Multilingual speech capture with instant AI tag generation.
- [x] **Waste-Free Streak Counter & Hostel Leaderboard**: Gamified plate-clearing incentives.
- [x] **Manager Dashboard**: Expected headcount metrics, dish-wise performance tables, and waste trends.

### Planned Stretch Features
- [ ] **Thali Scan (Vision AI)**: Plate photo upload analyzed by Claude Vision to calculate leftover percentage per dish.
- [ ] **Ask MassMatter (Natural Language Analytics)**: Conversational chat interface for managers to ask natural-language questions over mess data.
- [ ] **AI Menu Optimizer**: Automatic menu recommendations for upcoming weeks based on historical satisfaction and waste data.
- [ ] **PWA & Mobile Push Notifications**: Push alerts sent 30 minutes before meal skip cutoff times.

---

## 🛠️ Technology Stack

| Layer | Technology | Purpose |
|---|---|---|
| **Framework** | Next.js 16 (App Router) | Full-stack React framework with Server & Client components |
| **Language** | TypeScript | End-to-end type safety |
| **Auth** | Auth.js (NextAuth v5) | Google OAuth, Email/Credentials, role-based session claims |
| **Styling** | Tailwind CSS v4 | Modern, utility-first responsive styling |
| **UI Components** | shadcn/ui style components & Lucide React | Clean, accessible design system |
| **Charts** | Recharts | Visualizing waste reduction, headcount, and dish ratings |
| **Database & ORM**| PostgreSQL (Neon / Supabase / Local) + Prisma ORM | Relational data persistence |
| **Validation** | Zod | Schema validation for user input and AI responses |
| **AI / LLM** | Anthropic Claude SDK (`@anthropic-ai/sdk`) | Multilingual classification and executive reports |
| **Speech** | Web Speech API | Zero-cost browser speech-to-text in EN, HI, GU |

---

## 📂 Project Structure

```text
├── app/
│   ├── api/
│   │   ├── auth/
│   │   │   └── [...nextauth]/route.ts  # Auth.js route handler
│   │   └── feedback/
│   │       └── route.ts               # AI-powered anonymous feedback endpoint
│   ├── dashboard/
│   │   └── page.tsx                   # Protected Manager/Admin Demand & AI Dashboard
│   ├── login/
│   │   └── page.tsx                   # Mobile-first Login page with 1-click Demo Accounts
│   ├── student/
│   │   └── page.tsx                   # Protected Student Portal (Menu, ratings, skips, voice)
│   ├── globals.css                    # Tailwind CSS v4 styling rules
│   ├── layout.tsx                     # App root layout with SessionProvider and Navbar
│   └── page.tsx                       # Interactive home landing page
├── auth.ts                            # Auth.js configuration with Google & Credentials
├── components/
│   ├── ui/
│   │   ├── badge.tsx                  # Badge component with status variants
│   │   ├── button.tsx                 # Button component with CVA variants
│   │   ├── card.tsx                   # Card, CardHeader, CardContent
│   │   └── input.tsx                  # Accessible input field
│   ├── Navbar.tsx                     # Navigation header with session & role badges
│   └── SessionProvider.tsx            # NextAuth SessionProvider wrapper
├── docs/
│   └── PRD.md                         # Complete original Product Requirements Document
├── lib/
│   ├── anthropic.ts                   # Anthropic Claude SDK client instance
│   ├── prisma.ts                      # Prisma Client singleton
│   ├── utils.ts                       # Tailwind clsx + twMerge utility
│   └── validations.ts                # Zod data validation schemas
├── middleware.ts                      # Role-based route guard for /student & /dashboard
├── prisma/
│   ├── schema.prisma                  # PostgreSQL database models
│   └── seed.ts                        # Full week Indian hostel data seeder
├── public/                            # Static media and icons
├── types/
│   └── next-auth.d.ts                 # NextAuth role session type definitions
├── .env.example                       # Environment variables template
├── package.json                       # Dependencies and scripts
└── tsconfig.json                      # TypeScript compiler configuration
```

---

## ⚡ Getting Started

### 1. Clone & Install Dependencies
```bash
git clone https://github.com/aryapatel23/HH-Goa-WisprFlow-task.git
cd HH-Goa-WisprFlow-task
npm install
```

### 2. Environment Setup
Copy `.env.example` to `.env`:
```bash
cp .env.example .env
```
Fill in the credentials:
```env
DATABASE_URL="postgresql://postgres:password@localhost:5432/messmeter?schema=public"
AUTH_SECRET="your-32-char-auth-secret"
ANTHROPIC_API_KEY="your-anthropic-api-key"
# Optional for Google sign-in:
AUTH_GOOGLE_ID="your-google-client-id"
AUTH_GOOGLE_SECRET="your-google-client-secret"
```

### 3. Migrate & Seed Database
```bash
npx prisma db push
npx prisma db seed
```

### 4. Run Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser. Visit [http://localhost:3000/login](http://localhost:3000/login) to log in using the demo accounts.

---

*Owner: Arya Patel | Built for Hackathon Goa with Wispr Flow*
