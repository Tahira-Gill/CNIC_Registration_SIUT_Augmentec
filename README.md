# CNIC Registration — Technology Assessment (SIUT × Augmentec)

A two-part web app for the CNIC-Based Patient Registration System technology
assessment:

- **Public form** (`/`) — anyone with the link rates the system using the
  RE-AIM + Proctor's instrument. No login needed.
- **Dashboard** (`/dashboard`) — only you can sign in and see the results:
  SIUT vs Augmentec comparisons, section-level charts, individual responses,
  and a CSV export.

Built with Next.js 14 + Tailwind + Supabase (Postgres, Auth, Row Level
Security), ready to deploy on Vercel.

---

## 1. Create the Supabase project (backend + database)

1. Go to [supabase.com](https://supabase.com) → **New project**. Pick any
   name (e.g. `cnic-assessment`) and a strong database password (save it
   somewhere safe — you won't need it day-to-day, but Supabase asks for it).
2. Once the project is ready, open **SQL Editor → New query**, paste the
   entire contents of `supabase/schema.sql` from this project, and click
   **Run**. This creates the `responses` table and locks it down so:
   - anyone can *submit* a response (needed for the public form), but
   - only a signed-in user (you) can *read* responses (needed for the
     dashboard).
3. Go to **Authentication → Providers → Email** and turn **off** "Allow new
   users to sign up." This is what keeps the dashboard to just you — nobody
   can create their own login.
4. Go to **Authentication → Users → Add user**, and create the one account
   you'll use to log in (your email + a password). This is the account
   you'll use at `/login`.
5. Go to **Project Settings → API** and copy two values, you'll need them in
   step 3 below:
   - **Project URL**
   - **anon public** key (NOT the `service_role` key — never use that one
     in this app)

## 2. Push the code to GitHub

From this project folder:

```bash
git init
git add -A
git commit -m "CNIC registration technology assessment app"
```

Then create a new empty repository on GitHub (github.com → New repository,
don't initialize with a README), and push:

```bash
git remote add origin https://github.com/YOUR-USERNAME/cnic-assessment.git
git branch -M main
git push -u origin main
```

## 3. Deploy on Vercel

1. Go to [vercel.com](https://vercel.com) → **Add New → Project**, and
   import the GitHub repo you just pushed.
2. Before clicking Deploy, open **Environment Variables** and add:

   | Name | Value |
   |---|---|
   | `NEXT_PUBLIC_SUPABASE_URL` | the Project URL from step 1.5 |
   | `NEXT_PUBLIC_SUPABASE_ANON_KEY` | the anon public key from step 1.5 |

3. Click **Deploy**. In a couple of minutes you'll get a live URL like
   `cnic-assessment.vercel.app`.

That's it — the app is live.

- Share `https://cnic-assessment.vercel.app/` with SIUT and Augmentec
  respondents — that's the form.
- Go to `https://cnic-assessment.vercel.app/dashboard` yourself and sign in
  with the account you created in step 1.4 — that's your private dashboard.

### Local development (optional)

If you want to run it on your own machine before/instead of Vercel:

```bash
npm install
cp .env.local.example .env.local   # then fill in your Supabase values
npm run dev
```

Open `http://localhost:3000`.

---

## Already deployed this before?

If you already ran the old `schema.sql` and have live responses, don't
re-run `schema.sql` — it would try to recreate the table. Instead, open
**Supabase → SQL Editor → New query**, paste in
`supabase/migration_002_dual_submission.sql`, and run it once. It upgrades
your existing table in place (adds the two new coverage columns, backfills
them from your old data, and drops the old column) without losing any
responses you've already collected. Then redeploy the updated app code
(push to GitHub, Vercel redeploys automatically).

## How the form maps to the paper instrument

- Respondents pick **one or both** phases at the start: **Rollout
  monitoring (weeks 1–12)** brings in **Part I — Proctor's Implementation
  Outcomes**; **Evaluate & sustain checkpoint** brings in **Parts II–V** —
  RE-AIM, Service Outcomes, End-User Outcomes, and the Overall Assessment —
  and asks which checkpoint (month 1/3/6/12) it's for. Picking both adds
  every section from both phases into one flow, so someone doing a
  checkpoint review after weeks of rollout monitoring doesn't have to
  submit twice.
- Phase 1 (CFIR, diagnose readiness) isn't in this form, per the source
  document — it's conducted separately, before go-live.

Respondents pick **SIUT** or **Augmentec** as their organization at the
start; the dashboard uses that to compare the two sides, exactly as the
instrument intends ("completed independently by SIUT and by Augmentec, then
compared").

## Where things live in the code

- `lib/questions.ts` — every question, section, and label in the
  instrument. Edit wording here if anything needs tweaking; the form and
  dashboard both read from this single source.
- `supabase/schema.sql` — the database table and security rules.
- `app/page.tsx` — the public multi-step form.
- `app/dashboard/` — the protected dashboard (`layout.tsx` guards access,
  `page.tsx` loads the data, `DashboardClient.tsx` in
  `components/dashboard/` renders it).
- `app/login/page.tsx` — your sign-in page.

## Adding a second admin later

If you ever want a colleague (e.g. Dr. Mohsin) to also see the dashboard,
add them the same way you added yourself: **Supabase → Authentication →
Users → Add user**. No code changes needed.
