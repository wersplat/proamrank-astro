# Pro-Am Rankings (Astro + Supabase + R2)

## Prereqs
- Cloudflare Pages
- R2 bucket (bind as `R2_BUCKET`  in Pages → Functions)
- Supabase project with read-only views (RLS)

## Local dev
```
npm i
npm run dev
```

## Env (Pages → Settings → Environment Variables)
- SUPABASE_URL
- SUPABASE_ANON_KEY
- PUBLIC_ASSETS_BASE (optional, e.g., https://cdn.proamrank.gg)

## Functions (Pages → Functions → R2 Bindings)
- Bind your bucket name as `R2_BUCKET` 

## Replace DB Types
- Run: `supabase gen types typescript --project-id <YOUR_PROJECT_ID> > src/lib/db.types.ts` 
- Update queries in `src/pages/index.astro`  to match your view names/columns.

## Deploy
- Connect repo to Cloudflare Pages
- Build: `npm run build` 
- Output dir: `dist` 

After generation, you will:
- Replace `src/lib/db.types.ts` with your actual generated types.
- Update the Supabase view name/columns in `src/pages/index.astro`.
- Set env vars and R2 binding in Cloudflare Pages.
- (Optional) Map `PUBLIC_ASSETS_BASE` to an R2 public domain/Worker.
