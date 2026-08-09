from enum import Enum


class InterviewState(Enum):

    START = "start"

    QUESTIONING = "questioning"

    COMPLETED = "completed"


class Difficulty(Enum):

    EASY = "Easy"

    MEDIUM = "Medium"

    HARD = "Hard"


class InterviewStateMachine:

    def __init__(
        self,
        min_questions=8,
        max_questions=10
    ):

        self.state = InterviewState.START

        self.question_count = 0

        self.min_questions = min_questions

        self.max_questions = max_questions

        # =============================================
        # ADAPTIVE DIFFICULTY
        # =============================================

        self.difficulty = Difficulty.MEDIUM


    # =================================================
    # START
    # =================================================

    def start_interview(self):

        self.state =InterviewState.QUESTIONING


    # =================================================
    # QUESTION
    # =================================================

    def record_question(self):

        self.question_count += 1


    # =================================================
    # GET CURRENT DIFFICULTY
    # =================================================

    def get_difficulty(self):

        return self.difficulty.value


    # =================================================
    # UPDATE DIFFICULTY
    # =================================================

    def update_difficulty(
        self,
        evaluation
    ):

        if not isinstance(
            evaluation,
            dict
        ):

            return self.get_difficulty()


        # =============================================
        # GET IMPORTANT SCORES
        # =============================================

        scores = [

            evaluation.get(
                "accuracy",
                0
            ),

            evaluation.get(
                "depth",
                0
            ),

            evaluation.get(
                "problem_solving",
                0
            ),

            evaluation.get(
                "system_reasoning",
                0
            )

        ]


        valid_scores = []


        for score in scores:

            try:

                valid_scores.append(
                    float(score)
                )

            except (
                TypeError,
                ValueError
            ):

                pass


        if not valid_scores:

            return self.get_difficulty()


        average_score = (
            sum(valid_scores)
            /
            len(valid_scores)
        )


        print(
            "Adaptive difficulty score:",
            average_score
        )


        # =============================================
        # STRONG ANSWER
        # =============================================

        if average_score >= 80:

            if self.difficulty == Difficulty.EASY:

                self.difficulty =Difficulty.MEDIUM

            elif self.difficulty == Difficulty.MEDIUM:

                self.difficulty = Difficulty.HARD

            else:

                self.difficulty =Difficulty.HARD


        # =============================================
        # WEAK ANSWER
        # =============================================

        elif average_score < 55:

            if self.difficulty == Difficulty.HARD:

                self.difficulty =Difficulty.MEDIUM

            elif self.difficulty == Difficulty.MEDIUM:

                self.difficulty =Difficulty.EASY

            else:

                self.difficulty =Difficulty.EASY


        # =============================================
        # AVERAGE ANSWER
        # =============================================

        else:

            # Keep current difficulty

            pass


        print(
            "Next interview difficulty:",
            self.get_difficulty()
        )


        return self.get_difficulty()


    # =================================================
    # CONTINUE?
    # =================================================

    def should_continue(self):

        if self.question_count < self.min_questions:

            return True


        if self.question_count >= self.max_questions:

            return False


        return True


    # =================================================
    # COMPLETE
    # =================================================

    def complete_interview(self):

        self.state =InterviewState.COMPLETED