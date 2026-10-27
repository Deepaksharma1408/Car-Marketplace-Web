# Website requirements audit

> Historical audit: the six frontend prototype journeys were subsequently implemented. See [current prototype completion](prototype-completion-2026-10-27.md) for updated status.

Reviewed 27 October 2026 against RFP_Confidential_Marketplace_26.10.2026.docx, Listing options.png and High-Level Technical Overview.png.

## Conclusion and limits

The repository contains a substantial interactive Next.js web prototype, not the production Stage 1 marketplace specified by the RFP. Landing, listing detail, listing wizard, seller dashboard and admin screens are present. Most persistence and business operations use browser localStorage and mock records. The iOS/Android application, production backend and real media pipeline are absent from this repository.

This is a source-code audit, not a browser acceptance test, deployment audit, security penetration test or mobile-device playback test. No external cloud accounts or separate mobile repositories were supplied or verified. A feature marked present below means its implementation was found in this repository; it does not certify production readiness. No website code was changed during this audit.

The RFP is treated as requirements evidence. Its vendor proposal instructions are not instructions to change this website or submit a commercial proposal.

Status meanings: Present = implemented browser behavior; Partial = some required behavior exists; Demo = screen or operation relies on mock data/simulation; Missing = no implementation found; Roadmap = intentionally later-stage scope.

## Stage 1 requirement matrix

