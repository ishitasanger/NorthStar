from .state_machine import InterviewStateMachine
from .context_manager import InterviewContext
from .feedback_generator import FeedbackGenerator
from llm import generate_response


class Interviewer:

    def __init__(self, llm=None):

        self.llm = llm

        self.state_machine = InterviewStateMachine()


    # =====================================================
    # START INTERVIEW
    # =====================================================

    def start(
        self,
        candidate,
        curriculum
    ):

        self.context = InterviewContext(
            candidate,
            curriculum
        )

        self.state_machine.start_interview()


    # =====================================================
    # GENERATE QUESTION
    # =====================================================

    def generate_question(self):

        # ---------------------------------------------
        # GET CURRENT DIFFICULTY
        # ---------------------------------------------

        difficulty = (
            self.state_machine.get_difficulty()
        )


        print(
            "Generating question at difficulty:",
            difficulty
        )


        # ---------------------------------------------
        # BUILD PROMPT WITH DIFFICULTY
        # ---------------------------------------------

        prompt = (
            self.context.build_interviewer_prompt(
                difficulty
            )
        )


        # ---------------------------------------------
        # GENERATE QUESTION
        # ---------------------------------------------

        question = generate_response(
            prompt
        )


        # ---------------------------------------------
        # SAVE QUESTION
        # ---------------------------------------------

        self.context.add_question(
            question
        )


        self.state_machine.record_question()


        print(
            "Question generated:",
            question
        )


        return question


    # =====================================================
    # PROCESS ANSWER
    # =====================================================

    def process_answer(
        self,
        answer
    ):

        # ---------------------------------------------
        # SAVE ANSWER
        # ---------------------------------------------

        self.context.add_answer(
            answer
        )


        # ---------------------------------------------
        # GET QUESTION
        # ---------------------------------------------

        question = (
            self.context.questions[-1]
        )


        # ---------------------------------------------
        # EVALUATE ANSWER
        # ---------------------------------------------

        from .evaluator import AnswerEvaluator


        evaluator = AnswerEvaluator()


        evaluation = (
            evaluator.evaluate(
                question,
                answer
            )
        )


        print(
            "Answer evaluation:",
            evaluation
        )


        # ---------------------------------------------
        # SAVE EVALUATION
        # ---------------------------------------------

        self.context.add_evaluation(
            evaluation
        )


        # ---------------------------------------------
        # UPDATE ADAPTIVE DIFFICULTY
        # ---------------------------------------------

        next_difficulty = (
            self.state_machine.update_difficulty(
                evaluation
            )
        )


        print(
            "Next question difficulty:",
            next_difficulty
        )


        # ---------------------------------------------
        # CHECK WHETHER INTERVIEW CONTINUES
        # ---------------------------------------------

        should_continue = (
            self.state_machine.should_continue()
        )


        if not should_continue:

            self.state_machine.complete_interview()


        return {

            "evaluation":
                evaluation,

            "should_continue":
                should_continue,

            "difficulty":
                next_difficulty
        }


    # =====================================================
    # GENERATE FINAL FEEDBACK
    # =====================================================

    def generate_feedback(self):

        feedback_generator = (
            FeedbackGenerator()
        )


        return (
            feedback_generator.generate_feedback(
                self.context
            )
        )