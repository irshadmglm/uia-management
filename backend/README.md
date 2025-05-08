

# School Management App - Backend

This is the **backend** of the School Management Application built with **Node.js**, **Express.js**, and **MongoDB**. It handles all API endpoints, authentication, database interactions, and real-time communication using **Socket.io**.

## 🔧 Tech Stack

- **Node.js**
- **Express.js**
- **MongoDB** with Mongoose
- **Socket.io** - Real-time communication
- **JWT** - Authentication
- **Cloudinary** - Image uploads
- **Google Sheets API** - External integration

## 📦 Installation

cd backend
npm install

🚀 Running the Server

npm run dev

 Environment Variables
Create a .env file in the backend/ directory with the following:

env
Copy
Edit
MONGODB_URI=your_mongo_connection_string
PORT=5000
JWT_SECRET=your_jwt_secret
NODE_ENV=development

# Cloudinary Config
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# Google Service Account
GOOGLE_SERVICE_ACCOUNT_EMAIL=your_service_account_email
GOOGLE_PRIVATE_KEY="your_private_key_with_newlines_escaped"