# Ecommerce Fullstack Application Setup

## Project Overview
Building a complete ecommerce platform with Next.js (frontend) and NestJS (backend).

## Project Structure
- **apps/api**: NestJS backend with API endpoints
- **apps/web**: Next.js frontend application
- **packages/database**: Shared database models and migrations
- **packages/shared**: Shared types and utilities

## Tech Stack
- **Backend**: NestJS, PostgreSQL, TypeORM, JWT, Stripe
- **Frontend**: Next.js 14, TailwindCSS, React Query, NextAuth

## Setup Checklist
- [ ] Install dependencies (yarn install)
- [ ] Configure PostgreSQL
- [ ] Set up environment variables
- [ ] Run database migrations
- [ ] Start development servers
- [ ] Verify API health check
- [ ] Verify frontend loads

## Running the Application
```bash
yarn dev          # Start both frontend and backend
yarn build        # Build both applications
yarn start        # Start production backend
```

## Key Files
- `package.json`: Monorepo configuration
- `tsconfig.json`: TypeScript configuration
- `apps/api/src/main.ts`: Backend entry point
- `apps/web/app/page.tsx`: Frontend entry point
