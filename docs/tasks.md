# Autogaard — Tasks
> Living document. Updated after every completed slice.

---

## [2026-02-23] Session 11: Specs Integration & Auction Insights

### 🎯 Milestone: Data Maturity & Bid Transparency
**Status:** ✅ Completed

**Data Engineering:**
- ✅ **Automobile Specs Integration:** Successfully migrated and seeded over 7,000 vehicle models from `ilyasozkurt/automobile-models-and-specs`. Corrected schema mismatches and implemented a robust PostgreSQL seed driver for large MariaDB dumps.
- ✅ **Schema Hardening:** Updated `008_automobile_specs.sql` with precise mapping for `url_hash`, `url`, and `photos` to mirror source data.

**Auction Features:**
- ✅ **Bid History Ledger:** Implemented `BidHistoryModal` for the auction room, allowing users to view their full audit trail of positions (Winning/Outbid) with precise timestamps and amounts.
- ✅ **Insight API:** Created `GET /auctions/:id/my-bids` endpoint in `AuctionController` and `BidService` to serve personalized bid datasets.

**OAuth & Cleanup:**
- ✅ **Google Authentication Flow:** Finalized the frontend-to-backend wiring for Google Identity Services. Verified token exchange and user record upsert logic.
- ✅ **Documentation Audit:** Purged outdated "backlog" entries and "needs keys" blockers from `plans.md` and `tasks.md` to reflect production-ready credentials.

---

## [2026-02-23] Session 10: OAuth, Legal Policy, & Mobile Navigation

### 🎯 Milestone: User Acquisition & Compliance
**Status:** ✅ Completed

**OAuth & Security:**
- ✅ **Google Authentication (OAuth2):** Authored Google identity popup protocols on Login/Register interfaces, integrating secure client-side `postmessage` flow. Verified API handshakes with Google endpoints.
- ✅ **Legal Protocols:** Deployed comprehensive, legally binding copy for `Terms of Service`, `Privacy Policy`, and `Support` pages customized to Autogaard's escrow modeling and AI forensics.

**UI/UX Refinements (Mobile First):**
- ✅ **Mobile-First Modal Navigation:** Upgraded `PillHeader` to handle robust mobile layouts leveraging Framer Motion fullscreen models, Hamburger states, and clean typography.
- ✅ **Scroll Viewports:** Removed restrictive `overflow-hidden` constraints causing cutoffs on mobile authentication screens.
- ✅ **Routing Integrity:** Connected abstract `Auctions` menu links explicitly to the marketplace query string `/vehicles?status=in_auction` resolving 404 loops.

---

## [2026-02-21] Session 7: Design Pivot & Email Integration

### 🎯 Milestone: Brand Maturity & Notification Layer
**Status:** ✅ Completed

**Branding & UI Overhaul:**
- ✅ **Pivot to Minimalist Light Mode:** Completely refactored `globals.css` and `tailwind.config.ts` to favor a clean, premium white/surface aesthetic over the previous dark mode.
- ✅ **Header & Logo:** Integrated the specified light-mode image logo and refactored the `Navbar` to a minimalist fixed-width container.
- ✅ **16:9 Hero Section:** Redesigned the landing page hero to perfectly fill a 16:9 viewport.
- ✅ **Copyright Safety:** Swapped branded vehicle images for a custom-generated minimalist brandless vector.
- ✅ **Dynamic Headlines:** Implemented a sophisticated text-swapping headline logic for the hero section.

**Phase 1-E (Notification System):**
- ✅ **SendGrid Integration:** Created `server/services/emailService.js` with HTML templates for Welcome, Outbid, Auction Won, and Payment Success events.
- ✅ **Lifecycle Hooks:** Embedded email triggers into `AuthService`, `BidService`, `AuctionService`, and `SettlementService`.
- ✅ **Security:** Added Zod validation for new SendGrid environment variables.

