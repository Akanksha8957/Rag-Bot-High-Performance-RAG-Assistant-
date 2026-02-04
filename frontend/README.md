# 🤖 Rag-Bot Frontend

A premium, high-contrast React dashboard for the High-Performance RAG Assistant. Designed with a focus on speed, clarity, and intuitive AI interaction.

## 🚀 Overview
The frontend serves as the control center for your RAG experience. It features a sleek dark UI, real-time chat updates, and a robust document management sidebar.

## ✨ Features
- **Dynamic Chat Interface**: Lightning-fast message exchange with the RAG backend.
- **Document Management**: Seamlessly upload, view, and manage your PDF knowledge base.
- **High-Contrast Dark UI**: Professionally designed for long-session comfort and clarity.
- **Responsive Design**: Built with React and Bootstrap for a fluid experience across devices.
- **Real-time Session Management**: Keep track of multiple AI chat sessions easily.

## 🛠️ Tech Stack
- **React 19**: Modern component-based architecture.
- **Bootstrap 5**: Responsive layout and UI components.
- **Axios**: Efficient API communication with the Django backend.
- **React Router 7**: Sophisticated client-side routing.

## 📦 Getting Started

### Prerequisites
- Node.js (v18+)
- npm or yarn

### Installation
1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file (if required) and configure your API base URL:
   ```env
   REACT_APP_API_URL=http://localhost:8000/api
   ```
4. Start the development server:
   ```bash
   npm start
   ```

## 📂 Project Structure
- `src/api`: Axios instances for backend communication.
- `src/components`: Reusable UI components (Navbar, Sidebar, ChatBox).
- `src/pages`: Main view components (Dashboard, Login).
- `src/assets`: Images and persistent styles.

## 🤝 Contributing
Contributions are welcome! Please feel free to submit a Pull Request.
