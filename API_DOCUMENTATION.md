# API Documentation

## Base URL
- Development: `http://localhost:3001`
- Production: `https://your-domain.com`

## Authentication

All protected endpoints require JWT token in header:
```
Authorization: Bearer <your_jwt_token>
```

---

## Authentication Endpoints

### Register User
```http
POST /auth/register
Content-Type: application/json

{
  "email": "user@example.com",
  "firstName": "John",
  "lastName": "Doe",
  "password": "SecurePass123"
}

Response 201:
{
  "accessToken": "eyJhbGc...",
  "user": {
    "id": "uuid",
    "email": "user@example.com",
    "firstName": "John",
    "lastName": "Doe"
  }
}
```

### Login User
```http
POST /auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "SecurePass123"
}

Response 200:
{
  "accessToken": "eyJhbGc...",
  "user": { ... }
}
```

---

## Product Endpoints

### Get All Products
```http
GET /products?skip=0&take=10

Response 200:
[
  {
    "id": "uuid",
    "name": "Product Name",
    "description": "...",
    "price": 99.99,
    "stock": 50,
    "category": "Electronics",
    "rating": 4.5,
    "reviewCount": 12,
    "images": ["url1", "url2"],
    "isActive": true,
    "createdAt": "2024-01-01T00:00:00Z"
  },
  ...
]
```

### Get Product Details
```http
GET /products/{id}

Response 200:
{
  "id": "uuid",
  "name": "Product Name",
  "description": "Full description",
  "price": 99.99,
  "stock": 50,
  "category": "Electronics",
  "rating": 4.5,
  "reviewCount": 12,
  "images": ["url1", "url2"],
  "reviews": [
    {
      "id": "uuid",
      "userId": "user-uuid",
      "rating": 5,
      "comment": "Great product!",
      "createdAt": "2024-01-01T00:00:00Z"
    }
  ]
}
```

### Search Products
```http
GET /products/search?q=headphones

Response 200:
[
  { product objects matching query }
]
```

### Get All Categories
```http
GET /products/categories

Response 200:
[
  "Electronics",
  "Accessories",
  "Clothing",
  ...
]
```

### Filter Products
```http
GET /products/filter?category=Electronics&minPrice=50&maxPrice=500&sortBy=price&skip=0&take=10

Query Parameters:
- category (optional): Filter by category
- minPrice (optional): Minimum price
- maxPrice (optional): Maximum price
- minRating (optional): Minimum rating
- sortBy (optional): 'price', 'rating', or 'newest'
- skip (optional): Number of items to skip (default: 0)
- take (optional): Number of items to return (default: 10)

Response 200:
[
  { filtered product objects }
]
```

### Get Products by Category
```http
GET /products/category/{category}?skip=0&take=10

Response 200:
[
  { product objects }
]
```

### Create Product (Admin)
```http
POST /products
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "New Product",
  "description": "Product description",
  "price": 99.99,
  "stock": 100,
  "category": "Electronics",
  "images": ["url1", "url2"]
}

Response 201:
{
  "id": "uuid",
  "name": "New Product",
  ...
}
```

### Update Product (Admin)
```http
PUT /products/{id}
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "Updated Name",
  "price": 89.99,
  "stock": 50
}

Response 200:
{ updated product object }
```

### Delete Product (Admin)
```http
DELETE /products/{id}
Authorization: Bearer <token>

Response 200:
{ success message }
```

### Add Product Review
```http
POST /products/{id}/reviews
Authorization: Bearer <token>
Content-Type: application/json

{
  "userId": "user-uuid",
  "rating": 5,
  "comment": "Excellent product!"
}

Response 201:
{
  "id": "uuid",
  "productId": "product-uuid",
  "userId": "user-uuid",
  "rating": 5,
  "comment": "Excellent product!",
  "createdAt": "2024-01-01T00:00:00Z"
}
```

---

## Cart Endpoints

