# HITFACT — COMPLETE WEBSITE + ADMIN PANEL GENERATION PROMPT

You are a senior product architect, UX/UI designer, full-stack engineer,
database engineer, security engineer and DevOps engineer.

Build a production-ready web application called **HITFACT**.

## 1. BRAND

Name: HITFACT Primary tagline: FACTS THAT HIT. Positioning: Politics •
Media • Reality

Brand personality: - Bold - Independent - Evidence-driven -
Professional - Modern - Clear - Non-partisan

Primary visual direction: - Red: \#ED1C24 - Black: \#0A0A0A - White:
\#FFFFFF - Optional neutral gray - Strong editorial typography - High
contrast - Minimal unnecessary gradients/glows - Responsive and
accessible

The design must look like a serious modern digital media organization,
not a generic blog and not a clone of Instagram.

## 2. CORE PRODUCT

Create a social-first digital media platform with: - Latest-first home
feed - Trending feed - Topic/category feeds - News/article publishing -
Image posts - Video posts - Carousel/multiple-image posts - Fact-check
posts - Explainers - Polls - Quizzes - Surveys - Custom forms - User
accounts - User profiles - Likes - Comments - Nested replies -
Saves/bookmarks - Shares - Follows - Notifications - Search - Reports -
Moderation - Admin CMS - Editorial workflow - Analytics - Source
management - Media library - SEO - Audit logs - Backup-ready
architecture

## 3. RECOMMENDED STACK

Use a modern production stack unless the environment requires an
equivalent: - Frontend: Next.js + TypeScript - UI: Tailwind CSS +
accessible component system - Backend: Next.js server/API layer or
separate Node.js service - Database: PostgreSQL - Authentication: secure
managed authentication such as Supabase Auth or equivalent - Storage:
S3-compatible object storage or Supabase Storage - Caching/rate
limiting: Redis-compatible service where useful - Search: PostgreSQL
full-text initially; dedicated search engine later if needed -
Deployment: Vercel/Cloudflare for frontend and suitable managed
backend/database - Email: transactional email provider - Analytics:
privacy-conscious analytics plus internal analytics

Keep architecture modular so providers can be replaced.

## 4. USER EXPERIENCE

### Guest

Guests can: - Browse posts - Read articles - Read fact checks - View
polls and quizzes - Search content - Share public content

Guests cannot: - Like - Comment - Save - Vote where login is required -
Access private profile/activity data

### Registered user

Users can: - Create profile - Like/unlike - Comment - Reply - Save -
Share - Follow topics and optionally authors - Vote in polls - Take
quizzes - Submit forms - Receive notifications - View own activity -
Report content - Manage account/privacy settings

## 5. HOME FEED

Desktop: - Header with HITFACT logo - Navigation - Search - User/account
controls - Main feed - Optional right sidebar for trending/polls/popular
fact checks

Mobile: - Compact top header - Feed-first layout - Bottom navigation -
Fast scrolling - Large touch targets

Default feed order: 1. Latest published content 2. Scheduled content
only after publication time 3. Never expose drafts 4. Optional ranking
for Trending 5. Keep Latest and Trending clearly separate

Each post card should support: - Author/source - Timestamp - Category -
Headline/caption - Image/video/carousel - Fact-check verdict when
applicable - Like - Comment - Save - Share - View count where
appropriate - Source indicator

## 6. CONTENT TYPES

### Standard Post

Fields: - title - caption/body - media - category - tags - author -
sources - status - publish_at - SEO fields

### Article

Fields: - headline - dek/summary - body - featured image - author -
category - tags - sources - related posts - SEO - publish date - update
date

### Fact Check

Required structure: - claim - claimant - claim date - claim source -
context - evidence - analysis - verdict - sources - related claims -
correction history

Verdicts: - TRUE - FALSE - MISLEADING - PARTLY_TRUE - UNVERIFIED

Never label a claim FALSE merely because evidence is missing. Use
UNVERIFIED where appropriate.

### Explainer

- question/title
- summary
- structured sections
- evidence/source links
- related content

### Poll

- question
- options
- single/multiple choice
- start/end
- login requirement
- anonymous option
- result visibility rule
- vote limit/rate limit
- status

### Quiz

- title
- description
- questions
- options
- correct answer
- explanation
- timer optional
- score
- pass mark optional
- attempt rules
- result visibility
- leaderboard optional

### Form/Survey

Provide a reusable form builder with: - short text - long text - email -
phone - number - date - dropdown - radio - checkbox - file upload -
image upload - rating - yes/no - multiple choice - consent field -
required/optional - validation - conditional logic where feasible

