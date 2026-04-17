# Testing

## The quality gate

Every commit must pass, from `web/`:

```bash
pnpm typecheck && pnpm lint && pnpm test
```

- **typecheck** — `tsc --noEmit`
- **lint** — `eslint`
- **test** — `vitest run`

Exactly this command. No `--no-verify`. No skipping.

## Vitest

Unit and integration tests live alongside the code they test:

```
src/components/TaskCard.tsx
src/components/TaskCard.test.tsx
```

Use `@testing-library/react` for component tests. Mock Supabase at the module boundary — don't hit a real DB in unit tests.

Minimal config in `web/vitest.config.ts`:

```ts
import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig({
  plugins: [react(), tsconfigPaths()],
  test: { environment: "jsdom", globals: true, setupFiles: ["./vitest.setup.ts"] },
});
```

## Playwright (e2e)

Only added when a story explicitly needs cross-page flow coverage. Not required for the 5 stories in this PRD.

If added: tests live in `web/e2e/`. Run via `pnpm e2e`. Keep them out of the `pnpm test` gate unless the story says otherwise (they're slower and flaky against a cold Supabase).

## CI

You create `.github/workflows/ci.yml` as part of US-006 — it's not pre-baked. The workflow runs the same quality gate on Node 20 with pnpm via corepack: checkout, install, then `pnpm -C web typecheck && pnpm -C web lint && pnpm -C web test`.

Triggers: push to any branch, PR to `main`. Skip gracefully when `web/package.json` doesn't exist yet (early stories may land before the Next.js app is scaffolded).

No deploy step in CI. Vercel owns deploys; release.yml (also US-006) owns tag-based GitHub Releases.

## What not to test

- Third-party libraries. Trust them.
- Static markup with no logic.
- Trivial getters / setters.

Test the behaviour the PRD's acceptance criteria describe. If a story says "row appears in list", write a test that asserts exactly that.
