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
import { resolve } from "node:path";

export default defineConfig({
  plugins: [react()],
  resolve: { alias: { "@": resolve(__dirname, "src") } },
  test: { environment: "jsdom", globals: true, setupFiles: ["./vitest.setup.ts"] },
});
```

Do **not** use `vite-tsconfig-paths` — it's ESM-only and Vite's CJS config loader can't `require()` it. Set `resolve.alias` by hand; simpler and no broken peer dep.

### Gotchas

- **`userEvent` v14 + `vi.useFakeTimers()` hang.** user-event schedules its own zero-delay timers to sequence events; under fake timers they never fire and the test times out. For any assertion that drives `setInterval`/`setTimeout`, switch to `fireEvent.click` / `fireEvent.keyDown` — synchronous, timer-free. Keep `userEvent` for non-timer interactions. Always `vi.useRealTimers()` in an `afterEach`.
- **Mocking server actions.** Mock `next/cache` and the Supabase server client at the module boundary:

  ```ts
  vi.mock("next/cache", () => ({ revalidatePath: vi.fn() }));
  vi.mock("@/lib/supabase/server", () => ({
    createClient: vi.fn(async () => ({ from: () => ({ insert: insertMock }) })),
  }));
  ```

  Set `process.env.NEXT_PUBLIC_SUPABASE_URL` / `NEXT_PUBLIC_SUPABASE_ANON_KEY` in `beforeEach` so the env-guard early-return doesn't short-circuit the test path.

### Contract tests

Alongside feature tests, keep one **contract test** per invariant the runtime enforces but the compiler doesn't. The prime example is Next 16's `"use server"` async-only exports rule — see `agent-docs/nextjs.md` for the full snippet. That test lives at `web/src/contracts.test.ts` and runs under `pnpm test` with zero extra wiring.

If you discover another class of runtime bug that unit tests missed, add a sibling contract test rather than hoping the next iteration remembers the rule.

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