| ID | Requirement | Status | Findings and evidence |
|---|---|---|---|
| S01 | Cross-platform iOS and Android apps | Missing | Repository contains Next.js web code only. No native/cross-platform mobile project or app-store release configuration found. Responsive web screens do not satisfy this deliverable. |
| S02 | Dubai, cars for sale, no launch monetization | Partial | Listing types and creation enforce city Dubai/category car; monetization flags are disabled. Current branding and lookup data focus on luxury/supercars, narrower than the RFP's general cars-for-sale boundary. See src/types/index.ts, src/mocks/lookups.ts, src/config/flags.ts. |
| S03 | Guest browse | Present | Public landing and listing pages exist without an account requirement. The demo nevertheless defaults to an authenticated individual account in src/features/auth/store.ts. |
| S04 | Account creation, sign-in, session management and recovery | Demo | Login/signup/recovery screens exist. Auth is a persisted Zustand browser store; login selects demo users, OTP is generated locally and accepts universal code 123456. Password recovery displays a code rather than providing a secure reset service. See src/features/auth/store.ts and src/app/forgot-password/page.tsx. |
| S05 | Verified seller contact details | Demo | No real email/SMS verification service found. Local OTP simulation is not verified ownership of a phone/email. |
| S06 | Server-enforced roles and permissions | Missing | Role switching is exposed for demos, admin screen has no authorization gate, and mock operations do not enforce server-side permissions. No backend route handlers were found. |
| S07 | Vertical discovery feed with listing and seller video cards | Missing | Listing video player exists, but the homepage displays horizontally moving image cards. There is no complete vertical feed/watch-mode journey combining sale and social videos. See src/app/page.tsx and src/components/video/VerticalVideoPlayer.tsx. |
| S08 | Basic feed ordering with no personalization | Partial | Newest/price/mileage/views sorts exist for web inventory. A launch vertical-feed ordering service is absent. Personalization remains a disabled roadmap flag. |
| S09 | Structured vehicle search filters | Partial | Make, text query including model, price buckets, Dubai area, media type and body style exist. Separate model/year/mileage/fuel/transmission/condition filters and arbitrary price ranges are not implemented on the public search. See src/app/page.tsx. |
| S10 | Listing media, specifications, seller identity, status | Present | Public car page includes video/photos, gallery/lightbox, vehicle fields, seller information and sold/pending state UI. See src/app/car/[slug]/page.tsx. Dedicated public seller/dealer profiles remain incomplete. |
| S11 | Contact preference WhatsApp/call/both | Present | Detail-page ContactActionButtons conditionally renders selected methods and opens wa.me/tel links. External opening/dial success still needs browser/device verification. |
| S12 | Separate WhatsApp and call lead tracking | Demo | Contact actions call logLead with separate event types, but records and counters persist locally in one browser, not a shared analytics backend. See src/components/listings/ContactActionButtons.tsx and src/lib/mockApi/index.ts. |
| S13 | Private likes and favourites | Missing | Counts and savedListings fields exist; no complete buyer like/save/unsave/list-saved interaction and persistence flow found. Data fields are not feature completion. |
| S14 | Sharing and deep links | Partial | Listing URL copy works in code. App deep-link button only displays an alert; no native universal/app-link configuration found. |
| S15 | Comments, replies, reporting and hide/moderation | Missing | Comments flag, counts and seeded report records exist. No actual comment/reply creation flow, buyer report submission or complete comment hide/moderation implementation found. |
| S16 | Profiles with mixed social and sale grid, private saved/liked items | Partial | Own seller dashboard has inventory/social sections and settings; public mixed-profile routes and functional private like/save collections are absent. |
| S17 | Individual non-sale car video posting | Demo | Individual dashboard can create a social record, but it always uses a fixed demo video URL rather than uploading user media. See handleCreateVideo in src/app/dashboard/page.tsx. |
| S18 | Dealers cannot post standalone social videos | Partial | Dashboard distinguishes dealer/individual UI. Mock createSocialVideo accepts a supplied userId without authoritative role verification. |
| S19 | Three listing paths A/B/C | Demo | All three paths and their descriptions are visible in the listing wizard, but media input/processing uses preset assets and simulations. |
| S20 | Path A actual upload and validate/format without re-editing | Demo | Validation helper exists, but wizard handleValidateVideoSample simply succeeds after a timer. Preset URL is submitted. No durable upload/transcoding/formatting service found. |
| S21 | Path A MP4/MOV, 60 sec, 9:16, minimum 720p, 500 MB | Partial | Standalone validateVideoFile checks metadata/size, but is not wired into a real wizard file flow. It also accepts WebM, treats low resolution as a warning and accepts a wider aspect-ratio range than strict 9:16. See src/lib/qualityChecks.ts. |
| S22 | Path B 1–5 real clips, <=30 sec each, <=500 MB total | Missing | Template editor initializes fictitious clip names and image URLs; no actual raw-clip upload and enforcement found. |
| S23 | Premium/Sport/Cosy, three templates per style | Present | Nine template configuration definitions and corresponding style/template selection UI exist. This is configuration/UI coverage, not proof of rendering. See src/config/templates.ts. |
| S24 | Actual template trim/crop/slots/transitions/overlays/render | Demo | Timers advance progress then return the same Mixkit video. No rendering engine or worker generates a seller-specific result. See handleStartRender in src/components/wizard/SmartTemplateEditor.tsx. |
| S25 | 10–20 sec, 1080x1920, 30 fps, H.264/MP4 output | Missing | Templates define durations in range, but no encoder enforces resolution, fps or codec. Demo completion logs claim 60 fps, conflicting with the RFP target of 30 fps. |
| S26 | Lightweight media classification, duplicates/weak shots, slot suggestions | Demo | Simulated slot ordering and one hardcoded flagged clip; no image/video inference, real duplicate detection or evaluated fallback pipeline found. |
| S27 | Stabilization/denoise/exposure only as needed, preserve car appearance | Missing | No processing implementation or appearance-preservation QA found. No generated car media pipeline was found either. |
| S28 | Free preview, failure/retry, three configurable renders per listing | Partial | Timeline preview and counter UI exist; render count starts at 2 and is component state. It resets on remount and does not consume the admin maxRendersPerListing flag. Simulated render always completes; admin retry marks a job complete without rendering. |
| S29 | Licensed music provider and up to nine licensed tracks | Demo | Nine demo track entries and licence descriptions exist. Referenced local music assets were not found under public; no provider integration or licence evidence was supplied. Licence strings do not establish actual rights. |
| S30 | Path C remains static; no photo-to-video conversion | Present | photos_only creates no video URL and listing detail opens the photo gallery. Horizontal UI movement is distinct from converting photos into video. |
| S31 | 10–20 actual photos across all paths, ordering and cover | Partial | Demo photos can be reordered, removed and selected as cover. Photo count UI exists, but no real file upload found; submission only checks lower bound. Validation helper is not connected to an actual quality-gate upload flow. See PhotoQualityGate.tsx and new-listing/page.tsx. |
| S32 | At most one static card per seven video cards | Missing | No vertical-feed mixing rule found. Current inventory grid/carousel mixes listing types without this ratio. |
| S33 | Create, preview and submit for review | Demo | Wizard previews and stores a pending_review listing in localStorage. Submission succeeds with fallback demo video even if Path B was never rendered. |
| S34 | Save draft, resume and upload progress | Missing | Autosave only changes a displayed time every 15 seconds; it does not save wizard fields/media or restore a draft. Simulated render progress is not upload progress. |
| S35 | Edit, archive, delete, mark sold and relist | Demo | Seller dashboard and mock API include these operations and local audit records. No shared server persistence or server ownership enforcement exists. |
| S36 | Review every new listing, reasons and audit trail | Partial | Admin approve/reject flow, pending statuses and local history exist. Public getListingBySlug does not restrict records to publicly visible statuses, so pending/draft records can be loaded by slug/id. Publication rules need server enforcement. |
| S37 | Manual dealer verification, documents and licence expiry | Demo | Request/review/suspend UI and data fields exist. Document path is fabricated from a filename; no secure document upload/store/retrieval found. Admin Create Dealer only updates component usersList, so it is not durable. |
| S38 | Basic shared seller/dealer dashboard and inventory management | Demo | Inventory, status tabs, editing and settings exist for role-dependent views. Dealer access/profile administration is not secured or backed by a shared service. |
| S39 | Minimal landing and indexable/shareable public listing web pages | Partial | Landing and listing URLs exist. Listing content loads client-side from mock/browser data; metadata is generic at layout level. Client JSON-LD exists, but listing-specific server metadata and cross-device persistence are missing. |
| S40 | Admin users, review, moderation, config and operations | Demo | Eight admin sections exist with local actions. Several operations are simulated or incomplete, and access is not protected. Admin report action changes listing status for listing targets; no complete comment/social/user moderation action chain was found. |
| S41 | Analytics: starts/completions/published/views/watch/completion/retention | Demo | Seed analytics, counters and charts exist. Player tracks progress locally but does not emit watch analytics to shared storage. New listings receive hardcoded watch averages/completion rates. No complete event ingestion/retention tracking found. |
| S42 | Separate private seller metrics from public counters | Partial | Data types and screens separate them visually. Full records reside in client localStorage; there is no API projection/authorization preventing access to private fields. |
| S43 | English launch, Arabic legal only, RTL-ready structure | Partial | English UI and Arabic privacy/terms routes exist. Broad hardcoded strings indicate localization groundwork is incomplete. Arabic legal adequacy was not reviewed. Full Arabic/RTL is not a Stage 1 acceptance requirement. |
| S44 | No user-facing AI in Stage 1 | Mismatch | Wizard explicitly displays AI Media Assistant and marketing promises AI assistance. RFP allows internal lightweight assistance but says no user-facing AI. Confirm intended copy and keep assistance internal. |

