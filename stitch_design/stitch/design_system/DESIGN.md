# Design System Specification: The Kinetic Sanctuary

## 1. Overview & Creative North Star
**Creative North Star: The Curated Atelier**

This design system moves away from the "software-as-a-tool" aesthetic toward "software-as-a-space." Inspired by high-end physical workspaces—think white oak desks, soft morning light, and premium stationery—this system prioritizes the user's mental clarity. 

We achieve an editorial, high-end feel by rejecting the "boxed" nature of traditional web UI. Instead of rigid grids and 1px dividers, we use **intentional asymmetry**, **generous negative space**, and **atmospheric depth**. The interface should feel less like a digital dashboard and more like a beautifully laid-out broadsheet or a physical desktop where layers of information rest naturally upon one another.

---

## 2. Colors & The "No-Line" Philosophy

Our palette is rooted in the warmth of `#fc8f3f` (Vibrant Orange) and the purity of `#ffffff`. The strategy is "Tonal Minimalism."

### The "No-Line" Rule
**Explicit Instruction:** Designers are prohibited from using 1px solid borders for sectioning or containment. 
Boundaries must be defined solely through background color shifts. For example:
- A `surface-container-low` navigation panel sitting against a `surface` background.
- Content differentiation achieved through padding and tonal contrast rather than strokes.

### Surface Hierarchy & Nesting
Treat the UI as a series of physical layers. Use the following tiers to create a "nested" depth:
- **Surface (`#f9f9f9`):** The canvas. Used for the primary background.
- **Surface-Container-Low (`#f3f3f3`):** Navigational panels and context-shifting sidebars.
- **Surface-Container-High (`#e8e8e8`):** Task cards and primary interaction objects.
- **Surface-Container-Highest (`#e2e2e2`):** Nested elements, such as chips or search inputs inside cards.

### The Glass & Gradient Rule
To ensure the system feels "alive" and not static:
- **Floating Elements:** Must utilize Glassmorphism. Use `surface_bright` at 70% opacity with a `12px` backdrop-blur.
- **Signature Textures:** Main CTAs must use an **Adaptive Gradient**. Transition from `primary` (#fc8f3f) to `secondary_container` (#febe97) at a 135-degree angle. This adds a "soul" to the action point that a flat hex code cannot provide.

---

## 3. Typography
We use **Inter** exclusively to maintain a clean, modernist foundation. The editorial feel is driven by exaggerated scale and line height.

*   **Display (L/M/S):** Large, commanding presence for "Zen moments" or hero headers. Lower letter-spacing (-0.02em).
*   **Headline (L/M/S):** Used for section titles. High contrast against body text.
*   **Body (L/M/S):** Set to `line-height: 1.6`. This generous leading is non-negotiable; it ensures the "Sanctuary" feels breathable and readable.
*   **Labels:** Reserved for utility. Use `letter-spacing: 0.05em` and uppercase sparingly to denote metadata.

---

## 4. Elevation & Depth

### The Layering Principle
Depth is achieved by "stacking" the surface tiers. To create a lift effect, place a `surface_container_lowest` card on a `surface_container_low` section. The change in hex code provides the "edge" that a border would traditionally provide.

### Ambient Shadows
For floating components (Command Palette, Popovers):
- **Shadow Color:** Use a tinted version of the `on-surface` color (e.g., `#1a1c1c` at 5% alpha).
- **Properties:** Extra-diffused. `0px 20px 40px`. This mimics natural light falling across a physical desk rather than a harsh digital drop shadow.

### The "Ghost Border" Fallback
In rare cases where accessibility or color collisions demand a container edge, use a **Ghost Border**:
- `outline-variant` (#dcc1b2) at **15% opacity**. It should be felt, not seen.

---

## 5. Components

### Buttons
- **Primary:** Adaptive Gradient (#fc8f3f to #febe97). White text. Elevation should be tonal, not shadowed.
- **Secondary:** Ghost Border (15% opacity). No background fill.
- **Tertiary:** Text-only, using the `primary` color for the label.

### Command Palette
- **Visuals:** Full glass overlay. `surface` at 60% opacity, `12px` backdrop-blur. 
- **Interaction:** Centrally positioned, deep ambient shadow, `md` (12px) corner radius.

### Cards & Lists
- **Rule:** Forbid divider lines. 
- **Implementation:** Separate list items with 8px or 12px of vertical white space. For cards, use `rounding-value-2` (8px). 

### Chips
- **Visuals:** `rounding-value-3` (Full pill). 
- **Color:** `surface-container-highest` background. Use for filtering or categorization without cluttering the visual field.

### Icons
- **Style:** Monoline SVG.
- **Stroke:** Fixed at `1.5pt`. 
- **Endcaps:** Rounded. This maintains the "Calm" theme by removing sharp digital points.

---

## 6. Do's and Don'ts

### Do
- Use **Asymmetry:** If a layout feels too "balanced" and generic, offset a header or increase the left margin to create an editorial look.
- Use **White Space as a Border:** If two elements are touching, increase the gap instead of adding a line.
- Use **Tonal Stacking:** Always reference the Surface Hierarchy scale before considering a shadow.

### Don't
- **No 100% Opaque Borders:** Never use a solid grey line to separate content.
- **No Default Leading:** Never use a line-height below 1.5 for body text.
- **No Pure Black Shadows:** Shadows must be soft, large, and tinted by the surface color.
- **No Sharp Corners:** Never use 0px rounding. Even the most subtle radius (4px) is required to maintain the "Kinetic" softness.