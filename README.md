# Ecommerce Fullstack Application

A complete ecommerce website built with **Next.js** (frontend) and **NestJS** (backend).

## Project Structure

```
├── apps/
│   ├── api/          # NestJS backend
│   └── web/          # Next.js frontend
├── packages/
│   ├── database/     # Database models and migrations
│   └── shared/       # Shared types and utilities
└── .github/          # GitHub configuration
```

## Tech Stack

### Backend (NestJS)
- NestJS framework
- PostgreSQL database
- TypeORM for ORM
- JWT authentication
- Stripe for payments
- Class-validator for validation

### Frontend (Next.js)
- Next.js 14 with App Router
- TailwindCSS for styling
- React Query for state management
- Axios for API calls
- NextAuth for authentication

## Getting Started

### Prerequisites
- Node.js 18+
- Yarn or npm
- PostgreSQL

### Installation

```bash
# Install dependencies
yarn install

# Set up environment variables
cp apps/api/.env.example apps/api/.env.local
cp apps/web/.env.example apps/web/.env.local

# Run database migrations
cd apps/api
yarn typeorm migration:run

# Start development servers
yarn dev
```

### Running Services

```bash
# Development
yarn dev

# Build
yarn build

# Production
yarn start
```

## Features

- [x] Product catalog with search and filtering
- [x] Shopping cart and checkout
- [x] Order management
- [x] User authentication and profiles
- [x] Admin dashboard
- [x] Payment processing (Stripe)
- [x] Email notifications
- [x] Review and rating system

## API Documentation

Backend API docs available at `http://localhost:3001/api/docs`

## License

MIT
