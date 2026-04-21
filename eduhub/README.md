# EduHub - Study Material Management System

A full-stack MERN application for managing and sharing study materials.

## Features
- **User Authentication**: Secure register/login with JWT.
- **Role-Based Access**: Admins can upload/delete materials; Users can view/download.
- **Multiple Material Types**: Supports PDF, DOC, PPT files and YouTube video links.
- **Search**: Search materials by title.
- **Modern UI**: Built with React, Tailwind CSS, and Lucide icons.

## Prerequisites
- Node.js installed.
- MongoDB running locally (default: `mongodb://localhost:27017/eduhub`).

## Setup

1. **Install Dependencies**
   ```bash
   npm install
   cd client && npm install
   cd ../server && npm install
   ```

2. **Environment Variables**
   The server `.env` file is already created in `server/.env`.
   ```env
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/eduhub
   JWT_SECRET=your_jwt_secret_key_12345
   NODE_ENV=development
   ```

3. **Run the Application**
   From the root directory:
   ```bash
   npm run dev
   ```
   - Frontend: `http://localhost:5173`
   - Backend: `http://localhost:5000`

## Admin Access
To create an admin user, you can register a new account and then manually update the `role` field in the MongoDB `users` collection to `"admin"`. Alternatively, you can modify the registration logic temporarily.
