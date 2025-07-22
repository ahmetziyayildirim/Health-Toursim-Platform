# Health Tourism Platform - Backend API

A comprehensive backend API for the Health Tourism Platform, built with Node.js, Express, and MongoDB.

## 🚀 Features

- **Authentication & Authorization**: JWT-based auth with role-based access control
- **Health Tourism Packages**: CRUD operations for tourism packages
- **Booking System**: Complete reservation and booking management
- **AI Chat Integration**: OpenAI-powered chat assistant
- **Payment Processing**: Stripe integration for secure payments
- **Email Notifications**: Automated email system
- **File Upload**: Secure file handling with Multer
- **Rate Limiting**: Protection against abuse
- **Security**: Helmet, CORS, and input validation

## 📁 Project Structure

```
backend/
├── src/
│   ├── controllers/     # Request handlers
│   ├── models/         # Database models
│   ├── routes/         # API routes
│   ├── middleware/     # Custom middleware
│   ├── services/       # Business logic
│   ├── utils/          # Helper functions
│   ├── config/         # Configuration files
│   └── server.js       # Main server file
├── database/
│   ├── migrations/     # Database migrations
│   └── seeds/          # Test data
├── docs/              # Documentation
├── package.json
├── .env               # Environment variables
└── README.md
```

## 🛠️ Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd health-tourism-platform/backend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   Copy `.env.example` to `.env` and configure:
   ```bash
   cp .env.example .env
   ```

4. **Configure MongoDB**
   - Install MongoDB locally or use MongoDB Atlas
   - Update `MONGODB_URI` in `.env`

5. **Start the server**
   ```bash
   # Development mode
   npm run dev
   
   # Production mode
   npm start
   ```

## 🔧 Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `NODE_ENV` | Environment mode | development |
| `PORT` | Server port | 5000 |
| `MONGODB_URI` | MongoDB connection string | mongodb://localhost:27017/health-tourism |
| `JWT_SECRET` | JWT signing secret | - |
| `JWT_EXPIRE` | JWT expiration time | 7d |
| `OPENAI_API_KEY` | OpenAI API key for chat | - |
| `STRIPE_SECRET_KEY` | Stripe secret key | - |
| `EMAIL_HOST` | SMTP host | smtp.gmail.com |
| `EMAIL_USER` | SMTP username | - |
| `EMAIL_PASS` | SMTP password | - |

## 📚 API Endpoints

### Health Check
- `GET /health` - Server health status
- `GET /api` - API information

### Authentication (Coming Soon)
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout
- `GET /api/auth/me` - Get current user

### Packages (Coming Soon)
- `GET /api/packages` - Get all packages
- `GET /api/packages/:id` - Get package by ID
- `POST /api/packages` - Create package (Admin)
- `PUT /api/packages/:id` - Update package (Admin)
- `DELETE /api/packages/:id` - Delete package (Admin)

### Bookings (Coming Soon)
- `GET /api/bookings` - Get user bookings
- `POST /api/bookings` - Create booking
- `GET /api/bookings/:id` - Get booking details
- `PUT /api/bookings/:id` - Update booking
- `DELETE /api/bookings/:id` - Cancel booking

### Chat (Coming Soon)
- `POST /api/chat` - Send message to AI
- `GET /api/chat/history` - Get chat history

## 🧪 Testing

```bash
# Run tests
npm test

# Run tests with coverage
npm run test:coverage
```

## 🚀 Deployment

### Using Docker
```bash
# Build image
docker build -t health-tourism-backend .

# Run container
docker run -p 5000:5000 --env-file .env health-tourism-backend
```

### Using PM2
```bash
# Install PM2
npm install -g pm2

# Start application
pm2 start src/server.js --name "health-tourism-api"

# Monitor
pm2 monit
```

## 📝 Development

### Adding New Routes
1. Create controller in `src/controllers/`
2. Create route file in `src/routes/`
3. Add route to `src/server.js`

### Database Models
Models are defined in `src/models/` using Mongoose schemas.

### Middleware
Custom middleware is located in `src/middleware/`.

## 🔒 Security Features

- **Helmet**: Security headers
- **CORS**: Cross-origin resource sharing
- **Rate Limiting**: Request rate limiting
- **JWT**: Secure authentication
- **Input Validation**: Request validation
- **Password Hashing**: bcrypt encryption

## 📊 Monitoring

- Health check endpoint: `/health`
- Request logging
- Error tracking
- Performance monitoring

## 🤝 Contributing

1. Fork the repository
2. Create feature branch
3. Commit changes
4. Push to branch
5. Create Pull Request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

For support, email support@healthjourney.com or create an issue.
