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
You are a professional technical interviewer.

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

Ask the next technical interview question.

Requirements:
- Sound like a real human interviewer.
- Be professional and conversational.
- Adapt to the candidate's experience and previous answers.
- Ask one question at a time.
- Do not explain the question.
- Do not mention that you are an AI.
- Return only the question.
"""