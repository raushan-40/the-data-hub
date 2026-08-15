# Sprint 9 Development Log — The Data Hub

---

# Sprint 9 — Phase 1: Server Initialization & Route Scaffolding

## Objective
Initialize the Node.js project, install and configure Express, listen on port 5000, enable basic JSON parsing middleware, and scaffold the baseline REST API endpoints for the blog post resource without database persistence or premature abstractions.

## AI Assistance
AI was utilized as a senior pair-programming assistant to:
- Establish clean architectural boundaries between the main application entry point (`server.js`) and modular routing (`routes/posts.js`).
- Verify standard RESTful endpoint naming conventions and JSON-only response patterns.
- Ensure strict adherence to incremental development policies (avoiding premature database or auth implementations).

## Architecture
- `server.js`: The application entry point. Configures `express.json()` middleware, registers the health check route (`GET /`), mounts the resource router under `/posts`, and provides a 404 JSON fallback for unmatched routes.
- `routes/posts.js`: Modular router using `express.Router()` defining the five standard REST endpoints.

## Implementation
Five REST route scaffolds were implemented to return predictable JSON acknowledgements:
- `GET /posts`: Returns `200 OK` acknowledgment.
- `GET /posts/:id`: Returns `200 OK` acknowledgment with parsed URL parameter `id`.
- `POST /posts`: Returns `201 Created` acknowledgment.
- `PUT /posts/:id`: Returns `200 OK` acknowledgment with parsed URL parameter `id`.
- `DELETE /posts/:id`: Returns `200 OK` acknowledgment with parsed URL parameter `id`.
- `GET /`: Returns `200 OK` health check (`{"message": "The Data Hub API is running"}`).
- Wildcard 404 handler: Returns `404 Not Found` (`{"message": "Route not found"}`).

## Testing
- Verified server startup on port 5000 using `npm start`.
- Tested `GET http://localhost:5000/` returning `200 OK`.
- Tested `GET http://localhost:5000/posts` returning `200 OK`.
- Tested `GET http://localhost:5000/posts/1` returning `200 OK` with `id: "1"`.
- Tested `POST http://localhost:5000/posts` and `PUT http://localhost:5000/posts/1` with JSON test bodies.
- Tested `DELETE http://localhost:5000/posts/1` returning `200 OK`.
- Tested unknown paths returning `404 Not Found` in JSON format.

## Debugging
No runtime errors or package conflicts were encountered during initialization.

## Result
Phase 1 baseline was successfully established and verified.

---

# Sprint 9 — Phase 2: In-Memory Storage & Real CRUD Logic

## Objective
Implement an in-memory data store (`blogPosts` array) and replace the route scaffolds with complete CRUD (Create, Read, Update, Delete) business logic, payload validation, and appropriate HTTP status codes.

## In-Memory Storage Approach
An in-memory array (`let blogPosts = []`) and an incremental integer counter (`let nextId = 1`) manage the state of blog posts during the application runtime. No external database or persistent storage is used.

## Data Structure
Each blog post item contains:
- `id` (Number): Unique incrementing identifier.
- `title` (String): Title of the post (required).
- `body` (String): Content of the post (required).
- `createdAt` (String): ISO 8601 creation timestamp.

## CRUD Implementation
- `GET /posts`: Returns the full `blogPosts` array with `200 OK`.
- `GET /posts/:id`: Parses `id` as an integer. Returns the post (`200 OK`) if found, or `404 Not Found` if missing.
- `POST /posts`: Validates string presence for `title` and `body`. Appends new post object with unique ID and timestamp, returning `201 Created`.
- `PUT /posts/:id`: Finds target by numeric ID. Returns `404` if not found. Validates updated fields and updates in-place, returning `200 OK`.
- `DELETE /posts/:id`: Finds target by numeric ID. Returns `404` if not found. Removes the post via array splice and returns `200 OK`.

## Validation Approach
Payload validation ensures both `title` and `body` exist, are strings, and are not empty/whitespace-only. Requests failing validation immediately respond with `400 Bad Request` (`{"message": "Title and body are required."}`).

## Postman / Thunder Client Tests
Executed 16 required test cases:
1. `GET /posts` → `200 []`
2. `POST /posts` (valid payload) → `201 Created` with ID 1
3. `GET /posts` → `200` (1 post in array)
4. `GET /posts/1` → `200` (returns post 1)
5. `PUT /posts/1` (valid payload) → `200` (returns updated post 1)
6. `GET /posts/1` → `200` (returns updated content)
7. `POST /posts` (second post) → `201 Created` with ID 2
8. `GET /posts` → `200` (2 posts in array)
9. `DELETE /posts/1` → `200 Post deleted successfully`
10. `GET /posts` → `200` (only post 2 remains)
11. `GET /posts/999999` → `404 Post not found`
12. `PUT /posts/999999` → `404 Post not found`
13. `DELETE /posts/999999` → `404 Post not found`
14. `POST /posts` (missing title) → `400 Bad Request`
15. `POST /posts` (missing body) → `400 Bad Request`
16. `PUT /posts/2` (invalid/empty body) → `400 Bad Request`

Regression Tests:
- `GET /` → `200 OK`
- `GET /unregistered-route` → `404 Not Found`

## Debugging
No errors encountered; parsing numeric parameters with `parseInt(req.params.id, 10)` ensured type-safe array lookups.

## Result
In-memory CRUD logic, validation, and error responses verified across all test scenarios.

---

# Sprint 9 — Phase 3: Custom Middleware & Mock Authentication

## Objective
Implement global request-logging middleware to capture every incoming HTTP transaction and a demonstration mock authentication endpoint (`POST /login`).

## Architecture
- **Global Logging Middleware**: Registered via `app.use()` in `server.js` before all route declarations. Intercepts `req.method` and `req.originalUrl`, generates a timestamp with `new Date().toLocaleString()`, logs the formatted entry to the server console, and invokes `next()`.
- **Mock Login Route**: Declared as `POST /login` in `server.js`. Validates the presence of `username` and `password`, checks against demonstration credentials (`raushan` / `test123`), and returns a mock JWT string.

## Testing
- Verified console log output across multiple routes:
  ```text
  [GET] / - 15/08/2026, 18:30:00
  [GET] /posts - 15/08/2026, 18:30:04
  [POST] /posts - 15/08/2026, 18:30:08
  [POST] /login - 15/08/2026, 18:30:12
  [GET] /invalid-route - 15/08/2026, 18:30:16
