# 📄 DocAnalyze - AI-Powered Contract Analysis

## 🚀 Overview

**LegalDocAnalyzer** is a secure, full-stack web application designed to simplify legal contract review. Users can upload contracts (PDF/DOCX), and the system uses **Google Gemini AI** to automatically extract key clauses, summarize content, and identify potential risks.

With an intuitive dashboard and an interactive contract viewer, users can review AI insights and add personal notes to specific clauses using a rich-text editor.

---

## ✨ Key Features

-   **📂 Smart Uploads**: Supports PDF and DOCX formats with secure storage using MongoDB GridFS.
-   **🤖 AI Analysis**: 
    -   **Summarization**: instant plain-English summary of complex legal documents.
    -   **Risk Detection**: Automatically flags "High", "Medium", and "Low" risk clauses with explanations.
    -   **Clause Extraction**: Parses documents into structured clauses for easy review.
-   **📝 Interactive Review**: Add rich-text notes to any clause using the integrated **Draft.js** editor.
-   **🔐 Secure Authentication**: JWT-based secure signup and login system.
-   **🎨 Premium UI**: Modern, responsive dark-themed interface built with React and Vite.

---

## 🛠️ Technology Stack

### Frontend
-   **React.js** (Vite)
-   **Draft.js** (Rich Text Editor)
-   **Axios** (API Communication)
-   **React Router** (Navigation)
-   **React Icons** (UI Elements)

### Backend
-   **Node.js & Express**
-   **MongoDB & Mongoose** (Database)
-   **Multer & GridFS** (File Storage)
-   **Google Gemini API** (AI Model: `gemini-flash-latest`)
-   **PDF-Parse & Mammoth** (Document Parsing)
-   **JWT & Bcrypt** (Security)

---

## ⚙️ Installation & Setup

Follow these steps to run the project locally.

### Prerequisites
-   Node.js (v14+ recommended)
-   MongoDB (Atlas URI or Local)
-   Google Cloud API Key (Generative Language API enabled)

### 1. Clone the Repository
```bash
git clone https://github.com/Vijay0672/LegalDocAnalyzer.git
cd LegalDocAnalyzer
```

### 2. Backend Setup
Navigate to the backend folder and install dependencies:
```bash
cd backend
npm install
```

Create a `.env` file in the `backend/` directory:
```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
GEMINI_API_KEY=your_google_gemini_api_key
```

Start the server:
```bash
npm run dev
# Server runs on http://localhost:5000
```

### 3. Frontend Setup
Open a new terminal, navigate to the frontend folder, and install dependencies:
```bash
cd frontend
npm install
```

Start the React app:
```bash
npm run dev
# App runs on http://localhost:5173
```

---

## 📖 Usage Guide

1.  **Sign Up**: Create an account on the login page.
2.  **Dashboard**: Click "Upload Contract" to select a PDF or DOCX file.
3.  **Processing**: The system will upload the file and trigger AI analysis.
4.  **Review**: Click "View Analysis" to open the viewer.
    -   **Left Panel**: Read the contract text.
    -   **Right Panel**: View the AI Key Summary and Risk Assessment.
    -   **Add Notes**: Click on any clause card to add your own notes using the editor and click "Save Note".

---

## 📡 API Endpoints

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `POST` | `/api/auth/signup` | Register a new user |
| `POST` | `/api/auth/login` | Login and receive JWT |
| `POST` | `/api/contracts/upload` | Upload file & trigger analysis |
| `GET` | `/api/contracts` | List all user contracts |
| `GET` | `/api/contracts/:id` | Get contract details & analysis |
| `PUT` | `/api/contracts/:id/clauses/:clauseId` | Update user notes for a clause |
