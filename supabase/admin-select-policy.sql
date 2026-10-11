-- Additional policy: authenticated prompt admins can view drafts and published records.
create policy "Prompt admins can view all prompts" on public.prompts
for select to authenticated
using ((auth.jwt()->'app_metadata'->>'role') = 'prompt_admin');
