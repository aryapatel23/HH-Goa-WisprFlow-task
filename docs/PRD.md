# MassMatter: Product Requirements Document
**AI-powered hostel mess feedback, demand forecasting and food-waste reduction platform**  
*Version 1.0 | Owner: Arya | Built with Wispr Flow (voice-driven development)*

---

## 1. Problem Statement
Hostel and college messes serve hundreds of students three times a day, yet they run almost blind. Cooking quantities are guesses, so a large share of cooked food is thrown away while other meals run short. Feedback is collected through paper registers, WhatsApp groups or a suggestion box that nobody reads, so complaints about taste, hygiene or quantity never reach the manager in a usable form. Students have no simple way to say "I will skip dinner", and managers have no way to see which dishes are consistently rejected.

Modern AI makes this solvable at low cost. Large language models can read free-text complaints in English, Hindi or Hinglish, classify and summarise them. Lightweight forecasting can predict tomorrow's headcount from skip-meal signals, weekday patterns and menu popularity. Generative AI can then turn raw data into a plain-language weekly report and answer a manager's questions in natural language ("Which dish had the most waste this month?").

MassMatter turns a mess from a guess-based operation into a data-driven one, with one-tap student input and an AI-assisted manager dashboard.

---

### 1A. The Distinctive Twist: Voice-First, Hostel-Specific, Multilingual
Most feedback apps are forms, and students ignore forms. MassMatter is built around three ideas that make it different from a generic rating app:

1. **Speak your feedback, in your own language.** Instead of typing, a student taps a mic and says, *"aaj ka paneer bahut oily tha, aur roti kacchi thi"* or the same in Gujarati or English. The browser transcribes it (Web Speech API), and an LLM translates, categorises, scores sentiment and links it to the exact dish and meal. This is the natural fit for a project built entirely with Wispr Flow: the product and the way it was built both run on voice.
2. **Built for one real hostel first.** The pilot uses the actual Rai University hostel mess menu, real meal timings and real dish names, with a short case-study section in the README. A named, real deployment is far more credible than generic demo data.
3. **The Waste-Free Streak.** Students earn streaks and a hostel-wide leaderboard for skipping meals they will not eat, on time, and for clearing their plate. It turns "mark skip" from a chore into a small game, and gives managers better forecasts as a side effect.
4. **Stretch twist: Thali Scan.** A student or mess worker photographs a returned plate; a vision-capable LLM estimates how much was left (none, quarter, half, most) and logs it against the dish. This gives a real, measured waste signal per dish, not just opinions.

---

## 2. Vision and Goals
- **Vision:** Every hostel mess cooks the right amount of food that students actually like.
- **Goals:**
  - Reduce estimated food waste by giving managers a headcount forecast per meal.
  - Raise feedback participation by making a rating a single tap.
  - Convert unstructured complaints into categorised, prioritised, actionable insights using AI.
  - Give the manager an AI-generated weekly summary and a chat interface over their own data.
- **Success Metrics (Pilot Targets):**
  - 60% or more of students rate at least one meal per week.
  - Forecast headcount within 10% of actual attendance after two weeks of data.
  - Complaint auto-classification agreement with manual labels of 85% or more.
  - Manager dashboard loads in under 2 seconds on a hostel Wi-Fi connection.

---

## 3. Users and Personas
- **Student (Primary):** Lives in the hostel, has a phone, wants to be heard without effort. Needs: see today's menu, rate in one tap, mark skipped meals, complain anonymously.
- **Mess Manager (Primary):** Plans cooking quantity and vendor orders. Needs: expected headcount, dish-wise ratings, waste trends, categorised complaints, a summary he can act on without reading hundreds of comments.
- **Warden / Admin (Secondary):** Needs a weekly report and visibility into hygiene issues.

---

## 4. Scope & Planned Features

### MVP (Must Build, 1-2 day voice build)
- **Student Login & Role-Based Access:** College domain email or OAuth; roles: student, manager, admin.
- **Daily Menu View:** Breakfast, lunch, snacks, dinner with timings and dish list.
- **One-Tap Star Rating:** 1 to 5 stars per meal or per dish with quick emoji reactions.
- **Skip-Meal Toggle:** Mark skipping upcoming meals before manager cut-off time.
- **Voice Feedback:** Browser Web Speech API capture in English, Hindi, Gujarati, Hinglish sent to Claude AI pipeline.
- **Anonymous Complaint Box:** Voice or text with AI auto-tagging (hygiene, taste, quantity, service, other), sentiment score, urgency level, and dish linking.
- **Waste-Free Streak & Hostel Leaderboard:** Gamified rewards for on-time skips and plate clearing.
- **Manager Dashboard:** Headcount forecasting (enrolled - skips + adjustments), average ratings, top rejected dishes, complaint distribution charts.
- **AI Weekly Summary:** Automated executive briefing generated from aggregated ratings, skips, and complaints.

### Stretch Features
- **Ask MassMatter (Natural Language Analytics):** Manager asks questions in plain language; Claude queries pre-approved views.
- **Thali Scan (Vision AI):** Photo plate leftover estimation.
- **Menu Optimizer:** LLM suggests next week's menu based on ratings and waste patterns.
- **PWA & Offline Menu:** Push notifications before meal skip cut-offs.

---

## 5. Technology Stack
- **Frontend & App Router:** Next.js 16 (App Router), React 19, TypeScript
- **Styling & UI:** Tailwind CSS, shadcn/ui design tokens, Lucide Icons
- **Charts & Visualizations:** Recharts
- **Database & ORM:** PostgreSQL (Neon / Supabase) via Prisma ORM
- **Validation:** Zod schemas
- **AI & LLM:** Anthropic SDK (`@anthropic-ai/sdk` / Claude 3.5 Sonnet) with structured JSON outputs & fallbacks
- **Voice Input:** Web Speech API (in-browser) + Claude translation & classification

---

## 6. Architecture & Data Model
- **User:** `id`, `email`, `name`, `role` (STUDENT, MANAGER, ADMIN), `hostelBlock`, `roomNumber`, `streakCount`
- **Meal:** `id`, `date`, `slot` (BREAKFAST, LUNCH, SNACKS, DINNER), `startTime`, `endTime`, `cutoffTime`
- **Dish:** `id`, `name`, `category`, `mealId`
- **Rating:** `id`, `userId`, `mealId`, `dishId`, `stars` (1-5), `reaction`
- **MealSkip:** `id`, `userId`, `mealId`, `createdAt`
- **Complaint:** `id`, `text`, `audioUrl`, `category`, `sentiment`, `urgency`, `mealId`, `dishId`, `status`, `createdAt` *(Identity strictly anonymous)*
- **WeeklyReport:** `id`, `weekStart`, `content`, `metricsJson`, `createdAt`
