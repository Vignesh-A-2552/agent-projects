from fastapi import APIRouter
from pydantic import BaseModel
from app.agent.research_agent.research_agent import ResearchAgent

router = APIRouter(prefix="/api/v1")

# Initialize the research agent
research_agent = ResearchAgent()


class ChatRequest(BaseModel):
    """Request model for chat endpoint."""
    query: str


class ChatResponse(BaseModel):
    """Response model for chat endpoint."""
    research_summary: str
    research_documents: str


@router.get("/chat")
def read_chat():
    """Simple GET endpoint for chat."""
    return {"message": "This is the chat endpoint"}


@router.post("/chat/research")
async def research_chat(request: ChatRequest) -> ChatResponse:
    """
    Research chat endpoint that uses the Research Agent.

    Args:
        request: ChatRequest containing the user query

    Returns:
        ChatResponse with research summary and documents
    """
    # Build the agent if not already built
    if research_agent.agent is None:
        await research_agent.build_agent()

    # Invoke the research agent
    result = await research_agent.invoke({"user_input": request.query})

    # Return the response
    return ChatResponse(
        research_summary=result.get("research_summary", ""),
        research_documents=result.get("research_documents", "")
    )