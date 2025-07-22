# Health Tourism Platform

A comprehensive health tourism platform built with React, Node.js, Express, and MongoDB. This platform connects patients with medical facilities in Turkey, offering complete health tourism packages including medical treatments, accommodation, and travel arrangements.

## 🌟 Features

### For Patients
- **Browse Medical Packages**: Explore various health tourism packages with detailed information
- **Advanced Search & Filtering**: Find packages by category, location, price, and experience type
- **Booking Management**: Complete booking system with status tracking
- **User Dashboard**: Manage personal information, view booking history
- **Review System**: Rate and review completed packages

### For Administrators
- **Admin Dashboard**: Comprehensive overview with statistics and analytics
- **User Management**: Manage patient accounts and admin users
- **Package Management**: Create, edit, and manage health tourism packages
- **Booking Management**: Monitor and update booking statuses
- **Content Management**: Manage reviews, communications, and system content

### Medical Package Categories
- Wellness & Spa
- Medical Treatment
- Dental Care
- Aesthetic Surgery
- Health Checkup
- Rehabilitation
- Fertility Treatment
- Eye Surgery
- Hair Transplant
- Weight Loss Surgery

## 🏗️ Architecture

### Frontend (React + Vite)
- **Framework**: React 18 with Vite for fast development
- **Styling**: Tailwind CSS for responsive design
- **State Management**: Context API and local state
- **Routing**: React Router for navigation
- **HTTP Client**: Axios for API communications

### Backend (Node.js + Express)
- **Runtime**: Node.js with Express.js framework
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT-based authentication system
- **Security**: CORS, Helmet, Rate limiting
- **File Upload**: Support for document and image uploads

### Database Schema
- **Users**: Patient and admin user management
- **Packages**: Health tourism package definitions
- **Bookings**: Complete booking lifecycle management
- **Reviews**: User feedback and rating system

## 🚀 Live Demo

- **Frontend**: [https://health-tourism-frontend.onrender.com](https://health-tourism-frontend.onrender.com)
- **Backend API**: [https://health-tourism-backend.onrender.com](https://health-tourism-backend.onrender.com)

### Demo Credentials
- **Admin Login**: 
  - Email: `admin@healthjourney.com`
  - Password: `admin123`

## 🛠️ Installation & Setup

### Prerequisites
- Node.js (v18 or higher)
- MongoDB Atlas account or local MongoDB installation
- Git

### Clone Repository
```bash
git clone https://github.com/ahmetziyayildirim/Health-Toursim-Platform.git
cd Health-Toursim-Platform
```

### Backend Setup
```bash
cd backend
npm install

# Create .env file
cp .env.example .env
# Edit .env file with your MongoDB URI and other configurations

# Start development server
npm run dev
```

### Frontend Setup
```bash
cd frontend
npm install

# Start development server
npm run dev
```

### Environment Variables

#### Backend (.env)
```env
# Database
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/health-tourism

# Server
NODE_ENV=development
PORT=5001

# JWT
JWT_SECRET=your-super-secret-jwt-key
JWT_EXPIRE=7d

# CORS
FRONTEND_URL=http://localhost:3000
ADMIN_URL=http://localhost:3000

# Optional integrations
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password

STRIPE_SECRET_KEY=sk_test_your-stripe-key
OPENAI_API_KEY=sk-your-openai-key
```

#### Frontend (.env)
```env
VITE_API_URL=http://localhost:5001
VITE_NODE_ENV=development
```

## 📁 Project Structure

```
Health Tourism Platform/
├── backend/                    # Backend API server
│   ├── src/
│   │   ├── config/            # Database and app configuration
│   │   ├── middleware/        # Express middleware (auth, error handling)
│   │   ├── models/            # MongoDB models (User, Package, Booking, Review)
│   │   ├── routes/            # API routes
│   │   ├── seeders/           # Database seeders for initial data
│   │   └── server.js          # Express server entry point
│   ├── package.json
│   └── .env.example
├── frontend/                   # React frontend application
│   ├── src/
│   │   ├── components/        # Reusable UI components
│   │   ├── pages/            # Page components
│   │   ├── services/         # API service functions
│   │   ├── utils/            # Utility functions
│   │   └── App.jsx           # Main App component
│   ├── public/               # Static assets
│   ├── package.json
│   └── .env.example
└── README.md
```

## 🔧 API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user
- `PUT /api/auth/profile` - Update user profile

### Packages
- `GET /api/packages` - Get all packages with filtering
- `GET /api/packages/:id` - Get package details
- `GET /api/packages/categories` - Get package categories

### Bookings
- `POST /api/bookings` - Create new booking
- `GET /api/bookings/my-bookings` - Get user's bookings
- `GET /api/bookings/:id` - Get booking details

### Admin Routes
- `GET /api/admin/dashboard` - Admin dashboard stats
- `GET /api/admin/users` - Manage users
- `GET /api/admin/bookings` - Manage all bookings
- `PUT /api/admin/bookings/:id/status` - Update booking status

## 🎨 Key Features Implementation

### Booking System
- Complete booking workflow with multiple statuses
- Payment integration ready (Stripe)
- Document upload and verification
- Email notifications system
- Travel date management with flexibility options

### Search & Filtering
- Advanced search by package title, location, category
- Price range filtering
- Experience type filtering (Wellness, Treatment-focused, etc.)
- Sorting by price, rating, popularity

### Admin Dashboard
- Real-time statistics and analytics
- User and booking management
- Package creation and editing
- Review moderation system

## 🔒 Security Features

- JWT-based authentication
- Password hashing with bcrypt
- CORS protection
- Rate limiting
- Input validation and sanitization
- Admin role-based access control

## 🚀 Deployment

### Render.com Deployment
Both frontend and backend are deployed on Render.com:

1. **Backend**: Deployed as a Node.js web service
2. **Frontend**: Deployed as a static site
3. **Database**: MongoDB Atlas for production database

### Deployment Configuration
- Automatic deployments from GitHub
- Environment variables configured in Render dashboard
- Custom build and start commands configured

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👨‍💻 Author

**Ahmet Ziya Yıldırım**
- GitHub: [@ahmetziyayildirim](https://github.com/ahmetziyayildirim)
- Email: ahmetziya@gmail.com

## 🙏 Acknowledgments

- Built with modern web technologies
- Designed for Turkish health tourism industry
- Focuses on user experience and medical tourism workflow
- Comprehensive admin panel for business management

---

*This platform aims to bridge the gap between international patients and Turkish medical facilities, providing a seamless health tourism experience.*