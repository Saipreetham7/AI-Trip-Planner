# AI Trip Planner

AI Trip Planner is an end-to-end travel planning experience built with Next.js. It combines a conversational AI assistant, dynamic UI widgets, and rich destination data to help travellers go from an idea to a structured itinerary in minutes. Authenticated users can chat with the planner, review day-by-day recommendations, and store their trips for later reference.

## Key Features
- Conversational trip planner that gathers requirements step-by-step and auto-suggests quick replies for budget, group size, and duration.
- AI-generated hotel and activity recommendations rendered in an animated timeline with pricing, best-time-to-visit tips, and Google Maps deep links.
- Live imagery enrichment via Google Places Photos for both accommodation and points of interest.
- Clerk-protected workflow that gates trip creation behind sign-in while keeping the public landing page open.
- Convex-backed persistence layer that stores user profiles and full trip payloads for future retrieval.
- Built-in rate limiting example (Arcjet) to demonstrate how to shield AI-facing endpoints.

## Architecture Overview
- **Frontend:** Next.js App Router (React 19) renders the landing `Hero` component, authenticated dashboard (`/create-new-trip`), and shared layout/Header.
- **Conversation Flow:** `ChatBox` component streams user prompts to `POST /api/aimodel`. The route switches between an interview prompt and a final planning prompt when `isFinal` is reached.
- **Generative UI:** The assistant can request contextual widgets (`BudgetUi`, `GroupSizeUi`, `SelectDaysUi`, `FinalUi`) by returning a `ui` flag, allowing fast structured responses without typing.
- **Itinerary Rendering:** `Itinerary` pairs the saved `TripInfo` with the animated `Timeline` component, surfacing hotel cards (`HotelCardItem`) and activity cards (`PlaceCardItem`). Each card refreshes imagery through the Google Places proxy endpoint.
- **Persistence:** After the final plan is generated, the client saves the trip to Convex (`tripDetail.CreateTripDetail`) alongside the Clerk user reference.
- **Auth & Guard Rails:** `middleware.ts` ensures every route except `/`, `/sign-in`, and `/sign-up` is authenticated. Optional `/api/arcjet` illustrates how to add rate limits in front of sensitive endpoints.

## Tech Stack
- Framework: Next.js 15 (App Router), React 19
- Styling: Tailwind CSS v4, custom theme tokens, motion/react animations
- UI Utilities: shadcn/ui primitives, class-variance-authority, lucide-react icons
- Authentication: Clerk (sign-in/up pages, header user controls)
- Backend as a Service: Convex for user & trip data storage
- AI Integration: OpenRouter (Grok 4 Fast) via `/api/aimodel`
- Data Enrichment: Google Places Text Search & Photos
- Resilience & Ops: Arcjet token bucket rate limiting sample

## Project Structure
```
app/
  _components/        // Landing page UI (Hero, Header)
  (auth)/             // Clerk-hosted sign-in & sign-up routes
  api/                // Edge/server routes (AI model, Arcjet, Google Places)
  create-new-trip/    // Authenticated trip planner experience
  provider.tsx        // Shared layout providers (Clerk, Convex, custom contexts)
components/ui/        // Reusable UI primitives (buttons, timeline, dialogs)
context/              // React context definitions for user & trip detail state
convex/               // Convex schema and mutations
hooks/                // Custom hooks (e.g., outside click)
```

## Getting Started
1. **Install dependencies**
   ```bash
   npm install
   ```
2. **Configure environment variables** (see the next section) in a `.env.local` file.
3. **Start Convex dev server** in a separate terminal to enable data mutations:
   ```bash
   npx convex dev
   ```
4. **Run the Next.js app**
   ```bash
   npm run dev
   ```
5. Open `http://localhost:3000` and sign in with Clerk to access `/create-new-trip`.

## Environment Variables
Create `.env.local` with the following keys (replace placeholders with your own credentials):

```
# Clerk
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_...
CLERK_SECRET_KEY=sk_...
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up

# Convex
NEXT_PUBLIC_CONVEX_URL=https://<your-convex-deployment>.convex.cloud
# For local Convex dev you may also need CONVEX_DEPLOY_KEY (see Convex docs)

# AI provider (OpenRouter)
OPENROUTER_API_KEY=or-...

# Google Places
GOOGLE_PLACES_API_KEY=AIza...

# Arcjet (optional but required for /api/arcjet route)
ARCJET_KEY=aj_...
```

> 💡 **Tip:** When running Convex locally, `npx convex dev` will print the URL you should copy into `NEXT_PUBLIC_CONVEX_URL`.

## Available Scripts
- `npm run dev` – start the Next.js development server.
- `npm run build` – create a production build.
- `npm run start` – run the production build locally.
- `npx convex dev` – watch Convex schema/mutations and serve the local Convex backend.

## API Endpoints
- `POST /api/aimodel` – Primary AI interface. Accepts `{ messages, isFinal }` and proxies to OpenRouter. Returns structured JSON with `resp`, `ui`, and optionally `trip_plan`.
- `POST /api/google-place-detail` – Fetches photo metadata from Google Places Text Search and returns a direct media URL for the requested hotel/activity.
- `GET /api/arcjet` – Demonstrates Arcjet token bucket rate limiting (replace the hard-coded `userId` before using in production).

## Authentication & Authorization
- Public routes: landing page (`/`), sign-in, and sign-up.
- All other routes (pages and API handlers) are protected by Clerk middleware.
- `Header` surfaces the Clerk `UserButton` and swaps the call-to-action between `SignInButton` and "Create New Trip" depending on authentication state.

## Data Model & Persistence
- `UserTable` tracks Clerk users inside Convex (name, email, avatar, optional subscription).
- `TripDetailTable` stores AI-generated itineraries by `tripId` and links them to the Convex user document.
- The client stores the latest `TripInfo` in context so `Itinerary` stays reactive while the Convex mutation completes.

## Customising the AI Experience
- Prompt templates live in `app/api/aimodel/route.ts`. Adjust `PROMPT` for interview tone or `FINAL_PROMPT` to tweak the JSON itinerary schema.
- Update `BudgetUi`, `GroupSizeUi`, and `SelectDaysUi` to add richer presets or additional quick replies.
- `Timeline` and card components can be extended to surface more metadata (e.g., booking links, estimated costs).

## Deployment Notes
- Provide all environment variables through your hosting provider (e.g., Vercel environment settings).
- Convex can be deployed via `npx convex deploy` to produce the `NEXT_PUBLIC_CONVEX_URL` used by the client.
- Clerk supports domain-specific redirect URLs; ensure `NEXT_PUBLIC_CLERK_SIGN_IN_URL` and `NEXT_PUBLIC_CLERK_SIGN_UP_URL` match your deployed paths.
- If you rely on Arcjet in production, switch the rule mode from `LIVE` to the desired configuration and supply a per-user identifier instead of the sample value.

## Troubleshooting
- **No itinerary appears:** confirm the OpenRouter key is valid and that the AI response includes `trip_plan`. Check server logs for JSON parsing errors.
- **Missing images:** verify `GOOGLE_PLACES_API_KEY` has Places API access and billing enabled. The `/api/google-place-detail` endpoint returns the raw error for easier debugging.
- **Convex errors:** make sure the Convex dev server is running and the `NEXT_PUBLIC_CONVEX_URL` matches the URL printed by Convex.
- **Auth redirects:** ensure the Clerk publishable & secret keys are configured and that the middleware allowlist covers any additional public routes you add.

Happy travels! ✈️
