# Project Mandate: Full-Stack Fitness Tracker App

I need you to initiate a new monorepo project following the strict technical design document provided below. This is a **Fitness Tracker App** built using the T3 Stack principles and a Firebase/tRPC backend.

## Phase 1: Core Setup & Shared Schema

**Goal:** Establish the monorepo structure, configure all tools, and define the core, type-safe data schemas.

### 1. Monorepo & Tooling Setup

Start by setting up the PNPM monorepo structure with Turborepo, adhering to the layout in Section 3 of the TDD.

1.  **Initialize Monorepo:** Set up the root directory and `pnpm-workspace.yaml`.
2.  **Packages:** Create the basic directory structure for `apps/web`, `functions`, and `packages/shared`.
3.  **Vite/React App:** Set up `apps/web` with Vite, React, and TypeScript.
4.  **Backend/tRPC Functions:** Set up the `functions` package with Node/TypeScript, configured for Firebase Cloud Functions deployment, and the basic tRPC server structure.
5.  **Install/Configure:** Install and configure the core tooling: **TypeScript (strict)**, **Tailwind CSS**, **ESLint**, **Prettier**, and **T3 Env**. Ensure the Tailwind configuration is shared.

### 2. Core Data Schemas (`packages/shared`)

Create the following Zod schemas in `packages/shared` for maximum type safety across the monorepo.

| Entity | Schema Name | Key Fields & Validation Requirements |
| :--- | :--- | :--- |
| **User** | `UserSchema` | `uid`: string (required), `name`: string (min 2 chars), `age`: number (min 13), `weightKg`: number (positive), `fitnessGoal`: string (optional), `theme`: 'light' \| 'dark' (default 'system') |
| **Exercise** | `ExerciseSchema` | `id`: string, `name`: string, `description`: string, `category`: 'cardio' \| 'strength' \| 'stretching' \| 'full_body', `imageUrl`: string (URL) |
| **LogEntry** | `LogEntryInputSchema` | `workoutId`: string, `durationSeconds`: number (positive), `notes`: string (optional), `date`: date (default now) |

### 3. Frontend Utilities (`apps/web`)

1.  **Theme Provider:** Create a React Context or component to manage the **Light/Dark mode toggle**, storing the preference in **Local Storage** (as required by the features list) and applying the Tailwind classes to the document body. Use a `shadcn/ui` button for the toggle.
2.  **tRPC Client Setup:** Configure the tRPC client and React Query Provider in `apps/web`.

## Technical Design Document (Reference)

***Note to Cursor: The full TDD is below for your reference. Focus on executing the "Phase 1: Core Setup & Shared Schema" tasks first.***

---
(Paste the full, original Technical Design Document here, including the filled-in pitch and goals, but omitting the `[...]` template placeholders where possible.)
---

**One-sentence pitch:** A personalized, responsive fitness tracker that motivates users and simplifies progress logging for all workout types.

### 1. OVERVIEW
* Goal:
    * Provide a unified platform for tracking diverse workouts and setting fitness goals.
    * Ensure a smooth, mobile-friendly experience with responsive design and light/dark modes.
    * Offer progress tracking and motivation without requiring a complex external API for basic logging (via local storage/Firebase).
* Key features: (List all key features from Section 1 here)

### 2. TECH STACK (GOLDEN PATH)
(Paste the full Tech Stack list here)

### 3. MONOREPO LAYOUT (PNPM)
(Paste the full Monorepo Layout list here)

### 4. ARCHITECTURE
(Paste the Architecture description here)

### 5. DATA MODEL
(Reference the Zod schemas created above for the data structure)

### 6. API DESIGN (tRPC)
(Focus on implementing the `user` router first.)
| Router | Procedure | Input (Zod schema) | Output |
| :--- | :--- | :--- | :--- |
| **user** | `getProfile` | (none) | `UserSchema` |
| **user** | `updateProfile`| `UserSchema.partial()`| `UserSchema` |
...