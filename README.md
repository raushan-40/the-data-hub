# The Data Hub

## Overview
The Data Hub is a lightweight, high-performance REST API built with Node.js and Express for Sprint 9 (Track B: Fullstack Developer). It provides resource endpoints for managing blog posts, a custom request logging middleware, and a demonstration mock login endpoint.

## Features
- **RESTful API**: Standardized endpoints for resource management.
- **In-Memory CRUD**: In-memory data store handling creation, retrieval, updating, and deletion of posts.
- **Request Logging Middleware**: Intercepts and logs HTTP method, URL path, and timestamp for all incoming traffic.
- **Mock Login**: Demonstration authentication endpoint returning a mock JWT token.
- **Robust Error Handling**: Standardized JSON responses for `400 Bad Request`, `401 Unauthorized`, `404 Not Found`, and `500 Internal Server Error`.

## API Endpoints

### Health & Auth
| Method | Endpoint | Description | Status Codes |
|---|---|---|---|
| `GET` | `/` | API Health Check | `200` |
| `POST` | `/login` | Mock authentication | `200`, `400`, `401` |

### Blog Posts Resource
| Method | Endpoint | Description | Status Codes |
|---|---|---|---|
| `GET` | `/posts` | Retrieve all posts | `200` |
| `GET` | `/posts/:id` | Retrieve single post by ID | `200`, `404` |
| `POST` | `/posts` | Create new post | `201`, `400` |
| `PUT` | `/posts/:id` | Update post by ID | `200`, `400`, `404` |
| `DELETE` | `/posts/:id` | Delete post by ID | `200`, `404` |

## Setup & Local Execution

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd the-data-hub