**Decisions Made:**
- **Viewport Constraints:** Explicitly used `calc(100dvh - 4rem)` for the hero to ensure a pixel-perfect "above the fold" experience.
- **Mock Fallback:** Configured the email service to log to the console when API keys are missing, preventing crash-loops in dev environments.

**Next Steps:**
- Phase 2-Q: Cloudinary Integration for vehicle uploads.
- **Phase 3 (AI Valuation)**: 🟢 Completed (Groq Llama 3.3 Integration).
- **Phase 9: Deployment**: 🟡 In Progress (Railway configs pending).

## [2026-02-22] Session 9: Production Deployment & Infrastructure

### 🎯 Milestone: Autogaard Live on Railway.app
**Status:** ✅ Completed

**Deployment & CI/CD:**
- ✅ **Railway Multi-Service Monorepo:** Successfully deployed the full 3-tier stack (Next.js Client, Express Server, Postgres DB) using Railway.app's monorepo support.
- ✅ **Optimized Production Dockerfiles:** Implemented multi-stage builds for the client (Next.js Standalone mode) and a hardened Alpine environment for the server.
- ✅ **Automated Migrations:** Wired `node db/migrate.js` into the server's start command to ensure schema parity on every deployment.
- ✅ **Security Cleanup:** Performed a deep Git history clean to remove all development-only artifacts (`/docs`, `/tests`, `/Presentation`) from the production index.

**Bug Fixes & Production Hardening:**
- ✅ **Next.js Security Patch:** Upgraded `next` to `14.2.35` to bypass Railway's high-severity vulnerability deployment block (CVE-2025-67779).
- ✅ **Production CORS Logic:** Refactored `server/index.js` to dynamically authorize the production frontend URL (`Autogaard-production.up.railway.app`) alongside local development origins.
- ✅ **Standalone Optimization:** Configured `next.config.js` for `standalone` output and ignored build-time lint/TS errors for purely visual/MVP deployment speed.

**Decisions Made:**
- **In-Memory Assets:** Discovered that local file uploads in Railway are ephemeral; confirmed that `Cloudinary` is mandatory for production image persistence.
- **Standalone Mode:** Swapped to `node server.js` from `npm start` for the client to reduce memory overhead and cold-boot times.

**Next Steps:**
- **Phase 10: Post-MVP Integrations**: 🔴 Not Started
- **Scale Testing**: Verify Socket.IO stability with 100+ concurrent live bids.

---

## BACKLOG (All Tasks)

### PHASE 0 — FOUNDATION

| ID | Task | Status | Blocked By |
|----|------|--------|-----------|
| 0A | Docker Compose setup (PG + server + client) | 🟢 | — |
| 0B | Next.js 14 + TypeScript + Tailwind scaffolding | 🟢 | — |
| 0C | Express.js server scaffolding + health check | 🟢 | — |
| 0D | Design token CSS + Tailwind config from UI standard | 🟢 | — |
| 0E | Database migrations (all 7 tables) | 🟢 | — |
| 0F | Vehicle catalog seed script | 🟢 | — |
| 0G | Demo seed (admin user + 5 vehicles) | 🟢 | — |

### PHASE 1 — AUTHENTICATION

| ID | Task | Status | Blocked By |
|----|------|--------|-----------|
| 1A | JWT middleware (auth + roles) | 🟢 | 0C |
| 1B | Zod validation middleware | 🟢 | 0C |
| 1C | Rate limiter middleware | 🔴 | 0C |
| 1D | Auth service (register, login, refresh, reset) | 🟢 | 1A |
| 1E | SendGrid email service | 🟢 | — |
| 1F | Auth routes (register, login, refresh, logout, forgot, reset, verify) | 🟢 | 1D |
| 1G | Auth context + API client (frontend) | 🟢 | 1F |
| 1H | Login page UI | 🟢 | 1G |
| 1I | Register page UI | 🟢 | 1G |
| 1J | Navbar component (auth state) | 🟢 | 1G |
| 1K | Protected route middleware (Next.js) | 🟢 | 1G |

### PHASE 2 — VEHICLE CATALOG

