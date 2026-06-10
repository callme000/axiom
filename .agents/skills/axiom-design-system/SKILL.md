---
name: "axiom-design-system"
description: "Enforces the 'Bloomberg Terminal for Personal Finance' aesthetic. Invoke when the user asks to build, style, or modify any React/Next.js frontend component, page, or UI element in Axiom."
---

# Axiom Design System Guardian

This skill enforces the strict visual identity and aesthetic rules for the Axiom frontend. Axiom is **NOT** a consumer budgeting app (like Monarch or YNAB) and it is **NOT** a luxury watch advertisement. 

Axiom is the **"Bloomberg Terminal for Personal Finance"**. 

It must feel premium, data-dense, highly functional, and ruthlessly objective. The design must be extremely responsive, looking perfect on both ultra-wide monitors and mobile viewports.

## 1. Core Visual Identity
- **Tone:** Sovereign intelligence, clinical, data-dense, and highly functional.
- **Differentiation:** It should feel like professional enterprise software used by elite operators. Math dictates the deployment; the UI should reflect that cold, deterministic truth.
- **Responsiveness (Flexible Approach):** The UI must dynamically adapt to any screen size. Use flexible CSS Grid/Flexbox layouts, fluid typography (`clamp()`), and ensure touch targets are usable on mobile while remaining data-dense on desktop.

## 2. Typography Hierarchy
Do NOT use generic fonts (Arial, Inter, Roboto). We use a highly legible, monospaced or technical sans-serif aesthetic for data, paired with a sharp display font.
- **Display (Hero/Headers):** Sharp, geometric, or technical sans.
- **Heading (Sections):** Crisp, uppercase, tracking-wide.
- **Metric (Financial Data):** Tabular lining (e.g., `font-variant-numeric: tabular-nums`). Numbers must perfectly align vertically.
- **Label (Subtext/Axes):** Small, uppercase, muted (`text-zinc-500`), highly legible.
- **Telemetry (Logs/Raw Data):** Strict monospace (e.g., Geist Mono, JetBrains Mono) for logs, timestamps, and IDs.

## 3. Spacing System
Enforce a rigid, mathematical spacing scale. Avoid arbitrary pixel values. Use Tailwind's spacing scale strictly:
- **8px (`gap-2`, `p-2`):** Micro-components, tight data clusters.
- **16px (`gap-4`, `p-4`):** Standard component padding.
- **24px (`gap-6`, `p-6`):** Card padding, section spacing.
- **32px (`gap-8`, `p-8`):** Major structural dividers.
- **48px (`gap-12`, `p-12`):** Hero sections, distinct page zones.
- **64px (`gap-16`, `p-16`):** Page-level breathing room.

## 4. Color System
Axiom does not use colorful gradients or playful pastels. It uses a dark, command-center theme with highly intentional functional colors.
- **Background:** True black (`#000000`) or deep command-center dark (`#0a0a0a`). No glassmorphism unless strictly necessary for z-index layering.
- **Foreground:** Stark white or off-white (`#ededed`) for primary data. Muted grays (`#999999`) for labels.
- **Truth (Neutral/System):** Electric Blue (`#3b82f6`) or pure white.
- **Warning (Solvency/Deficit):** High-visibility Amber or Orange.
- **Opportunity/Asset (Positive):** Clinical Green or Teal.
- **Leakage (Negative/Waste):** Harsh Red.

## 5. Motion System
Animations must be functional, not decorative. They should draw the eye to data changes, not distract the user.
- **Instant (0-100ms):** Hover states on standard buttons.
- **Fast (150ms):** Tooltips, dropdowns, minor state changes.
- **Standard (300ms):** Page transitions, modal reveals.
- **Luxury/Telemetry (500ms+):** Staggered data reveals (using `animation-delay`), chart drawing, and number-ticker counting (e.g., framer-motion `<motion.span>`).

## 6. Execution Rules
1. **Analyze the Request:** Determine what data is being presented.
2. **Apply the Terminal Aesthetic:** Remove unnecessary borders, shadows, and glass effects. Use high-contrast text, strict tabular numbers, and a dark theme.
3. **Ensure Responsiveness:** Use Tailwind's `sm:`, `md:`, `lg:` prefixes to guarantee the component scales elegantly from mobile to desktop.
4. **Implement:** Write clean, production-grade Next.js/React code using Tailwind CSS v4. Ensure all interactive elements have clear, instant hover/focus states.