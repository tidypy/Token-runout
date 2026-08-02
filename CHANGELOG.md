# Project Issues & Feature Changelog

Tracked feature additions, enhancements, and remedies implemented for **Token Runway Tracker**.

---

## 📋 Feature Issues Tracker

### [ISSUE #1] Provider Rate Limit & Quota Telemetry (5-Hour & Weekly Limits)
- **Category**: Telemetry & Quota Engine
- **Status**: `[RESOLVED / IMPLEMENTED]`
- **Description**: Provider APIs and local tools report usage in bundled limits rather than manual per-model token entries (e.g. Gemini 5-Hour Limit 93%, Weekly Limit 53%, Claude 100% 5-Hour Limit with 3h 45m refresh countdown).
- **Implementation**: Built [`lib/tracker/quota.ts`](file:///c:/Users/Dev/Documents/APPS/Token-runout-main/Token-runout-main/lib/tracker/quota.ts) and [`QuotaCard`](file:///c:/Users/Dev/Documents/APPS/Token-runout-main/Token-runout-main/components/tracker/quota-card.tsx).
- **Remedy / Comments**:
  - *Comment 1*: Added color-coded threshold badges (`OK`, `Warning >80%`, `Critical >95%`).
  - *Comment 2*: Added support for dual connection modes (**Direct API Key** vs **Local Telemetry**).

---

### [ISSUE #2] Git Codebase Token Utilization & Hotspot Analysis
- **Category**: Analytics & Developer KPIs
- **Status**: `[RESOLVED / IMPLEMENTED]`
- **Description**: Developers need actionable information showing *where* their tokens were spent across specific code files instead of generic vanity metrics.
- **Implementation**: Created [`GitHotspots`](file:///c:/Users/Dev/Documents/APPS/Token-runout-main/Token-runout-main/components/tracker/git-hotspots.tsx) and [`lib/tracker/git-analytics.ts`](file:///c:/Users/Dev/Documents/APPS/Token-runout-main/Token-runout-main/lib/tracker/git-analytics.ts).
- **Remedy / Comments**:
  - *Comment 1*: Initial design included a manual diff form (+lines, -lines, commit count inputs).
  - *Remedy*: Removed manual diff input form as it added friction; replaced with automated hotspot tracking per codebase folder.
  - *Remedy 2*: Replaced automatic faux data with real-data logging & optional preview diff triggers.

---

### [ISSUE #3] Codebase Folder Management & Pointing
- **Category**: Workspace Integration
- **Status**: `[RESOLVED / IMPLEMENTED]`
- **Description**: Allow developers to point the app to local codebase folders to group token metrics and git hotspots per project (e.g., `acme-web`, `docs-pipeline`).
- **Implementation**: Created [`AddCodebaseModal`](file:///c:/Users/Dev/Documents/APPS/Token-runout-main/Token-runout-main/components/tracker/add-codebase-modal.tsx).
- **Remedy / Comments**:
  - *Comment 1*: Integrated the Add Codebase button directly into the top codebase filter bar for instant access.

---

### [ISSUE #4] Zero-Config Git HTTP Repository Sync
- **Category**: Remote Git Tracking & Auth
- **Status**: `[RESOLVED / IMPLEMENTED]`
- **Description**: Manual PAT tokens are developer-heavy and hidden in GitHub settings. Users need a simple HTTP URL paste mechanism or local directory auto-sync.
- **Implementation**: Created [`GithubAuthCard`](file:///c:/Users/Dev/Documents/APPS/Token-runout-main/Token-runout-main/components/tracker/github-auth-card.tsx).
- **Remedy / Comments**:
  - *Comment 1*: Defaulted repository connection to simple HTTP URL paste (`https://github.com/owner/repo.git`) with zero token configuration for public and local repos.
  - *Comment 2*: Retained optional PAT token input inside an advanced accordion for private repos.

---

### [ISSUE #5] Forecast Dashboard Redesign & Glassy UI Aesthetics
- **Category**: UI & Dashboard
- **Status**: `[RESOLVED / IMPLEMENTED]`
- **Description**: Build a light-glass floating widget & full dashboard interface with overview stat cards, forecast panel, pricing catalog, and token-saving tips card.
- **Implementation**: Assembled [`app/page.tsx`](file:///c:/Users/Dev/Documents/APPS/Token-runout-main/Token-runout-main/app/page.tsx), [`CompactWidget`](file:///c:/Users/Dev/Documents/APPS/Token-runout-main/Token-runout-main/components/tracker/compact-widget.tsx), [`ForecastPanel`](file:///c:/Users/Dev/Documents/APPS/Token-runout-main/Token-runout-main/components/tracker/forecast-panel.tsx), and [`PricingTable`](file:///c:/Users/Dev/Documents/APPS/Token-runout-main/Token-runout-main/components/tracker/pricing-table.tsx).
- **Remedy / Comments**:
  - *Remedy*: Explicitly set `turbopack.root` in `next.config.ts` to silence workspace root warnings.

---

### [ISSUE #6] Interactive Codebase Deletion
- **Category**: Workspace Integration
- **Status**: `[RESOLVED / IMPLEMENTED]`
- **Description**: Users need to delete or untrack codebases directly from the interface.
- **Implementation**: Added active codebase pill close handlers in [`app/page.tsx`](file:///c:/Users/Dev/Documents/APPS/Token-runout-main/Token-runout-main/app/page.tsx).
- **Remedy / Comments**:
  - *Comment 1*: Added an `x` delete icon directly to active codebase tabs in the filter bar, saving workspace screen space.

---

### [ISSUE #7] Hero Mode Selector Segment Cards
- **Category**: UI & Dashboard
- **Status**: `[RESOLVED / IMPLEMENTED]`
- **Description**: Standard tabs are easy to miss, leading users to mistake simulation predictions with actual usage metrics.
- **Implementation**: Created segmented cards in [`app/page.tsx`](file:///c:/Users/Dev/Documents/APPS/Token-runout-main/Token-runout-main/app/page.tsx).
- **Remedy / Comments**:
  - *Comment 1*: Replaced the small top-right tab switcher with prominent segment selector cards featuring custom colors, active glow styling, and description subheadings.

---

### [ISSUE #8] Subscription Account Tiers Setup
- **Category**: Plan Configuration
- **Status**: `[RESOLVED / IMPLEMENTED]`
- **Description**: Users with account subscription plans (Google Gemini Pro, Claude Free, GPT Free) need clean tracking without granular model API keys.
- **Implementation**: Updated [`lib/tracker/storage.ts`](file:///c:/Users/Dev/Documents/APPS/Token-runout-main/Token-runout-main/lib/tracker/storage.ts) and [`lib/tracker/pricing.ts`](file:///c:/Users/Dev/Documents/APPS/Token-runout-main/Token-runout-main/lib/tracker/pricing.ts).
- **Remedy / Comments**:
  - *Comment 1*: Populated Pro Plans and Free Tiers out-of-the-box, displaying a clean **⚡ Free Tier** badge on cards instead of empty budget allocations.

### [ISSUE #9] DeepSeek Peak-Valley Pricing Advisory
- **Category**: Tips & Pricing Engine
- **Status**: `[RESOLVED / IMPLEMENTED]`
- **Description**: DeepSeek off-peak pricing discounts (up to 50% savings during 16:00-24:00 UTC) need visibility to guide model routing.
- **Implementation**: Updated [`components/tracker/tips-card.tsx`](file:///c:/Users/Dev/Documents/APPS/Token-runout-main/Token-runout-main/components/tracker/tips-card.tsx).

---

### [ISSUE #10] Dark Mode & Pro Blue Theme Switcher
- **Category**: UI / Styling
- **Status**: `[RESOLVED / IMPLEMENTED]`
- **Description**: Provide customizable themes (Light Glassy, Sleek Dark Mode, Pro Blue CMS).
- **Implementation**: Created [`components/tracker/theme-switcher.tsx`](file:///c:/Users/Dev/Documents/APPS/Token-runout-main/Token-runout-main/components/tracker/theme-switcher.tsx).

---

### [ISSUE #11] Standalone PyInstaller Desktop Bundle
- **Category**: Desktop / Packaging
- **Status**: `[RESOLVED / IMPLEMENTED]`
- **Description**: Non-technical users need a zero-terminal single-file executable (`TokenRunout.exe`) without Node.js, NPM, or firewall prompts.
- **Implementation**: Created [`desktop_runner.py`](file:///c:/Users/Dev/Documents/APPS/Token-runout-main/Token-runout-main/desktop_runner.py), [`build_desktop.py`](file:///c:/Users/Dev/Documents/APPS/Token-runout-main/Token-runout-main/build_desktop.py), and updated [`next.config.ts`](file:///c:/Users/Dev/Documents/APPS/Token-runout-main/Token-runout-main/next.config.ts) for static export (`output: "export"`).
- **Remedy / Comments**:
  - *Remedy*: Used an in-process loopback HTTP server (`127.0.0.1:0`) to resolve Next.js static asset chunk paths while bypassing Windows Firewall prompts.

---

### [ISSUE #12] Native Floating Overlay Desktop Widget
- **Category**: Desktop / UX
- **Status**: `[RESOLVED / IMPLEMENTED]`
- **Description**: The compact widget mode must function as a standalone, frameless floating desktop overlay rather than being trapped in a browser tab.
- **Implementation**: Updated [`components/tracker/compact-widget.tsx`](file:///c:/Users/Dev/Documents/APPS/Token-runout-main/Token-runout-main/components/tracker/compact-widget.tsx) and [`app/page.tsx`](file:///c:/Users/Dev/Documents/APPS/Token-runout-main/Token-runout-main/app/page.tsx).
- **Remedy / Comments**:
  - *Remedy*: Implemented `-webkit-app-region: drag` for frameless window dragging across screens and PyWebView two-way IPC window resizing and Always-on-Top toggles.

---

## 📝 Recent Version Changelog

### v0.4.0 (2026-08-02)
- **Feat**: Single-file Windows desktop executable packaging (`dist/TokenRunout.exe` via PyInstaller).
- **Feat**: Native floating desktop widget overlay with frameless window dragging (`-webkit-app-region: drag`).
- **Feat**: Two-way PyWebView IPC bridge for Compact Widget vs Full Dashboard window resizing and Always-On-Top toggles.
- **Fix**: Resolved strict TypeScript and ESLint warnings/errors across `app/page.tsx`, `settings-sheet.tsx`, `theme-switcher.tsx`, and `use-tracker.ts`.
- **Fix**: Solved static asset chunk loading via embedded loopback server (`127.0.0.1:0`), preventing startup hangs.

### v0.3.0 (2026-08-01)
- **Feat**: Prominent segmented Hero Mode Switcher cards (Forecast vs Actual Plans).
- **Feat**: Capability to remove a codebase directly from filter pills (`[x]`).
- **Feat**: Seeded Google Pro Plan, Claude Free, and GPT Free subscription accounts.
- **Feat**: DeepSeek Peak-Valley pricing advisory warning widget in TipsCard.
- **Feat**: Dark mode & Pro Blue CMS theme switcher toggles.
- **Fix**: Removed forced automatic simulation data for fresh codebase views.


### v0.2.0 (2026-08-01)
- **Feat**: Provider Rate Limit & Quota Telemetry (5-Hour & Weekly Limits).
- **Feat**: Git File Hotspots ("Where Tokens Were Spent").
- **Feat**: Zero-Config Git HTTP Repository Sync (`GithubAuthCard`).
- **Feat**: Codebase Folder Management Sheet (`AddCodebaseModal`).
- **Refactor**: Simplified Git Hotspots by removing manual diff input forms.
- **Build**: Resolved Turbopack root config and TypeScript zero-error compliance.

### v0.1.0 (2026-08-01)
- Initial token runway tracker core engine & model card layout.