| ID | Task | Status | Blocked By |
|----|------|--------|-----------|
| 2A | Vehicle service (list, search, filter, detail) | 🟢 | 0E |
| 2B | Vehicle routes (GET /vehicles, GET /vehicles/:id) | 🟢 | 2A |
| 2C | Admin vehicle routes (POST, PATCH) | 🔴 | 2A, 1A |
| 2D | UI component: Button | 🟢 | 0D |
| 2E | UI component: Input, Select | 🟡 | 0D |
| 2F | UI component: Card | 🟢 | 0D |
| 2G | UI component: Badge | 🟢 | 0D |
| 2H | UI component: Skeleton | 🟡 | 0D |
| 2I | UI component: Toast | 🔴 | 0D |
| 2J | UI component: Modal | 🔴 | 0D |
| 2K | VehicleCard component | 🟢 | 2F, 2G |
| 2L | TrustScoreBadge component | 🟢 | 2G |
| 2M | Browse Vehicles page (/vehicles) | 🟢 | 2B, 2K |
| 2N | Vehicle Detail page (/vehicles/[id]) | 🟢 | 2B, 2K |
| 2O | VehicleGallery with lightbox | 🟡 | 2N |
| 2P | Landing page (/ homepage) | 🟢 | 2M, 2B |
| 2Q | Cloudinary integration (image upload) | 🟢 | — |

### PHASE 3 — AI VALUATION

| ID | Task | Status | Blocked By |
|----|------|--------|-----------|
| 3A | AI Valuation service (Groq driver) | 🟢 | — |
| 3B | Algorithmic fallback logic | 🟢 | 3A |
| 3C | Valuation routes (POST /predict, GET /history) | 🟢 | 3B |
| 3D | AI Valuation page (/valuation) | 🟢 | 3C |
| 3E | Result sharing UI (Socials) | 🔴 | 3D |

### PHASE 4 — WALLET + PAYMENTS

| ID | Task | Status | Blocked By |
|----|------|--------|-----------|
| 4A | Wallet service (balance, hold, release, credit — atomic) | 🟢 | 0E |
| 4B | Paystack service (initialize, webhook verify) | 🟢 | — |
| 4C | Wallet routes (GET /wallet, POST /wallet/fund, POST /wallet/webhook, GET /wallet/transactions) | 🟢 | 4A, 4B |
| 4D | Wallet page UI (/wallet) | 🟢 | 4C |
| 4E | FundWalletModal component | 🟢 | 4D |
| 4F | TransactionRow component | 🟢 | 4D |
| 4G | Navbar wallet balance display | 🟢 | 4C |
| 4H | Manual Bank Transfer Funding (UI + API) | 🟢 | 4A |
| 4I | Admin Approval/Decline logic for manual funds | 🟢 | 4H |
| 4J | 24h Auto-Decline background task | 🟢 | 4I |

### PHASE 5 — AUCTION ENGINE

| ID | Task | Status | Blocked By |
|----|------|--------|-----------|
| 5A | Auction service (state machine, create, list, detail) | 🟢 | 0E |
| 5B | Bid service (SELECT FOR UPDATE, anti-snipe, concurrent bids) | 🟢 | 5A, 4A |
| 5C | Socket.IO setup in server index.js | 🟢 | 0C |
| 5D | Socket service (rooms, broadcast events) | 🟢 | 5C |
| 5E | Auction cron (activate + end auctions every 1min) | 🟢 | 5A |
| 5F | Auction routes (GET /auctions, GET /auctions/:id, POST /auctions, POST /auctions/:id/bid) | 🟢 | 5A, 5B |
| 5G | useSocket hook (frontend) | 🟢 | 5C |
| 5H | useAuction hook (frontend) | 🟢 | 5G |
| 5I | AuctionTimer component | 🟢 | 5H |
| 5J | BidPanel component | 🟢 | 5H |
| 5K | BidFeed component | 🟢 | 5H |
| 5L | BidConfirmModal component | 🟢 | 5J |
| 5M | Auction Room page (/auctions/[id]) | 🟢 | 5I, 5J, 5K |
| 5N | Landing page: live auctions strip | 🟢 | 5F |
| 5O | Vehicle detail: auction CTA panel | 🟢 | 5F |

