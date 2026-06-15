# Botsmart-Style Full-Site Redesign

Date: 2026-06-15
Project: new-api

## Goal

Redesign the `web/default` frontend so the whole product feels close to the reference site at `https://kjapi.botsmart.net/`: a polished new-api-based AI API gateway with a restrained SaaS control-panel look, public marketing pages, token lookup, and a complete authenticated console.

The implementation should be high-fidelity in information architecture, layout, visual density, interaction patterns, and page coverage. It must not copy third-party sensitive or proprietary materials such as company logos, institution names, official endorsement claims, contact details, account data, or private assets. The protected project identifiers `new-api` and `QuantumNous` must remain intact wherever the repository currently requires them.

The product should be presented as a single-upstream service. This deployment connects only to the API provider described in `/Users/locky/Downloads/跨境数科模型API接入文档20260409.md`; upstream credentials are provided by that provider and configured by administrators, while end users continue to use this new-api site through locally issued API keys.

## Reference Findings

The reference site uses these major patterns:

- Public header with logo/name, links for home, console, pricing/model plaza, token lookup, docs, about, language, theme, notifications, and user profile.
- Public home page with centered trust-oriented positioning, subdued white background, green/blue accent text, a large rounded light panel, and four capability cards.
- About page with structured sections for positioning, advantages, safety/compliance, support context, and contact blocks.
- Token lookup page with a simple token input, show/hide control, query button, and empty/result state.
- Authenticated console with a top global nav, left grouped sidebar, and a large rounded main content surface.
- Dashboard overview with setup guide, API key onboarding steps, curl request preview, readiness signals, quick actions, usage cards, balance card, announcements, FAQ, and uptime/status panels.
- Operational pages with dense but calm tables: API keys, usage logs, task logs, statistics, wallet, profile, channel/admin tables, and settings forms.

The upstream API document adds these constraints:

- Upstream base URL: `http://211.136.118.26:32001`.
- Authentication: Bearer token, using an upstream API key provided by the upstream provider.
- Supported protocols: OpenAI, Anthropic, Gemini, and NewAPI.
- Text models use `/v1/chat/completions` for OpenAI-compatible calls.
- OpenAI image generation is only for `gpt-image-1.5`.
- Gemini image models must use Gemini `generateContent`, not OpenAI image generation.
- The public product copy should say this site provides one managed access point to the upstream's model service, not that this deployment directly operates many unrelated provider channels.

## Content Boundary

Replicate:

- Page structure and navigation coverage.
- Visual hierarchy, spacing, card/table density, rounded panels, side navigation, and top navigation behavior.
- Generic trust and safety messaging for an AI API gateway.
- Control states such as empty data, loading skeletons, filters, row actions, status pills, and quick actions.

Do not replicate:

- The reference site's logo, brand name, institution names, official endorsement wording, real contact details, or account-specific data.
- Any private key, token, user name, balance, logs, or personal account artifacts observed in Chrome.
- Third-party images or assets unless they are replaced with project-owned or generic equivalents.

Keep:

- Existing new-api and QuantumNous attribution, licensing, package metadata, repository references, import paths, and protected identity mentions.
- Existing backend API contracts and business logic unless a frontend call shape is already supported by the project.
- The distinction between upstream provider credentials and local user API keys.

## Scope

### Public Experience

- Redesign `/` as a trust-oriented AI API gateway home page:
  - Centered headline and subtitle.
  - Primary CTA to console or sign up.
  - Secondary CTA to model pricing/docs.
  - Light compliance/trust panel with four capability cards.
  - Compact capability bands for supported models, unified API, single-upstream routing, billing, and observability.
- Redesign `/about` fallback content so an unconfigured site still has a polished about page.
  - If admins configure custom about content, continue to render it.
  - If no custom content exists, render generic platform positioning and project attribution.
- Add or refine `/key` token lookup page if missing in `web/default`.
  - Password token input, visibility toggle, query action, idle/loading/error/result states.
  - Results should use existing backend-supported token query APIs where available.
- Keep `/pricing` model plaza behavior, but align its shell, empty states, filters, and table/card presentation to the new visual system.
  - Model copy and protocol hints should reflect the upstream document's supported model list and protocol caveats.
- Keep docs as a configurable external link.

### Authenticated User Console

- Keep the current authenticated layout structure, but tune it to match the reference:
  - Top global navigation remains visible.
  - Left sidebar is grouped into common/user/admin sections with compact labels.
  - Main content area becomes a rounded white surface on a soft gray background.
- Refine dashboard overview:
  - Preserve existing onboarding guide, request preview, quick actions, usage cards, API info, announcements, FAQ, performance, and uptime panels.
  - Tighten copy and spacing to match the reference dashboard.
  - Keep real data from existing APIs and avoid mock values when data exists.
- Refine pages:
  - `/keys`: table toolbar, filters, create key button, empty state.
  - `/usage-logs/common`, `/usage-logs/task`, `/usage-logs/statistics`: filter strip, summary metrics, export/search actions, dense table.
  - `/wallet`: balance card, recharge/redemption controls, records.
  - `/profile`: profile summary card, binding/security/preference cards, sidebar preference controls.
  - `/playground` and chat pages: fit into the same navigation and surface treatment without changing model/request behavior.

