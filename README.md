# 🤖 ChatGPT-Style Analytics Assistant  
**Tech Stack:** React, TailwindCSS, JavaScript, Node.js, Express

A fully responsive chat-based analytics dashboard inspired by ChatGPT.  
Users can create sessions, ask questions, receive structured table responses, like/dislike answers, reset history, and use a modern UI optimized for both desktop and mobile.

---

## 🎯 Features

- 💬 Interactive chat with built-in session handling  
- 📊 Tabular data responses  
- 👍👎 Feedback on assistant messages  
- 🗂 Multiple chat sessions with auto titles  
- 🗑 Reset/Clear all sessions  
- 🎨 Dark/Light mode with persistent theme  
- 📱 Full mobile responsive UI (sidebar hides → mobile dropdown)  
- 🔄 Auto refresh of session list  

---

## 🧩 Tech Stack

**Frontend:** React.js, TailwindCSS, JavaScript (ES6+), React Router DOM, Fetch API, LocalStorage  
**Backend:** Node.js, Express.js, UUID, File-based JSON storage, CORS, Body-Parser  

---

## 📁 Project Structure

project/
│
├── frontend/
│ ├── src/
│ │ ├── components/
│ │ ├── api/
│ │ ├── App.js
│ │ └── index.js
│ └── package.json
│
└── backend/
├── mockData.js
├── server.js
└── package.json

## ⚙️ Installation & Setup

1️⃣ Clone Repository
```bash
git clone "https://github.com/sridharreddy7780/lumibyte-chat-app-clone-assignement.git"
cd project

2️⃣ Backend Setup
cd backend
npm install
node server.js
Backend runs at: http://localhost:4000

3️⃣ Frontend Setup
cd ../frontend
npm install
npm start
Frontend runs at: http://localhost:3000

📡 API Endpoints

Method	Endpoint	Purpose
GET	/api/sessions	Fetch sessions
GET	/api/new-chat	Create chat session
GET	/api/session/:id	Fetch session history
POST	/api/chat/:id	Send question + get mock response
POST	/api/feedback/:id/:index	Save feedback
POST	/api/reset	Clear all sessions

🧪 Usage

1️⃣ Start frontend & backend
2️⃣ Click New Chat
3️⃣ Ask questions like:

show sales
active users
sample metrics

4️⃣ View text + table results
5️⃣ Like or dislike responses
6️⃣ Select or reset chat sessions

🎨 UI Features

Gradient enhanced header

Mobile dropdown session manager

Glassmorphic chat container

Smooth spacing & rounded UI

👨‍💻 Developer

Name: K sridhar reddy
Role: Full Stack Developer
Email: ksr131687@gmail.com
GitHub: https://github.com/sridharreddy7780
LinkedIn: https://www.linkedin.com/in/sridharreddykotripalli/
