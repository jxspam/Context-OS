# web — Context-OS app

This is the "here's one I prepared earlier" branch. The Next.js app lives here after Ralph has chewed through the 6 user stories in `../design/PRD.md`.

## To run locally

```bash
# from the repo root, first time only:
./setup.sh            # or .\setup.ps1 on Windows

# then:
cd web
pnpm install
pnpm dev              # → http://localhost:3000
```

Your Supabase credentials should already be in `web/.env.local` (setup script prompted for them).

## State of this branch

- `main` is the clone point (README + setup only)
- `buildclub/design` has Jax's full design artifacts
- `buildclub/design-prune` has the scaled-back PRD, `CLAUDE.md`, and `agent-docs/`
- **`buildclub/ralph`** (you are here) — the app Ralph produced from all of the above
- `buildclub/agents` adds Ellie's mastra agents on top

The `web/` directory is populated before the meetup by running:

```bash
git checkout buildclub/design-prune
./scripts/ralph/ralph.sh --tool claude 10
```

If you're cloning fresh and want to run the app without rebuilding it, you're in the right place.
