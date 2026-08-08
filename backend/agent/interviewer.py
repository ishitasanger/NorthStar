from .state_machine import InterviewStateMachine
from .context_manager import InterviewContext


class Interviewer:
    def __init__(self, llm=None):
        self.llm = llm
        self.state_machine = InterviewStateMachine()

    def start(self, candidate, curriculum):
        self.context = InterviewContext(candidate, curriculum)
        self.state_machine.start_interview()

    def generate_question(self):
        return self.context.questions