## Technical and operational requirements

| Requirement | Assessment |
|---|---|
| Modular backend and shared transactional database | Missing from this repository. src/lib/mockApi/index.ts is a browser simulation, not a deployed API. |
| Object storage, upload sessions, CDN delivery, media deletion | No production integration found. Remote demo URLs are playback assets, not an owned upload/storage pipeline. |
| Processing jobs, retries and failure monitoring | Demo logs/statuses only; retry changes local state to completed. No durable queue, worker or failure alerting found. |
| Search index | Client filtering/mock query only; no external/shared index found. Choice of dedicated index vs database search can be decided in Discovery. |
| Secure authentication, secrets, RBAC and private records | No production implementation found. Browser role switching/local OTP cannot protect users, dealer documents or admin operations. |
| Audit logs | Local editable history records exist. No authoritative server audit log or access controls found. |
| Notifications | Admin pending-count UI exists; no push/email/SMS delivery backend found. Diagram marks email/SMS optional; account recovery still needs a real delivery/auth mechanism. |
| Encryption, retention/deletion, residency and backups | Cannot certify from this repository. No infrastructure configuration or evidence of these production controls was supplied. deleteAccount clears auth state; it does not implement complete data/media erasure. |
| Monitoring, crash reporting, alerting and rollback | No implementation/configuration found for production services. |
| Capacity and performance | No load tests or capacity/cost model found for 500 listings/5,000 MAU. RFP baseline implies 150,000 watched minutes/month; 2x and 5x mean 300,000 and 750,000 minutes. These are planning targets, not measured capability. |
| QA and release | No authored automated test suite, mobile app submission setup, CI pipeline or operational handover evidence found in supplied project files. No acceptance/device/network tests were run in this audit. |
| Ownership and portability | Account ownership, IP assignment, supplier terms, design handover and third-party licences cannot be established from frontend source. Treat as delivery/procurement evidence still required. |

## Scope differences and ambiguities to resolve

