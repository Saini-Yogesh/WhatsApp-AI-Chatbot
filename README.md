# WhatsApp AI Chatbot 🚀

This project is an AI-powered chatbot for WhatsApp using Twilio API and Gemini AI. It automates responses based on structured conversation flows.

![image](https://github.com/user-attachments/assets/d68aab6f-ee74-4d16-8bce-4fb3fffe6c9e)

## Installation & Setup Guide

### 1. Clone the Repository
```sh
git clone https://github.com/Saini-Yogesh/WhatsApp-AI-Chatbot.git
cd WhatsApp-AI-Chatbot
```

### 2. Setup Environment Variables
Create a `.env` file in the root directory and add the following:

```env
PORT=8000
TWILIO_SID=your_twilio_sid
TWILIO_AUTH_TOKEN=your_twilio_auth_token
GEMINI_API_KEY=your_gemini_api_key
```

⚠️ **Security Note:** Keep your API keys private and do not share them.

### 3. Install Dependencies
Install dependencies for the main project:

```sh
npm install
```

Then, navigate to the backend and install dependencies:

```sh
cd backend
npm install
```

Do the same for the frontend:

```sh
cd ../frontend
npm install
```

### 4. Run the Application
You can start the backend and frontend separately or together using the provided scripts.

#### Start the Backend
```sh
npm run backend
```

#### Start the Frontend
```sh
npm run frontend
```

#### Start Both Backend & Frontend Concurrently
```sh
npm run dev
```

### 5. Access the Application
- **Backend API:** [http://localhost:8000](http://localhost:8000)
- **Frontend:** [http://localhost:3000](http://localhost:3000) (Default React Port)

## Features
✅ AI-driven structured conversations  
✅ WhatsApp automation with Twilio API  
✅ Real-time chat processing  

## Contributing
Feel free to fork and submit pull requests! 🚀

## Scripts
Ensure the following scripts are included in your `package.json`:

```json
"scripts": {
    "frontend": "npm run start --prefix frontend",
    "backend": "nodemon backend/index.js",
    "dev": "concurrently \"npm run backend\" \"npm run frontend\""
}
```
