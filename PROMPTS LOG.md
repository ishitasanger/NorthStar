## Prompt 001 — Backend Foundation Setup

**Date:** 08 August 2026  
**Tool:** ChatGPT

### Prompt

alright, let us start. This is our project structure(attached above). Take this as reference and remember it in our conversations. Now I'm supposed to work on main.py, services folder, utils folder and api folder. My teammates are simultaneously doing the rest. and we'll commit our work side by side regularly. so tell me what should i start with now?

### Outcome

Planned the implementation order for the backend API, session
service, LLM service, utilities, and bookmark service.

## Prompt 002 — FastAPI Backend Foundation

**Date:** 08 August 2026
**Tool:** ChatGPT

### Prompt

I don't know how to use FastAPI. Guide me step by step while
building the backend for my AI Interview Agent. I am responsible
for main.py, the api folder, services folder, and utils folder.

Start with the smallest working FastAPI application and explain
what each piece of code does instead of giving me the entire
backend at once. We will build the required POST /api/interview
endpoint incrementally.
 
### Outcome

Started building the FastAPI backend incrementally, beginning
with the application entry point.

## Prompt 003

**Date:** 08 August 2026
**Tool:** ChatGPT

### Prompt

Alright let us start give me the code step by step now...also tell me what to add in prompt log

### Outcome

Started implementing the backend step by step, beginning with `main.py`, while keeping the established project structure and technical specification in mind.

## Prompt 004

**Date:** 08 August 2026  
**Tool:** ChatGPT

### Prompt

Tell me what code to add after main.py one at a time..

### Outcome

Continued backend implementation step by step after completing `main.py`, beginning with the interview API endpoint.

## Prompt 005

**Date:** 08 August 2026  
**Tool:** ChatGPT

### Prompt

Give me the code after making the POST connection to understand the requests

### Outcome

Added Pydantic request handling to `POST /api/interview` so the endpoint can accept the hackathon's starting interview request with `sessionId` and `candidate`, as well as subsequent conversation requests with `sessionId` and `message`.

## Prompt 006

**Date:** 08 August 2026  
**Tool:** ChatGPT

### Prompt

yes done now what

### Outcome

Added basic interview state fields to each `sessionId`, including the candidate information, conversation messages, questions asked, and current question number.

## Prompt 007

**Date:** 08 August 2026  
**Tool:** ChatGPT

### Prompt

ok till now i have made main.py and api/interview.py as said by you? now what should i do next?

Here r the codes for your reference.

main.py

from fastapi import FastAPI

from api.interview import router as interview_router

app = FastAPI(
    title="AI Interview Agent",
    description="AI-powered technical interview agent",
    version="1.0.0"
)

app.include_router(interview_router)

@app.get("/")
def root():
    return {
        "message": "AI Interview Agent is running"
    }

interview.py

from fastapi import APIRouter
from pydantic import BaseModel
from typing import Optional

router = APIRouter(prefix="/api", tags=["Interview"])

class InterviewRequest(BaseModel):
sessionId: str
candidate: Optional[dict] = None
message: Optional[str] = None

interview_sessions = {}

@router.post("/interview")
def interview(request: InterviewRequest):

    session_id = request.sessionId

    if session_id not in interview_sessions:
        interview_sessions[session_id] = {
            "candidate": request.candidate,
            "messages": [],
            "questions_asked": [],
            "current_question": 0
        }

    if request.message:
        interview_sessions[session_id]["messages"].append(
            request.message
        )

        return {
            "reply": f"I received your answer: {request.message}",
            "done": False
        }

    return {
        "reply": "Welcome. Let's begin your interview.",
        "done": False
    }

## Prompt 008

**Date:** 08 August 2026  
**Tool:** ChatGPT

### Prompt

tell me what to add in services/. i have session_service, bookmark_service and llm_service py files

### Outcome

Implemented the first service layer in `services/session_service.py` to handle interview session creation, retrieval, and message storage, moving session-state responsibilities out of the API layer.

## Prompt 009

**Date:** 08 August 2026  
**Tool:** ChatGPT

### Prompt

i have done the changes..what and how do i test

### Outcome

Tested the integration between `api/interview.py` and `services/session_service.py` using FastAPI Swagger docs. Verified session creation, retrieval, message storage, repeated requests with the same `sessionId`, and creation of a separate session with a different `sessionId`.

## Prompt 010

**Date:** 08 August 2026  
**Tool:** ChatGPT

### Prompt

Are we done? should we go to llm_service? if yes give the code

### Outcome

Started implementing `services/llm_service.py` as the LLM integration layer using Groq, with a reusable `generate_response()` function for generating interview responses.

# Prompt 011

**Date:** 08 August 2026
**Tool:** ChatGPT

### Prompt

I have made the llm_service.py file..what to do next? bookmark_service or fastapi connection?

### Outcome

Decided to proceed with the FastAPI connection before implementing `bookmark_service.py`. Connected the existing `llm_service.py` to the interview API flow so that `/api/interview` can use `generate_response()` to generate AI interviewer responses.

# Prompt 012

**Date:** 08 August 2026
**Tool:** ChatGPT

### Prompt

i had also told you that my work is in services folder, main.py, utils folder and api folder

### Outcome

Clarified the current development scope and followed the user's specified work division: `services/`, `api/`, `utils/`, and `main.py`. Confirmed that the next step after `llm_service.py` is connecting the LLM service to the FastAPI interview endpoint rather than implementing `bookmark_service.py`.

# Prompt 013

**Date:** 08 August 2026
**Tool:** ChatGPT

### Prompt

10. services/bookmark_service.py
    This is NOT an AI agent.
    And that's completely okay.
    The AI Interviewer is the AI agent.
    The Bookmark Manager is simply a product feature.
    It does:
    Create bookmark
    Rename bookmark
    Create folder
    Move bookmark
    Delete bookmark
    Search bookmark
    Add note
    Example:
    {
    "id": "bm_001",
    "question": "Explain Dijkstra's algorithm.",
    "name": "Important Graph Question",
    "folder": "DSA",
    "tags": ["Graph", "Medium"],
    "note": "Revise priority queue implementation."
    }
    This can also live inside JSON. THIS IS HOW I WANT THE CODE FOR BOOKMARK_SERVICES.PY...pls give the code..im not working on fastapi connections anymore

### Outcome

Implemented `services/bookmark_service.py` as an independent product service using JSON persistence. Added functionality for creating, retrieving, renaming, moving, deleting, searching, and updating notes for bookmarks, along with folder management.

# Prompt 014

**Date:** 08 August 2026
**Tool:** ChatGPT

### Prompt

ok can i test this now? also should i make a connection or wait for frontend completion

### Outcome

Confirmed that `bookmark_service.py` should be tested independently before connecting it to FastAPI or the frontend. Created a temporary `test_bookmark_service.py` test flow to verify bookmark creation, retrieval, renaming, folder creation, moving, note updates, searching, and deletion. Recommended connecting the service to the API first and the frontend afterward.