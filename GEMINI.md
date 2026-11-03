# Project Guidelines & Agent Rules

You are working on the **Salon POS** project. Always follow the project structure, folder conventions, and architectural patterns defined below when creating or modifying code.

---

## 1. Directory Structure & File Conventions

Follow these strict location and file naming conventions:

### A. Reusable / Shared UI Components
- **Location:** `src/components/`
- **Pattern:** `src/components/<component-name>/index.tsx`
- **Rule:** Only generic, globally shared components (e.g., buttons, tables, modals, form inputs) belong here.
- **Example:**
  - `src/components/table/index.tsx`
  - `src/components/button/index.tsx`
  - `src/components/modal/index.tsx`

### B. Pages / Route Views
- **Location:** `src/pages/`
- **Pattern:** `src/pages/<page-name>/index.tsx`
- **Rule:** Every page or top-level route view must have its main entry point in its own directory with an `index.tsx`.
- **Example:**
  - `src/pages/dashboard/index.tsx`
  - `src/pages/appointments/index.tsx`
  - `src/pages/billing/index.tsx`

### C. Page-Specific Components & Sub-Parts
- **Location:** `src/pages/<page-name>/components/<component-name>/index.tsx`
- **Rule:** Components or sections that are specific to a single page MUST NOT be placed in `src/components/`. Keep them localized inside the corresponding page's `components/` directory with an `index.tsx` entry point.
- **Example:**
  - `src/pages/dashboard/components/stats-card/index.tsx`
  - `src/pages/dashboard/components/recent-sales/index.tsx`
  - `src/pages/appointments/components/calendar-view/index.tsx`

### D. Data Types & Interfaces
- **Location:** `src/interface/`
- **Pattern:** `src/interface/<page-or-feature>.types.ts`
- **Rule:** All TypeScript types, interfaces, and data models related to pages and domain entities MUST be defined in `src/interface/` and imported where needed. Do NOT declare major data types inline inside page or component files.
- **Example:**
  - `src/interface/dashboard.types.ts`
  - `src/interface/appointment.types.ts`
  - `src/interface/customer.types.ts`

---

## 2. Directory Tree Summary

```text
src/
├── components/                     # Global reusable components
│   └── table/
│       └── index.tsx               # e.g., src/components/table/index.tsx
├── pages/                          # Application pages / views
│   └── dashboard/
│       ├── index.tsx               # Main page entry: src/pages/dashboard/index.tsx
│       └── components/             # Page-specific components
│           └── stats-card/
│               └── index.tsx       # e.g., src/pages/dashboard/components/stats-card/index.tsx
├── interface/                      # Shared & page data types / interfaces
│   └── dashboard.types.ts          # e.g., src/interface/dashboard.types.ts
└── layout/                         # Layout wrappers (e.g., MainLayout, Sidebar, Navbar)
```

---

## 3. Coding & TypeScript Standards

1. **Type Imports:** Always import data types and interfaces from `src/interface/` using explicit type imports (`import type { ... } from ...`).
2. **Component Exports:** Each component folder should export its component through `index.tsx` (default or named export).
3. **Keep Responsibilities Separated:**
   - Keep page views (`src/pages/<page-name>/index.tsx`) clean by delegating complex layout sections to subcomponents in `components/`.
   - Avoid duplicating common UI elements; extract reusable pieces into `src/components/`.

---

## 4. Theme & Styling Guidelines (Tailwind CSS v4)

1. **Pre-define Theme Colors in Tailwind:**
   - NEVER use arbitrary hardcoded hex codes directly in component classes (avoid `bg-[#c71585]`, `text-[#c71585]`).
   - All theme-related colors must be registered in `src/index.css` inside the `@theme` block.
   - Example configuration:
     ```css
     @theme {
       --color-primary-light: #c71585;
       --color-primary: #a0106a;
       --color-primary-dark: #800b55;
       --color-primary-lighter: #fce7f3;
     }
     ```
2. **Use Tailwind Semantic Utility Classes:**
   - Once defined in `@theme`, use the standard generated utility classes:
     - Backgrounds: `bg-primary-light`, `bg-primary`
     - Text colors: `text-primary-light`, `text-primary`
     - Borders: `border-primary-light`, `border-primary`
     - Ring / Focus: `ring-primary-light`, `focus:ring-primary`
     - Hover & Active states: `hover:bg-primary-light`, `hover:text-primary`


