# 🚀 Genova AI - Complete Setup & Run Guide

## 📦 Project Structure

```
genova-ai/
├── backend/                      # Node.js + Express Backend
│   ├── src/
│   │   ├── config/
│   │   │   └── database.js      # MongoDB connection
│   │   ├── models/
│   │   │   ├── User.js          # User model with password hashing
│   │   │   └── HealthAnalysis.js # Health analysis model
│   │   ├── middleware/
│   │   │   └── authMiddleware.js # JWT authentication middleware
│   │   ├── controllers/
│   │   │   ├── authController.js      # Register/Login logic
│   │   │   ├── analysisController.js  # Symptom analysis logic
│   │   │   └── historyController.js   # History management
│   │   ├── routes/
│   │   │   ├── authRoutes.js    # Authentication endpoints
│   │   │   ├── analysisRoutes.js # Analysis endpoints
│   │   │   └── historyRoutes.js  # History endpoints
│   │   ├── services/
│   │   │   └── openRouterService.js # AI integration service
│   │   └── utils/
│   ├── server.js                # Express server entry point
│   ├── package.json
│   └── .env.example             # Environment variables template
│
├── frontend/                     # React Frontend
│   ├── public/
│   │   └── index.html
│   ├── src/
│   │   ├── components/
│   │   │   ├── Navbar.js        # Navigation bar
│   │   │   ├── Navbar.css
│   │   │   ├── MedicalDisclaimer.js # Disclaimer banner
│   │   │   ├── MedicalDisclaimer.css
│   │   │   └── ProtectedRoute.js # Route guard
│   │   ├── pages/
│   │   │   ├── Home.js          # Landing page
│   │   │   ├── Home.css
│   │   │   ├── Login.js         # Login page
│   │   │   ├── Register.js      # Registration page
│   │   │   ├── Auth.css         # Auth pages styles
│   │   │   ├── Dashboard.js     # User dashboard
│   │   │   ├── Dashboard.css
│   │   │   ├── Analysis.js      # Symptom analysis page
│   │   │   └── Analysis.css
│   │   ├── context/
│   │   │   ├── AuthContext.js   # Authentication state
│   │   │   └── ThemeContext.js  # Theme management
│   │   ├── services/
│   │   │   └── api.js           # Axios API configuration
│   │   ├── App.js               # Main app component
│   │   ├── index.js             # React entry point
│   │   └── index.css            # Global styles & design system
│   ├── package.json
│   └── .env.example
│
└── README.md                     # Project documentation
```

---

## ⚙️ STEP-BY-STEP SETUP

### 1️⃣ Prerequisites

