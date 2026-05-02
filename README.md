# CollabImage API

A Node.js/Express backend API for image collaboration with group management capabilities.

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Run development server
npm run dev
```

Server runs on `http://localhost:4000`

## 📋 Environment Variables

Create a `.env.development` file:

| Variable                   | Description                 |
| -------------------------- | --------------------------- |
| `DBConnectionString`       | MongoDB connection string   |
| `frontEndConnectionString` | Allowed CORS origin         |
| `PORT`                     | Server port (default: 4000) |
| `CLERK_PUBLISHABLE_KEY`    | Clerk auth publishable key  |
| `CLERK_SECRET_KEY`         | Clerk auth secret key       |
| `IMAGEKIT_URL_ENDPOINT`    | ImageKit URL endpoint       |
| `IMAGEKIT_PUBLIC_KEY`      | ImageKit public key         |
| `IMAGEKIT_PRIVATE_KEY`     | ImageKit private key        |
| `IMAGEKIT_PRIVATE_KEY`     | ImageKit private key        |
| `ENV`                      | development | production    |


### Environment Modes

- **Development** — loads `.env.development`
- **Production** — loads `.env.production` (or Vercel env vars)

## 🛠️ Tech Stack

- **Runtime:** Node.js 20.x
- **Framework:** Express.js
- **Database:** MongoDB + Mongoose
- **Auth:** Clerk (@clerk/express)
- **Image Storage:** ImageKit
- **Deployment:** Vercel

## API Endpoints

### Authentication

| Method | Endpoint      | Description                             |
| ------ | ------------- | --------------------------------------- |
| `GET`  | `/auth/login` | Authenticate user (requires Clerk auth) |

### Image Upload

| Method | Endpoint              | Description                  |
| ------ | --------------------- | ---------------------------- |
| `POST` | `/upload/uploadImage` | Upload image (requires auth) |

### Group Management

| Method   | Endpoint                                     | Description                |
| -------- | -------------------------------------------- | -------------------------- |
| `POST`   | `/group/creategroup/:name`                   | Create a new group         |
| `DELETE` | `/group/deletegroup/:groupId`                | Delete a group             |
| `GET`    | `/group/getgroups/:email`                    | Get groups created by user + groups shared with user |
| `PUT`    | `/group/modifygroup/:groupId/:email/:action` | Add/remove user from group |

## 📁 Project Structure

```
src/
├── config/
│   ├── env.config.ts      # Environment configuration
│   ├── global.config.ts   # Global feature flags
│   └── imagekit.config.ts # ImageKit setup
├── controller/
│   ├── group/             # Group CRUD controllers
│   ├── image/             # Image upload controller
│   └── user/              # Auth controller
├── middleware/
│   └── authetication.middleware.ts  # Auth middleware
├── models/
│   ├── group.model.ts     # Group Mongoose model
│   └── user.model.ts      # User Mongoose model
├── routes/
│   ├── auth.route.ts
│   ├── group.route.ts
│   └── uploadImage.route.ts
├── common/
│   ├── enums/             # TypeScript enums
│   ├── functions/         # Shared functions
│   └── interface/         # TypeScript interfaces
└── index.ts               # Express app entry point
```

## 🔧 Available Scripts

| Script          | Description                   |
| --------------- | ----------------------------- |
| `npm run dev`   | Start dev server with nodemon |
| `npm run build` | Compile TypeScript            |
| `npm run start` | Run compiled production build |

## 🔐 Authentication

All protected routes require a valid Clerk authentication token. Include the token in the `Authorization` header:

```
Authorization: Bearer <clerk-token>
```

## 📦 Dependencies

- `@clerk/express` — Authentication
- `cors` — Cross-origin resource sharing
- `dotenv` — Environment variable loading
- `express` — Web framework
- `imagekit` — Image storage
- `mongoose` — MongoDB ODM
- `multer` — File upload handling