1. The RFP requires minimal public web in Stage 1 and reserves the full searchable web marketplace for Stage 2. This prototype already has web inventory search, body filters and grid browsing. Keep it only as an explicit scope decision; it does not replace the required mobile application.
2. The RFP covers Dubai cars for sale generally. Current premium/supercar positioning may be intentional, but supporting only that inventory should be agreed as a scope restriction.
3. The RFP describes internal lightweight AI media assistance but prohibits user-facing AI. Current UI advertises it. Clarify internal implementation and remove AI-facing claims if strict RFP alignment is wanted.
4. The diagrams and RFP agree that photos remain static and all paths have 10–20 gallery photos. A moving web carousel does not meet or replace the vertical video feed and its one-per-seven static-card rule.
5. RFP dealer administration wording mentions both dealer-managed inventory and internal-admin maintenance. Existing shared dashboard broadly demonstrates the former; agree final delegation/permissions during Discovery.
6. Demo copy includes claims such as instant Dubai RTA checks, 60 fps playback and licence-cleared music. No supporting integrations/rights evidence was found. Do not use those claims as acceptance evidence.

## Stage 2 and Stage 3

These are future stages, not missing launch features that should automatically be added now. ROADMAP_FLAGS labels some intentions but does not implement them.

| Stage | Requirement | Current evidence |
|---|---|---|
| 2 | UAE-wide location coverage | Disabled roadmap flag; actual creation remains Dubai only. |
| 2 | Full Arabic/RTL mobile and web | Not implemented; Arabic legal pages only. |
| 2 | Full searchable web and dealer pages | Searchable web inventory partly present early; public dealer pages and production indexing remain incomplete. |
| 2 | Optimized dealer portal, CSV import/export, feed tools | Basic dashboard and CSV export exist. No CSV import or dealer inventory feed integration found. |
| 2 | Subscriptions, promoted listings, entitlements and billing | Disabled flags; no billing/entitlement implementation found. |
| 2 | Following, creator qualification and milestones | No working follow system or qualification tracker for 10 videos plus 50,000 views or 500 followers. |
| 2 | Personalization and richer seller analytics | Disabled flag/demo metrics; no behavioral recommendation system. Native chat correctly remains outside this stage. |
| 3 | Bikes, yachts, plate numbers and rentals | Disabled flags; listing model is car/Dubai only. |
| 3 | Native messaging, inbox, notifications and safety | No implementation found. |
| 3 | API/DMS/light CRM connectors | No implementation found. |
| 3 | Sponsored feed advertising and billing | Disabled flag only. |
| 3 | Advanced ranking, comparison, enrichment, fraud scoring and predictive alerts | No implementation found. |

## Recommended completion order

1. Agree launch boundary: minimal web vs expanded web, general cars vs luxury-only, mobile requirements and the internal AI policy.
2. Build shared data storage, real authentication/contact verification, server-enforced roles, listing visibility rules and private-data responses.
3. Implement durable media uploads, real Path A validation, Path B rendering and processing workers, Path C photo uploads, enforce limits and wire configuration to those operations.
4. Complete recoverable drafts, listing lifecycle/moderation, document verification and actual media failure/retry behavior.
5. Build mobile vertical discovery/watch mode, feed mixing, likes/saves/share, comments/replies/reporting and public mixed profiles.
6. Add real analytics, secure operational tooling, monitoring/backups and indexable listing pages; verify music rights and provider agreements.
7. Run end-to-end, access-control, accessibility, device/video-network and capacity tests; deliver deployment, ownership and handover evidence.

## Main source references

- src/features/auth/store.ts: demo authentication, role switching and OTP.
- src/lib/mockApi/index.ts: localStorage data, listing lifecycle, reports, analytics and job simulations.
- src/app/dashboard/new-listing/page.tsx: A/B/C workflow, timestamp-only autosave and sample validation.
- src/components/wizard/SmartTemplateEditor.tsx: simulated media, render timers and fixed output URL.
- src/components/wizard/PhotoQualityGate.tsx: demo photo loading, cover and ordering.
- src/lib/qualityChecks.ts: standalone browser media validation helpers.
- src/app/page.tsx: web filtering and horizontal inventory slideshow.
- src/app/car/[slug]/page.tsx: gallery, seller details, copy URL, client JSON-LD and placeholder app link.
- src/components/video/VerticalVideoPlayer.tsx: player controls and local playback progress.
- src/components/listings/ContactActionButtons.tsx: selected contact methods and local lead logging.
- src/app/dashboard/page.tsx: inventory operations, social demo posting, CSV export and settings.
- src/app/admin/page.tsx: admin sections and transient Create Dealer operation.
- src/components/dealers/DealerVerificationModal.tsx: verification request and synthetic document path.
- src/config/templates.ts, src/config/music.ts, src/config/flags.ts: template/track definitions and roadmap flags.
