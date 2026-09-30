# The Data Hub (Backend)

## Overview
RESTful API for **The Data Hub** built with Node.js, Express, MongoDB Atlas, Mongoose, Multer, and Cloudinary.

## Features
- **Database Persistence**: MongoDB Atlas cluster with Mongoose ODM.
- **Relational Data**: Post-to-User references with `.populate('author')`.
- **Image Storage**: Cloudinary upload pipeline via Multer memory storage.
- **Production Deployment**: Configured for Render.

## Required Environment Variables
| Variable | Description | Example |
|---|---|---|
| `PORT` | Server listening port | `5000` |
| `MONGO_URI` | MongoDB Atlas connection string | `mongodb+srv://...` |
| `CLIENT_URL` | Deployed Frontend Vercel URL | `https://cine-stream.vercel.app` |
| `CLOUDINARY_CLOUD_NAME` | Cloudinary Cloud Name | `dxxxx` |
| `CLOUDINARY_API_KEY` | Cloudinary API Key | `123456789` |
| `CLOUDINARY_API_SECRET` | Cloudinary API Secret | `abcdef123456` |

## Local Setup
```bash
npm install
npm start