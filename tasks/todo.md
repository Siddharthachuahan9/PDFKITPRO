# PDFKit Pro - Implementation Plan

## Current Sprint: Dashboard Enhancement + Auth + Billing

---

## Phase 9: UI Polish & Modal System
- [ ] Fix Upgrade Modal alignment (flex centering, equal cards)
- [ ] Create reusable modal components
- [ ] Add useEscapeKey hook
- [ ] Integrate modal with locked tool clicks

## Phase 10: Context Rail (Dashboard Enhancement)
- [ ] Create ContextRail.tsx (collapsible, 260px/64px)
- [ ] Create UserCard.tsx (avatar, email, plan badge)
- [ ] Create PrivacyPanel.tsx (local/cloud/tracking status)
- [ ] Create QuickActions.tsx (recent files, shortcuts)
- [ ] Create UsageMeter.tsx (limits, credits)
- [ ] Create TipBox.tsx (rotating tips)
- [ ] Update dashboard layout with rail
- [ ] Add mobile bottom sheet for context

## Phase 11: Authentication (Auth.js + Supabase)
- [ ] Create Supabase users table schema
- [ ] Set up Auth.js with GitHub OAuth
- [ ] Create login page with modern UI
- [ ] Add session with user.id and user.plan
- [ ] Create middleware for protected routes
- [ ] Create lib/access.ts feature gate helper

## Phase 12: Dodo Payments Integration
- [ ] Create /api/billing/checkout route
- [ ] Create /api/billing/webhook route
- [ ] Create lib/billing.ts (isolated Dodo logic)
- [ ] Add UpgradeButton component
- [ ] Connect upgrade modal to checkout flow

## Phase 13: Privacy Policy
- [ ] Create content/privacy.md
- [ ] Create /privacy page with nice layout
- [ ] Add privacy link to footer

## Phase 14: Fix PDF Merge Preview
- [ ] Diagnose preview issue
- [ ] Create lib/pdf/preview.ts with PDF.js helpers
- [ ] Add Web Worker for thumbnail generation
- [ ] Update PdfPreview component
- [ ] Add loading states

## Phase 15: PDF Edit Feature (Free)
- [ ] Add tool to registry (status: ready)
- [ ] Create edit-pdf page
- [ ] Add text annotation overlay
- [ ] Add signature (draw/upload)
- [ ] Save with pdf-lib

## Phase 16: Testing & QA
- [ ] Set up Vitest
- [ ] Create tests/unit/access.test.ts
- [ ] Create tests/unit/merge.test.ts
- [ ] Create tests/unit/preview.test.ts
- [ ] Create tests/manual/qa-checklist.md
- [ ] Add npm test scripts

## Phase 17: Documentation
- [ ] Create docs/features.md (live vs planned)
- [ ] Create docs/vercel-env.md
- [ ] Update .env.example
- [ ] Create verification report

---

## Previously Completed
- [x] Next.js 15 setup with TypeScript + Tailwind
- [x] Core UI components (AppShell, Sidebar, ToolCard, etc.)
- [x] Library modules (pdf, encryption, storage, etc.)
- [x] Dashboard with Command Center layout
- [x] Merge PDF tool (working)
- [x] 21 tools defined with status system
- [x] PrivacyBadge, FeaturedTools, ToolSection
- [x] CreditLine component

---

**Current Status:** Phase 9 - UI Polish
**Last Updated:** 2026-02-02
