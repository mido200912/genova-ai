# 🏥 Genova AI - Project Summary & Architecture

## 📝 Executive Summary

**Genova AI** is a production-ready MVP web application that provides AI-powered pre-diagnostic health insights. The system analyzes user-reported symptoms using advanced AI (LLaMA-3-8B) and returns structured health information including possible conditions, recommended specialists, suggested tests, and emergency detection.

### ⚠️ Key Compliance Points:
- ✅ Does NOT diagnose diseases
- ✅ Does NOT prescribe medications  
- ✅ Includes medical disclaimer on all pages
- ✅ For educational purposes only
- ✅ Encourages professional medical consultation

---

## 🏗️ System Architecture

```
┌─────────────────────────────────────────────────────────┐
│                     CLIENT LAYER                         │
│  ┌─────────────────────────────────────────────────┐   │
│  │          React Frontend (Port 3000)              │   │
│  │  • React Router for navigation                   │   │
│  │  • Context API for state management              │   │
│  │  • Axios for API communication                   │   │
│  │  • Dark/Light theme support                      │   │
│  └─────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────┘
                           │
                  HTTP/HTTPS (REST API)
                           │
                           ▼
┌─────────────────────────────────────────────────────────┐
│                    API GATEWAY LAYER                     │
│  ┌─────────────────────────────────────────────────┐   │
│  │       Express Server (Port 5000)                 │   │
│  │  • CORS configuration                            │   │
│  │  • Rate limiting (100 req/15min)                 │   │
│  │  • Helmet security headers                       │   │
│  │  • JWT authentication middleware                 │   │
│  └─────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────┘
                           │
              ┌────────────┴────────────┐
              ▼                         ▼
┌──────────────────────────┐  ┌──────────────────────────┐
│    BUSINESS LOGIC        │  │    AI SERVICE LAYER      │
│                          │  │                          │
│  • Auth Controller       │  │  • OpenRouter Service    │
│  • Analysis Controller   │  │  • LLaMA-3-8B Model      │
│  • History Controller    │  │  • JSON Response Parser  │
│                          │  │  • Emergency Detector    │
└──────────────────────────┘  └──────────────────────────┘
              │
              ▼
┌─────────────────────────────────────────────────────────┐
│                   DATA LAYER                             │
│  ┌─────────────────────────────────────────────────┐   │
│  │            MongoDB Database                      │   │
│  │  • Users Collection                              │   │
│  │  • HealthAnalyses Collection                     │   │
│  │  • Indexed queries                               │   │
│  └─────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────┘
```

---

## 🗂️ Database Schema

### Users Collection
```javascript
{
  _id: ObjectId,
  name: String (required, 2-50 chars),
  email: String (required, unique, validated),
  password: String (hashed, bcrypt 10 rounds),
  age: Number (1-150, optional),
  gender: String (enum: male/female/other/prefer-not-to-say),
  createdAt: Date,
  lastLogin: Date,
  timestamps: true
}
```

### HealthAnalyses Collection
```javascript
{
  _id: ObjectId,
  userId: ObjectId (ref: User, indexed),
  userInput: String (required, max 2000 chars),
  aiResponse: {
    analysis_summary: String,
    possible_conditions: [{
      condition: String,
      risk_level: String (Low/Medium/High),
      reason: String
    }],
    recommended_specialist: String,
    suggested_tests: [String],
    emergency_flag: Boolean,
    disclaimer: String
  },
  metadata: {
    processingTime: Number (ms),
    modelUsed: String,
    analyzed: Boolean
  },
  createdAt: Date,
  timestamps: true,
  indexes: [userId + createdAt]
}
```

---

## 🔐 Security Implementation

### Authentication Flow
```
1. User registers → Password hashed with bcrypt (10 rounds)
2. User logs in → Credentials verified
3. Server generates JWT token (expires in 7 days)
4. Client stores token in localStorage
5. Token sent in Authorization header for protected routes
6. Middleware verifies token on each request
7. User object attached to request if valid
```

### Security Features
- **Password Security:** bcrypt hashing with salt rounds
- **JWT Tokens:** Signed with secret key, 7-day expiration
- **Rate Limiting:** 100 requests per 15 minutes per IP
- **Helmet:** Security headers (XSS, content sniffing, etc.)
- **CORS:** Configured origin whitelist
- **Input Validation:** express-validator on all inputs
- **Environment Variables:** Sensitive data in .env
- **SQL Injection Protection:** MongoDB native protection
- **XSS Protection:** React auto-escaping

---

## 🤖 AI Integration Architecture

