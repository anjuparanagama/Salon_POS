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
  - `src/pages/services/index.tsx`

### C. Page-Specific Components & Sub-Parts

- **Location:** `src/pages/<page-name>/components/<component-name>/index.tsx`
- **Rule:** Components or sections that are specific to a single page MUST NOT be placed in `src/components/`. Keep them localized inside the corresponding page's `components/` directory with an `index.tsx` entry point.
- **Example:**
  - `src/pages/dashboard/components/stats-card/index.tsx`
  - `src/pages/appointments/components/appointment-list/index.tsx`
  - `src/pages/services/components/service-card/index.tsx`

### D. Data Types & Interfaces

- **Location:** `src/interface/`
- **Pattern:** `src/interface/<page-or-feature>.types.ts`
- **Rule:** All TypeScript types, interfaces, and data models related to pages and domain entities MUST be defined in `src/interface/` and imported where needed. Do NOT declare major data types inline inside page or component files.
- **Example:**
  - `src/interface/dashboard.types.ts`
  - `src/interface/appointment.types.ts`
  - `src/interface/service.types.ts`
  - `src/interface/routes.types.ts`

### E. Routing Configuration

- **Location:** `src/routes/`
- **Files:**
  - `src/routes/sidebar.routes.ts`: Centralizes `ROUTES` path constants and `sidebarRoutes` navigation list.
  - `src/routes/index.tsx`: Pure React Router component exporting `AppRoutes`.

---

## 2. Directory Tree Summary

```text
src/
├── components/                     # Global reusable components
│   └── modal/
│       └── index.tsx               # e.g., src/components/modal/index.tsx
├── pages/                          # Application pages / views
│   └── appointments/
│       ├── index.tsx               # Main page entry: src/pages/appointments/index.tsx
│       └── components/             # Page-specific components
│           └── appointment-list/
│               └── index.tsx       # e.g., src/pages/appointments/components/appointment-list/index.tsx
├── routes/                         # Centralized routing configuration
│   ├── index.tsx                   # AppRoutes view mapping (<Routes>)
│   └── sidebar.routes.ts           # ROUTES constants & sidebarRoutes items
├── interface/                      # Shared & page data types / interfaces
│   ├── appointment.types.ts        # e.g., src/interface/appointment.types.ts
│   └── routes.types.ts             # Sidebar & route type definitions
└── layout/                         # Layout wrappers (e.g., MainLayout, Sidebar, Navbar)
```

---

## 3. Workflow for Adding a New Page

Whenever adding a new page to the project, agents MUST strictly follow this flow:

1. **Step 1: Create Interfaces / Types**
   - Create `src/interface/<feature-name>.types.ts` with all domain entities, filter state, form payloads, and statistics types.
2. **Step 2: Create Page & Subcomponents**
   - Create the page root: `src/pages/<page-name>/index.tsx`.
   - Create page-specific subcomponents in `src/pages/<page-name>/components/<subcomponent-name>/index.tsx`.
   - Never use inline major types; import via `import type { ... } from "../../interface/<feature-name>.types"`.
3. **Step 3: Register Path & Sidebar Route**
   - Open `src/routes/sidebar.routes.ts`.
   - Add the path constant to `ROUTES`:
     ```ts
     export const ROUTES = {
       ...
       FEATURE: "/feature",
     } as const;
     ```
   - If the page belongs in the main Sidebar navigation, add its item to `sidebarRoutes` with an appropriate Lucide icon:
     ```ts
     export const sidebarRoutes: SidebarItem[] = [
       ...{ label: "Feature", href: ROUTES.FEATURE, icon: FeatureIcon },
     ];
     ```
4. **Step 4: Register Route in AppRoutes**
   - Open `src/routes/index.tsx`.
   - Import the page component: `import Feature from "../pages/feature";`.
   - Add the `<Route>` element inside `AppRoutes`:
     ```tsx
     <Route path={ROUTES.FEATURE} element={<Feature />} />
     ```
5. **Step 5: Update TopHeader Breadcrumbs (if applicable)**
   - In `src/App.tsx`, update `getBreadcrumbs()` so that the new route displays the correct breadcrumb trail.
6. **Step 6: Verify Build & Lint**
   - Always run `npm run lint` and `npm run build` to confirm 0 errors or warnings before completing the task.

---

## 4. Coding & TypeScript Standards

1. **Type Imports:** Always import data types and interfaces from `src/interface/` using explicit type imports (`import type { ... } from ...`).
2. **Component Exports:** Each component folder should export its component through `index.tsx` (default or named export).
3. **Keep Responsibilities Separated:**
   - Keep page views (`src/pages/<page-name>/index.tsx`) clean by delegating complex layout sections to subcomponents in `components/`.
   - Avoid duplicating common UI elements; extract reusable pieces into `src/components/`.

---

## 5. Theme & Styling Guidelines (Tailwind CSS v4)

1. **Pre-define Theme Colors in Tailwind:**
   - NEVER use arbitrary hardcoded hex codes directly in component classes (avoid `bg-[#c71585]`, `text-[#c71585]`).
   - All theme-related colors must be registered in `src/index.css` inside the `@theme` block.
   - Example configuration:
     ```css
     @theme {
       --color-primary-light: #c71585;
       --color-primary: #d9145a;
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

Email: admin@gmail.com
Password: admin123