Admin can: - create - preview - publish - close - duplicate - export
responses - filter responses - view analytics

## 7. SOCIAL FEATURES

Likes: - authenticated only - one active like per user/post - fast
optimistic UI - server validation

Comments: - nested replies - edit own comment within configurable
period - delete own comment - admin moderation - pin comment - lock
comments - report comment - anti-spam/rate limiting

Saves: - private bookmarks - saved-post list

Shares: - native share API when available - copy link -
WhatsApp/Facebook/X/Telegram sharing - share count only if implemented
reliably

Follows: - follow topics - optional author follow - following feed -
notifications

## 8. SEARCH

Search: - posts - articles - fact checks - topics - tags - polls -
quizzes

Filters: - content type - category - date - verdict - author - tag

Provide useful empty states and typo-tolerant search where practical.

## 9. FACT-CHECK DATABASE

Create a dedicated searchable fact-check archive.

Each result: - claim - verdict - claimant - date - short finding -
sources - link to full fact check

Allow filtering by: - TRUE - FALSE - MISLEADING - PARTLY TRUE -
UNVERIFIED

## 10. ADMIN PANEL

Create a separate protected admin application area.

Sidebar: - Dashboard - Posts - Articles - Fact Checks - Drafts -
Scheduled - Polls - Quizzes - Forms - Surveys - Users - Comments -
Reports - Media Library - Sources - Categories - Tags - Notifications -
Analytics - Team - Roles - Audit Logs - Settings

### Dashboard cards

- users
- active users
- posts
- views
- likes
- comments
- shares
- poll votes
- quiz attempts
- form submissions
- reports
- pending moderation

Charts: - daily visitors - registrations - engagement - content
performance - poll participation - quiz completion - form submissions

## 11. POST CREATOR

Admin must be able to: - create - edit - duplicate - preview - save
draft - submit for review - approve - publish - schedule - unpublish -
archive

Fields: - title - body/caption - media - category - tags - sources -
author/byline - featured - comments enabled - SEO title - SEO
description - OG image - canonical URL

Support autosave and warn before losing unsaved work.

## 12. EDITORIAL WORKFLOW

Support: DRAFT → RESEARCH → REVIEW → FACT CHECK → APPROVED → SCHEDULED →
PUBLISHED → UPDATED/ARCHIVED

Role permissions must control transitions.

## 13. ADMIN ROLES

SUPER_ADMIN: full access

EDITOR: content creation/editing/publishing

FACT_CHECKER: fact-check research, evidence and verdict workflow

RESEARCHER: research and drafts

MODERATOR: comments, reports, bans

ANALYST: analytics

Do not rely only on frontend hiding. Enforce authorization on the
server.

## 14. MEDIA LIBRARY

Support: - image upload - video upload - documents - alt text -
captions - file metadata - search - folders/tags - reusable media -
replacement/archiving

Optimize images for web using responsive variants and modern formats
where supported.

Validate file type, size and upload permissions.

## 15. COMMENTS AND MODERATION

Admin: - view - search - filter - pin - hide - delete - lock - restore
where appropriate - ban user - review reports

User reporting reasons: - false information - spam - harassment - hate -
copyright - other

Maintain moderation history and audit logs.

## 16. NOTIFICATIONS

Support: - new post from followed topic/author - comment reply - comment
like - poll closing - quiz result - form/admin notifications -
moderation status where appropriate

Provide user notification settings.

## 17. ANALYTICS

Internal analytics: - page views - unique visitors - sessions -
registrations - active users - post views - likes - comments - shares -
saves - poll votes - quiz attempts - form submissions - traffic source -
device - top content - engagement rate

Avoid collecting unnecessary personal data.

## 18. SECURITY

Implement: - HTTPS - secure cookies/session handling - password hashing
through trusted auth provider - CSRF protection where applicable - XSS
prevention - SQL injection protection - input validation - output
escaping - upload validation - authorization checks - rate limiting -
brute-force protection - CAPTCHA/anti-bot where appropriate - admin
2FA - audit logs - secure headers - secret management -
dependency/security updates

Never expose private user data through APIs.

## 19. PRIVACY

Provide: - Privacy Policy page - Terms page - Cookie policy where
required - account deletion flow - data export where required - consent
controls - clear public/private profile rules

Do not collect sensitive information unless necessary.

## 20. SEO

Implement: - metadata - canonical URLs - Open Graph - Twitter/X cards -
sitemap - robots - structured data - Article/NewsArticle schema where
appropriate - Breadcrumb schema - fast loading - semantic HTML - clean
URLs

