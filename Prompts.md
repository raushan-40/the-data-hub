# Sprint 10 — Phase 2
## Live MongoDB CRUD Logic

### Objective
Migrate all resource endpoints in `routes/posts.js` from the Sprint 9 in-memory storage array to live MongoDB Atlas persistence using Mongoose ODM methods, implementing async/await and robust ObjectId validation.

### Why the In-Memory Array Was Removed
The in-memory `blogPosts = []` array was volatile and reset on every server restart. Replacing it with MongoDB Atlas as the single source of truth provides persistent, scalable storage.

### Mongoose CRUD Implementation
- **Create (`POST /posts`)**: Uses `Post.create({ title, content })` to persist a document in MongoDB, returning `201 Created`.
- **Read All (`GET /posts`)**: Uses `Post.find()` to fetch all post documents from MongoDB, returning `200 OK` with an array.
- **Read Single (`GET /posts/:id`)**: Uses `Post.findById(id)` to retrieve a specific post document, returning `200 OK` or `404 Not Found`.
- **Update (`PUT /posts/:id`)**: Uses `Post.findByIdAndUpdate(id, { title, content }, { new: true, runValidators: true })` to update and return the modified document, returning `200 OK` or `404 Not Found`.
- **Delete (`DELETE /posts/:id`)**: Uses `Post.findByIdAndDelete(id)` to delete the document, returning `200 OK` or `404 Not Found`.

### Validation & Error Handling
- **Input Validation**: `title` and `content` are checked for non-empty string types before database execution, returning `400 Bad Request` if invalid.
- **ObjectId Validation**: `mongoose.Types.ObjectId.isValid(id)` guards all parameterized routes (`GET`, `PUT`, `DELETE`), returning `400 Bad Request` for malformed IDs (e.g. `123`) without crashing the process.
- **Error Forwarding**: Asynchronous database errors are safely caught and forwarded to Express error handling without leaking connection secrets or credentials.

### Postman Testing Results
Executed all 13 required test cases:
1. `POST /posts` with valid body → `201 Created` with MongoDB `_id`
2. `GET /posts` → `200 OK` (returns array containing created document)
3. `GET /posts/:id` (valid `_id`) → `200 OK` (returns specific document)
4. `PUT /posts/:id` (valid update) → `200 OK` (returns updated document)
5. `GET /posts/:id` → `200 OK` (reflects updated content)
6. `POST /posts` (second post) → `201 Created`
7. `DELETE /posts/:id` → `200 OK` (`{"message": "Post deleted successfully"}`)
8. `GET /posts/:id` (deleted `_id`) → `404 Not Found`
9. **Persistence Restart Test**: Stopped server (`Ctrl+C`), restarted with `npm start`, and ran `GET /posts` → Remaining post persisted in MongoDB Atlas.
10. `GET /posts/123` (invalid ID format) → `400 Bad Request` (`{"message": "Invalid post ID format"}`)
11. `GET /posts/000000000000000000000000` (non-existent valid ObjectId) → `404 Not Found`
12. `POST /posts` with `{}` → `400 Bad Request`
13. `PUT /posts/:id` with missing body fields → `400 Bad Request`

Regression Tests:
- `GET /` → `200 OK`
- `POST /login` → `200 OK` with mock JWT token
- Request logging middleware accurately recorded all transactions in the console.

### Actual Debugging Encountered
Ensured that non-ObjectId parameters (like integer `1` or string `abc`) are intercepted by `mongoose.Types.ObjectId.isValid()` prior to Mongoose query execution to prevent unhandled CastErrors.

### Final Result
Live MongoDB CRUD migration is complete, persistent across restarts, and verified against all test cases.