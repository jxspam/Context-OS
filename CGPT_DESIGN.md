# Design System: The Kinetic Sanctuary

 

## 1. Overview & Creative North Star

The Creative North Star for this system is **"The Kinetic Sanctuary."** 

 

In an era of chaotic "agentic" workflows, this system rejects the cluttered dashboard in favor of an editorial, high-performance environment that feels both expansive and focused. We are not building a tool; we are building a state of flow. We move beyond the "standard SaaS" look by prioritizing **Tonal Layering** over structural lines. By utilizing intentional asymmetry, moderate roundedness, and a sophisticated interplay of frosted surfaces, the UI feels like a high-end physical workspace—quiet, premium, and infinitely capable.

 

---

 

## 2. Colors & Surface Philosophy

The palette is rooted in a crisp white (`#ffffff`) foundation, designed to recede and allow the user's work to take center stage. The primary (`#fc8f3f`) and secondary (`#f1f9b0`) colors introduce a vibrant, energetic feel, while tertiary (`#D8B4FE`) provides a subtle accent.

 

### The "No-Line" Rule

**Explicit Instruction:** 1px solid borders are strictly prohibited for sectioning content. To define boundaries, designers must use **Background Shifts** or **Tonal Transitions**. 

- A card should not have a stroke; it should be a `surface-container-low` element sitting on a `surface` background. 

- Use the `surface-container` tiers (Lowest to Highest) to create a sense of organic nesting.

 

### Surface Hierarchy

- **Primary Background (`surface`):** The base canvas (`#ffffff`).

- **Secondary Workspace (`surface-container-low`):** Used for large sidebars or secondary panels.

- **Active Cards (`surface-container-high`):** The primary interactive container for AI agents and task blocks.

- **Floating Modals/Popovers (`surface-bright`):

):** The highest level of elevation, paired with a backdrop blur.

 

### Signature Textures

Main CTAs and AI-driven insights must utilize the **Adaptive Gradient**: a transition from `primary` (#fc8f3f) to a derived `secondary_container` color. This gradient should feel like "captured light" rather than a flat fill, providing the visual soul of the system.

 

---

 

## 3. Typography: The Editorial Voice

We use **Inter** not just for legibility, but as a structural element. The hierarchy is designed to feel like a high-end journal—authoritative yet approachable.

 

*   **Display (`display-lg` to `display-sm`):** Reserved for "Flow States" or empty-screen welcomes. Use tight letter-spacing (-0.02em) to create a "locked-in" feel.

*   **Headlines (`headline-md`):** Used for agent names and major workspace titles. These define the "bones" of the layout.

*   **Body (`body-md`):** Our workhorse. High line-height (1.6) is required to maintain the "Calm" aesthetic.

*   **Labels (`label-sm`):** All caps with slight letter-spacing (+0.05em) for metadata and AI status indicators, ensuring they feel distinct from actionable text.

 

---

 

## 4. Elevation & Depth

We eschew the "pasted-on" look of traditional shadows in favor of **Atmospheric Depth**.

 

*   **The Layering Principle:** Instead of shadows, stack surface tiers. Place a `surface-container-highest` card inside a `surface-container-low` wrapper. The delta in luminance creates a natural, soft lift.

*   **Ambient Shadows:** For floating elements (Command Bars, Tooltips), use an ultra-diffused shadow: `box-shadow: 0 20px 50px rgba(0, 0, 0, 0.3)`. The shadow must never be pure black; it should be a tinted version of `surface_container_lowest`.

*   **The "Ghost Border" Fallback:** If a separation is functionally required (e.g., in high-density data), use the `outline-variant` token at **15% opacity**. It should be felt, not seen.

*   **Glassmorphism:** All floating AI overlays must use `surface-variant` with a 12px `backdrop-blur`. This ensures the agent feels like it is "hovering" over the context, not replacing it.

 

---

 

## 5. Components

 

### Cards & Workspaces

*   **The Rule of Zero Dividers:** Forbid divider lines. Use `surface-container` shifts or `2` units (normal) of vertical gaps from the spacing scale to separate content blocks.

*   **Rounding:** Use a moderate rounding (`2` from the theme) for main workspace cards and a slightly less rounded value for internal chips or input fields, creating a sophisticated, modern silhouette.

 

### Command Buttons

*   **Primary (AI Action):** Gradient fill (`primary` to a derived `primary_container`) with `on_primary` text. No border.

*   **Secondary:** `surface-container-highest` background with a "Ghost Border."

*   **Tertiary:** Transparent background, `primary` text, with a subtle hover state using `surface-bright`.

 

### Agentic Inputs

*   **The Focused Input:** Text areas for AI prompts should have no visible border until focused. Upon focus, the background shifts to `surface-container-high` with a subtle `primary` glow (2px blur).

*   **Monoline Icons:** All SVG icons must be 1.5pt stroke width, using `on_surface_variant` for inactive states and the `primary` color for active AI states.

 

### Context Chips

*   Used for tagging metadata (Tasks, Context, AI). 

*   Style: `surface-container-highest` with `label-md` typography. Use a maximum roundedness (`3` from the theme) for a pill-shaped, tactile feel.

 

---

 

## 6. Do’s and Don'ts

 

### Do

*   **Do** embrace negative space. If a layout feels "empty," it is likely working.

*   **Do** use asymmetrical padding (e.g., more padding at the top of a card than the bottom) to create a sense of "gravity" and editorial intent.

*   **Do** use the abstract circular loop logo as a loading state, rotating the three segments independently to represent AI "thinking."

 

### Don't

*   **Don't** use 100% opaque borders. They break the "Kinetic Sanctuary" immersion.

*   **Don't** use pure black text on the white background. Always use `on_surface` or `on_surface_variant` to reduce eye strain and maintain the "Calm" style.

*   **Don't** use standard "drop shadows" on static cards. Let the tonal shifts do the heavy lifting.