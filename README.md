# MaySecret E-commerce Website

A complete e-commerce checkout system built with React, Node.js, Express, and MongoDB. Features user authentication, shopping cart, multi-step checkout, and UPI payment integration.

## 🚀 Features

### Frontend (React + TypeScript)
- **User Authentication**: Login/Register with JWT tokens
- **Shopping Cart**: Add, remove, and update product quantities
- **Multi-step Checkout**: Address selection → Payment → Order confirmation
- **UPI Payment Integration**: Generate UPI deep links for payment
- **Responsive Design**: Mobile-first design with Tailwind CSS
- **Modern UI/UX**: Smooth animations with Framer Motion

### Backend (Node.js + Express)
- **RESTful API**: Complete CRUD operations for all entities
- **JWT Authentication**: Secure user sessions
- **MongoDB Integration**: Mongoose ODM with proper schemas
- **Password Hashing**: Bcrypt for secure password storage
- **CORS Enabled**: Cross-origin resource sharing

### Database (MongoDB)
- **User Management**: Authentication and profile data
- **Product Catalog**: Product information and inventory
- **Shopping Cart**: User-specific cart management
- **Order Management**: Complete order lifecycle
- **Address Management**: Multiple delivery addresses per user

## 🛠️ Tech Stack

- **Frontend**: React 19, TypeScript, Tailwind CSS, Framer Motion
- **Backend**: Node.js, Express.js, MongoDB, Mongoose
- **Authentication**: JWT, Bcrypt
- **Payment**: UPI deep link integration
- **Development**: Nodemon, ESLint

## 📋 Prerequisites

- Node.js (v16 or higher)
- MongoDB (local installation or MongoDB Atlas)
- npm or yarn package manager

## 🚀 Installation & Setup

### 1. Clone the Repository
```bash
git clone <repository-url>
cd maysecret
```

### 2. Backend Setup
```bash
cd backend

# Install dependencies
npm install

# Create .env file
echo "MONGODB_URI=mongodb://localhost:27017/maysecret" > .env
echo "JWT_SECRET=your_super_secret_jwt_key_here_change_in_production" >> .env
echo "PORT=5000" >> .env

# Start MongoDB (if running locally)
# Make sure MongoDB is running on your system

# Seed the database with products
npm run seed

# Start the development server
npm run dev
```

### 3. Frontend Setup
```bash
# From the root directory
npm install

# Start the development server
npm start
```

### 4. Access the Application
- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:5000
- **API Health Check**: http://localhost:5000/api/health

## 🗄️ Database Schema

### User
```javascript
{
  name: String,
  email: String (unique),
  password: String (hashed),
  addresses: [Address],
  createdAt: Date
}
```

### Product
```javascript
{
  name: String,
  price: Number,
  image: String,
  description: String,
  category: String,
  inStock: Boolean,
  stock: Number,
  rating: Number,
  reviews: Number
}
```

### Cart
```javascript
{
  userId: ObjectId (ref: User),
  products: [{
    product: ObjectId (ref: Product),
    quantity: Number
  }]
}
```

### Order
```javascript
{
  userId: ObjectId (ref: User),
  products: [{
    product: ObjectId (ref: Product),
    quantity: Number,
    price: Number
  }],
  totalAmount: Number,
  address: Address,
  paymentStatus: String (Pending/Paid/Failed),
  orderStatus: String (Processing/Shipped/Delivered)
}
```

## 🔐 API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/profile` - Get user profile
- `POST /api/auth/address` - Add new address
- `GET /api/auth/addresses` - Get user addresses

### Products
- `GET /api/products` - Get all products
- `GET /api/products/:id` - Get product by ID
- `GET /api/products/search/:query` - Search products
- `GET /api/products/category/:category` - Get products by category

### Cart
- `GET /api/cart` - Get user cart
- `POST /api/cart/add` - Add product to cart
- `PUT /api/cart/update/:productId` - Update cart item quantity
- `DELETE /api/cart/remove/:productId` - Remove item from cart
- `DELETE /api/cart/clear` - Clear cart

### Orders
- `POST /api/orders` - Create new order
- `GET /api/orders` - Get user orders
- `GET /api/orders/:id` - Get order by ID
- `PATCH /api/orders/:id/payment-status` - Update payment status
- `PATCH /api/orders/:id/cancel` - Cancel order

### Payment
- `POST /api/payment/upi-link` - Generate UPI payment link
- `POST /api/payment/verify-payment` - Verify payment
- `GET /api/payment/status/:orderId` - Get payment status
- `POST /api/payment/mock-success` - Mock payment success (testing)

## 💳 UPI Payment Integration

The system generates UPI deep links in the format:
```
upi://pay?pa=myshop@upi&pn=MaySecret&mc=1234&tid=txn123456&tr=order123&am=<amount>&cu=INR
```

**UPI Details:**
- **Bank**: SBI Bank
- **Account**: 123456678
- **UPI ID**: myshop@upi
- **Merchant Code**: 1234

## 🔧 Development Scripts

### Backend
```bash
npm run dev          # Start development server with nodemon
npm run seed         # Seed database with sample products
npm start            # Start production server
```

### Frontend
```bash
npm start            # Start development server
npm run build        # Build for production
npm test             # Run tests
```

## 🌐 Environment Variables

### Backend (.env)
```env
MONGODB_URI=mongodb://localhost:27017/maysecret
JWT_SECRET=your_super_secret_jwt_key_here_change_in_production
PORT=5000
```

## 📱 User Flow

1. **Browse Products**: Users can view products on the home page
2. **Add to Cart**: Click "Add to Cart" to add products
3. **Authentication**: Login/Register required for checkout
4. **Cart Management**: Review and modify cart items
5. **Checkout Process**:
   - Step 1: Select or add delivery address
   - Step 2: Choose payment method (UPI)
   - Step 3: Confirm order details
   - Step 4: Complete payment
6. **Order Confirmation**: View order summary and status

## 🧪 Testing

### Mock Payment
For testing purposes, the system includes a mock payment success endpoint:
- Use "Simulate Payment Success" button during checkout
- This bypasses actual UPI payment for development

### Sample Data
The database is seeded with sample products:
- Brightening Serum
- Sunscreen Spray
- Hydrating Moisturizer

## 🚀 Deployment

### Backend Deployment
1. Set production environment variables
2. Use PM2 or similar process manager
3. Configure MongoDB Atlas for production
4. Set up proper JWT secrets

### Frontend Deployment
1. Build the production bundle: `npm run build`
2. Deploy to Vercel, Netlify, or similar
3. Update API base URL for production

## 🔒 Security Features

- **JWT Authentication**: Secure user sessions
- **Password Hashing**: Bcrypt with salt rounds
- **Protected Routes**: Authentication middleware for sensitive endpoints
- **Input Validation**: Server-side validation for all inputs
- **CORS Configuration**: Proper cross-origin settings

## 📞 Support

For support or questions:
- **Email**: support@maysecret.com
- **Phone**: +91 9579365540

## 📄 License

This project is licensed under the ISC License.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

---

**Note**: This is a development version. For production use, ensure proper security measures, environment variables, and database configurations are in place.
