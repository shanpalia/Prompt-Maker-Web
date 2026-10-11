# Deploy the Prompt Maker admin API

The admin dashboard now sends write operations to the Supabase Edge Function `admin-prompts`. Deploy this function before using Add/Save/Publish/Delete in the dashboard.

## 1. Create the Edge Function

In Supabase Dashboard, open project `ralinnuegsbuvlhwpzln` → **Edge Functions** → **Deploy a new function**. Name it exactly:

`admin-prompts`

Copy the full code from this repository file into the function editor:

`supabase/functions/admin-prompts/index.ts`

Deploy the function. In the function settings, turn off the platform's **Verify JWT** gateway option for this function because the request uses a Firebase ID token, not a Supabase Auth JWT. The function itself validates the Firebase token through Firebase Identity Toolkit and only permits the verified admin email `shanpalia786@gmail.com`.

## 2. Add Edge Function secrets

In Edge Functions → Secrets, set these values:

- `SUPABASE_URL` = `https://ralinnuegsbuvlhwpzln.supabase.co`
- `SUPABASE_SERVICE_ROLE_KEY` = your project's **service_role** secret key from Project Settings → API Keys. Never put this key in HTML, GitHub source, or a public client.
- `FIREBASE_WEB_API_KEY` = the `apiKey` value in `firebase-config.js` in this repository.

Do not share or commit the service-role key. The function uses it only on the server side.

## 3. Test

1. Wait for GitHub Pages to publish the latest commit.
2. Open `https://shanpalia.github.io/Prompt-Maker-Web/admindash.html`.
3. Sign in using the verified admin account `shanpalia786@gmail.com`.
4. Add a small test prompt and save it. A selected image must be 10 MB or smaller.
5. Open Supabase → Table Editor → `public.prompts` and confirm the row exists.
6. Mark the prompt as published and reload the public homepage.

If the function returns an error, copy the exact error shown in the admin dashboard. Do not disable RLS or add unrestricted public write policies as a workaround.
