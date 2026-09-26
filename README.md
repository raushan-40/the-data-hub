# The Data Hub

## Overview
**The Data Hub** is a RESTful API built with **Node.js**, **Express**, and **MongoDB Atlas** using **Mongoose** (Sprint 10 — Track B: Fullstack Developer). It features persistent CRUD operations, User-to-Post relationships with reference population, a custom recent posts query, request logging middleware, and demonstration mock authentication.

---

## Features
- **MongoDB Atlas Persistence**: Cloud-backed persistence via Mongoose schemas.
- **Relational Data Modeling**: `Post` documents reference `User` documents via `author` ObjectId references.
- **Payload Hydration (`populate()`)**: Automatically populates author information (`name`, `email`) on post retrieval.
- **Top 3 Most Recent Posts**: Database-level sorting (`createdAt: -1`) and limiting (`limit(3)`).
- **Request Logging Middleware**: Global logging of HTTP method, URL path, and timestamp.
- **Mock Authentication**: Demonstration `POST /login` returning a mock JWT token.

---

## API Endpoints

### 1. Health & Demonstration Auth
| Method | Endpoint | Description | Status Codes |
|---|---|---|---|
| `GET` | `/` | API Health Check | `200 OK` |
| `POST` | `/login` | Mock authentication | `200 OK`, `400 Bad Request`, `401 Unauthorized` |

### 2. User Testing Resource
| Method | Endpoint | Description | Status Codes |
|---|---|---|---|
| `GET` | `/users` | List all users | `200 OK` |
| `POST` | `/users` | Create user for relation testing | `201 Created`, `400 Bad Request` |

### 3. Blog Posts Resource
| Method | Endpoint | Description | Status Codes |
|---|---|---|---|
| `GET` | `/posts` | Retrieve all posts (hydrated author) | `200 OK` |
| `GET` | `/posts/recent` | Top 3 most recent posts (newest first) | `200 OK` |
| `GET` | `/posts/:id` | Retrieve single post by ID (hydrated author) | `200 OK`, `400 Bad Request`, `404 Not Found` |
| `POST` | `/posts` | Create new post with optional/validated `author` | `201 Created`, `400 Bad Request`, `404 Not Found` |
| `PUT` | `/posts/:id` | Update post by ID | `200 OK`, `400 Bad Request`, `404 Not Found` |
| `DELETE` | `/posts/:id` | Delete post by ID | `200 OK`, `400 Bad Request`, `404 Not Found` |

---

## Setup & Local Execution

1. Clone the repository and install dependencies:
   ```bash
   npm install