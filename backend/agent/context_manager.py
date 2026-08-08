from .data_loader import load_candidates, load_curriculum
class InterviewContext:
    def __init__(self, candidate=None, curriculum=None):
        self.candidate = candidate
        self.curriculum = curriculum
        self.questions = []
        self.answers = []
        self.evaluations = []

    def add_question(self, question):
        self.questions.append(question)

    def add_answer(self, answer):
        self.answers.append(answer)

    def add_evaluation(self, evaluation):
        self.evaluations.append(evaluation)

    def get_history(self):
        return {
            "questions": self.questions,
            "answers": self.answers,
            "evaluations": self.evaluations
        }
    def set_candidate(self, candidate):
        self.candidate = candidate
    
    def load_data(self):
        self.candidates = load_candidates()
        self.curriculum = load_curriculum()

    def build_interviewer_prompt(self):
        candidate = self.candidate["member"]

        return f"""
You are a professional technical interviewer conducting an adaptive technical interview.

Candidate:
Name: {candidate["name"]}
Role: {candidate["jobRole"]}
Experience: {candidate["yearsExperience"]} years
Education: {candidate["education"]}

Relevant curriculum:
{self.curriculum["modules"]}

Previous Questions:
{self.questions}

Previous Answers:
{self.answers}

Previous Evaluations:
{self.evaluations}

Your task is to ask the NEXT technical interview question.

IMPORTANT ADAPTIVE INTERVIEW RULES:

1. If there is a previous question and answer, use the candidate's MOST RECENT answer to decide what to ask next.

2. The next question should naturally follow from the candidate's previous answer whenever possible.

3. If the candidate demonstrated strong understanding, increase the difficulty or ask a deeper follow-up question.

4. If the candidate's answer was partially correct or incomplete, ask a targeted follow-up that tests the missing concept.

5. If the candidate's answer was incorrect, ask a simpler clarifying question or test the underlying concept again.

6. Do not repeat a question that has already been asked.

7. Stay within the relevant technical curriculum and the candidate's job role.

8. The interview should feel like a real conversation, where each question follows logically from the candidate's response.

9. Ask exactly ONE question.

10. Return ONLY the question. Do not provide an explanation, evaluation, or answer.

Generate the next question now.
"""