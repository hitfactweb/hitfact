# HITFACT — TECHNICAL ARCHITECTURE

## Recommended architecture

Browser → Next.js web application → API/server layer → PostgreSQL →
Object storage → Cache/rate-limit layer → Email/notification provider →
Analytics

## Application layers

1.  Presentation
2.  Authentication/authorization
3.  API/service layer
4.  Domain/business logic
5.  Persistence/repositories
6.  Background jobs
7.  Observability

## Principles

- Server-side authorization
- Typed APIs
- Database migrations
- Transactional writes for votes/likes where needed
- Cursor pagination for feeds
- CDN for media
- Background jobs for notifications and heavy processing
- Provider abstraction for storage/email/auth

## Suggested module boundaries

/auth /users /content /articles /fact-check /interactions /comments
/polls /quizzes /forms /search /notifications /moderation /analytics
/admin /media /settings

## Deployment

Use managed services initially. Keep database and media backups
independent of the application host.

## Scaling path

Stage 1: PostgreSQL + object storage + CDN Stage 2: Redis/cache +
background jobs Stage 3: dedicated search Stage 4: read
replicas/advanced analytics if traffic requires it