Ensure you have the following installed:
- **Node.js** v16+ ([Download](https://nodejs.org/))
- **MongoDB** (local or [MongoDB Atlas](https://www.mongodb.com/cloud/atlas))
- **OpenRouter API Key** (get free at [https://openrouter.ai/](https://openrouter.ai/))

---

### 2️⃣ Backend Setup

```bash
# Navigate to backend directory
cd genova-ai/backend

# Install dependencies
npm install

# Create .env file
cp .env.example .env
```

**Edit `.env` file with your configuration:**

```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/genova-ai
JWT_SECRET=your_super_secret_jwt_key_minimum_32_characters_long
OPENROUTER_API_KEY=sk-or-v1-your-actual-openrouter-api-key-here
NODE_ENV=development
FRONTEND_URL=http://localhost:3000
```

**Important:** 
- Replace `OPENROUTER_API_KEY` with your actual API key from OpenRouter
- Change `JWT_SECRET` to a strong random string (minimum 32 characters)
- If using MongoDB Atlas, replace `MONGODB_URI` with your connection string

---

### 3️⃣ Frontend Setup

```bash
# Navigate to frontend directory (from project root)
cd frontend

# Install dependencies
npm install

# Create .env file
cp .env.example .env
```

**Edit `.env` file:**

```env
REACT_APP_API_URL=http://localhost:5000/api
```

---

### 4️⃣ Start MongoDB

**Option A: Local MongoDB**
```bash
# Windows
mongod

# macOS/Linux
sudo mongod
```

**Option B: MongoDB Atlas**
- Create free cluster at [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
- Get connection string and update `MONGODB_URI` in backend `.env`

---

### 5️⃣ Run the Application

**Terminal 1 - Start Backend:**
```bash
cd backend
npm run dev
```

You should see:
```
🚀 Genova AI Backend running on port 5000
📊 Environment: development
🔗 API Base URL: http://localhost:5000/api
✅ MongoDB Connected: localhost
```

**Terminal 2 - Start Frontend:**
```bash
cd frontend
npm start
```

Browser will automatically open at `http://localhost:3000`

---

## 🧪 Testing the Application

### 1. Create an Account
1. Go to `http://localhost:3000`
2. Click "Get Started Free"
3. Fill in registration form
4. Click "Create Account"

### 2. Test Symptom Analysis
1. Click "New Analysis" or navigate to Analysis page
2. Enter symptoms (example):
   ```
   I have been experiencing a persistent headache for 3 days, along with mild fever and body aches. The headache is worse in the morning and I feel extremely tired.
   ```
3. Click "Analyze Symptoms"
4. Wait for AI response (5-15 seconds)
5. Review structured results

### 3. View Dashboard
- Navigate to Dashboard to see:
  - Total analyses count
  - Emergency flags count
  - Recent analyses history

---

## 📋 API Endpoints Reference

### Authentication
```
POST /api/auth/register
Body: { name, email, password, age?, gender? }

POST /api/auth/login
Body: { email, password }

GET /api/auth/me
Headers: { Authorization: "Bearer <token>" }
```

### Analysis
```
POST /api/analysis
Headers: { Authorization: "Bearer <token>" }
Body: { symptoms: "string (10-2000 chars)" }

GET /api/analysis/:id
Headers: { Authorization: "Bearer <token>" }
```

### History
```
GET /api/history?limit=10&page=1
Headers: { Authorization: "Bearer <token>" }

GET /api/history/stats
Headers: { Authorization: "Bearer <token>" }

DELETE /api/history/:id
Headers: { Authorization: "Bearer <token>" }
```

---

## 🔑 Getting OpenRouter API Key

1. Go to [https://openrouter.ai/](https://openrouter.ai/)
2. Sign up / Login
3. Navigate to "Keys" section
4. Click "Create Key"
5. Copy the key (starts with `sk-or-v1-...`)
6. Paste into `.env` file as `OPENROUTER_API_KEY`

**The free model used:**
- `meta-llama/llama-3-8b-instruct:free`
- No credit card required
- Rate limits apply (check OpenRouter docs)

---

## 🎨 Features Implemented

✅ User Authentication (Register/Login)
✅ JWT Token-based Security
✅ Password Hashing (bcrypt)
✅ AI Symptom Analysis via OpenRouter
✅ Structured JSON Response
✅ Emergency Detection Flag
✅ Health Analysis History
✅ Dashboard with Statistics
✅ Dark/Light Mode Toggle
✅ Medical Disclaimer
✅ Responsive Design
✅ Input Validation
✅ Rate Limiting
✅ CORS Configuration
✅ Error Handling

---

## 🛡️ Security Features

- JWT authentication middleware
- Password hashing with bcrypt (10 rounds)
- Helmet security headers
- Rate limiting (100 requests per 15 min)
- CORS protection
- Input validation with express-validator
- Environment variable protection
- No sensitive data in responses

---

## 🚨 Troubleshooting

### Backend won't start
- Check MongoDB is running
- Verify `.env` file exists and has correct values
- Check port 5000 is not in use

### Frontend can't connect to backend
- Ensure backend is running on port 5000
- Check `REACT_APP_API_URL` in frontend `.env`
- Check CORS settings in backend

### AI analysis fails
- Verify `OPENROUTER_API_KEY` is correct
- Check OpenRouter API status
- Ensure symptoms are at least 10 characters
- Check backend console for error messages

### MongoDB connection fails
- Verify MongoDB service is running
- Check `MONGODB_URI` in `.env`
- For Atlas, check IP whitelist and credentials

---

## 📱 Responsive Design

The application is fully responsive:
- Desktop (1200px+)
- Tablet (768px - 1199px)
- Mobile (< 768px)

---

## 🎯 Production Deployment Checklist

Before deploying to production:

1. Change `JWT_SECRET` to a strong random string
2. Update environment variables for production
3. Set `NODE_ENV=production`
4. Use production MongoDB database
5. Configure proper CORS origins
6. Enable HTTPS
7. Set up logging service
8. Configure backup strategy for database
9. Set up monitoring (uptime, errors)
10. Review rate limiting settings

---

## 📞 Support

For issues or questions:
- Check troubleshooting section
- Review error messages in console
- Verify all environment variables
- Ensure all dependencies are installed

---

## 📄 License

MIT License - See LICENSE file for details

---

## ⚠️ Legal Disclaimer

This application is for **educational purposes only**. It does NOT:
- Diagnose diseases
- Prescribe medications
- Replace professional medical advice

Always consult qualified healthcare professionals for medical concerns.

---

**Built with ❤️ using React, Node.js, Express, MongoDB, and OpenRouter AI**
