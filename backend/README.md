# ⚙️ Rag-Bot Backend

The brain of the Rag-Bot powered by Django, LangChain, and FAISS. This backend handles document processing, vector embeddings, and real-time RAG query orchestration.

## 🚀 Architecture
The backend is built using **Django Rest Framework (DRF)** and implements a robust Retrieval-Augmented Generation (RAG) pipeline:
1. **Extraction**: Text is extracted from uploaded PDF, DOCX, and TXT files.
2. **Chunking**: Documents are split into optimized chunks using `RecursiveCharacterTextSplitter`.
3. **Embedding**: Chunks are converted into high-dimensional vectors via OpenAI's `text-embedding-3-small`.
4. **Vector Store**: Embeddings are stored in **FAISS** for ultra-fast semantic search.
5. **Retrieval**: Relevant context is retrieved and passed to GPT-3.5-Turbo for factual, context-aware responses.

## ✨ Features
- **JWT Authentication**: Secure user sessions with token-based auth.
- **PDF Intelligence**: Deep text extraction and indexing.
- **Scalable RAG**: Fast retrieval using FAISS local indexes.
- **RESTful API**: Clean endpoints for documents, chat history, and AI queries.
- **Email Support**: Integrated SMTP for system notifications and password resets.

## 🛠️ Tech Stack
- **Django 6.0**: High-level Python web framework.
- **Django Rest Framework**: For building powerful APIs.
- **LangChain**: Orchestration of the LLM and RAG pipeline.
- **FAISS**: Library for efficient similarity search and clustering of dense vectors.
- **OpenAI API**: Powering embeddings and chat reasoning.

## 📦 Getting Started

### Prerequisites
- Python 3.10+
- OpenAI API Key

### Installation
1. Clone the repository and navigate to the backend:
   ```bash
   cd backend
   ```
2. Create and activate a virtual environment:
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```
3. Install dependencies:
   ```bash
   pip install django djangorestframework django-cors-headers djangorestframework-simplejwt python-dotenv PyPDF2 python-docx langchain langchain-openai langchain-community faiss-cpu
   ```
4. Configure environment variables in `.env`:
   ```env
   SECRET_KEY=your_secret_key
   DEBUG=True
   OPENAI_API_KEY=your_openai_api_key
   EMAIL_HOST_USER=your_email@gmail.com
   EMAIL_HOST_PASSWORD=your_app_password
   ```
5. Run migrations and start the server:
   ```bash
   python manage.py migrate
   python manage.py runserver
   ```

## 🛤️ API Endpoints
- `POST /api/users/register/`: User registration.
- `POST /api/users/login/`: User login (returns JWT).
- `GET /api/rag/documents/`: List user documents.
- `POST /api/rag/documents/`: Upload new document.
- `POST /api/rag/chat/ask/`: Submit a question to the AI.
- `GET /api/rag/chat/history/`: Retrieve chat session history.

## 🛡️ Security
- All sensitive data is managed via environment variables.
- Passwords are hashed using Django's security defaults.
- Endpoints are protected by JWT authentication.
