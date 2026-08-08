from .state_machine import InterviewStateMachine
from .context_manager import InterviewContext
from .feedback_generator import FeedbackGenerator
from llm import generate_response


class Interviewer:
    def __init__(self, llm=None):
        self.llm = llm
        self.state_machine = InterviewStateMachine()

    def start(self, candidate, curriculum):
        self.context = InterviewContext(candidate, curriculum)
        self.state_machine.start_interview()

    def generate_question(self):
        prompt = self.context.build_interviewer_prompt()
        question = generate_response(prompt)

        self.context.add_question(question)
        self.state_machine.record_question()

        return question

    def process_answer(self, answer):
        self.context.add_answer(answer)

        question = self.context.questions[-1]

        from .evaluator import AnswerEvaluator

        evaluator = AnswerEvaluator()
        evaluation = evaluator.evaluate(question, answer)

        self.context.add_evaluation(evaluation)

        should_continue = self.state_machine.should_continue()

        return {
            "evaluation": evaluation,
            "should_continue": should_continue
        }

    def generate_feedback(self):
   
        feedback_generator = FeedbackGenerator()

        return feedback_generator.generate_feedback(
            self.context
        )