### OpenRouter Service Flow
```
1. Receive symptom description from user
2. Construct system prompt with:
   - Medical guidelines (no diagnosis/prescription)
   - JSON structure requirements
   - Emergency detection criteria
3. Send to OpenRouter API with:
   - Model: meta-llama/llama-3-8b-instruct:free
   - Temperature: 0.7
   - Max tokens: 1000
   - Response format: JSON
4. Parse JSON response
5. Validate required fields
6. Ensure proper data types
7. Return structured analysis
8. Save to database
```

### AI Response Validation
```javascript
Required Fields Checked:
✓ analysis_summary (string)
✓ possible_conditions (array)
✓ recommended_specialist (string)
✓ suggested_tests (array)
✓ emergency_flag (boolean)
✓ disclaimer (string)
```

---

## 📊 API Endpoints Overview

### Public Endpoints
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login

### Protected Endpoints (Require JWT)
- `GET /api/auth/me` - Get current user profile
- `POST /api/analysis` - Analyze symptoms
- `GET /api/analysis/:id` - Get single analysis
- `GET /api/history` - Get analysis history (paginated)
- `GET /api/history/stats` - Get user statistics
- `DELETE /api/history/:id` - Delete analysis

### Health Check
- `GET /api/health` - Server status check

---

## 🎨 Frontend Architecture

### Component Hierarchy
```
App.js (Router + Context Providers)
├── ThemeProvider (Dark/Light mode)
├── AuthProvider (User authentication state)
└── Routes
    ├── Navbar (Always visible)
    ├── Home (Landing page)
    ├── Login (Public)
    ├── Register (Public)
    ├── ProtectedRoute
    │   ├── Dashboard (User stats + recent analyses)
    │   └── Analysis (Symptom input + AI results)
    └── 404 (Not found)
```

### State Management
- **AuthContext:** User state, login, logout, registration
- **ThemeContext:** Dark/light mode toggle
- **Local Storage:** JWT token, user data, theme preference

### API Service Layer
```javascript
api.js
├── axios instance with:
│   ├── Base URL configuration
│   ├── Request interceptor (add JWT token)
│   ├── Response interceptor (handle 401 errors)
│   └── 30s timeout
├── authAPI (register, login, getProfile)
├── analysisAPI (analyzeSymptoms, getAnalysisById)
└── historyAPI (getHistory, getStats, deleteAnalysis)
```

---

## 🎯 Key Features Implementation

### 1. Authentication System
- User registration with validation
- Secure login with JWT
- Password hashing with bcrypt
- Protected routes
- Auto-redirect on token expiry
- Persistent sessions

### 2. AI Symptom Analysis
- Natural language symptom input
- AI-powered analysis via OpenRouter
- Structured JSON response
- Emergency detection flag
- Risk level classification (Low/Medium/High)
- Specialist recommendations
- Suggested medical tests

### 3. Dashboard
- Total analyses count
- Emergency flags count
- Recent analyses history
- Quick action buttons
- Statistics overview

### 4. User Experience
- Dark/Light mode toggle
- Responsive design (mobile/tablet/desktop)
- Loading states
- Error handling
- Success/error notifications
- Medical disclaimer banner
- Smooth animations

---

## 🚀 Performance Optimizations

### Backend
- Database indexing on userId + createdAt
- Connection pooling (MongoDB native)
- Efficient query patterns
- Rate limiting to prevent abuse
- Request timeout (30s)

### Frontend
- Code splitting (React lazy loading potential)
- Optimized re-renders with Context API
- Cached user data in localStorage
- Debounced form inputs
- Lazy-loaded images

---

## 📈 Scalability Considerations

### Current MVP Scale
- **Users:** Up to 10,000 users
- **Requests:** 100 req/15min per user
- **Database:** MongoDB single instance

### Future Scalability Path
1. **Horizontal Scaling:**
   - Load balancer (Nginx/AWS ALB)
   - Multiple backend instances
   - MongoDB replica set

2. **Caching Layer:**
   - Redis for session storage
   - API response caching

3. **CDN:**
   - Static asset delivery
   - Frontend hosting on Vercel/Netlify

4. **Database Optimization:**
   - Sharding for large datasets
   - Read replicas

---

## 🧪 Testing Strategy

### Backend Testing
- Unit tests for controllers
- Integration tests for API endpoints
- Middleware tests
- Database model tests

### Frontend Testing
- Component unit tests (Jest)
- Integration tests (React Testing Library)
- E2E tests (Cypress/Playwright)

### Security Testing
- Penetration testing
- Dependency vulnerability scans
- OWASP Top 10 compliance

---

## 📦 Deployment Architecture

### Recommended Production Setup

