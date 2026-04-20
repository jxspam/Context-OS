# Context-OS

Follow-along repo for **Optimising Vibe Coding — Ship Full-Stack AI Apps** (Brisbane, 20 Apr 2026).

Three talks, three branches. Check one out and you're at the state that talk *ends* on.

## What you need before you start

- A terminal you're comfortable with
- `git` installed
- A [GitHub](https://github.com/join) account (free)
- A [Supabase](https://supabase.com) account (free tier is fine)
- A [Vercel](https://vercel.com/signup) account (free tier is fine)

## Clone it

```bash
git clone https://github.com/jxspam/Context-OS.git
cd Context-OS
```

(Or use [GitHub Desktop](https://desktop.github.com/) if the terminal isn't your thing.)

## Run the setup script

Installs everything you need: Node, pnpm, GitHub CLI, Claude Code, Ralph, the Supabase CLI, and the Vercel CLI. Safe to re-run — it skips anything already installed.

**macOS / Linux:**

```bash
./setup.sh
```

**Windows (PowerShell):**

```powershell
.\setup.ps1
```

It will prompt you for your Supabase **Project URL** and **anon key** and drop them into `web/.env.local` for you.

## The talks

| Branch | Talk | State it represents |
|---|---|---|
| `main` | — | Clone point. README + setup scripts only. |
| `buildclub/design` | **Jax — Design** | Stitch output + full PRD. End of talk 1. |
| `buildclub/design-prune` | (bridge) | Full PRD trimmed to 6 stories. Start of talk 2. |
| `buildclub/ralph` | **Chris — Ralph** | Working Next.js app, manual features. End of talk 2. |
| `buildclub/agents` | **Ellie — Agentic** | Mastra agents wired into the app. End of talk 3. |
| `ref/pre-rewrite` | — | Snapshot of the repo before this layout was cut. |

Jump to the state you want:

```bash
git checkout buildclub/ralph
cd web
pnpm install && pnpm dev
```

## Further reading

- [Stitch](https://stitch.withgoogle.com/) — Google's AI design tool used in talk 1
- [Ralph — the autonomous AI agent loop](https://github.com/snarktank/ralph) — driving talk 2
- [Mastra](https://mastra.ai) — the agent framework used in talk 3
- [Claude Code docs](https://docs.claude.com/en/docs/claude-code)
- [Supabase + Next.js guide](https://supabase.com/docs/guides/auth/server-side/nextjs)
- [Meetup page on Luma](https://luma.com/yo5jatjk)
