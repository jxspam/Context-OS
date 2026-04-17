# Deployment

## Vercel

The app deploys to Vercel. Setup:

```bash
cd web
vercel login       # opens browser
vercel             # links project, deploys preview
vercel --prod      # after main is green, deploy production
```

Once linked, the repo's `main` branch auto-deploys via Vercel's Git integration. PRs get preview URLs automatically.

## Environment variables

Set in Vercel dashboard or via CLI:

```bash
vercel env add NEXT_PUBLIC_SUPABASE_URL production
vercel env add NEXT_PUBLIC_SUPABASE_ANON_KEY production
# Repeat for preview + development
```

**Never commit `.env.local`.** The setup script writes it locally; `.gitignore` keeps it out of git.

If a server-only Supabase service role key is ever added: name it `SUPABASE_SERVICE_ROLE_KEY` (no `NEXT_PUBLIC_` prefix) so it stays server-side.

## Build

Vercel detects Next.js automatically. The build command is `pnpm build`, install is `pnpm install`, output is `.next`. No custom config needed — `vercel.json` is not checked in.

## GitHub Actions

Two workflows, both authored as part of US-006 (not pre-baked):

- **`.github/workflows/ci.yml`** — typecheck + lint + tests on every push and PR. Does **not** deploy. If you need CI to gate deploys, toggle Vercel's "Require CI to pass" on the project.
- **`.github/workflows/release.yml`** — on git tag push matching `v*`, runs the gate, then creates a GitHub Release with auto-generated notes via `softprops/action-gh-release@v2`.

Ralph creates both files when working US-006. They should not exist before that story runs.

## Domain

The free Vercel subdomain (`<project>-<hash>.vercel.app`) is fine for the demo. Custom domains are post-meetup territory.