### Get Cart
```http
GET /cart
Authorization: Bearer <token>

Response 200:
{
  "id": "uuid",
  "userId": "user-uuid",
  "items": [
    {
      "id": "uuid",
      "cartId": "cart-uuid",
      "productId": "product-uuid",
      "quantity": 2,
      "product": { product object },
      "addedAt": "2024-01-01T00:00:00Z"
    }
  ],
  "createdAt": "2024-01-01T00:00:00Z"
}
```

### Add Item to Cart
```http
POST /cart/items
Authorization: Bearer <token>
Content-Type: application/json

{
  "productId": "product-uuid",
  "quantity": 2
}

Response 201:
{ cart item object }
```

### Update Item Quantity
```http
PUT /cart/items/{itemId}
Authorization: Bearer <token>
Content-Type: application/json

{
  "quantity": 5
}

Response 200:
{ updated cart item }
```

### Remove Item from Cart
```http
DELETE /cart/items/{itemId}
Authorization: Bearer <token>

Response 200:
{ success message }
```

### Clear Cart
```http
DELETE /cart
Authorization: Bearer <token>

Response 200:
{ success message }
```

---

## Order Endpoints

### Create Order
```http
POST /orders
Authorization: Bearer <token>
Content-Type: application/json

{
  "cartItems": [
    {
      "id": "item-uuid",
      "productId": "product-uuid",
      "quantity": 2,
      "product": { price: 99.99 }
    }
  ],
  "totalAmount": 199.98,
  "shippingAddress": "123 Main St, City, State 12345"
}

Response 201:
{
  "id": "order-uuid",
  "userId": "user-uuid",
  "totalAmount": 199.98,
  "status": "pending",
  "shippingAddress": "...",
  "items": [...],
  "payments": [],
  "createdAt": "2024-01-01T00:00:00Z"
}
```

### Get User's Orders
```http
GET /orders
Authorization: Bearer <token>

Response 200:
[
  { order objects }
]
```

### Get Order Details
```http
GET /orders/{id}
Authorization: Bearer <token>

Response 200:
{
  "id": "order-uuid",
  "userId": "user-uuid",
  "totalAmount": 199.98,
  "status": "processing",
  "shippingAddress": "...",
  "trackingNumber": "TRACK123456",
  "items": [
    {
      "id": "uuid",
      "orderId": "order-uuid",
      "productId": "product-uuid",
      "quantity": 2,
      "priceAtPurchase": 99.99,
      "product": { product object }
    }
  ],
  "payments": [
    {
      "id": "uuid",
      "orderId": "order-uuid",
      "amount": 199.98,
      "status": "completed",
      "method": "paystack",
      "paystackReference": "ref123...",
      "createdAt": "2024-01-01T00:00:00Z"
    }
  ]
}
```

### Track Order
```http
GET /orders/tracking/{id}
Authorization: Bearer <token>

Response 200:
{
  "orderId": "order-uuid",
  "status": "shipped",
  "trackingNumber": "TRACK123456",
  "createdAt": "2024-01-01T00:00:00Z",
  "updatedAt": "2024-01-02T00:00:00Z",
  "shippingAddress": "...",
  "totalAmount": 199.98,
  "payments": [...]
}
```

### Update Order Status (Admin)
```http
PUT /orders/{id}/status
Authorization: Bearer <token>
Content-Type: application/json

{
  "status": "shipped",
  "trackingNumber": "TRACK123456"
}

Response 200:
{ updated order object }
```

### Cancel Order
```http
PUT /orders/{id}/cancel
Authorization: Bearer <token>

Response 200:
{ updated order object }
```

---

## Wishlist Endpoints

### Get Wishlist
```http
GET /wishlist
Authorization: Bearer <token>

Response 200:
[
  {
    "id": "uuid",
    "userId": "user-uuid",
    "productId": "product-uuid",
    "product": { product object },
    "addedAt": "2024-01-01T00:00:00Z"
  }
]
```

### Add to Wishlist
```http
POST /wishlist/{productId}
Authorization: Bearer <token>

Response 201:
{
  "id": "uuid",
  "userId": "user-uuid",
  "productId": "product-uuid",
  "addedAt": "2024-01-01T00:00:00Z"
}
```