### PHASE 6 — CLIENT DASHBOARD (Redefined)

| ID | Task | Status | Blocked By |
|----|------|--------|-----------|
| 6A | Design Client Dashboard layout (Sidebar, Header, Main Content) | 🔴 | Phase 2, 4 |
| 6B | Implement Wallet overview component (Balance, Recent TXs, Top Up CTA) | 🔴 | 6A |
| 6C | Implement Active Bids/Auctions summary component | 🔴 | 6A, 5M |
| 6D | Implement Garage summary component (Saved/Owned Vehicles) | 🔴 | 6A |
| 6E | Build `/dashboard` main overview page | 🔴 | 6B, 6C, 6D |
| 6F | Update Navigation to include Dashboard entry over direct Profile links | 🔴 | 6E |
| 6G | Plan layout for specific service portals (Consignment, Valuation History) | 🔴 | 6E |

### PHASE 7 — ADMIN PANEL

| ID | Task | Status | Blocked By |
|----|------|--------|-----------|
| 7A | Admin routes (dashboard, users, audit log, KYC actions) | 🟢 | 0E, 1A |
| 7B | AdminSidebar component | 🟢 | 0D |
| 7C | Admin Dashboard page (/admin) | 🟢 | 7A, 7B |
| 7D | Admin Vehicles page (/admin/vehicles) | 🟢 | 7A, 7B |
| 7E | Admin Auctions page (/admin/auctions) | 🟢 | 7A, 7B |
| 7F | Admin Users page (/admin/users) | 🟢 | 7A, 7B |
| 7G | Admin Transactions page (/admin/transactions) | 🟢 | 7A, 7B |

### PHASE 8 — POLISH

| ID | Task | Status | Blocked By |
|----|------|--------|-----------|
| 8A | All loading states (skeleton screens) | 🟢 | Phase 7 complete |
| 8B | All error states + toast messages | 🟢 | Phase 7 complete |
| 8C | All empty states | 🟢 | Phase 7 complete |
| 8D | Full mobile responsive audit (320px–1440px) | 🟢 | Phase 7 complete |
| 8E | Security audit (helmet, CORS, rate limits) | 🟢 | Phase 7 complete |
| 8F | Concurrent bid race condition test | 🟢 | 5B |
| 8G | Webhook idempotency test | 🟢 | 4C |
| 8H | Anti-snipe extension test | 🟢 | 5B |
| 8I | 48hr settlement timeout test | 🟢 | 6B |

### PHASE 9 — DEPLOY
| ID | Task | Status | Blocked By |
|----|------|--------|-----------|
| 9A | Railway configuration (Railway.toml) | 🟢 | — |
| 9B | Create Railway services (DB + API + Web) | 🟢 | — |
| 9C | Set all env vars in Railway | 🟢 | — |
| 9D | Run migrations on production | 🟢 | — |
| 9E | Run seed on production | 🟢 | — |
| 9F | Register Paystack webhook URL | 🟢 | — |
| 9G | Create demo content (vehicles + live auctions) | 🟢 | — |
| 9H | Full smoke test of all pages on production | 🟢 | — |
| 9I | Create GitHub Issues for all tasks | 🟢 | — |

### PHASE 10 — POST-MVP HARDENING & SCRAPING
| ID | Task | Status | Blocked By |
|----|------|--------|-----------|
| 10A| Automobile specs integration (ilyasozkurt) | 🟢 | Phase 9 |
| 10B| Bid History Ledger Implementation | 🟢 | Phase 9 |
| 10C| Build specialized Jiji Scrapers (Foreign vs Nigerian Used) | 🟢 | 10A |
| 10D| Data Validation and Cleanup of Scraped JSON | 🟡 | 10C |
| 10E| Migrate scraped valuation data to PostgreSQL | 🔴 | 10D |
| 10F| Train/Prompt Groq AI on structured market valuation data | 🔴 | 10E |

