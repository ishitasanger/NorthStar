from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import Optional

from services.session_service import (
    create_session,
    get_session,
    remove_session
)

from llm import generate_response


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
# INTERVIEW HISTORY
# =========================================================

class InterviewHistory(BaseModel):
    questions: list[str] = []
    answers: list[str] = []
    evaluations: list = []


# =========================================================
# REQUEST MODEL
# =========================================================

class InterviewRequest(BaseModel):
    sessionId: str

    candidate: Optional[Candidate] = None

    message: Optional[str] = None

    endInterview: bool = False

    # Smart Analysis
    smartAnalysis: bool = False

    interviewHistory: Optional[InterviewHistory] = None


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
# SMART ANALYSIS RESPONSE MODEL
# =========================================================

class SmartAnalysisItem(BaseModel):
    question: str
    candidate_answer: str
    ideal_answer: str

    missing_points: list[str]
    additional_points: list[str]
    what_was_wrong: list[str]

    how_to_improve: str


# =========================================================
# RESPONSE MODEL
# =========================================================

class InterviewResponse(BaseModel):
    reply: str
    done: bool

    feedback: Optional[Feedback] = None

    interview_history: Optional[InterviewHistory] = None

    smart_analysis: Optional[list[SmartAnalysisItem]] = None


# =========================================================
# SMART ANALYSIS GENERATOR
# =========================================================

def generate_smart_analysis(
    candidate,
    history
):

    questions = history.questions
    answers = history.answers
    evaluations = history.evaluations


    if not questions or not answers:

        raise HTTPException(
            status_code=400,
            detail=(
                "No interview questions and answers "
                "available for analysis."
            )
        )


    analysis_prompt = f"""
You are an expert technical interview coach.

Your job is to analyze a candidate's REAL interview answers.

Candidate:
{candidate}

Interview Questions:
{questions}

Candidate Answers:
{answers}

Existing Evaluations:
{evaluations}

For EVERY question-answer pair, produce a detailed
but concise analysis.

For each question provide:

1. ideal_answer

- Give the answer a strong technical candidate
  should ideally give.
- Be technically correct.
- Explain the important reasoning.
- Do not make it unnecessarily long.

2. missing_points

- List important concepts that were expected
  but missing from the candidate's answer.
- If nothing important was missing, return [].

3. additional_points

- List useful points that were not necessary
  but would have made the answer stronger.
- Examples, edge cases, complexity,
  trade-offs, practical considerations, etc.
- If there are no meaningful additional points,
  return [].

4. what_was_wrong

- Identify technically incorrect statements,
  misconceptions, or reasoning mistakes.
- Do NOT invent mistakes.
- If the answer was completely correct,
  return [].

5. how_to_improve

- Give specific advice for improving THIS answer.
- Do not give generic motivational advice.

IMPORTANT:

- Analyze the candidate's actual answer.
- Do not assume the candidate said something
  they did not say.
- Do not invent missing information.
- If the candidate's answer is correct,
  acknowledge that.
- Keep the ideal answer educational
  and interview-ready.
- Use simple, clear language.
- Return ONLY valid JSON.

Return exactly this structure:

{{
    "analysis": [
        {{
            "question": "question text",
            "candidate_answer": "candidate answer",
            "ideal_answer": "ideal answer",
            "missing_points": [
                "missing point"
            ],
            "additional_points": [
                "additional point"
            ],
            "what_was_wrong": [
                "incorrect point"
            ],
            "how_to_improve": "specific improvement advice"
        }}
    ]
}}
"""


    # =====================================================
    # CALL LLM
    # =====================================================

    try:

        raw_response = generate_response(
            analysis_prompt
        )

    except Exception as error:

        print(
            "Smart analysis LLM error:",
            error
        )

        raise HTTPException(
            status_code=500,
            detail="Unable to generate smart analysis."
        )


    # =====================================================
    # PARSE JSON RESPONSE
    # =====================================================

    import json


    try:

        cleaned_response = raw_response.strip()


        if cleaned_response.startswith("```json"):

            cleaned_response = cleaned_response[7:]


        if cleaned_response.startswith("```"):

            cleaned_response = cleaned_response[3:]


        if cleaned_response.endswith("```"):

            cleaned_response = cleaned_response[:-3]


        parsed = json.loads(
            cleaned_response.strip()
        )


        analysis = parsed.get(
            "analysis",
            []
        )


        return analysis


    except Exception as error:

        print(
            "Smart analysis JSON parsing error:",
            error
        )

        print(
            "Raw LLM response:",
            raw_response
        )

        raise HTTPException(
            status_code=500,
            detail=(
                "Smart analysis returned "
                "an invalid response."
            )
        )


# =========================================================
# ONE AND ONLY INTERVIEW ENDPOINT
# =========================================================

@router.post(
    "/interview",
    response_model=InterviewResponse
)
def interview(
    request: InterviewRequest
):

    session_id = request.sessionId


    # =====================================================
    # SMART ANALYSIS
    # =====================================================

    if request.smartAnalysis:

        if request.interviewHistory is None:

            raise HTTPException(
                status_code=400,
                detail=(
                    "Interview history is required "
                    "for smart analysis."
                )
            )


        if request.candidate is None:

            raise HTTPException(
                status_code=400,
                detail=(
                    "Candidate information is required "
                    "for smart analysis."
                )
            )


        analysis = generate_smart_analysis(
            request.candidate.model_dump(),
            request.interviewHistory
        )


        return {
            "reply": "Smart analysis generated.",
            "done": True,
            "smart_analysis": analysis
        }


    # =====================================================
    # CHECK EXISTING SESSION
    # =====================================================

    session = get_session(
        session_id
    )


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


        interview_history = (
            session.context.get_history()
        )


        remove_session(
            session_id
        )


        return {
            "reply": "Interview completed.",
            "done": True,
            "feedback": feedback,
            "interview_history": interview_history
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

            next_question = (
                session.generate_question()
            )


            return {
                "reply": next_question,
                "done": False
            }


        # =================================================
        # NATURAL COMPLETION
        # =================================================

        feedback = session.generate_feedback()


        interview_history = (
            session.context.get_history()
        )


        remove_session(
            session_id
        )


        return {
            "reply": "Interview completed.",
            "done": True,
            "feedback": feedback,
            "interview_history": interview_history
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