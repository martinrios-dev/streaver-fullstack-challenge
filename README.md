# Streaver Full-Stack Challenge

A Next.js application for browsing and managing posts from multiple users, built with Prisma ORM and SQLite.

## Overview

This application provides a post management interface designed for users with slow or unstable internet connections. It fetches user and post data from an external API, stores it locally, and implements client-side caching with stale-while-revalidate behavior to ensure the UI remains responsive even when network conditions are poor.

## Key Features

- **Posts Listing**: Browse all posts with user information displayed in a card-based layout
- **Filter by User**: Filter posts by user ID to view content from specific users
- **Post Deletion**: Delete posts with optimistic UI updates and error recovery
- **Client-Side Caching**: 5-minute localStorage cache with background revalidation for instant UI feedback
- **Offline Resilience**: Cached data is retained when refresh fails, keeping the app functional under unstable network conditions
- **Responsive Design**: Mobile-first dark theme interface built with Tailwind CSS

## Prerequisites

- Node.js 18+ 
- pnpm (recommended)

## How to Run

1. **Install dependencies**:
   ```bash
   pnpm install
   ```

2. **Run database migrations**:
   ```bash
   pnpm db:migrate
   ```

3. **Seed the database**:
   ```bash
   pnpm db:seed
   ```

4. **Start the development server**:
   ```bash
   pnpm dev
   ```

   Open [http://localhost:3000](http://localhost:3000) in your browser.

## Available Scripts

- `pnpm dev` - Start development server
- `pnpm build` - Build for production
- `pnpm start` - Start production server
- `pnpm lint` - Run ESLint
- `pnpm db:migrate` - Run Prisma migrations
- `pnpm db:seed` - Seed the database
- `pnpm db:studio` - Open Prisma Studio
- `pnpm db:reset` - Reset database and re-run migrations

> **Note**: `prisma generate` runs automatically after `pnpm install` via the `postinstall` hook. 

## Database

This project uses:
- **ORM**: Prisma
- **Database**: SQLite
- **Database file**: `./prisma/dev.db`

The `.env` file is committed for demo purposes (challenge requirement). The database file itself (`*.db`) is gitignored.

## Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Database**: SQLite + Prisma ORM
