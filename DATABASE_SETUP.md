# Database Setup Guide

The app is now running in development mode with mock storage. To enable persistent data storage, you need to set up a real database connection.

## Quick Setup

Run the interactive setup script:

```bash
npm run setup
```

This will guide you through:

1. Getting a free Neon database
2. Configuring your connection string
3. Setting up the database schema

## Manual Setup

### 1. Get a Neon Database (Free)

1. Go to [https://neon.tech](https://neon.tech)
2. Create a free account
3. Create a new project
4. Click "Connect" and copy the connection string

### 2. Configure Environment Variables

Create a `.env` file in the project root:

```env
DATABASE_URL="postgresql://username:password@ep-your-endpoint.us-east-2.aws.neon.tech/dbname?sslmode=require"
NODE_ENV=development
```

Replace the DATABASE_URL with your actual Neon connection string.

### 3. Push Database Schema

```bash
npm run db:push
```

### 4. Restart the Server

```bash
npm run dev
```

## Current Status

✅ **Server Running**: http://localhost:5000
✅ **AI Services**: 22 services loaded and operational
⚠️ **Database**: Using mock storage (data won't persist)

The app is fully functional with mock storage for development. Database setup is only needed for data persistence.

## Available Endpoints

- **Health Check**: http://localhost:5000/api/health
- **AI Status**: http://localhost:5000/api/ai-status
- **Frontend**: http://localhost:5000

## Troubleshooting

If you encounter issues:

1. Make sure your DATABASE_URL is correct
2. Check that your Neon database is active
3. Run `npm run db:push` to ensure schema is up to date
4. Restart the dev server with `npm run dev`
