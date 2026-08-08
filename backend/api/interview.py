from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import Optional

from services.session_service import (
    create_session,
    get_session
)

router = APIRouter(prefix="/api", tags=["Interview"])


# ---------- CANDIDATE MODELS ----------

class CandidateMember(BaseModel):
    id: str
    name: str
    jobRole: str
    yearsExperience: int
    education: str
    status: str


class Mission(BaseModel):
    day: int
    title: str
    passed: Optional[bool] = None
    attempts: Optional[int] = None
    skipped: Optional[bool] = None


class CandidateSignals(BaseModel):
    commitDays: int
    missionsCompleted: int
    missionsFirstTry: int


class Candidate(BaseModel):
    member: CandidateMember
    missions: list[Mission]
    signals: CandidateSignals


# ---------- REQUEST MODEL ----------

class InterviewRequest(BaseModel):
    sessionId: str
    candidate: Optional[Candidate] = None
    message: Optional[str] = None


# ---------- RESPONSE MODELS ----------

class Feedback(BaseModel):
    summary: str
    strengths: list[str]
    gaps: list[str]
    next_steps: list[str]


class InterviewResponse(BaseModel):
    reply: str
    done: bool
    feedback: Optional[Feedback] = None


# ---------- INTERVIEW ENDPOINT ----------

@router.post("/interview", response_model=InterviewResponse)
def interview(request: InterviewRequest):

    session_id = request.sessionId

    # Check whether the session already exists
    session = get_session(session_id)

    # ---------- NEW INTERVIEW ----------

    if session is None:

        if request.candidate is None:
            raise HTTPException(
                status_code=404,
                detail="Candidate information is required to start the interview"
            )

        candidate = request.candidate.model_dump()

        # Load curriculum
        from agent.data_loader import load_curriculum
        curriculum = load_curriculum()

        # Create interviewer session
        interviewer = create_session(
            session_id,
            candidate,
            curriculum
        )

        # Generate first interview question
        question = interviewer.generate_question()

        return {
            "reply": question,
            "done": False
        }

    # ---------- CONTINUE EXISTING INTERVIEW ----------

    if request.message:

        result = session.process_answer(
            request.message
        )

        if result["should_continue"]:
            next_question = session.generate_question()

            return {
                "reply": next_question,
                "done": False
            }

        # Interview completed
        feedback = session.generate_feedback()

        return {
            "reply": "Interview completed.",
            "done": True,
            "feedback": feedback
        }

    # ---------- INVALID REQUEST ----------

    raise HTTPException(
        status_code=400,
        detail="Message is required to continue the interview"
    )