```
┌─────────────────────────────────────────┐
│          CloudFlare CDN                  │
│       (SSL, DDoS Protection)             │
└─────────────────────────────────────────┘
                  │
                  ▼
┌─────────────────────────────────────────┐
│      Frontend (Vercel/Netlify)          │
│      • React Production Build            │
│      • Static asset serving              │
└─────────────────────────────────────────┘
                  │
                  ▼ (API Calls)
┌─────────────────────────────────────────┐
│    Backend (Heroku/Railway/AWS)         │
│    • Node.js Express Server              │
│    • Environment variables               │
│    • Auto-scaling enabled                │
└─────────────────────────────────────────┘
                  │
       ┌──────────┴──────────┐
       ▼                     ▼
┌────────────────┐  ┌────────────────┐
│  MongoDB Atlas │  │  OpenRouter AI │
│  (Database)    │  │  (AI Service)  │
└────────────────┘  └────────────────┘
```

---

## 🔧 Environment Variables

### Backend (.env)
```env
PORT=5000
MONGODB_URI=mongodb://...
JWT_SECRET=your_secret_key
OPENROUTER_API_KEY=sk-or-v1-...
NODE_ENV=production
FRONTEND_URL=https://your-domain.com
```

### Frontend (.env)
```env
REACT_APP_API_URL=https://api.your-domain.com/api
```

---

## 📊 Monitoring & Logging

### Recommended Tools
- **Backend Monitoring:** PM2, New Relic, DataDog
- **Error Tracking:** Sentry
- **Logs:** Winston + CloudWatch
- **Uptime:** UptimeRobot, Pingdom
- **Analytics:** Google Analytics, Mixpanel

---

## 🎓 Learning Outcomes

This project demonstrates:
- ✅ Full-stack MERN development
- ✅ RESTful API design
- ✅ JWT authentication implementation
- ✅ AI/ML integration (OpenRouter)
- ✅ Database design and modeling
- ✅ Security best practices
- ✅ Clean code architecture
- ✅ Modern React patterns
- ✅ State management
- ✅ Responsive design
- ✅ Error handling
- ✅ Production-ready code

---

## 🚨 Important Disclaimers

### Medical Disclaimer
This application is strictly for educational purposes and must not be used as:
- A medical diagnostic tool
- A prescription device
- A replacement for professional medical advice

### Liability
The developers and operators of this system assume no liability for:
- Medical decisions made based on system output
- Accuracy of AI-generated responses
- Health outcomes resulting from system use

Users must always consult qualified healthcare professionals for medical concerns.

---

## 📚 Technology Stack Summary

| Layer | Technology | Purpose |
|-------|-----------|---------|
| **Frontend** | React 18 | UI framework |
| **Routing** | React Router v6 | Navigation |
| **Styling** | Vanilla CSS | Custom design system |
| **State** | Context API | Global state |
| **HTTP** | Axios | API client |
| **Backend** | Express.js | Web server |
| **Runtime** | Node.js 16+ | JavaScript runtime |
| **Database** | MongoDB | NoSQL database |
| **ODM** | Mongoose | MongoDB object modeling |
| **Auth** | JWT | Token-based auth |
| **Security** | bcrypt, helmet | Password hashing, headers |
| **Validation** | express-validator | Input validation |
| **AI** | OpenRouter | AI API gateway |
| **Model** | LLaMA-3-8B | Language model |

---

## 📈 Future Enhancements

### Phase 2 Features
- [ ] User profile editing
- [ ] Email verification
- [ ] Password reset flow
- [ ] Export analysis as PDF
- [ ] Share analysis with doctor
- [ ] Multi-language support
- [ ] Voice input for symptoms
- [ ] Image upload (rashes, injuries)

### Phase 3 Features
- [ ] Telemedicine integration
- [ ] Appointment booking
- [ ] Health tracking dashboard
- [ ] Medication reminders
- [ ] Family member profiles
- [ ] Health insurance integration

---

## 👨‍💻 Code Quality Standards

- **ESLint:** No errors in production
- **Code Style:** Consistent formatting
- **Comments:** Clear and concise
- **Naming:** Descriptive variable/function names
- **Modularity:** Single responsibility principle
- **DRY:** Don't repeat yourself
- **Error Handling:** Comprehensive try-catch blocks
- **Validation:** All user inputs validated

---

## 📞 Support & Maintenance

### Regular Maintenance Tasks
- Update dependencies monthly
- Security patch monitoring
- Database backup verification
- Log review and cleanup
- Performance monitoring
- API rate limit adjustment

---

**Built with ❤️ for educational purposes**
**Version 1.0.0 | February 2026**
