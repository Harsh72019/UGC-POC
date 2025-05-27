# UGC Backend

A backend API service built with **Node.js**, **Express**, **MongoDB**, and **Firebase** for managing users, posts, and authentication in a User-Generated Content (UGC) application.

---

## 🔧 Tech Stack

- **Node.js** + **Express** – REST API server
- **MongoDB** + **Mongoose** – Database and ODM
- **Firebase Admin SDK** – Auth and custom token generation
- **Joi** – Request validation
- **Axios** – External API calls (e.g., Google Identity Toolkit)
- **Postman** – API testing

---

## 📁 Project Structure

```
UGCBackend/
├── src/
│   ├── config/              # Environment configs
│   ├── controllers/         # Route controllers
│   ├── models/              # Mongoose schemas
│   ├── routes/              # Route definitions
│   ├── validations/         # Joi validation schemas
│   ├── utils/               # Helpers (e.g., catchAsync, ApiError)
├── .env                     # Environment variables
├── server.js                # App entry point
```

---

## ⚙️ Setup Instructions

### 1. Clone the Repository

```bash
git clone https://github.com/Harsh72019/ugc-backend.git
cd ugc-backend
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Environment Variables

Create a `.env` file in the root directory and configure:

```env
PORT=3000
MONGO_URI=mongodb://localhost:27017/ugc
FIREBASE_PROJECT_ID=your-project-id
FIREBASE_CLIENT_EMAIL=your-service-account-email
FIREBASE_PRIVATE_KEY=your-service-account-private-key
FIREBASE_API_KEY=your-firebase-web-api-key
NODE_ENV=development
```

> You can get these from your Firebase service account credentials and project settings.

---

## 🔐 Firebase Custom Token Generation (Dev Only)

A dev-only route is available to generate Firebase ID tokens from UID:

**Route:**
```
GET /api/v1/auth/generate-token/:uid
```

Use the token for further requests requiring Firebase authentication.

---

## 🧪 Postman Setup

Use the included Postman Collection to test API endpoints.

### 🛠️ Auto-setting `firebaseToken` Variable

Use this snippet as a **Tests** script in the token generation request:

```js
const token = pm.response.json().data.token;
pm.environment.set("firebaseToken", token);
```

Then, use `{{firebaseToken}}` in the **Authorization** header or body.

---

## 📌 Routes Overview

### Auth

- `GET /api/v1/auth/generate-token/:uid` – Generates Firebase token (dev only)

### Users

- `PATCH /api/v1/user/:userId` – Update user info
- `DELETE /api/v1/user/:userId` – Delete a user
- `PATCH /api/v1/user/preferences` – Update preferences

### Posts

- `POST /api/v1/post` – Create a post
- `GET /api/v1/post/:id` – Get post by ID
- `DELETE /api/v1/post/:id` – Delete post

---

## 🧾 License

MIT
