# Ecommerce Fullstack Application - Setup Instructions

## Prerequisites

Before you begin, ensure you have the following installed:

- Node.js 18+ ([Download](https://nodejs.org/))
- Yarn (`npm install -g yarn`)
- PostgreSQL 12+ ([Download](https://www.postgresql.org/download/))

## Project Setup

### 1. Install Dependencies

```bash
yarn install
```

### 2. Database Setup

Create a PostgreSQL user and database:

```sql
-- Connect to PostgreSQL as admin
CREATE USER ecommerce WITH PASSWORD 'password';
CREATE DATABASE ecommerce OWNER ecommerce;
GRANT ALL PRIVILEGES ON DATABASE ecommerce TO ecommerce;
```

Or use the provided setup script:

```bash
# On macOS/Linux
bash setup.sh

# On Windows
setup.bat
```

### 3. Configure Environment Variables

Copy example files to actual environment files:

```bash
cp apps/api/.env.example apps/api/.env.local
cp apps/web/.env.example apps/web/.env.local
```

Edit the files with your actual configuration.

### 4. Run Database Migrations

```bash
cd apps/api
yarn typeorm migration:run
```

## Running the Application

### Development Mode

Start both frontend and backend:

```bash
yarn dev
```

This will start:
- **Backend API**: http://localhost:3001
- **Frontend**: http://localhost:3000

API Documentation (Swagger): http://localhost:3001/api/docs

### Production Build

```bash
yarn build
```

### Production Start

```bash
yarn start
```

## Project Structure

```
fullstackEC/
├── apps/
│   ├── api/                 # NestJS Backend
│   │   ├── src/
│   │   │   ├── main.ts      # Entry point
│   │   │   ├── app.module.ts
│   │   │   ├── modules/     # Feature modules
│   │   │   ├── entities/    # Database entities
│   │   │   └── health/      # Health check
│   │   └── package.json
│   │
│   └── web/                 # Next.js Frontend
│       ├── app/             # Pages and layouts
│       ├── components/      # React components
│       ├── lib/             # Utilities and API client
│       ├── styles/          # Global styles
│       └── package.json
│
├── packages/
│   ├── database/            # Shared database models
│   └── shared/              # Shared types and utilities
│
├── .github/
│   └── copilot-instructions.md
│
├── package.json             # Monorepo configuration
├── tsconfig.json            # TypeScript configuration
└── nest-cli.json            # NestJS CLI configuration
```

## Available APIs

### Authentication
- `POST /auth/register` - Register new user
- `POST /auth/login` - Login user

### Products
- `GET /products` - Get all products
- `GET /products/:id` - Get product details
- `GET /products/search?q=query` - Search products
- `GET /products/category/:category` - Get products by category
- `POST /products/:id/reviews` - Add product review

### Cart
- `GET /cart` - Get user's cart
- `POST /cart/items` - Add item to cart
- `PUT /cart/items/:id` - Update cart item quantity
- `DELETE /cart/items/:id` - Remove item from cart
- `DELETE /cart` - Clear cart

### Orders
- `GET /orders` - Get user's orders
- `GET /orders/:id` - Get order details
- `POST /orders` - Create new order
- `PUT /orders/:id/status` - Update order status
- `PUT /orders/:id/cancel` - Cancel order

### Users
- `GET /users/:id` - Get user profile
- `PUT /users/:id` - Update user profile

## Frontend Pages

- `/` - Home page
- `/products` - All products
- `/products/:id` - Product details
- `/cart` - Shopping cart
- `/auth/login` - User login
- `/auth/register` - User registration

## Development Tips

### Backend Development
- API server hot-reloads with `yarn dev` in the api app
- Database changes auto-sync (in development)
- View API docs at http://localhost:3001/api/docs

### Frontend Development
- Hot Module Replacement (HMR) enabled
- TailwindCSS for styling
- React Query for server state management
- Zustand for client state (cart)

## Troubleshooting

### Port Already in Use
If ports 3000 or 3001 are already in use:

```bash
# Change frontend port
yarn workspace @ecommerce/web dev -p 3002

# Change backend port
export PORT=3002 && yarn workspace @ecommerce/api dev
```

### Database Connection Error
Ensure PostgreSQL is running:
```bash
# macOS
brew services start postgresql

# Linux
sudo systemctl start postgresql

# Windows
# Start PostgreSQL from Services or pgAdmin
```

### Dependencies Issues
Clear cache and reinstall:
```bash
yarn cache clean
rm -rf node_modules
yarn install
```

## Next Steps

1. Add more product categories
2. Implement Stripe payment integration
3. Add email notifications
4. Create admin dashboard
5. Add order tracking
6. Implement product reviews
7. Add wishlists
8. Implement search filters

## License

MIT

## Support

For issues or questions, please open an issue in the repository.