### Remove from Wishlist
```http
DELETE /wishlist/{productId}
Authorization: Bearer <token>

Response 200:
{ success message }
```

### Check if in Wishlist
```http
GET /wishlist/check/{productId}
Authorization: Bearer <token>

Response 200:
{
  "inWishlist": true
}
```

---

## Payment Endpoints

### Initialize Payment (Paystack)
```http
POST /payments/initialize
Content-Type: application/json

{
  "orderId": "order-uuid",
  "amount": 199.98,
  "email": "customer@example.com"
}

Response 200:
{
  "authorizationUrl": "https://checkout.paystack.com/...",
  "accessCode": "access_code",
  "reference": "order_uuid_timestamp"
}
```

### Verify Payment
```http
GET /payments/verify/{reference}

Response 200:
{
  "success": true,
  "message": "Verification successful",
  "data": {
    "reference": "reference",
    "amount": 19998,
    "status": "success"
  }
}
```

### Get Payment Status
```http
GET /payments/status/{reference}

Response 200:
{
  "id": "uuid",
  "orderId": "order-uuid",
  "amount": 199.98,
  "status": "completed",
  "method": "paystack",
  "paystackReference": "reference",
  "transactionId": "transaction-id",
  "createdAt": "2024-01-01T00:00:00Z"
}
```

### List Payments (Admin)
```http
GET /payments?skip=0&take=10
Authorization: Bearer <token>

Response 200:
[
  { payment objects }
]
```

---

## User Endpoints

### Get User Profile
```http
GET /users/{id}

Response 200:
{
  "id": "uuid",
  "email": "user@example.com",
  "firstName": "John",
  "lastName": "Doe",
  "phone": "+1234567890",
  "avatar": "url",
  "isAdmin": false,
  "createdAt": "2024-01-01T00:00:00Z"
}
```

### Update User Profile
```http
PUT /users/{id}
Authorization: Bearer <token>
Content-Type: application/json

{
  "firstName": "John",
  "lastName": "Updated",
  "phone": "+1234567890",
  "avatar": "url"
}

Response 200:
{ updated user object }
```

---

## Admin Endpoints

### List All Orders (Admin)
```http
GET /admin/orders?skip=0&take=10
Authorization: Bearer <token>

Response 200:
[
  { order objects with user details }
]
```

### Get Order Statistics (Admin)
```http
GET /admin/orders/stats
Authorization: Bearer <token>

Response 200:
{
  "totalOrders": 150,
  "totalRevenue": 15000.00,
  "pendingOrders": 10,
  "completedOrders": 120
}
```

### List All Products (Admin)
```http
GET /admin/products?skip=0&take=10
Authorization: Bearer <token>

Response 200:
[
  { all product objects including inactive }
]
```

---

## Error Responses

### 400 Bad Request
```json
{
  "statusCode": 400,
  "message": "Invalid request parameters",
  "error": "Bad Request"
}
```

### 401 Unauthorized
```json
{
  "statusCode": 401,
  "message": "Invalid credentials",
  "error": "Unauthorized"
}
```

### 403 Forbidden
```json
{
  "statusCode": 403,
  "message": "Access denied",
  "error": "Forbidden"
}
```

### 404 Not Found
```json
{
  "statusCode": 404,
  "message": "Resource not found",
  "error": "Not Found"
}
```

### 500 Internal Server Error
```json
{
  "statusCode": 500,
  "message": "Internal server error",
  "error": "Internal Server Error"
}
```

---

## Status Codes

- `200` - OK
- `201` - Created
- `400` - Bad Request
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not Found
- `500` - Internal Server Error

---

## Rate Limiting

(To be implemented)

## CORS

CORS is enabled for `FRONTEND_URL` environment variable.

## Pagination

Use `skip` and `take` query parameters:
- `skip`: Number of items to skip (default: 0)
- `take`: Max number of items to return (default: 10)

---

## Webhook Events (Paystack)

Paystack sends webhooks for payment events:
- `charge.success` - Payment successful
- `charge.failed` - Payment failed

Configure webhook URL in Paystack dashboard.
