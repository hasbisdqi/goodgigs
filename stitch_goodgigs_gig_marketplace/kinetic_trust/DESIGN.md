---
name: Kinetic Trust
colors:
  surface: '#f7f9fb'
  surface-dim: '#d8dadc'
  surface-bright: '#f7f9fb'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f2f4f6'
  surface-container: '#eceef0'
  surface-container-high: '#e6e8ea'
  surface-container-highest: '#e0e3e5'
  on-surface: '#191c1e'
  on-surface-variant: '#464555'
  inverse-surface: '#2d3133'
  inverse-on-surface: '#eff1f3'
  outline: '#777587'
  outline-variant: '#c7c4d8'
  surface-tint: '#4d44e3'
  primary: '#3525cd'
  on-primary: '#ffffff'
  primary-container: '#4f46e5'
  on-primary-container: '#dad7ff'
  inverse-primary: '#c3c0ff'
  secondary: '#006c49'
  on-secondary: '#ffffff'
  secondary-container: '#6cf8bb'
  on-secondary-container: '#00714d'
  tertiary: '#3130c0'
  on-tertiary: '#ffffff'
  tertiary-container: '#4b4dd8'
  on-tertiary-container: '#d9d8ff'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#e2dfff'
  primary-fixed-dim: '#c3c0ff'
  on-primary-fixed: '#0f0069'
  on-primary-fixed-variant: '#3323cc'
  secondary-fixed: '#6ffbbe'
  secondary-fixed-dim: '#4edea3'
  on-secondary-fixed: '#002113'
  on-secondary-fixed-variant: '#005236'
  tertiary-fixed: '#e1e0ff'
  tertiary-fixed-dim: '#c0c1ff'
  on-tertiary-fixed: '#07006c'
  on-tertiary-fixed-variant: '#2f2ebe'
  background: '#f7f9fb'
  on-background: '#191c1e'
  surface-variant: '#e0e3e5'
typography:
  display-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 48px
    fontWeight: '700'
    lineHeight: '1.2'
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 32px
    fontWeight: '700'
    lineHeight: '1.25'
  headline-lg-mobile:
    fontFamily: Plus Jakarta Sans
    fontSize: 24px
    fontWeight: '700'
    lineHeight: '1.3'
  headline-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 24px
    fontWeight: '600'
    lineHeight: '1.4'
  body-lg:
    fontFamily: Inter
    fontSize: 18px
    fontWeight: '400'
    lineHeight: '1.6'
  body-md:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: '1.5'
  label-md:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '600'
    lineHeight: '1.2'
    letterSpacing: 0.01em
  label-sm:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '500'
    lineHeight: '1.2'
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  base: 8px
  container-padding-mobile: 1rem
  container-padding-desktop: 2rem
  gutter: 1.5rem
  stack-sm: 0.5rem
  stack-md: 1rem
  stack-lg: 2rem
---

## Brand & Style

The design system is built on the intersection of professional reliability and the kinetic energy of the modern gig economy. It targets a dual-audience: the ambitious freelancer seeking growth and the efficient employer seeking quality. The visual language is **Corporate Modern with a Tech-Optimist edge**, prioritizing speed of task completion without sacrificing the feeling of a secure, institutional platform.

The UI evokes an emotional response of "competence and momentum." This is achieved through high-clarity layouts, a crisp color palette, and purposeful motion. To differentiate between the two primary user states:
- **Freelancer Mode:** Emphasizes growth and opportunity with more prominent use of the success/mint accents.
- **Employer Mode:** Emphasizes management and stability with a heavier lean on the professional indigo and structured containers.

## Colors

The palette is anchored by **Professional Indigo**, a color that signals depth and intelligence. **Mint Green** is used strategically to indicate financial growth, successful matches, and active "Freelancer" status. 

For the dual-sided experience:
- **Indigo (#4F46E5)** serves as the primary action color for the Employer dashboard (Post a Gig, Hire).
- **Mint (#10B981)** takes a primary role in the Freelancer dashboard (Find Work, Get Paid).
- **Slate Gray (#F8FAFC)** provides a low-contrast, easy-on-the-eyes canvas that allows the high-chroma primary colors to guide the user's attention.

## Typography

This design system utilizes a tiered typography approach to balance personality and utility. **Plus Jakarta Sans** is used for headings to provide a friendly, modern, and slightly rounded geometric feel that softens the "corporate" edge. **Inter** is used for all body copy and UI labels to ensure maximum legibility and a systematic, technical feel for data-heavy gig listings.

Text contrast is strictly maintained using Slate 900 for primary headings and Slate 600 for secondary body text. On mobile, large display type should scale down aggressively to prevent awkward line breaks in gig titles.

## Layout & Spacing

The layout follows a **Fluid Grid** philosophy with a focus on "Center-Stage" content. 
- **Desktop:** A 12-column grid with 24px gutters. Content is typically constrained to a 1200px max-width container to prevent horizontal eye strain.
- **Mobile:** A single-column layout with 16px side margins. 

Spacing follows a strict 8px linear scale. Vertical rhythm is established through "Stacks":
- Use **Stack-SM (8px)** for internal component spacing (e.g., icon to text).
- Use **Stack-MD (16px)** for spacing between elements within a card.
- Use **Stack-LG (32px)** for spacing between distinct sections or cards.

## Elevation & Depth

Visual hierarchy is established through **Tonal Layering** and **Ambient Shadows**. Instead of heavy borders, the design system uses subtle elevation to define surfaces.

- **Level 0 (Background):** Slate Gray (#F8FAFC) - No shadow.
- **Level 1 (Cards/Surface):** White (#FFFFFF) - Subtle, extra-diffused shadow: `0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -2px rgba(0, 0, 0, 0.05)`.
- **Level 2 (Interactive/Hover):** White (#FFFFFF) - More pronounced shadow to indicate lift: `0 10px 15px -3px rgba(0, 0, 0, 0.08)`.

Floating Action Buttons (FABs) and Modals use a primary-tinted shadow (Indigo or Mint) at very low opacity (5-8%) to maintain the brand connection even in the elevation.

## Shapes

The shape language is approachable and modern. A standard radius of **16px (rounded-xl)** is applied to all primary containers and cards to create a "container" feel that is friendly and soft.

- **Buttons:** 12px radius for a slightly tighter, more professional look than the cards.
- **Input Fields:** 8px radius to maintain a sense of structure and data-entry precision.
- **Avatars:** Always circular to distinguish people from objects/cards.

## Components

### Buttons
- **Primary:** Solid Indigo (Employer) or Mint (Freelancer). High-contrast white text.
- **Secondary:** Indigo/Mint tint background (10% opacity) with solid color text.
- **Ghost:** No background, solid color text. Used for less frequent actions like "Cancel."

### Cards
Cards are the primary vehicle for gig listings. They feature a white background, 16px rounded corners, and a 1px border in Slate 200. On hover, the border color shifts to the Primary color.

### Chips/Badges
Used for skills and categories. They should have a 100px (pill) radius. Use a light gray background with Slate 700 text by default, shifting to a Mint background when a skill is "Matched."

### Input Fields
Background should be white with a 1px Slate 300 border. On focus, the border thickens to 2px and changes to the mode-specific accent color (Indigo or Mint) with a soft outer glow.

### Switcher (Dual-Mode)
A prominent toggle or segment control in the navigation bar. When switching to "Freelancer," the primary interactive color throughout the app transitions from Indigo to Mint via a subtle CSS transition to signify the state change.