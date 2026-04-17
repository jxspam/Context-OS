# Applying the design system

**Source of truth:** `design/DESIGN.md` (the "Kinetic Sanctuary"). Read it before building UI.

## Headlines

- **No 1px borders for sectioning content.** Create hierarchy with surface tiers instead (see below).
- **No pure-black text on white.** Use the muted tokens defined in `globals.css`.
- **Tonal layering over strokes.** A card is not a bordered box — it's a brighter surface on a darker one (or vice versa).

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
