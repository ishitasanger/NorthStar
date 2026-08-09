from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import Optional
import json

from services.session_service import (
    create_session,
    get_session,
    remove_session
)

from llm import generate_response, generate_json_response


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

    # =====================================================
    # ADAPTIVE DIFFICULTY
    # =====================================================

    difficulty: Optional[str] = None

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

    # =====================================================
    # VALIDATE HISTORY
    # =====================================================

    if not questions or not answers:

        raise HTTPException(
            status_code=400,
            detail=(
                "No interview questions and answers "
                "available for analysis."
            )
        )

    # =====================================================
    # PASS 1
    # Generate the detailed analysis
    # =====================================================

    first_prompt = f"""
You are an expert technical interview evaluator.

Analyze the candidate's interview answers.

Your primary task is to determine what a strong candidate
would need to cover for EACH question and compare that
against what the candidate actually said.

CANDIDATE:
{candidate}

QUESTIONS:
{questions}

CANDIDATE ANSWERS:
{answers}

EXISTING EVALUATIONS:
{evaluations}

For every question:

1. Understand exactly what the question asks.
2. Identify the important concepts required to answer it.
3. Identify the concepts the candidate actually covered.
4. Identify concepts the candidate completely failed to
   mention.
5. Identify statements the candidate made that were
   incorrect, vague, misleading, or oversimplified.
6. Create a technically strong ideal answer.
7. Give specific advice for improvement.

IMPORTANT:

A concept that is necessary to properly answer the question
is NOT an optional additional point.

For example, if a question asks about:

"How would you implement vector search and make retrieval
efficient?"

then concepts such as:

- similarity metrics
- nearest-neighbor search
- indexing
- approximate nearest-neighbor search
- retrieval efficiency
- scalability

may be REQUIRED concepts.

If the candidate did not discuss them, they are missing.

Do not assume that mentioning a related technology means
the candidate covered the underlying concept.

Return ONLY valid JSON.

Use exactly:

{{
    "analysis": [
        {{
            "question": "question",
            "candidate_answer": "answer",
            "ideal_answer": "ideal answer",
            "required_concepts": [
                "concept required by the question"
            ],
            "covered_concepts": [
                "concept actually covered"
            ],
            "missing_concepts": [
                "required concept not covered"
            ],
            "weak_points": [
                "incorrect or weak statement"
            ],
            "additional_points": [
                "optional enhancement"
            ],
            "how_to_improve": "specific advice"
        }}
    ]
}}
"""

    try:

        first_response = generate_json_response(
            first_prompt
        )

    except Exception as error:

        print(
            "Smart analysis first-pass error:",
            error
        )

        raise HTTPException(
            status_code=500,
            detail="Unable to generate smart analysis."
        )

    # =====================================================
    # PARSE PASS 1
    # =====================================================

    try:

        cleaned_first = first_response.strip()

        if cleaned_first.startswith("```json"):
            cleaned_first = cleaned_first[7:]

        if cleaned_first.startswith("```"):
            cleaned_first = cleaned_first[3:]

        if cleaned_first.endswith("```"):
            cleaned_first = cleaned_first[:-3]

        first_data = json.loads(
            cleaned_first.strip()
        )

        first_analysis = first_data.get(
            "analysis",
            []
        )

    except Exception as error:

        print("Smart analysis first-pass JSON error:", error)
        print("Raw first-pass response:", first_response)

        raise HTTPException(
            status_code=500,
            detail=(
                "Smart analysis first pass "
                "returned invalid JSON."
            )
        )

    # =====================================================
    # PASS 2
    #
    # Specifically validate MISSING concepts.
    #
    # This pass is intentionally independent from
    # additional_points.
    # =====================================================

    second_prompt = f"""
You are performing a FINAL VALIDATION of a technical
interview analysis.

Your ONLY important task is to correctly identify
REQUIRED concepts that the candidate FAILED to mention.

Do NOT confuse missing concepts with optional additional
information.

Here is the analysis from the first evaluator:

{json.dumps(first_analysis, indent=2)}

=========================================================
MISSING CONCEPT DEFINITION
=========================================================

A missing concept is:

A concept that is important or necessary for a strong,
technically complete answer to the QUESTION, but which
does NOT appear in the candidate's actual answer.

If the candidate did not mention it, it can be missing.

If the candidate mentioned it incorrectly or vaguely,
it should be considered a weak point instead.

=========================================================
CRITICAL RULE
=========================================================

For EACH question:

1. Read the question.
2. Determine what the question requires.
3. Read the candidate's answer.
4. List the concepts actually covered.
5. Compare them.
6. Every important required concept that is absent
   MUST appear in missing_points.

Do NOT move required concepts into additional_points.

=========================================================
EXAMPLE
=========================================================

QUESTION:

"How would you implement a basic vector search algorithm
to find similar items in a high-dimensional vector space,
and what considerations would you take into account for
efficient retrieval?"

CANDIDATE ANSWER:

"I would use embeddings to represent the data as vectors
and compare the vectors to find similar items. For efficient
retrieval, I would use a vector database."

This answer is incomplete.

Likely missing concepts include:

- similarity metric
- cosine similarity or another distance function
- nearest-neighbor search
- indexing
- exact vs approximate nearest-neighbor search
- ANN techniques
- high-dimensional search considerations
- retrieval speed vs accuracy trade-off
- scalability

These are NOT merely additional points.

They are missing because the question explicitly asks
HOW the search works and HOW retrieval is made efficient.

=========================================================
ANOTHER IMPORTANT EXAMPLE
=========================================================

QUESTION:

"Explain relational databases, NoSQL databases and file
systems and provide a scenario where each should be used."

CANDIDATE ANSWER:

"Relational databases use tables. NoSQL is flexible.
File systems store files. I would use relational databases
for structured data, NoSQL for lots of data, and file systems
for documents."

Missing concepts could include:

- relationships
- SQL/querying
- ACID transactions
- NoSQL data models
- NoSQL scalability characteristics
- file-system characteristics
- concrete scenarios
- trade-offs

=========================================================
DO NOT OVER-PENALIZE
=========================================================

Do not invent missing concepts that are irrelevant to the
specific question.

Only include concepts that are genuinely important to
answering the question well.

=========================================================
OUTPUT
=========================================================

Return ONLY valid JSON.

Return:

{{
    "analysis": [
        {{
            "question": "question",
            "candidate_answer": "answer",
            "ideal_answer": "ideal answer",
            "missing_points": [
                "required concept that was actually missing"
            ],
            "additional_points": [
                "optional improvement"
            ],
            "what_was_wrong": [
                "incorrect or weak statement actually made"
            ],
            "how_to_improve": "specific improvement advice"
        }}
    ]
}}
"""

    try:

        second_response = generate_json_response(
            second_prompt
        )

    except Exception as error:

        print(
            "Smart analysis second-pass error:",
            error
        )

        raise HTTPException(
            status_code=500,
            detail="Unable to validate smart analysis."
        )

    # =====================================================
    # PARSE PASS 2
    # =====================================================

    try:

        cleaned_second = second_response.strip()

        if cleaned_second.startswith("```json"):
            cleaned_second = cleaned_second[7:]

        if cleaned_second.startswith("```"):
            cleaned_second = cleaned_second[3:]

        if cleaned_second.endswith("```"):
            cleaned_second = cleaned_second[:-3]

        second_data = json.loads(
            cleaned_second.strip()
        )

        final_analysis = second_data.get(
            "analysis",
            []
        )

    except Exception as error:

        print(
            "Smart analysis second-pass JSON error:",
            error
        )

        print(
            "Raw second-pass response:",
            second_response
        )

        raise HTTPException(
            status_code=500,
            detail=(
                "Smart analysis second pass "
                "returned invalid JSON."
            )
        )

    # =====================================================
    # FINAL NORMALIZATION
    # =====================================================

    normalized_analysis = []

    for item in final_analysis:

        normalized_analysis.append({

            "question":
                item.get(
                    "question",
                    ""
                ),

            "candidate_answer":
                item.get(
                    "candidate_answer",
                    ""
                ),

            "ideal_answer":
                item.get(
                    "ideal_answer",
                    ""
                ),

            "missing_points":
                item.get(
                    "missing_points",
                    []
                ),

            "additional_points":
                item.get(
                    "additional_points",
                    []
                ),

            "what_was_wrong":
                item.get(
                    "what_was_wrong",
                    []
                ),

            "how_to_improve":
                item.get(
                    "how_to_improve",
                    ""
                )
        })

    return normalized_analysis

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

    try:

        cleaned_response = raw_response.strip()


        if cleaned_response.startswith(
            "```json"
        ):

            cleaned_response = (
                cleaned_response[7:]
            )


        if cleaned_response.startswith(
            "```"
        ):

            cleaned_response = (
                cleaned_response[3:]
            )


        if cleaned_response.endswith(
            "```"
        ):

            cleaned_response = (
                cleaned_response[:-3]
            )


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

            "reply":
                "Smart analysis generated.",

            "done":
                True,

            "smart_analysis":
                analysis
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


        candidate = (
            request.candidate.model_dump()
        )


        from agent.data_loader import load_curriculum


        curriculum = load_curriculum()


        interviewer = create_session(
            session_id,
            candidate,
            curriculum
        )


        question = (
            interviewer.generate_question()
        )


        return {

            "reply":
                question,

            "done":
                False,

            "difficulty":
                interviewer.state_machine.get_difficulty()
        }


    # =====================================================
    # END INTERVIEW MANUALLY
    # =====================================================

    if request.endInterview:

        feedback = (
            session.generate_feedback()
        )


        interview_history = (
            session.context.get_history()
        )


        remove_session(
            session_id
        )


        return {

            "reply":
                "Interview completed.",

            "done":
                True,

            "feedback":
                feedback,

            "interview_history":
                interview_history
        }


    # =====================================================
    # CONTINUE EXISTING INTERVIEW
    # =====================================================

    if request.message:

        result = (
            session.process_answer(
                request.message
            )
        )


        # =================================================
        # CONTINUE INTERVIEW
        # =================================================

        if result["should_continue"]:

            next_question = (
                session.generate_question()
            )


            return {

                "reply":
                    next_question,

                "done":
                    False,

                "difficulty":
                    result["difficulty"]
            }


        # =================================================
        # NATURAL COMPLETION
        # =================================================

        feedback = (
            session.generate_feedback()
        )


        interview_history = (
            session.context.get_history()
        )


        remove_session(
            session_id
        )


        return {

            "reply":
                "Interview completed.",

            "done":
                True,

            "feedback":
                feedback,

            "interview_history":
                interview_history
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