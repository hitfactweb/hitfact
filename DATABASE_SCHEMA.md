# HITFACT — DATABASE SCHEMA

## Identity

### users

id, email, auth_provider_id, status, created_at, updated_at

### profiles

user_id, username, display_name, bio, avatar_media_id, visibility,
created_at, updated_at

### roles

id, name

### permissions

id, key

### user_roles

user_id, role_id

## Content

### posts

id, author_id, type, title, body, status, category_id, published_at,
updated_at, comments_enabled, featured

### articles

id, post_id, summary, body

### fact_checks

id, post_id, claim, claimant, claim_date, claim_source, context,
evidence, analysis, verdict, reviewed_by, reviewed_at

### categories

id, name, slug, description

### tags

id, name, slug

### post_tags

post_id, tag_id

### media

id, uploader_id, storage_key, mime_type, size, width, height, alt_text,
caption, created_at

### sources

id, title, url, publisher, published_at, accessed_at

### post_sources

post_id, source_id

## Social

### likes

user_id, post_id, created_at Unique(user_id, post_id)

### saves

user_id, post_id, created_at Unique(user_id, post_id)

### comments

id, post_id, user_id, parent_id, body, status, created_at, updated_at

### comment_likes

user_id, comment_id Unique(user_id, comment_id)

### follows

follower_id, target_type, target_id, created_at Unique(follower_id,
target_type, target_id)

## Polls

### polls

id, post_id/question, starts_at, ends_at, allow_multiple, require_login,
anonymous, result_visibility

### poll_options

id, poll_id, label, sort_order

### poll_votes

id, poll_id, option_id, user_id/session_hash, created_at

Enforce duplicate-vote rules according to poll configuration.

## Quizzes

### quizzes

id, title, description, time_limit, pass_mark, attempts_limit, published

### quiz_questions

id, quiz_id, question, explanation, sort_order

### quiz_options

id, question_id, label, is_correct

### quiz_attempts

id, quiz_id, user_id, score, started_at, completed_at

### quiz_answers

attempt_id, question_id, option_id

## Forms

### forms

id, title, description, status, starts_at, ends_at, response_limit

### form_fields

id, form_id, field_type, label, required, config_json, sort_order

### form_submissions

id, form_id, user_id, submitted_at, status

### form_answers

submission_id, field_id, value_json

## Community/moderation

### reports

id, reporter_id, target_type, target_id, reason, details, status,
reviewed_by, reviewed_at

### bans

id, user_id, reason, starts_at, ends_at, created_by

### audit_logs

id, actor_user_id, action, target_type, target_id, metadata_json,
created_at

## Notifications

### notifications

id, user_id, type, title, body, data_json, read_at, created_at

## Analytics

### analytics_events

id, anonymous/session/user identifier, event_name, target_type,
target_id, metadata_json, created_at

## Indexing

Index: - published_at - status - category_id - author_id - slug -
usernames - comments by post - likes by post - poll votes by poll -
submissions by form - report status - notification user/read state