Example routes: / /fact-check/ /politics/ /media/ /explainers/ /polls/
/quizzes/ /forms/ /post/\[slug\] /fact-check/\[slug\] /article/\[slug\]
/profile/\[username\] /search

## 21. ACCESSIBILITY

Follow WCAG principles: - keyboard navigation - visible focus - proper
labels - semantic HTML - sufficient contrast - alt text - reduced motion
support - screen-reader-friendly controls

## 22. PERFORMANCE

Target: - mobile-first - optimized images - lazy loading -
pagination/infinite scroll with robust cursor pagination - caching -
CDN - database indexes - avoid N+1 queries - skeleton loading - graceful
errors - Core Web Vitals optimization

Do not load all posts at once.

## 23. DATABASE

Use normalized relational design with strong foreign keys and indexes.

Core entities: users profiles roles permissions posts articles
fact_checks claims verdicts categories tags post_tags media sources
likes comments comment_likes saves follows notifications polls
poll_options poll_votes quizzes quiz_questions quiz_options
quiz_attempts quiz_answers forms form_fields form_submissions
form_answers reports bans audit_logs analytics_events settings

Use UUIDs or secure identifiers, timestamps, soft deletion where
appropriate, and unique constraints to prevent duplicate votes/likes.

## 24. POLL SECURITY

Do not allow users to vote repeatedly by simply manipulating the
frontend.

Enforce server-side: - authenticated identity if required - unique
constraints - rate limits - poll open/closed status - option validity

## 25. QUIZ SECURITY

Correct answers must not be exposed in public API payloads before
submission. Calculate/validate results server-side where necessary.

## 26. FORM SECURITY

- Validate every field server-side
- File upload scanning/validation
- Spam protection
- configurable response retention
- admin-only response access
- export permissions
- protect against form abuse

## 27. ERROR HANDLING

Create: - 404 - 403 - 401 - 429 - 500 - offline/network error states

Never show stack traces or secrets to users.

## 28. TESTING

Include: - unit tests - API tests - auth/permission tests - database
tests - integration tests - critical end-to-end tests - responsive
checks

Critical tests: 1. Register/login 2. Publish post 3. Feed ordering 4.
Like/unlike 5. Comment/reply 6. Save 7. Follow 8. Poll vote uniqueness
9. Quiz result 10. Form submission 11. Admin role permissions 12.
Moderation 13. Search 14. Fact-check creation 15. Scheduled publishing

## 29. SEED DATA

Provide demo seed data: - admin - editor - fact checker - moderator -
sample users - sample posts - sample fact checks - sample poll - sample
quiz - sample form

Never hardcode production credentials. Use environment variables and
documented setup steps.

## 30. PROJECT DOCUMENTATION

Generate and maintain: - README.md - PRD.md - ARCHITECTURE.md -
DATABASE_SCHEMA.md - ADMIN_PANEL.md - UI_SPEC.md - API_SPEC.md -
SECURITY.md - ROADMAP.md - .env.example - setup instructions -
deployment instructions - testing instructions

## 31. DEVELOPMENT RULES

Before writing code: 1. Read all project documentation. 2. Inspect
existing files. 3. Do not overwrite working code unnecessarily. 4.
Create reusable components. 5. Keep business logic separate from
presentation. 6. Use TypeScript types throughout. 7. Validate data at
API boundaries. 8. Enforce permissions server-side. 9. Add migrations
for database changes. 10. Keep secrets out of source control. 11. Add
tests for critical behavior. 12. Update documentation when architecture
changes.

## 32. UI REQUIREMENT

The website must feel like: - modern media - social feed - editorial
credibility - mobile-first - fast - clean - visually consistent

Do NOT make it: - a generic WordPress blog - an exact Instagram clone -
an overcrowded dashboard - overly animated - dependent on huge hero
banners

## 33. FINAL BUILD EXPECTATION

Deliver a working application, not only static mockups.

The implementation should include: - public website - authenticated user
area - admin panel - database - API/backend - authentication - content
management - social interaction - fact checking - polls - quizzes -
forms - moderation - analytics foundation - responsive UI - security -
documentation - tests - deployment instructions

If the chosen AI coding environment cannot implement a feature in one
pass, create the architecture and interfaces first, then implement the
feature incrementally without breaking the rest of the system.

At the end of each implementation stage, report: - what was built -
files changed - database changes - environment variables required - how
to run - how to test - known limitations - next recommended step