### Admin Console

Apply the same layout and visual system to admin pages without altering business rules:

- Channels and channel dialogs, with this deployment's primary path optimized for one upstream provider/channel.
- Models and model mappings.
- Users and user actions.
- Redemption codes.
- Subscriptions.
- System settings sections.
- Errors and logs.

Admin forms should keep all existing fields, validation, and API calls. The work here is presentation consistency: page titles, toolbars, cards, tables, dialogs, badges, and empty states.

Admin-facing copy should make the operational model clear: configure and monitor the single upstream provider key, base URL, protocol routing, model mappings, and health. It should not imply that ordinary operators need to manage many unrelated upstream vendors for this deployment.

## Visual System

- Background: soft neutral gray for app chrome, white for primary surfaces.
- Accent: restrained green for positive/compliance/status signals, deep neutral for primary actions, muted blue/green for public-page emphasis.
- Radius: larger page surfaces and dashboard cards; smaller controls remain consistent with the component library.
- Shadows: low-contrast, mostly border-led with subtle shadow on large surfaces.
- Typography: keep Public Sans-based system; no viewport-width font scaling.
- Navigation:
  - Public header: compact horizontal nav, logo/name left, actions right.
  - Authenticated layout: global top nav plus grouped sidebar.
- Controls:
  - Use existing buttons, inputs, badges, tables, dropdowns, tabs, dialogs, and command menu components.
  - Prefer lucide icons already used by the repo.
- Avoid decorative gradient blobs or unrelated illustrative assets.

## Architecture

Work inside `web/default` and preserve existing route boundaries:

- Public pages:
  - `src/features/home`
  - `src/features/about`
  - `src/features/pricing`
  - new or existing token lookup route/feature for `/key`
- Shared layout:
  - `src/components/layout/components/public-header.tsx`
  - `src/components/layout/components/public-layout.tsx`
  - `src/components/layout/components/app-header.tsx`
  - `src/components/layout/components/app-sidebar.tsx`
  - `src/components/layout/components/main.tsx`
  - `src/components/layout/components/section-page-layout.tsx`
- Console features:
  - `src/features/dashboard`
  - `src/features/keys`
  - `src/features/usage-logs`
  - `src/features/wallet`
  - `src/features/profile`
  - admin feature folders such as channels, models, users, system-settings.
- Styles:
  - Prefer component class updates and existing theme variables.
  - Keep global CSS changes limited to reusable tokens and shell-level behavior.

## Data Flow

- Continue using existing React Query hooks, API clients, auth store, system config store, and i18n.
- New public/token pages should call existing backend endpoints only. If no endpoint exists for a target reference feature, render a polished empty/unsupported state rather than adding backend scope in the first frontend pass.
- Do not store or expose any observed reference-site account data.
- Do not expose the upstream provider API key in frontend code, public configuration, screenshots, logs, or user-facing examples. User-facing examples should use local user keys such as `sk-...`.
- Request examples should point users at this deployment's local API host, while admin documentation/settings can reference the upstream base URL.
- Protocol guidance should preserve the upstream document's image constraints: Gemini image models use Gemini protocol; `gpt-image-1.5` uses OpenAI image generation.

## Internationalization

- All new user-visible strings must use `t('English key')`.
- Update frontend locale files for `en`, `zh`, `fr`, `ja`, `ru`, and `vi`.
- Run the project i18n sync tooling from `web/default` and fill missing translations.

## Testing And Verification

Minimum verification for each implementation phase:

- `bun run typecheck` from `web/default`.
- `bun run i18n:sync` from `web/default` after adding strings.
- `bun run build` from `web/default`.
- Browser verification of:
  - `/`
  - `/about`
  - `/key`
  - `/pricing`
  - `/dashboard/overview`
  - `/keys`
  - `/usage-logs/common`
  - `/usage-logs/statistics`
  - `/wallet`
  - `/profile`
  - representative admin pages.
- Responsive checks for desktop and mobile viewports.
- Confirm no protected identifiers were removed or renamed.

## Rollout Plan

1. Establish visual shell tokens and layout refinements.
2. Redesign public home/about/token lookup/model plaza.
3. Refine authenticated dashboard overview and shared console layout.
4. Refine user workflow pages.
5. Refine admin workflow pages.
6. Complete i18n, build, and browser verification.

## Implementation Assumptions

- Brand name, logo, docs URL, and custom page content should come from existing system configuration where possible. When configuration is unavailable, use generic new-api platform wording while preserving required project attribution.
- External docs URL continues to use configured status data.
- Token lookup uses the currently available backend endpoint behavior. If the backend does not support the full reference result shape, the frontend still provides the complete input, visibility toggle, query, loading, error, and graceful unsupported states without expanding backend scope in this pass.
- The upstream key is supplied out-of-band by the upstream provider and configured only in server-side/admin-controlled storage. The frontend must never hard-code it.
- The first implementation pass should prioritize frontend and configuration UX. Backend changes are limited to what is necessary to make the single-upstream configuration usable and safe.
