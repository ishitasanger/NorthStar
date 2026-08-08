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