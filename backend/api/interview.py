from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import Optional

from services.session_service import (
    create_session,
    get_session,
    remove_session
)


router = APIRouter(
    prefix="/api",
    tags=["Interview"]
)


# =========================================================
# CANDIDATE MODELS
# =========================================================

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


# =========================================================
# REQUEST MODEL
# =========================================================

class InterviewRequest(BaseModel):
    sessionId: str
    candidate: Optional[Candidate] = None
    message: Optional[str] = None
    endInterview: bool = False


# =========================================================
# FEEDBACK MODELS
# =========================================================

class SkillScores(BaseModel):
    technical_skills: float
    communication: float
    problem_solving: float
    system_reasoning: float


class TopicPerformance(BaseModel):
    topic: str
    score: float
    comment: str


class Feedback(BaseModel):
    summary: str
    overall_score: int
    questions_answered: int
    strengths: list[str]
    gaps: list[str]
    next_steps: list[str]
    skills: SkillScores
    topics: list[TopicPerformance]
    average_accuracy: Optional[float] = None


# =========================================================
# RESPONSE MODEL
# =========================================================

class InterviewResponse(BaseModel):
    reply: str
    done: bool
    feedback: Optional[Feedback] = None


# =========================================================
# INTERVIEW ENDPOINT
# =========================================================

@router.post(
    "/interview",
    response_model=InterviewResponse
)
def interview(request: InterviewRequest):

    session_id = request.sessionId

    # =====================================================
    # CHECK EXISTING SESSION
    # =====================================================

    session = get_session(session_id)


    # =====================================================
    # NEW INTERVIEW
    # =====================================================

    if session is None:

        if request.candidate is None:

            raise HTTPException(
                status_code=404,
                detail=(
                    "Candidate information is required "
                    "to start the interview"
                )
            )

        candidate = request.candidate.model_dump()

        from agent.data_loader import load_curriculum

        curriculum = load_curriculum()

        interviewer = create_session(
            session_id,
            candidate,
            curriculum
        )

        question = interviewer.generate_question()

        return {
            "reply": question,
            "done": False
        }


    # =====================================================
    # END INTERVIEW MANUALLY
    # =====================================================

    if request.endInterview:

        feedback = session.generate_feedback()

        # Remove completed interview from backend memory.
        remove_session(session_id)

        return {
            "reply": "Interview completed.",
            "done": True,
            "feedback": feedback
        }


    # =====================================================
    # CONTINUE EXISTING INTERVIEW
    # =====================================================

    if request.message:

        result = session.process_answer(
            request.message
        )

        # =================================================
        # CONTINUE INTERVIEW
        # =================================================

        if result["should_continue"]:

            next_question = session.generate_question()

            return {
                "reply": next_question,
                "done": False
            }


        # =================================================
        # NATURAL COMPLETION
        # =================================================

        feedback = session.generate_feedback()

        # Remove completed interview from backend memory.
        remove_session(session_id)

        return {
            "reply": "Interview completed.",
            "done": True,
            "feedback": feedback
        }


    # =====================================================
    # INVALID REQUEST
    # =====================================================

    raise HTTPException(
        status_code=400,
        detail=(
            "Message is required to continue "
            "the interview"
        )
    )