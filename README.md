# Prompt Maker by PaliaAPK HUB

Mobile-first prompt library. **Developer by Shanpalia**.

## Real prompts only
The homepage queries `public.prompts` from Supabase and only displays rows with `status = 'published'`. There are no seeded/demo prompt cards. When the table is empty, the homepage shows an empty state.

## Connect Supabase
1. Create/open your Supabase project.
2. In SQL Editor, run `supabase/schema.sql`.
3. Then run `supabase/admin-select-policy.sql`.
4. In Supabase Authentication, create an account for the owner/admin.
5. In Supabase SQL Editor, set the trusted app metadata role for the account you created (replace the email):
   ```sql
   update auth.users set raw_app_meta_data = coalesce(raw_app_meta_data, '{}'::jsonb) || '{"role":"prompt_admin"}'::jsonb where email = 'YOUR_ADMIN_EMAIL';
   ```
   Sign out and sign in again after changing the role so the session JWT refreshes. Never put a service-role key in the app or GitHub Actions.
6. In GitHub repo Settings → Secrets and variables → Actions → New repository secret, add:
   - `NEXT_PUBLIC_SUPABASE_URL` = Supabase Project URL
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY` = Supabase publishable/anon key (never the service-role key)
7. Run the GitHub Actions workflow again so those public build-time settings are embedded in the Android static app.

## How to use
- On the home screen, tap the Prompt Maker logo/title five times quickly to open `/admin/`.
- Sign in with the Supabase admin account.
- Add title, category, prompt text and optionally a hosted preview image URL.
- Leave “Publish now” checked to make it appear on the homepage; uncheck it to save a draft.
- Only published rows appear publicly. The database Row Level Security policies restrict writes to a user with `app_metadata.role = prompt_admin`.

## Security
The five-tap shortcut is only a hidden route, not security. Authentication and database Row Level Security enforce permissions. Never embed a Supabase service-role key or OpenAI secret key in the Android app. AI generation can be added via a server-side service; this static APK should not contain private API keys.


## PC / laptop website (build this first)
This project is a responsive website; on screens wider than 900px it uses a desktop layout with a wide hero, horizontal category navigation, a 4–5 column prompt grid and a centered bottom navigation panel. The phone layout remains responsive.

### Run on your Windows PC
1. Install Node.js LTS from https://nodejs.org/.
2. Download this repository using GitHub's **Code → Download ZIP**, then extract it.
3. Open the extracted folder in VS Code, or open Command Prompt in that folder.
4. Run:
   ```bash
   npm install
   ```
5. Create a file named `.env.local` in the project root and add your Supabase project URL and publishable/anon key:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=https://YOUR_PROJECT.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=YOUR_SUPABASE_PUBLISHABLE_OR_ANON_KEY
   ```
6. Run:
   ```bash
   npm run dev
   ```
7. On the same PC, open http://localhost:3000. The admin page is at http://localhost:3000/admin/.

For a public website, deploy this Next.js project to a Next.js-compatible host such as Vercel and add the same two public Supabase environment variables in the host's project settings. The database schema and admin role setup above must be completed first. Never expose a Supabase service-role key or private AI API key in the browser.
