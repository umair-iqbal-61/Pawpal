# 🐾 PawPal — AI Pet Care App

PawPal is a full-stack SaaS application that helps pet owners track their pet's health, log daily activities, set reminders, and get personalized AI-powered advice — all in one place.

**Live demo:** [pawpal.vercel.app](https://pawpal-seven.vercel.app)

---

## Screenshots

![Landing page](<img width="1896" height="5187" alt="Image" src="https://github.com/user-attachments/assets/6363e471-2d35-46e9-bd29-5ecd04df2ca5" />)
![Dashboard](<img width="1896" height="2760" alt="Image" src="https://github.com/user-attachments/assets/8aeec1a4-91b2-40cc-b3d7-8779c5cbff88" />)
![AI Chat](<img width="1896" height="1596" alt="Image" src="https://github.com/user-attachments/assets/1cfacd4f-743f-4078-9b63-39c822af4a53" />)

---

## Features

- **AI Chat** — Context-aware pet advisor powered by LLM API. Knows your pet's breed, age, weight history, meals, and vet visits before you even ask
- **Health Tracking** — Log meals, weight, and vet visits with full history per pet
- **Weight Chart** — Interactive line chart with range selector (2W / 1M / 3M / All) and trend indicators
- **Smart Reminders** — Browser notifications for feeding, medication, grooming, and vet visits on custom schedules
- **Photo Gallery** — Upload and manage pet photos with full-screen preview, stored on cloud storage
- **Multi-pet support** — Manage unlimited pets from one account
- **Dark mode** — Full dark mode support across every screen
- **Responsive** — Works on mobile, tablet, and desktop

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 18, Vite, React Router v6 |
| Styling | Tailwind CSS v4 |
| Backend | Supabase (PostgreSQL, Auth, Storage) |
| AI | LLM integration via REST API (Groq) |
| Charts | Recharts |
| Deployment | Vercel |

---

## Architecture

src/

├── components/

│   ├── tracking/          # MealLog, WeightLog, VetVisits, Reminders, PhotoGallery, WeightChart

│   ├── Chat.jsx           # AI chatbot UI

│   ├── DarkModeToggle.jsx

│   ├── ErrorBoundary.jsx

│   └── PetCard.jsx

├── hooks/

│   ├── useChat.js         # AI chat state + Supabase Edge Function proxy

│   ├── useDarkMode.js     # Theme persistence

│   ├── useReminders.js    # Browser notification scheduler

│   └── useSubscription.js

├── lib/

│   ├── supabase.js        # Supabase client + Google OAuth

│   └── storage.js         # File upload/delete utilities

├── pages/

│   ├── Landing.jsx

│   ├── Login.jsx

│   ├── Signup.jsx

│   ├── Dashboard.jsx

│   └── pets/

│       ├── PetList.jsx

│       ├── PetDetail.jsx

│       ├── AddPet.jsx

│       └── EditPet.jsx

supabase/

└── functions/

└── chat/              # Edge Function — secure AI proxy

---

## Database Schema

```sql
users          -- managed by Supabase Auth
pets           -- name, species, breed, age, weight, gender, notes, avatar_url
meal_logs      -- food_name, amount, meal_time, notes
weight_logs    -- weight, logged_at, notes
vet_visits     -- reason, vet_name, visit_date, next_visit, notes
reminders      -- title, reminder_type, remind_at, days[], is_active
pet_photos     -- url, caption, created_at
waitlist       -- email
```

All tables use Row Level Security (RLS) — users can only access their own data.

---

## Local Development

**Prerequisites:** Node.js 18+, Supabase CLI, Git

```bash
# Clone the repo
git clone https://github.com/umair-iqbal-61/Pawpal.git
cd pawpal

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env
# Fill in your Supabase URL and anon key

# Run locally
npm run dev
```

**Environment variables:**

```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
```

**Deploy Edge Functions:**

```bash
supabase login
supabase link
supabase secrets set GROQ_API_KEY=your-groq-key
supabase functions deploy chat --no-verify-jwt
```

---

## Key Technical Decisions

**Why Supabase over a custom backend?**
Supabase gives auth, PostgreSQL, file storage, and Edge Functions out of the box — no need to build and maintain a separate Node/Express API. RLS policies handle data security at the database level.

**Why a server-side AI proxy?**
The AI API key is never exposed to the browser. All AI requests go through a Supabase Edge Function that injects the key server-side before forwarding to the LLM provider.

**Why Groq?**
Generous free tier with fast inference. The integration uses standard OpenAI-compatible REST format making it trivial to swap providers.

---

## Roadmap

- [ ] PWA support for true background notifications
- [ ] Weight chart export as PNG/CSV
- [ ] Vet visit calendar view
- [ ] Multiple user roles (share pet with family members)
- [ ] Email digests for weekly health summaries

---

## License

MIT — feel free to fork and build on it.

---

Built by [Umair Iqbal](https://github.com/umair-iqbal-61) · 6th semester BS Information Technology student