# API Testing Guide - Genova AI

This guide provides example requests for testing the API using various tools.

---

## Base URL
```
http://localhost:5000/api
```

---

## 1. Authentication Endpoints

### Register New User

**POST** `/auth/register`

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "age": 30,
  "gender": "male"
}
```

**Response (Success):**
```json
{
  "success": true,
  "message": "User registered successfully",
  "data": {
    "user": {
      "id": "65abc123...",
      "name": "John Doe",
      "email": "john@example.com",
      "age": 30,
      "gender": "male"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

---

### Login

**POST** `/auth/login`

**Request Body:**
```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

**Response (Success):**
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "user": {
      "id": "65abc123...",
      "name": "John Doe",
      "email": "john@example.com",
      "age": 30,
      "gender": "male"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

---

### Get Current User Profile

**GET** `/auth/me`

**Headers:**
```
Authorization: Bearer <your_jwt_token>
```

**Response (Success):**
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "65abc123...",
      "name": "John Doe",
      "email": "john@example.com",
      "age": 30,
      "gender": "male",
      "createdAt": "2026-02-18T00:00:00.000Z",
      "lastLogin": "2026-02-18T00:46:00.000Z"
    }
  }
}
```

---

## 2. Analysis Endpoints

### Analyze Symptoms

**POST** `/analysis`

**Headers:**
```
Authorization: Bearer <your_jwt_token>
Content-Type: application/json
```

**Request Body:**
```json
{
  "symptoms": "I have been experiencing a persistent headache for 3 days, along with mild fever and body aches. The headache is worse in the morning and I feel extremely tired."
}
```

**Response (Success):**
```json
{
  "success": true,
  "message": "Analysis completed successfully",
  "data": {
    "analysisId": "65abc456...",
    "result": {
      "analysis_summary": "Based on the symptoms described, you appear to be experiencing a combination of headache, fever, and body aches...",
      "possible_conditions": [
        {
          "condition": "Viral Infection (Common Cold/Flu)",
          "risk_level": "Medium",
          "reason": "The combination of fever, headache, and body aches is commonly associated with viral infections."
        },
        {
          "condition": "Tension Headache",
          "risk_level": "Low",
          "reason": "Persistent headaches that worsen in the morning can be tension-related."
        }
      ],
      "recommended_specialist": "General Practitioner or Family Medicine Doctor",
      "suggested_tests": [
        "Complete Blood Count (CBC)",
        "C-Reactive Protein (CRP) test",
        "Temperature monitoring"
      ],
      "emergency_flag": false,
      "disclaimer": "This result is for educational purposes only and is not a medical diagnosis. Always consult a qualified healthcare professional for medical advice."
    },
    "processingTime": "8453ms",
    "createdAt": "2026-02-18T00:46:08.000Z"
  }
}
```

---

### Get Single Analysis by ID

**GET** `/analysis/:id`

**Headers:**
```
Authorization: Bearer <your_jwt_token>
```

**Example:**
```
GET /analysis/65abc456...
```

**Response (Success):**
```json
{
  "success": true,
  "data": {
    "_id": "65abc456...",
    "userId": "65abc123...",
    "userInput": "I have been experiencing...",
    "aiResponse": {
      "analysis_summary": "...",
      "possible_conditions": [...],
      "recommended_specialist": "...",
      "suggested_tests": [...],
      "emergency_flag": false,
      "disclaimer": "..."
    },
    "metadata": {
      "processingTime": 8453,
      "modelUsed": "meta-llama/llama-3-8b-instruct:free",
      "analyzed": true
    },
    "createdAt": "2026-02-18T00:46:08.000Z"
  }
}
```

---

## 3. History Endpoints

### Get Analysis History

**GET** `/history?limit=10&page=1&sortBy=createdAt&order=desc`

**Headers:**
```
Authorization: Bearer <your_jwt_token>
```

**Query Parameters:**
- `limit` (optional, default: 10) - Number of items per page
- `page` (optional, default: 1) - Page number
- `sortBy` (optional, default: createdAt) - Field to sort by
- `order` (optional, default: desc) - Sort order (asc/desc)

**Response (Success):**
```json
{
  "success": true,
  "data": {
    "analyses": [
      {
        "_id": "65abc456...",
        "userId": "65abc123...",
        "userInput": "...",
        "aiResponse": {...},
        "createdAt": "2026-02-18T00:46:08.000Z"
      }
    ],
    "pagination": {
      "currentPage": 1,
      "totalPages": 3,
      "totalItems": 25,
      "itemsPerPage": 10,
      "hasNextPage": true,
      "hasPrevPage": false
    }
  }
}
```

---

### Get History Statistics

**GET** `/history/stats`

**Headers:**
```
Authorization: Bearer <your_jwt_token>
```

**Response (Success):**
```json
{
  "success": true,
  "data": {
    "totalAnalyses": 25,
    "emergencyCount": 2,
    "recentAnalyses": [
      {
        "_id": "65abc456...",
        "createdAt": "2026-02-18T00:46:08.000Z",
        "aiResponse": {
          "analysis_summary": "...",
          "emergency_flag": false
        }
      }
    ]
  }
}
```

---

### Delete Analysis

**DELETE** `/history/:id`

**Headers:**
```
Authorization: Bearer <your_jwt_token>
```

**Example:**
```
DELETE /history/65abc456...
```

**Response (Success):**
```json
{
  "success": true,
  "message": "Analysis deleted successfully"
}
```

---

## Testing with cURL

### Register User
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "password": "password123",
    "age": 30,
    "gender": "male"
  }'
```

### Login
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "password123"
  }'
```

### Analyze Symptoms
```bash
curl -X POST http://localhost:5000/api/analysis \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -d '{
    "symptoms": "I have been experiencing a persistent headache for 3 days, along with mild fever and body aches."
  }'
```

### Get History
```bash
curl -X GET "http://localhost:5000/api/history?limit=5&page=1" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

---

## Testing with Postman

1. Import these endpoints into Postman
2. Create an environment variable called `token`
3. After login/register, save the token:
   ```javascript
   // In Tests tab of login/register request:
   pm.environment.set("token", pm.response.json().data.token);
   ```
4. Use `{{token}}` in Authorization header for protected routes

---

## Common Error Responses

### 400 Bad Request
```json
{
  "success": false,
  "message": "Validation failed",
  "errors": [
    {
      "field": "email",
      "message": "Please provide a valid email"
    }
  ]
}
```

### 401 Unauthorized
```json
{
  "success": false,
  "message": "Access denied. No token provided."
}
```

### 404 Not Found
```json
{
  "success": false,
  "message": "Analysis not found"
}
```

### 500 Internal Server Error
```json
{
  "success": false,
  "message": "Failed to analyze symptoms",
  "error": "AI Service Error: Rate limit exceeded"
}
```

---

## Rate Limiting

- **Limit:** 100 requests per 15 minutes per IP
- **Response when exceeded:**
```json
{
  "success": false,
  "message": "Too many requests from this IP, please try again later."
}
```

---

## Emergency Flag Detection

The AI will set `emergency_flag: true` for symptoms like:
- Severe chest pain
- Difficulty breathing
- Severe bleeding
- Loss of consciousness
- Stroke symptoms (FAST)
- Severe allergic reactions
- Severe head injury

**Example Emergency Response:**
```json
{
  "analysis_summary": "These symptoms require immediate medical attention...",
  "emergency_flag": true,
  "possible_conditions": [
    {
      "condition": "Potential Cardiac Emergency",
      "risk_level": "High",
      "reason": "Severe chest pain can indicate a heart attack."
    }
  ]
}
```
