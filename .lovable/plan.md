
# Apply Design System

## Overview
Apply the complete dark-mode visual system across the project: CSS variables, Tailwind config, and Google Fonts.

## Changes

### 1. `index.html`
- Add Google Fonts `<link>` for Inter (weights 300–700)

### 2. `src/index.css`
- Replace all `:root` variables with the new dark-only design tokens (surfaces, semantic colors, borders, shadows, effects)
- Remove the `.dark` block (dark-only theme)
- Add base body styles with Inter font family

### 3. `tailwind.config.ts`
- Add `fontFamily.sans` with Inter + system fallback
- Extend `colors` with all new tokens: surface tiers, semantic colors (warning, success, info, caution, accent-purple), border variants (subtle, strong), card hover, primary glow, overlay
- Add `boxShadow` tokens (glow, elevated, subtle)
- Add new keyframes: pulse-glow, slide-up, fade-in
- Add corresponding animations
- Update border radius to use 0.75rem

### 4. `src/pages/Index.tsx`
- Update to use the new design tokens so the landing page reflects the applied theme
