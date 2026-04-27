# Logger Micro-Service

A simple logger micro-service built with TypeScript for logging application events and errors.

## Table of Contents

- [Features](#features)
- [Installation](#installation)
- [Scripts](#scripts)
- [Environment Setup](#environment-setup)
- [Getting Started](#getting-started)
- [API Endpoints](#api-endpoints)
- [Payload Structure](#payload-structure)

## Features

- Log creation and retrieval
- Live log statistics
- Environment-specific configuration
- Built with TypeScript

## Installation

```bash
npm install
```

## Scripts

| Command         | Description                                |
| --------------- | ------------------------------------------ |
| `npm run dev`   | Run in development mode with hot reloading |
| `npm run build` | Compile TypeScript to JavaScript           |
| `npm start`     | Run the compiled service (build first)     |

## Environment Setup

This service uses environment-specific `.env` files (e.g., `.env.development` and `.env.production`). Ensure these files exist in the root directory with your configuration variables.

### Required Environment Variables

| Variable                   | Description                        | Example                                                                              |
| -------------------------- | ---------------------------------- | ------------------------------------------------------------------------------------ |
| `PORT`                     | The port on which the service runs | `3000`                                                                               |
| `DBConnectionString`       | MongoDB connection string          | `mongodb+srv://username:password@cluster.mongodb.net/db?retryWrites=true&w=majority` |
| `frontEndConnectionString` | Frontend application URL           | `http://localhost:4200`                                                              |
| `ENV`                      | Environment mode                   | `development`                                                                        |

## Getting Started

1. Install dependencies: `npm install`
2. For development: `set NODE_ENV=development && npm run dev` (loads `.env.development`)
3. Build the project: `npm run build`
4. For production: `set NODE_ENV=production && npm start` (loads `.env.production` after building)

## API Endpoints

- `POST /logs/createLogs` - Create a new log entry
- `GET /logs/liveLogStats` - Get live log statistics
- `GET /logs/getLogs` - Retrieve logs

Base URL: `http://localhost:3000`

## Payload Structure

For creating logs, use the following JSON payload:

```json
{
  "level": "error",
  "message": "agnibha",
  "meta": {
    "module": "test module",
    "serviceName": "test service",
    "route": "test route",
    "username": "rony",
    "sessionId": "1232"
  }
}
```
