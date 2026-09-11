# NÉCTAR Project Audit Report

## Phase 1 — Full Project Analysis

This document serves as a comprehensive audit of the NÉCTAR project repository, analyzing UI/UX, responsiveness, animations, 3D assets, performance, accessibility, and code quality.

### 1. UI/UX Issues
* **Typography:** The typography relies on static text sizes (e.g., `text-2xl`, `text-5xl`). It lacks fluid typography using CSS `clamp()` for smooth scaling across breakpoints.
* **Color Contrast:** The dark theme is beautiful, but some secondary text (e.g., `#a69888` on `#030201`) might fall slightly short of WCAG AA contrast ratios in certain lighting conditions.
* **Visual Hierarchy:** While the Hero section is breathtaking, the transition to subsequent sections (Product Spec, Ingredient List) lacks a cohesive narrative flow and padding consistency.

### 2. Responsiveness Issues
* **Mobile Layout (320px - 375px):** Some absolute positioned text in the Hero section overlaps or gets clipped on very small screens.
* **Fluid Grids:** The project uses standard Tailwind breakpoints, but lacks fully fluid grids. This can lead to awkward snapping between breakpoints instead of smooth continuous resizing.
* **Horizontal Scrolling:** Need to ensure no long words or absolute elements cause horizontal overflow on mobile devices.

### 3. Animation Quality
* **Scroll Animations:** The `HeroScrollStage` uses native `requestAnimationFrame` for scroll-linked animations, which is performant but can be janky on lower-end devices compared to a dedicated library like GSAP ScrollTrigger.
* **Entry Animations:** Subsequent sections (Product Specs, Ingredients, Marquee) lack staggered fade-up or slide-in entry animations when scrolled into view (missing `IntersectionObserver` logic).
* **Micro-interactions:** Interactive elements like buttons have some hover effects, but links, cards, and list items lack polished, modern focus/hover/active state transitions.

### 4. 3D Model Issues
* **Procedural Bottleneck:** The 3D models (jar, lid, candies) are generated *procedurally* at runtime using high-segment `THREE.LatheGeometry` and `THREE.SphereGeometry`. This causes a massive CPU spike on initial load.
* **Poly Count:** Candies use `36x26` sphere segments (roughly 1,800 vertices per candy), and there are over 60 candies in the jar. This results in >100k vertices generated on the fly.
* **No Compression:** Because the models are procedural, they aren't benefiting from Draco or Meshopt compression. Exporting these procedural meshes to a optimized `.glb` file is highly recommended.
* **Lazy Loading & Fallbacks:** The `Hero3DCanvas` loads immediately with no loading progress indicator, no lazy-loading (`React.lazy`), and no static image fallback for low-end mobile devices.

### 5. Performance
* **Main Thread Blocking:** Generating the PMREM environment map and all 3D geometries synchronously blocks the main thread, increasing Time to Interactive (TTI).
* **Bundle Size:** Three.js is imported synchronously. Code-splitting the 3D components would vastly improve the initial Lighthouse performance score.
* **Resource Optimization:** If any static images are added, they must be formatted as WebP/AVIF.

### 6. Accessibility (a11y)
* **Focus States:** Custom focus rings (`focus-visible:ring`) are missing, making keyboard navigation difficult.
* **ARIA Labels:** Buttons (like the floating cart button) need explicit `aria-label` attributes for screen readers.
* **Reduced Motion:** The Hero section respects `prefers-reduced-motion`, but this must be uniformly applied to all new entry animations and micro-interactions.

### 7. Code Quality
* **Duplication:** The candy placement array in `productModel.ts` is massive and hardcoded. 
* **Component Splitting:** `App.tsx` and `HeroScrollStage.tsx` are well-structured, but the Three.js logic in `Hero3DCanvas.tsx` is dense and could be modularized further.

---

## Prioritized Improvement Plan

### HIGH IMPACT (Do First)
1. **3D Optimization & Fallbacks:** 
   - Implement `React.lazy` and `Suspense` for the `Hero3DCanvas`.
   - Add a beautiful static image fallback and loading progress indicator for the 3D scene.
   - Refactor procedural geometry generation to lower poly counts or prepare for GLB export.
2. **Global Responsiveness:** Implement fluid typography (`clamp()`) across `index.css` and all components to guarantee zero horizontal scroll and perfect scaling from 320px to 1920px.
3. **Accessibility Pass:** Add ARIA labels to all interactive elements and ensure `focus-visible` styles are prominent and respect the brand colors.

### MEDIUM IMPACT
4. **Scroll-Triggered Entry Animations:** Implement an `IntersectionObserver` hook (or GSAP) to add staggered fade-and-slide-up animations to all non-hero sections (Product Specs, Ingredients, etc.).
5. **Micro-interactions:** Upgrade hover, active, and focus states on all buttons, links, and cards with smooth easings (`cubic-bezier`).
6. **Code-Splitting:** Ensure all heavy components and modals (`CartDrawer`, `ExportFramesModal`) are dynamically imported to reduce initial bundle size.

### LOW IMPACT (Polish)
7. **Lighting Tweaks:** Fine-tune the PMREM environment map and point lights to ensure shadows are softer and highlights are crisper on mobile devices without tanking framerate.
8. **Code Refactoring:** Clean up the hardcoded candy positions by extracting them to a separate JSON/data file.

---

## CHANGELOG
*(To be updated as improvements are made)*
