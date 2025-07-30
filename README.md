# WhatsApp AI Chatbot 🚀

This project is an AI-powered chatbot for WhatsApp using Twilio API and Gemini AI. It automates responses based on structured conversation flows.

![image](https://github.com/user-attachments/assets/d68aab6f-ee74-4d16-8bce-4fb3fffe6c9e)

## WhatsApp Chatbot Builder – System Flow

![ProjectFlow](https://github.com/user-attachments/assets/56913b85-2ee7-45ab-9585-21d4df731ab7)

## Potential Use Cases
- Customer support automation
- Personal assistant via WhatsApp
- Educational/tutoring bot
- E-commerce product recommendations
- FAQ automation for businesses

## Installation & Setup Guide

### 1. Clone the Repository

```sh
git clone https://github.com/Saini-Yogesh/WhatsApp-AI-Chatbot.git
cd WhatsApp-AI-Chatbot
```

### 2. Setup Environment Variables

You need to configure environment variables for both the frontend and backend.

#### Backend (.env)
Create a `.env` file inside the `backend` folder and add the following:

```env
PORT=your_backend_port
TWILIO_SID=your_twilio_sid
TWILIO_AUTH_TOKEN=your_twilio_auth_token
GEMINI_API_KEY=your_gemini_api_key
MONGO_URI=your_mongo_uri
FLOW_ID=your_flow_id
```

#### Frontend (.env)
Create a `.env` file inside the `frontend` folder and add the following:

```env
REACT_APP_GEMINI_API_KEY=your_gemini_api_key
REACT_APP_FLOW_ID=your_flow_id
REACT_APP_BUSINESS_ID=your_business_id
```

🚨 **Security Note:** Never expose API keys in public repositories.

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

- **Backend API:** [http://localhost:your_backend_port](http://localhost:your_backend_port)
- **Frontend:** [http://localhost:3000](http://localhost:3000)

## Features

📅 AI-driven structured conversations  
📞 WhatsApp automation with Twilio API  
🛠️ Real-time chat processing  

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

## Contributors

<table>
  <tr>
    <td align="center">
      <a href="https://github.com/Saini-Yogesh">
        <img src="https://github.com/Saini-Yogesh.png" width="120" height="120" style="border-radius: 50%;" /><br>
        <b>Saini-Yogesh</b>
      </a>
    </td>
    <td align="center">
      <a href="https://github.com/Sahil7811">
        <img src="https://github.com/Sahil7811.png" width="120" height="120" style="border-radius: 50%;" /><br>
        <b>Sahil7811</b>
      </a>
    </td>
  </tr>
</table>
