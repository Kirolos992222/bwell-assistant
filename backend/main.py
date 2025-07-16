from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional
import json
import asyncio
from diagnostic_graph import Graph
from langchain_core.messages import HumanMessage, AIMessage
from fastapi.responses import StreamingResponse
from langchain_google_genai import ChatGoogleGenerativeAI
from langchain_core.messages import HumanMessage

llm = ChatGoogleGenerativeAI(model="gemini-2.0-flash")

app = FastAPI(title="Diagnostic Assistant API", version="1.0.0")

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, replace with your frontend URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Pydantic models
class Message(BaseModel):
    role: str  # "user" or "assistant"
    content: str
    timestamp: Optional[str] = None
    agent: Optional[str] = None

class ChatRequest(BaseModel):
    message: str
    conversation_id: Optional[str] = None

class ChatResponse(BaseModel):
    messages: List[Message]
    conversation_id: str
    graph_state: dict

# In-memory storage for conversation states
conversation_states = {}

@app.get("/")
async def root():
    return {"message": "Diagnostic Assistant API is running"}

@app.post("/chat", response_model=ChatResponse)
async def chat(request: ChatRequest):
    try:
        # Get or create conversation state
        conversation_id = request.conversation_id or "default"
        
        if conversation_id not in conversation_states:
            conversation_states[conversation_id] = {
                "Messages": [],
                "Next": None,
                "Iterations": 0
            }
        
        graph_state = conversation_states[conversation_id]
        
        # Create user message
        user_message = HumanMessage(content=request.message)
        
        # Prepare graph input
        graph_input = {
            "Messages": graph_state["Messages"] + [user_message],
            "Next": None,
            "Iterations": 0
        }
        
        # Invoke the diagnostic graph
        result = Graph.invoke(graph_input)
        
        # Update conversation state
        conversation_states[conversation_id] = result
        
        # Convert messages to API format
        api_messages = []
        for msg in result["Messages"]:
            if isinstance(msg, HumanMessage):
                api_messages.append(Message(role="user", content=msg.content))
            elif isinstance(msg, AIMessage):
                agent_type = getattr(msg, 'agent_type', 'General')
                api_messages.append(Message(role="assistant", content=msg.content, agent=agent_type))
        
        return ChatResponse(
            messages=api_messages,
            conversation_id=conversation_id,
            graph_state=result
        )
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/chat/stream")
async def chat_stream(request: ChatRequest):
    def token_generator():
        # Prepare messages as you do now
        messages = [HumanMessage(content=request.message)]
        # Stream the response
        for chunk in llm.stream(messages):
            yield chunk.content  # or format as needed (e.g., add delimiters)
    return StreamingResponse(token_generator(), media_type="text/plain")

@app.get("/conversation/{conversation_id}")
async def get_conversation(conversation_id: str):
    if conversation_id not in conversation_states:
        raise HTTPException(status_code=404, detail="Conversation not found")
    
    graph_state = conversation_states[conversation_id]
    
    # Convert messages to API format
    api_messages = []
    for msg in graph_state["Messages"]:
        if isinstance(msg, HumanMessage):
            api_messages.append(Message(role="user", content=msg.content))
        elif isinstance(msg, AIMessage):
            agent_type = getattr(msg, 'agent_type', None)
            api_messages.append(Message(role="assistant", content=msg.content, agent=agent_type))
    
    return {
        "messages": api_messages,
        "conversation_id": conversation_id,
        "graph_state": graph_state
    }

@app.delete("/conversation/{conversation_id}")
async def clear_conversation(conversation_id: str):
    if conversation_id in conversation_states:
        del conversation_states[conversation_id]
    return {"message": "Conversation cleared"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)