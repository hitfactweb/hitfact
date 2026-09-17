# HITFACT — API SPECIFICATION

Use versioned APIs, e.g. /api/v1.

## Auth

POST /auth/register POST /auth/login POST /auth/logout POST
/auth/forgot-password POST /auth/reset-password GET /auth/me

## Users

GET /users/:username PATCH /users/me GET /users/me/saved GET
/users/me/activity

## Feed/content

GET /posts GET /posts/:slug POST /posts PATCH /posts/:id DELETE
/posts/:id POST /posts/:id/like DELETE /posts/:id/like POST
/posts/:id/save DELETE /posts/:id/save POST /posts/:id/share

## Comments

GET /posts/:id/comments POST /posts/:id/comments PATCH /comments/:id
DELETE /comments/:id POST /comments/:id/like DELETE /comments/:id/like
POST /comments/:id/report

## Fact checks

GET /fact-checks GET /fact-checks/:slug POST /fact-checks PATCH
/fact-checks/:id POST /fact-checks/:id/review

## Polls

GET /polls GET /polls/:id POST /polls/:id/vote GET /polls/:id/results

## Quizzes

GET /quizzes GET /quizzes/:id POST /quizzes/:id/start POST
/quizzes/:id/submit GET /quizzes/:id/results

## Forms

GET /forms/:slug POST /forms/:id/submit GET /admin/forms/:id/responses
GET /admin/forms/:id/export

## Search

GET /search?q=&type=&category=&tag=&date=

## Reports

POST /reports GET /admin/reports PATCH /admin/reports/:id

## Admin

GET /admin/dashboard GET /admin/analytics GET /admin/users GET
/admin/comments GET /admin/media GET /admin/audit-logs

## API rules

- Validate request bodies
- Authenticate protected routes
- Authorize by role
- Rate limit public write endpoints
- Never expose correct quiz answers before submission
- Never expose private form responses to public clients
- Return consistent error shapes
- Paginate list endpoints
