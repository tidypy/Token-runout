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

## 📝 Recent Version Changelog

### v0.2.0 (2026-08-01)
- **Feat**: Provider Rate Limit & Quota Telemetry (5-Hour & Weekly Limits).
- **Feat**: Git File Hotspots ("Where Tokens Were Spent").
- **Feat**: Zero-Config Git HTTP Repository Sync (`GithubAuthCard`).
- **Feat**: Codebase Folder Management Sheet (`AddCodebaseModal`).
- **Refactor**: Simplified Git Hotspots by removing manual diff input forms.
- **Build**: Resolved Turbopack root config and TypeScript zero-error compliance.

### v0.1.0 (2026-08-01)
- Initial token runway tracker core engine & model card layout.
