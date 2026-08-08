from enum import Enum


class InterviewState(Enum):
    START = "start"
    QUESTIONING = "questioning"
    COMPLETED = "completed"

class InterviewStateMachine:
    def __init__(self, min_questions=8, max_questions=10):
        self.state = InterviewState.START
        self.question_count = 0
        self.min_questions = min_questions
        self.max_questions = max_questions

    def start_interview(self):
        self.state = InterviewState.QUESTIONING

    def record_question(self):
        self.question_count += 1

    def should_continue(self):
        if self.question_count < self.min_questions:
            return True

        if self.question_count >= self.max_questions:
            return False

        return True

    def complete_interview(self):
        self.state = InterviewState.COMPLETED