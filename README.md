# Prompt Maker — PaliaAPK HUB

Standalone static website powered by `index.html`. Developer by Shanpalia.

## Publish on GitHub Pages
- GitHub Actions deploys `index.html` directly when changes are pushed to `main`.
- In **Settings → Pages**, set **Build and deployment → Source** to **GitHub Actions**.
- Website: https://shanpalia.github.io/Prompt-Maker-Web/

## Connect Supabase
1. Run `supabase/schema.sql` in your Supabase SQL Editor.
2. Run `supabase/admin-select-policy.sql` if required by your table policies.
3. Open `index.html` and replace `YOUR_SUPABASE_PROJECT_URL` and `YOUR_SUPABASE_ANON_KEY` with your project's URL and public anon/publishable key.
4. Create the admin user in Supabase Authentication and configure the role required by the RLS policies.
5. Commit the updated `index.html` to `main`.

**Security:** only use the public anon/publishable key in browser code. Never put a Supabase `service_role` key or other private secret in `index.html`. Authentication and Supabase Row Level Security must enforce admin-only changes.

## Features
- Responsive standalone HTML/CSS/JavaScript; no Node.js build required.
- Search and category filters for published prompts.
- Copy prompt text.
- Admin sign-in and prompt create/edit/publish/unpublish/delete (requires Supabase configuration).
- Five quick taps on the brand also opens the admin panel.
