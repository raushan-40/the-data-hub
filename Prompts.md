# Sprint 9 — Phase 2

## Objective
Implement an in-memory data store and complete CRUD (Create, Read, Update, Delete) business logic for the blog post resource with input validation and HTTP status code handling.

## In-Memory Storage Approach
An in-memory array (`let blogPosts = []`) and an incremental integer counter (`let nextId = 1`) manage the state of blog posts throughout the application runtime. No external database or persistent layer is utilized.

## Data Structure
Each blog post object consists of:
- `id` (Number): Auto-incremented unique identifier
- `title` (String): Post title (required)
- `body` (String): Post content (required)
- `createdAt` (String): ISO timestamp recording post creation time

## CRUD Implementation
- `GET /posts`: Returns the full `blogPosts` array (`200 OK`).
- `GET /posts/:id`: Finds post by parsed numeric ID. Returns the post (`200 OK`) or `404 Not Found` if missing.
- `POST /posts`: Validates presence of `title` and `body`, assigns `id` and `createdAt`, appends to array, and returns created post (`201 Created`).
- `PUT /posts/:id`: Validates target existence and payload fields, updates in-place, and returns updated post (`200 OK`).
- `DELETE /posts/:id`: Finds and removes post by index, returning confirmation message (`200 OK`).

## Validation Approach
Payload validation checks that `title` and `body` exist, are string types, and contain non-whitespace content. Missing or empty fields immediately return `400 Bad Request` with `{ "message": "Title and body are required." }`.

## Postman/Thunder Client Tests
Executed 16 comprehensive test cases:
1. `GET /posts` → `200 []`
2. `POST /posts` (valid body) → `201 Created` with ID 1
3. `GET /posts` → `200` (1 post in array)
4. `GET /posts/1` → `200` (returns post 1)
5. `PUT /posts/1` (valid body) → `200` (returns updated post 1)
6. `GET /posts/1` → `200` (returns updated content)
7. `POST /posts` (second post) → `201 Created` with ID 2
8. `GET /posts` → `200` (2 posts in array)
9. `DELETE /posts/1` → `200 Post deleted successfully`
10. `GET /posts` → `200` (only post 2 remaining)
11. `GET /posts/999999` → `404 Post not found`
12. `PUT /posts/999999` → `404 Post not found`
13. `DELETE /posts/999999` → `404 Post not found`
14. `POST /posts` (missing title) → `400 Bad Request`
15. `POST /posts` (missing body) → `400 Bad Request`
16. `PUT /posts/2` (invalid body) → `400 Bad Request`

Regression tests:
- `GET /` → `200 The Data Hub API is running`
- `GET /non-existent-route` → `404 Route not found`

## Debugging
No runtime errors or unhandled exceptions occurred during testing.

## Final Result
In-memory CRUD logic, validation, and error handling are fully operational and verified against all required test sequences.