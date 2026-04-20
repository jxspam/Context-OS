# Next.js 16

Framework-specific quirks. Read before writing any Next.js code — several of these are runtime-only constraints that `tsc`, `eslint`, and `vitest` won't catch on their own.

## `"use server"` files: async-only exports

A file whose first statement is `"use server"` can **only export async functions**. Next.js's Server Actions loader enforces this at module evaluation time and throws:

> A "use server" file can only export async functions, found object.

Allowed exports:

- `export async function createTask(...) { ... }`
- `export const createTask = async (...) => { ... }`
- `export type Foo = ...` (erased at runtime)
- `export interface Foo { ... }` (erased at runtime)

**Not** allowed:

- `export const initialState = { ok: false }` — object
- `export class Thing {}` — class
- `export function foo() {}` — sync function
- `export default { ... }` — non-async default

If a form needs an `initialState` for `useActionState`, put the type + constant in a sibling module (e.g. `actions-types.ts`) and import it from both the server actions file and the client form.

### Why the normal gate misses it

- `tsc` checks types, not Next.js runtime invariants
- ESLint's Next plugin has no rule for this
- Vitest loads modules through Vite/esbuild, which doesn't apply Next's SWC/RSC transform — the file loads as plain JS and non-async exports work fine
- `next build` only statically evaluates the module graph for **static** routes. Anything with `searchParams`, `cookies()`, or dynamic `params` is deferred to request time, so the invariant fires in `next dev` on first page load — after tests pass, after CI is green

### Catching it: Vitest contract test

Add this test once per app; it runs under the existing `pnpm test`:

```ts
// web/src/contracts.test.ts
import { readdirSync, readFileSync, statSync } from "node:fs";
import { join, resolve } from "node:path";
import { pathToFileURL } from "node:url";
import { describe, it, expect } from "vitest";

function* walk(dir: string): Generator<string> {
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry);
    if (statSync(full).isDirectory()) yield* walk(full);
    else if (/\.(ts|tsx)$/.test(full)) yield full;
  }
}

const useServerFiles = [...walk("src")].filter((f) => {
  const src = readFileSync(f, "utf8").trimStart();
  return src.startsWith('"use server"') || src.startsWith("'use server'");
});

describe('"use server" files only export async functions', () => {
  for (const file of useServerFiles) {
    it(file, async () => {
      const mod = await import(pathToFileURL(resolve(file)).href);
      for (const [name, value] of Object.entries(mod)) {
        expect(
          (value as { constructor?: { name?: string } })?.constructor?.name,
          `${file}: export '${name}' must be an AsyncFunction`,
        ).toBe("AsyncFunction");
      }
    });
  }
});
```

Zero deps (Node 20 built-in `fs` + Vitest). If a file exports a type alias, TS erases it at runtime so it never appears in `Object.entries(mod)` — the test ignores it naturally. If it exports a constant, the test fails with a clear message pointing at the file and the offending binding.

## Async primitives

Next 16 makes several previously-sync APIs async. Missing an `await` here is a silent type error in strict mode.

- `cookies()` from `next/headers`:

  ```ts
  const jar = await cookies();
  const value = jar.get("foo")?.value;
  ```

- Page `searchParams` is a `Promise`:

  ```ts
  export default async function Page({
    searchParams,
  }: {
    searchParams: Promise<{ filter?: string | string[] }>;
  }) {
    const { filter } = await searchParams;
  }
  ```

- Dynamic route `params` is a `Promise`:

  ```ts
  export default async function FocusPage({
    params,
  }: {
    params: Promise<{ id: string }>;
  }) {
    const { id } = await params;
  }
  ```

`createClient()` in the Supabase server wrapper has to be `async` because it awaits `cookies()` internally.

## `useSearchParams` in the root layout

Any client component mounted inside `app/layout.tsx` that calls `useSearchParams()` must be wrapped in `<Suspense fallback={null}>`. Without it, `next build` fails during static page generation with:

> useSearchParams() should be wrapped in a suspense boundary.

The Suspense boundary is how Next draws the static/dynamic split.

## `next lint` is removed

The `next lint` wrapper is gone in Next 16. Use `eslint .` directly. In `eslint.config.mjs` (flat config), import the config array and spread it:

```js
import next from "eslint-config-next/core-web-vitals";
export default [...next];
```

Do **not** use `FlatCompat` with `eslint-config-next` 16 — it triggers `Converting circular structure to JSON`.

## `next build` mutates tracked files

On first build, Next rewrites:

- `tsconfig.json` — sets `jsx: "react-jsx"`, adds `.next/dev/types/**/*.ts` to `include`
- `next-env.d.ts` — adds `import "./.next/types/routes.d.ts"`

These edits are intentional. Commit them; don't fight the tool.

Also ensure `*.tsbuildinfo` is in `.gitignore`.

## Turbopack is default

`next dev` and `next build` use Turbopack by default in Next 16. If a multi-lockfile workspace warning appears, set `turbopack.root` in `next.config.ts` to silence it:

```ts
export default {
  turbopack: { root: __dirname },
};
```

## Supabase single-row fetches

Use `.maybeSingle()` whenever a missing row is a valid UX outcome (e.g. a route that should `notFound()` on an unknown id):

```ts
const { data } = await supabase.from("tasks").select("*").eq("id", id).maybeSingle();
if (!data) notFound();
```

`.maybeSingle()` returns `{ data: null, error: null }` on 0 rows. `.single()` errors on 0 rows and forces you to distinguish "no row" from "real failure".

## Revalidation after mutations

Server actions that mutate data must call `revalidatePath(path)` (or `revalidateTag`) before returning — otherwise the cached RSC payload serves stale data on the next render:

```ts
await supabase.from("tasks").insert({ title });
revalidatePath("/");
return { ok: true, error: null };
```
