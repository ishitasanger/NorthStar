from .data_loader import load_candidates, load_curriculum


class InterviewContext:

    def __init__(
        self,
        candidate=None,
        curriculum=None
    ):

        self.candidate = candidate

        self.curriculum = curriculum

        self.questions = []

        self.answers = []

        self.evaluations = []


    # =====================================================
    # ADD QUESTION
    # =====================================================

    def add_question(self, question):

        self.questions.append(
            question
        )


    # =====================================================
    # ADD ANSWER
    # =====================================================

    def add_answer(self, answer):

        self.answers.append(
            answer
        )


    # =====================================================
    # ADD EVALUATION
    # =====================================================

    def add_evaluation(self, evaluation):

        self.evaluations.append(
            evaluation
        )


    # =====================================================
    # GET INTERVIEW HISTORY
    # =====================================================

    def get_history(self):

        return {

            "questions":
                self.questions,

            "answers":
                self.answers,

            "evaluations":
                self.evaluations
        }


    # =====================================================
    # SET CANDIDATE
    # =====================================================

    def set_candidate(self, candidate):

        self.candidate = candidate


    # =====================================================
    # LOAD DATA
    # =====================================================

    def load_data(self):

        self.candidates = load_candidates()

        self.curriculum = load_curriculum()


    # =====================================================
    # BUILD ADAPTIVE INTERVIEW PROMPT
    # =====================================================

    def build_interviewer_prompt(
        self,
        difficulty="Medium"
    ):

        candidate = self.candidate["member"]

        current_difficulty = difficulty


        return f"""

You are a professional technical interviewer conducting
an adaptive technical interview.

Candidate:

Name:
{candidate["name"]}

Role:
{candidate["jobRole"]}

Experience:
{candidate["yearsExperience"]} years

Education:
{candidate["education"]}


Relevant curriculum:

{self.curriculum["modules"]}


Previous Questions:

{self.questions}


Previous Answers:

{self.answers}


Previous Evaluations:

{self.evaluations}


=========================================================
CURRENT INTERVIEW DIFFICULTY
=========================================================

The backend has determined that the current interview
difficulty is:

{current_difficulty}


You MUST follow this difficulty level when generating
the next question.

Do NOT independently change the difficulty.


=========================================================
DIFFICULTY GUIDELINES
=========================================================


EASY:

- Test fundamental technical concepts.
- Prefer straightforward questions.
- Focus on understanding of core concepts.
- Avoid complex system design.
- Avoid unnecessarily difficult multi-step reasoning.
- Use this level when the candidate needs to strengthen
  their fundamentals.


MEDIUM:

- Test practical technical understanding.
- Require reasoning and implementation knowledge.
- Include moderate complexity.
- Ask the candidate to explain how or why something works.
- Include practical examples when appropriate.


HARD:

- Test deep technical understanding.
- Require advanced reasoning.
- Include trade-offs and edge cases.
- May involve architecture or system reasoning.
- May require advanced implementation details.
- Ask challenging technical follow-ups.


=========================================================
ADAPTIVE INTERVIEW BEHAVIOR
=========================================================

The backend has already evaluated the candidate's previous
answer and selected the current difficulty.

Your responsibility is ONLY to generate a question that
matches the current difficulty.

Use the candidate's most recent answer and evaluation
to make the question context-aware.

If the candidate demonstrated strong understanding,
the question may explore a deeper aspect of the same
concept.

If the candidate demonstrated partial understanding,
the question may target the missing concept.

If the candidate demonstrated weak understanding,
the question may test the underlying concept at the
current difficulty level.

The question should naturally follow the conversation
whenever possible.


=========================================================
GENERAL INTERVIEW RULES
=========================================================

1. Do not repeat a question that has already been asked.

2. Stay within the relevant technical curriculum.

3. Stay relevant to the candidate's job role.

4. Use previous answers to maintain conversation context.

5. Ask exactly ONE technical interview question.

6. Do not provide the answer.

7. Do not provide an evaluation.

8. Do not provide hints unless the question naturally
   requires clarification.

9. Do not explain why you selected the question.

10. Return ONLY the question text.


Generate the next question now.

"""