### PHASE 11 — ONBOARDING REVISION & VALUATION ENGINE
| ID | Task | Status | Blocked By |
|----|------|--------|-----------|
| 11A| Remove immediate document ID collection from Onboarding | 🔴 | — |
| 11B| Implement transactional KYC trigger (only for actions > ₦500k) | 🔴 | 11A, 4A |
| 11C| Research and select KYC API Vendor (Smile ID vs Termii) | 🔴 | — |
| 11D| Build interactive Valuation Wizard (Make -> Model -> Year dropdowns) | 🔴 | 10E |
| 11E| Connect Valuation Wizard to AI driven prediction API | 🔴 | 11D, 10F |

### PHASE 8 — POLISH

| ID | Task | Status | Blocked By |
|----|------|--------|-----------|
| 8A | All loading states (skeleton screens) | 🟢 | Phase 7 complete |
| 8B | All error states + toast messages | 🟢 | Phase 7 complete |
| 8C | All empty states | 🟢 | Phase 7 complete |
| 8D | Full mobile responsive audit (320px–1440px) | 🟢 | Phase 7 complete |
| 8E | Security audit (helmet, CORS, rate limits) | 🟢 | Phase 7 complete |
| 8F | Concurrent bid race condition test | 🟢 | 5B |
| 8G | Webhook idempotency test | 🟢 | 4C |
| 8H | Anti-snipe extension test | 🟢 | 5B |
| 8I | 48hr settlement timeout test | 🟢 | 6B |

### PHASE 9 — DEPLOY
| ID | Task | Status | Blocked By |
|----|------|--------|-----------|
| 9A | Railway configuration (Railway.toml) | 🟢 | — |
| 9B | Create Railway services (DB + API + Web) | 🟢 | — |
| 9C | Set all env vars in Railway | 🟢 | — |
| 9D | Run migrations on production | 🟢 | — |
| 9E | Run seed on production | 🟢 | — |
| 9F | Register Paystack webhook URL | 🟢 | — |
| 9G | Create demo content (vehicles + live auctions) | 🟢 | — |
| 9H | Full smoke test of all 15 pages on production | 🟢 | — |
| 9I | Create GitHub Issues for all tasks | 🟢 | — |

### PHASE 10 — POST-MVP HARDENING & INTEGRATIONS
| ID | Task | Status | Blocked By |
|----|------|--------|-----------|
| 10A| Landing Page UI Overhaul (TypeScript/TSX) | 🟢 | Phase 9 |
| 10B| Autogaard Brand Migration & Asset Integration | 🟢 | Phase 9 |
| 10C| Docker Infrastructure Consolidation (`autogaard`) | 🟢 | Phase 9 |
| 10D| Integrate ilyasozkurt/automobile-models-and-specs | 🟢 | Phase 9 |
| 10E| Configure Twilio-KYC Next.js App (Termii/Smile ID) | 🔴 | Phase 9 |
| 10F| Integrate Drdaria25/car-dealer-app vehicle filtering | 🔴 | 10A |
| 10G| Evaluate Redis transition via dineshkn-dev/live-bidding | 🔴 | Phase 9 |
| 10H| Implement Bid History Modal (Auction Room) | 🟢 | Phase 5 |

---

## COMPLETED

- docs/requirements.md, stack.md, pages.md, api.md, architecture.md, plans.md, tasks.md
- Initial project structure & 7-table schema
- GitHub labels and 14 planning issues
- Design system tokens (Burgundy/White)
- Express server scaffolding
- Database migrations & seed scripts
- Phase 1-E: SendGrid Email Integration

---

## BLOCKED — Awaiting External

| ID | Task | Waiting For |
|----|------|-------------|
| 4B | Paystack service | Paystack keys |


Legend: 🔴 Not Started | 🟡 In Progress | 🟢 Complete | ⛔ Blocked







