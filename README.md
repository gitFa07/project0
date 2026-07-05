# AI Chat Application (ChatGPT Clone)

A full-stack AI-powered chat application inspired by ChatGPT. It allows users to register, authenticate, create conversations, chat with Google's Gemini AI, upload files, and manage chat history through a modern, responsive interface.

---

## 🚀 Features

### 🔐 Authentication

- User Registration
- User Login
- JWT Authentication
- Protected Routes
- Persistent Login

### 💬 AI Chat

- Real-time AI conversations
- Streaming AI responses
- Markdown rendering
- Syntax highlighted code blocks
- Copy code functionality
- Automatic conversation title generation

### 📂 Conversation Management

- Create new conversations
- View conversation history
- Rename conversations
- Delete conversations
- Persistent chat storage

### 📎 File Upload

- Upload files alongside prompts
- PDF support
- DOCX support
- TXT support
- Image support (PNG/JPG)

### 🛡️ Security

- Helmet
- Express Rate Limiting
- JWT Authentication
- Input Validation
- Secure CORS Configuration
- Multer File Validation

---

# 🏗️ Tech Stack

## Frontend

- React 19
- React Router
- Axios
- Tailwind CSS
- React Markdown
- React Syntax Highlighter
- React Icons

## Backend

- Node.js
- Express.js
- MongoDB
- Mongoose
- JWT
- Multer
- Google Gemini API
- Express Validator
- Helmet
- Morgan
- Compression

---

# 📁 Project Structure

```
project0/

│
├── backend/
│   ├── src/
│   │   ├── config/
│   │   ├── controllers/
│   │   ├── middleware/
│   │   ├── models/
│   │   ├── routes/
│   │   ├── utils/
│   │   ├── validators/
│   │   └── server.js
│   │
│   ├── package.json
│   └── .env
│
└── frontend/
    ├── src/
    │   ├── assets/
    │   ├── components/
    │   ├── context/
    │   ├── pages/
    │   ├── services/
    │   └── App.jsx
    │
    ├── package.json
    └── .env
```

---

# ⚙️ Installation

## Clone Repository

```bash
git clone https://github.com/<your-username>/<repository-name>.git

cd project0
```

---

## Backend Setup

```bash
cd backend

npm install
```

Create a `.env` file.

```env
PORT=5000

MONGO_URI=your_mongodb_connection_string

JWT_SECRET=your_secret_key

GEMINI_API_KEY=your_gemini_api_key

CLIENT_URL=http://localhost:5173

NODE_ENV=development
```

Run backend

```bash
npm run dev
```

---

## Frontend Setup

```bash
cd frontend

npm install
```

Create `.env`

```env
VITE_API_URL=http://localhost:5000/api
```

Run frontend

```bash
npm run dev
```

---

# 🌐 API Endpoints

## Authentication

| Method | Endpoint             | Description   |
| ------ | -------------------- | ------------- |
| POST   | `/api/auth/register` | Register User |
| POST   | `/api/auth/login`    | Login User    |

---

## Conversations

| Method | Endpoint                     | Description             |
| ------ | ---------------------------- | ----------------------- |
| POST   | `/api/chat/conversation`     | Create Conversation     |
| GET    | `/api/chat/conversation`     | Get Conversations       |
| GET    | `/api/chat/conversation/:id` | Get Single Conversation |
| PUT    | `/api/chat/chat/:id`         | Rename Conversation     |
| DELETE | `/api/chat/chat/:id`         | Delete Conversation     |

---

## AI

| Method | Endpoint           | Description          |
| ------ | ------------------ | -------------------- |
| POST   | `/api/chat/home`   | Generate AI Response |
| POST   | `/api/chat/stream` | Stream AI Response   |

---

# 🔒 Security Features

- JWT Authentication
- Protected API Routes
- Password Hashing using bcrypt
- Request Rate Limiting
- Secure HTTP Headers
- Input Validation
- File Upload Validation
- CORS Protection

---

# 📸 Screenshots

### Login

_Add Screenshot_

### Register

_Add Screenshot_

### Chat Interface

_Add Screenshot_

### Markdown Rendering

_Add Screenshot_

### File Upload

_Add Screenshot_

---

# 🚀 Deployment

## Frontend

Vercel

## Backend

Render

## Database

MongoDB Atlas

---

# 🔮 Future Improvements

- AI Image Generation
- Multiple AI Models
- Voice Chat
- Dark / Light Theme
- Conversation Search
- Export Chat
- Chat Sharing
- AI Settings
- User Profile
- Message Reactions

---

# 👨‍💻 Author

**Falak Anwar**

Software Engineering Aspirant

GitHub: https://github.com/<your-github>

LinkedIn: https://linkedin.com/in/<your-linkedin>

---

# 📄 License

This project is licensed under the MIT License.
