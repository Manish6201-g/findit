# Deployment Guide: Campus Lost and Found

This guide provides step-by-step instructions for deploying the Campus Lost and Found full-stack application.

## Prerequisites
- A [GitHub](https://github.com/) account.
- A [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) account.
- A [Cloudinary](https://cloudinary.com/) account (for image storage).
- A [Vercel](https://vercel.com/) account (for Frontend).
- A [Render](https://render.com/) or [Railway](https://railway.app/) account (for Backend).

---

## 1. Database Setup (MongoDB Atlas)
1. Log in to MongoDB Atlas and create a new project.
2. Build a **Shared Cluster** (Free Tier).
3. **Network Access:** Add IP Address `0.0.0.0/0` to allow connections from deployment servers.
4. **Database Access:** Create a user with a secure password and "Read and Write to any database" permissions.
5. **Connection String:** Click **Connect** > **Drivers** and copy the URI. 
   - *Example: `mongodb+srv://<username>:<password>@cluster.mongodb.net/campus-found?retryWrites=true&w=majority`*

---

## 2. Image Storage Setup (Cloudinary)
1. Log in to Cloudinary.
2. Copy your **Cloud Name**, **API Key**, and **API Secret** from the Dashboard.

---

## 3. Backend Deployment (Render/Railway)
1. Connect your repository.
2. **Root Directory:** `backend`
3. **Build Command:** `npm install && npm run build`
4. **Start Command:** `npm start`
5. **Environment Variables:**
   - `NODE_ENV`: `production`
   - `PORT`: `5000`
   - `MONGODB_URI`: *Your Atlas URI*
   - `JWT_SECRET`: *A long random string*
   - `CLOUDINARY_CLOUD_NAME`: *From Cloudinary*
   - `CLOUDINARY_API_KEY`: *From Cloudinary*
   - `CLOUDINARY_API_SECRET`: *From Cloudinary*
6. **Note your API URL:** Once deployed, you will get a URL like `https://your-backend.onrender.com`.

---

## 4. Frontend Deployment (Vercel)
1. Import your repository to Vercel.
2. **Root Directory:** `frontend`
3. **Framework Preset:** Next.js
4. **Environment Variables:**
   - `NEXT_PUBLIC_API_URL`: `https://your-backend.onrender.com/api` (Use the URL from Step 3).
5. Click **Deploy**.

---

## 5. Post-Deployment Verification
1. Access your Vercel URL.
2. Sign up and log in.
3. Report an item and verify it appears in the browse list.
4. Test the claim process to ensure database updates and notifications work correctly.

---

## Maintenance
- **CORS:** Currently, the backend allows all origins (`origin: '*'`). For better security, update `backend/src/index.ts` to only allow your Vercel URL in production.
- **Logs:** Use Render/Vercel dashboards to monitor runtime logs for errors.
