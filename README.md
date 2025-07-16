# AI Diagnostic Assistant

A React + FastAPI application for medical diagnostic assistance using LangGraph.

## Features

- **React Frontend**: Modern chat interface with real-time messaging
- **FastAPI Backend**: RESTful API with LangGraph integration
- **Multi-Agent System**: Hypothesis generation, challenging, and test recommendation
- **Conversation Management**: Persistent chat history and state management
- **Responsive Design**: Beautiful UI that works on all devices

## Setup Instructions

### Backend Setup

1. **Use your existing virtual environment** (since you're already using uv):
```bash
cd backend
# If using uv, you can install the additional FastAPI dependencies:
uv add fastapi uvicorn
```

2. **Or install from requirements.txt**:
```bash
uv pip install -r requirements.txt
```

3. **Set up environment variables** (you may already have this):
```bash
cp .env.example .env
# Edit .env with your API keys
```

4. **Start the backend server**:
```bash
uv run uvicorn main:app --reload --port 8000
# Or if you prefer: python -m uvicorn main:app --reload --port 8000
```

### Frontend Setup

1. **Install dependencies**:
```bash
npm install
```

2. **Start the development server**:
```bash
npm run dev
```

The application will be available at:
- Frontend: http://localhost:5173
- Backend API: http://localhost:8000
- API Documentation: http://localhost:8000/docs

## API Endpoints

- `POST /chat` - Send a message to the diagnostic assistant
- `GET /conversation/{conversation_id}` - Retrieve conversation history
- `DELETE /conversation/{conversation_id}` - Clear conversation history

## Usage

1. Open the frontend in your browser
2. Start describing your symptoms or medical concerns
3. The AI will guide you through a systematic diagnostic process
4. Follow the questions and test recommendations provided
5. Receive a comprehensive diagnostic analysis

## Architecture

- **Frontend**: React with TypeScript, Tailwind CSS, and Axios
- **Backend**: FastAPI with LangGraph for multi-agent diagnostic reasoning
- **AI Models**: Google Gemini for natural language processing
- **State Management**: In-memory conversation storage

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## License

This project is licensed under the MIT License.