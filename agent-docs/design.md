# Applying the design system

**Source of truth:** `design/DESIGN.md` (the "Kinetic Sanctuary"). Read it before building UI.

## Before writing any UI

1. Open `design/DESIGN.md` for the token/voice rules.
2. Open the matching stitch reference for the screen you're working on — **both** the `code.html` (layout contract) and `screen.png` (visual target):
   - Workspace (Today / Upcoming / All / task list) → `design/stitch/s2_contextos_workspace/`
   - Focus mode (`/focus/[id]`) → `design/stitch/s3_focus_mode/`
   - Command palette (global overlay) → `design/stitch/s1_command_palette/`
3. If the app shell (sidebar + header + main canvas — see below) doesn't exist yet, **build the bare shell first, as part of the current story**. Do not build a parallel layout next to the missing shell.
4. Place new components inside the shell. If your story adds navigation (e.g. filters), those items go **inside the existing sidebar**, not as a sibling component next to the main content.

The stitch `code.html` is the **layout contract** — structural decisions (what's a sidebar, where the header sits, how the main canvas is framed) come from there. Token rules below still apply — stitch files use Material tokens inline; ours live in `globals.css`, so translate (e.g. stitch `bg-surface-container-high` maps to our `bg-surface-container-high`).

## App shell

Every screen except the command palette uses the same shell. Build it once in `layout.tsx` (or a nested layout) and reuse it.

- **Left sidebar** — fixed, `w-64`, `bg-surface-container-low`, full height, `p-6`. Contains (top to bottom): app wordmark ("ContextOS" + "Kinetic Sanctuary" eyebrow), primary gradient CTA (e.g. "New Context"), icon nav (Today / Upcoming / All / Settings — use `lucide-react` outline icons), user profile footer pinned with `mt-auto`.
- **Top header** — fixed, `h-16`, glass panel (`bg-surface/70` + `backdrop-blur-md`), spans `left-64` to `right-0`. Contains: search input (no border, rounded-full), secondary nav, icon buttons.
- **Main canvas** — `ml-64 pt-16`, `bg-surface`, generous padding (`p-10`). Story-specific content lives here.
- **Right rail** (only when a screen needs supplementary context) — fixed, `w-80`, `bg-surface-container-low`. When present, main canvas becomes `ml-64 mr-80 pt-16`.

The left-nav filter items (Today / Upcoming / All) are rows **inside the sidebar**, not a separate `FilterNav` component placed next to the main content.

## Screen → story mapping

| Story | Screen | Stitch reference |
|---|---|---|
| US-002 Add a task | Workspace / Today view | `design/stitch/s2_contextos_workspace/` |
| US-003 Sub-tasks | Workspace task card | `design/stitch/s2_contextos_workspace/` |
| US-004 Left-nav filters | Sidebar nav items | `design/stitch/s2_contextos_workspace/` |
| US-005 Focus mode | Focus route | `design/stitch/s3_focus_mode/` |

## Headlines

- **No 1px borders for sectioning content.** Create hierarchy with surface tiers instead (see below).
- **No pure-black text on white.** Use the muted tokens defined in `globals.css`.
- **Tonal layering over strokes.** A card is not a bordered box — it's a brighter surface on a darker one (or vice versa).
- **Build the app shell before the feature.** A centered `max-w-4xl` column is not this design system.

## Tailwind setup

Tailwind v4. Configuration lives in `web/src/app/globals.css` via `@theme` — not `tailwind.config.js`.

```css
/* web/src/app/globals.css */
@import "tailwindcss";

@theme {
  --color-surface: #ffffff;
  --color-surface-container-low:     #f7f7f8;
  --color-surface-container:         #f1f1f3;
  --color-surface-container-high:    #e9e9ed;
  --color-surface-container-highest: #dfdfe4;
  --color-surface-bright:            #ffffff;

  --color-on-surface:         #1a1a1f;
  --color-on-surface-variant: #54545e;

  --color-primary:   #fc8f3f;
  --color-secondary: #f1f9b0;
  --color-tertiary:  #d8b4fe;

  --radius-card: 16px;
  --radius-chip: 999px;
}
```

Then in components, use `bg-surface-container-high`, `text-on-surface-variant`, etc.

## Component patterns

### Cards
Use `bg-surface-container-high` on a `bg-surface` parent. No border. Moderate rounding via `rounded-[var(--radius-card)]`.

### Chips (for tags, filters, context)
`bg-surface-container-highest` + `rounded-[var(--radius-chip)]` for a pill shape. `text-on-surface-variant` for inactive, `text-primary` when active.

### Primary CTAs (the "AI action")
Gradient fill: `bg-gradient-to-br from-primary to-secondary`. White/on-primary text. No border.

### Secondary buttons
`bg-surface-container-highest` + `text-on-surface`. Hover: `bg-surface-bright`.

### Inputs
No border until focused. On focus: `bg-surface-container-high` + subtle primary glow (`ring-2 ring-primary/30`).

## Typography

- Font family: Inter (already loaded via `next/font` in `layout.tsx`).
- Display sizes (for empty-state welcomes, focus-mode timer): tight letter-spacing (`tracking-tight` or `-0.02em`).
- Body: `leading-relaxed` (1.6) — the "calm" aesthetic requires the space.
- Labels (metadata, status): `uppercase text-[11px] tracking-[0.12em] text-on-surface-variant`.

## Don't

- Don't add box-shadows to static cards. Let surface tiers do the lifting.
- Don't use pure black (`#000`) or pure white (`#fff`) text. Always go through `on-surface` tokens.
- Don't introduce new colors ad-hoc. If you need one, add it to `@theme` first.
- Don't use icon libraries that ship filled icons. Monoline (1.5pt stroke) only — lucide-react's outline set is fine.
