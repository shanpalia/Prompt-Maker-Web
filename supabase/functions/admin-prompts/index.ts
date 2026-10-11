// Secure admin API for Prompt Maker.
// Deploy as Supabase Edge Function: admin-prompts
// Required Edge Function secrets: SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, FIREBASE_WEB_API_KEY
const cors = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, apikey, content-type, x-client-info",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Content-Type": "application/json",
};
const json = (body: unknown, status = 200) => new Response(JSON.stringify(body), { status, headers: cors });

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: cors });
  if (req.method !== "POST") return json({ error: "POST required" }, 405);
  try {
    const authHeader = req.headers.get("Authorization") || "";
    const token = authHeader.replace(/^Bearer\s+/i, "");
    if (!token || token === authHeader) return json({ error: "Firebase sign-in token required." }, 401);

    // Firebase Identity Toolkit validates the ID token and returns the verified account.
    const lookup = await fetch(
      `https://identitytoolkit.googleapis.com/v1/accounts:lookup?key=${Deno.env.get("FIREBASE_WEB_API_KEY")}`,
      { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ idToken: token }) },
    );
    if (!lookup.ok) return json({ error: "Firebase token is invalid or expired. Sign in again." }, 401);
    const identity = await lookup.json();
    const user = identity.users?.[0];
    if (!user || (user.email || "").toLowerCase() !== "shanpalia786@gmail.com" || user.emailVerified !== true) {
      return json({ error: "Admin access denied. A verified authorized admin account is required." }, 403);
    }

    const base = (Deno.env.get("SUPABASE_URL") || "").replace(/\/$/, "");
    const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || "";
    if (!base || !serviceKey) return json({ error: "Supabase Edge Function secrets are not configured." }, 500);
    const body = await req.json();
    const action = body.action;
    const headers = { apikey: serviceKey, Authorization: `Bearer ${serviceKey}`, "Content-Type": "application/json" };

    if (action === "list") {
      const res = await fetch(`${base}/rest/v1/prompts?select=*&order=created_at.desc`, { headers });
      const data = await res.json();
      return res.ok ? json({ data }) : json({ error: data.message || "Could not load prompts." }, res.status);
    }
    if (action === "save") {
      const p = body.prompt || {};
      if (!p.title || !p.prompt_text || !p.category) return json({ error: "Title, category and prompt text are required." }, 400);
      const payload = {
        title: String(p.title).slice(0, 100), category: String(p.category).slice(0, 80),
        prompt_text: String(p.prompt_text), image_url: p.image_url || null,
        status: p.published ? "published" : "draft", published: !!p.published,
        published_at: p.published ? new Date().toISOString() : null, updated_at: new Date().toISOString(),
      };
      const isEdit = body.id !== null && body.id !== undefined && body.id !== "";
      const url = isEdit ? `${base}/rest/v1/prompts?id=eq.${encodeURIComponent(String(body.id))}` : `${base}/rest/v1/prompts`;
      const res = await fetch(url, {
        method: isEdit ? "PATCH" : "POST",
        headers: { ...headers, Prefer: "return=representation" },
        body: JSON.stringify(isEdit ? payload : { ...payload, created_at: new Date().toISOString() }),
      });
      const data = await res.json();
      return res.ok ? json({ data: Array.isArray(data) ? data[0] : data }) : json({ error: data.message || data.details || "Save failed." }, res.status);
    }
    if (action === "delete") {
      if (body.id === null || body.id === undefined) return json({ error: "Prompt ID required." }, 400);
      const res = await fetch(`${base}/rest/v1/prompts?id=eq.${encodeURIComponent(String(body.id))}`, { method: "DELETE", headers });
      if (!res.ok) return json({ error: await res.text() }, res.status);
      return json({ ok: true });
    }
    if (action === "upload") {
      const name = String(body.name || "image").replace(/[^a-zA-Z0-9._-]/g, "_").slice(-120);
      const mime = String(body.mime || "image/jpeg");
      const allowed = ["image/jpeg", "image/png", "image/webp", "image/gif"];
      if (!allowed.includes(mime)) return json({ error: "Only JPG, PNG, WEBP or GIF images are supported." }, 400);
      const encoded = String(body.base64 || "").replace(/^data:[^,]+,/, "");
      if (!encoded) return json({ error: "Image data is missing." }, 400);
      const raw = atob(encoded);
      if (raw.length > 10 * 1024 * 1024) return json({ error: "Image must be 10 MB or smaller." }, 413);
      const bytes = Uint8Array.from(raw, (c) => c.charCodeAt(0));
      const path = `${Date.now()}_${crypto.randomUUID()}_${name}`;
      const up = await fetch(`${base}/storage/v1/object/prompt-images/${encodeURIComponent(path)}`, {
        method: "POST", headers: { apikey: serviceKey, Authorization: `Bearer ${serviceKey}`, "Content-Type": mime, "x-upsert": "false" }, body: bytes,
      });
      if (!up.ok) return json({ error: (await up.text()).slice(0, 500) || "Image upload failed." }, up.status);
      return json({ url: `${base}/storage/v1/object/public/prompt-images/${path}` });
    }
    return json({ error: "Unknown action." }, 400);
  } catch (err) {
    return json({ error: err instanceof Error ? err.message : "Unexpected server error." }, 500);
  }
});
