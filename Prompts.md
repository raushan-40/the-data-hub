---

### Updated `Prompts.md` (Final Submission Section)

Append this final audit section to `Prompts.md`:

```markdown
# Sprint 10 — Final Production-Readiness & Deployment Audit

## Objective
Perform a final audit covering database persistence, relational modeling, security guarantees, and deployment readiness on cloud platforms (Render/Railway).

## Audit Findings & Verification
1. **MongoDB Atlas Persistence**: Verified that all post and user data are written directly to MongoDB Atlas. Stopped and restarted the server to confirm data persists.
2. **Relational Modeling & Aggregation**: Confirmed `Post.author` successfully links to `User._id`. Verified `GET /posts/recent` executes database-level `.sort({ createdAt: -1 }).limit(3)` and hydrates author fields.
3. **Security Check**: Verified `.env` is ignored by Git. No credentials or connection URIs exist in repository source code. Error handlers avoid exposing stack traces or raw database credentials.
4. **Cloud Deployment Compatibility**: Verified dynamic port binding via `process.env.PORT || 5000` and start script `node server.js`.

## Result
The Data Hub API meets all Sprint 10 Track B requirements and is fully production-ready for submission and live demonstration.


# Sprint 11 — Phase 3A: Backend Image Upload Foundation

## Objective
Establish a remote image upload foundation using Multer for multipart form handling (memory storage) and the Cloudinary Node SDK for cloud asset persistence.

## Architecture & Implementation
- **Dependencies**: Added `multer` and `cloudinary`.
- **Environment Configuration**: Extended `.env.example` with `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, and `CLOUDINARY_API_SECRET`.
- **Cloudinary SDK**: Configured in `config/cloudinary.js` using environment variables.
- **Multer Middleware**: Configured in `middleware/upload.js` with memory storage, image-only MIME type filtering, and a 5 MB maximum file size limit.
- **Dedicated Upload Endpoint**: Implemented `POST /uploads/image` in `routes/uploads.js` using `Readable.from(req.file.buffer).pipe(cloudinary.uploader.upload_stream(...))`.
- **Response**: Returns `200 OK` with `{ message, imageUrl, public_id }`.

## Testing
- Verified server starts without errors via `npm start`.
- Verified existing endpoints (`GET /`, `GET /posts`, `POST /login`) remain fully operational.
- Verified `POST /uploads/image` handles missing files (returns `400 Bad Request`), oversized files, and successfully uploads valid images to Cloudinary.


# Sprint 11 — Phase 3B: Integrate Image Upload with Posts and MongoDB

## Objective
Integrate the Multer memory storage and Cloudinary upload pipeline into the primary `POST /posts` route, saving the resulting Cloudinary `secure_url` in MongoDB under `imageUrl` while ensuring backward compatibility with requests that do not include an image.

## Architecture & Implementation
- **Schema Extension**: Added `imageUrl: { type: String, default: null }` to `models/Post.js`.
- **Multer Integration**: `POST /posts` executes `upload.single('image')` to parse `multipart/form-data` as well as standard JSON payloads without conflicts.
- **Remote Streaming**: If `req.file` is present, it is streamed to Cloudinary using `Readable.from(buffer).pipe(cloudinary.uploader.upload_stream(...))`.
- **Database Persistence**: MongoDB stores only the secure Cloudinary HTTPS URL string (`imageUrl`), never Base64 strings or binary buffers.
- **Error Handling**: Multer errors (file size limits > 5MB, non-image MIME types) return `400 Bad Request`. If Cloudinary upload fails, the endpoint aborts before creating an incomplete document in MongoDB.

## Testing & Verification
- Started backend via `npm start`; confirmed MongoDB Atlas connection.
- Tested `POST /posts` with JSON body (no image) → Created post with `imageUrl: null` (201 Created).
- Tested `POST /posts` with `multipart/form-data` (title + content + `image` file) → Image uploaded to Cloudinary, returned document with live `imageUrl` (201 Created).
- Tested `GET /posts` and `GET /posts/recent` → Returned posts with populated author and `imageUrl`.


---

### Update `the-data-hub/Prompts.md`
Append to `Prompts.md`:

```markdown
# Sprint 11 — Final Production Audit & Deployment Preparation

## Objective
Audit the entire fullstack system across both repositories (`Cine-Stream` frontend and `the-data-hub` backend) to verify production readiness, environment variable security, dynamic port and CORS configurations, and build viability.

## Audit Results
1. **Frontend**: Confirmed `src/services/api.js` uses `import.meta.env.VITE_API_URL`. Verified `npm run build` completes successfully with zero errors.
2. **Backend**: Confirmed `server.js` binds to `process.env.PORT || 5000`. Updated CORS to support `CLIENT_URL` for Vercel.
3. **Security**: Confirmed zero secrets or Cloudinary keys are exposed to the frontend client. MongoDB stores only the secure Cloudinary HTTPS URL.
4. **Deployment Strategy**: Frontend mapped to Vercel, Backend mapped to Render.


# Sprint 12 — Track B — Phase 1A: WebSocket Initialization & Base MVP: Backend Foundation

## Prompt
Sprint 12 — Track B — Phase 1A
WebSocket Initialization & Base MVP: Backend Foundation
[Attached full system prompt specification]

## Objective
Establish the Socket.io WebSocket server foundation within the existing Express application using a unified Node.js HTTP server without breaking existing REST API endpoints, Cloudinary integration, or MongoDB connection.

## Architecture & Implementation
- **HTTP Server**: Wrapped the Express `app` in `http.createServer(app)`.
- **Socket.io Initialization**: Attached `new Server(server, { cors: { origin: allowedOrigins } })` to share port `5000` / `process.env.PORT`.
- **Connection Lifecycle**: Added `io.on('connection', (socket) => { ... })` and `socket.on('disconnect')` to log client connect/disconnect events with `socket.id`.
- **Server Startup**: Updated entry point to listen via `server.listen(PORT)`.

## Testing & Verification
- Started backend via `npm start`.
- Verified console displays:
  - `MongoDB connected successfully`
  - `Server is running on port 5000`
- Verified REST endpoints (`GET /`, `GET /posts`, `POST /login`) continue to respond with `200 OK`.
- Verified Socket.io engine endpoint responds at `http://localhost:5000/socket.io/?EIO=4&transport=polling`.


# Sprint 12 — Track B — Phase 1C: Bidirectional Broadcast: Real-Time Messaging MVP

## Prompt
Sprint 12 — Track B — Phase 1C
Bidirectional Broadcast: Real-Time Messaging MVP
[Attached full system prompt specification]

## Objective
Implement bidirectional broadcast messaging over Socket.io by listening to `chat:message` events, validating the payload, and broadcasting `chat:message` to all connected clients.

## Implementation Details
- Handled `socket.on('chat:message')` validating `payload.text`.
- Broadcasted message payloads via `io.emit('chat:message', { id, text })`.
- Preserved existing MongoDB persistence, Cloudinary upload, and REST endpoints.