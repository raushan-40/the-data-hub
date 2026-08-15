# Sprint 9 — Phase 3

## Objective
Implement custom global request logging middleware and a demonstration mock authentication endpoint (`POST /login`) without introducing external authentication libraries or persistent user databases.

## Architecture
- **Global Logging Middleware**: Registered via `app.use()` immediately after `express.json()` and before all route handlers in `server.js`. This guarantees that every request—regardless of whether it targets `/`, `/posts`, `/login`, or an unmatched path—passes through the logger and continues to the next handler via `next()`.
- **Mock Login Route**: Declared as `POST /login` in `server.js`. Validates the request body for `username` and `password`, matching against demonstration credentials to return a mock JWT string or appropriate HTTP error status (400/401).

## Testing
Executed full verification using Postman/Thunder Client while inspecting the server console:
1. `GET /` → `200 OK` (Console logged: `[GET] / - <timestamp>`)
2. `GET /posts` → `200 OK` (Console logged: `[GET] /posts - <timestamp>`)
3. `GET /posts/1` → `404 Not Found` initially (Console logged: `[GET] /posts/1 - <timestamp>`)
4. `POST /posts` with payload → `201 Created` (Console logged: `[POST] /posts - <timestamp>`)
5. `POST /login` with `{"username": "raushan", "password": "test123"}` → `200 OK` + mock token (Console logged: `[POST] /login - <timestamp>`)
6. `POST /login` with missing `password` → `400 Bad Request`
7. `POST /login` with invalid credentials → `401 Unauthorized`
8. `GET /does-not-exist` → `404 Not Found` (Console logged: `[GET] /does-not-exist - <timestamp>`)
9. Stopped and restarted server via `npm start`; confirmed logging and CRUD routes continue to work seamlessly.

## Debugging
No syntax errors, unhandled promise rejections, or middleware hang issues occurred. Calling `next()` consistently ensured request flows were uninterrupted.

## Result
Custom request logging and mock login authentication completed successfully. All Phase 1, Phase 2, and Phase 3 capabilities are operational, compliant, and verified.