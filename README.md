# The Data Hub

## Overview
**The Data Hub** is a production-ready RESTful API built with **Node.js**, **Express**, and **MongoDB Atlas** using **Mongoose** (Sprint 10 — Track B: Fullstack Developer). It features persistent cloud CRUD operations, User-to-Post relational data modeling with `.populate()`, database-level aggregation for recent posts, global request-logging middleware, and demonstration mock authentication.

---

## Features
- **MongoDB Atlas Persistence**: Cloud database persistence replacing in-memory state.
- **Relational Data Modeling**: Posts reference User documents via Mongoose `ObjectId` references (`ref: 'User'`).
- **Relational Hydration (`populate()`)**: Automatically populates author information (`name`, `email`) on post retrieval.
- **Top 3 Most Recent Posts**: Database-level sorting (`createdAt: -1`) and query limiting (`limit(3)`).
- **Global Request Logging**: Intercepts all traffic and outputs HTTP method, path, and timestamp.
- **Mock Authentication**: Demonstration `POST /login` returning a mock JWT token.
- **Predictable Error Handling**: Robust JSON responses for `400 Bad Request`, `401 Unauthorized`, `404 Not Found`, and `500 Internal Server Error`.

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
| `POST` | `/users` | Create user for relational testing | `201 Created`, `400 Bad Request` |

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

### 1. Clone & Install
```bash
git clone <repository-url>
cd the-data-hub
npm install