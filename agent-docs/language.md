# Language & framework

## TypeScript

- `strict: true` in `tsconfig.json`. Non-negotiable.
- No `any`. Use `unknown` + narrowing if you truly don't know the shape.
- No `@ts-ignore` / `@ts-expect-error` without a comment explaining why, and a link to an issue if possible.
- Prefer `type` aliases for unions, `interface` for object shapes you expect to extend.
- Shared types live in `src/lib/types.ts`. Inline one-off types at their use site.

## Next.js (App Router)

- Target Next.js 16. Do not use legacy `pages/` router features.
- **Server components by default.** Mark a component client only when it needs: state, effects, event handlers, browser APIs, or context consumption.
- **Server actions** for mutations. Put them in a co-located `actions.ts` with `"use server"` at the top. The file can only export async functions — see `agent-docs/nextjs.md` for the full constraint, the async-primitive migration (cookies/searchParams/params), and the Vitest contract test that enforces it.
- Routing: file-based. Dynamic segments in brackets (`[id]`). No custom server.
- Metadata via the `metadata` export, not `<Head>`.

For all other Next 16-specific behaviour (async `cookies()` / `searchParams` / `params`, `useSearchParams` Suspense requirement, flat ESLint config, Turbopack defaults, Supabase `.maybeSingle()` pattern), read `agent-docs/nextjs.md` before writing code.

## React 19

- Functional components only.
- Prefer `useActionState` for form + server action pairs.
- `use` hook for unwrapping promises in server components where it reads naturally.
- No class components. No `forwardRef` unless absolutely required — React 19 forwards automatically.

## Naming

- Components: `PascalCase` (file: `TaskCard.tsx`, export: `TaskCard`).
- Hooks: `useCamelCase` (file: `useFocusTimer.ts`).
- Utility functions: `camelCase`.
- Types / interfaces: `PascalCase`.
- Constants: `SCREAMING_SNAKE_CASE` for module-level true constants; `camelCase` otherwise.

## What not to do

- No Redux / Zustand / other client state libraries. Server state + URL state covers the PRD.
- No CSS-in-JS. Tailwind only.
- No default exports except for Next.js route files (which require them).
