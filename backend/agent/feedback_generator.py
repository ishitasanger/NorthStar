import json

from llm import generate_response


class FeedbackGenerator:

    def __init__(self, llm=None):
        self.llm = llm


    def generate_feedback(self, context):

        prompt = f"""
You are a professional technical interviewer reviewing a completed technical interview.

Interview Questions:
{context.questions}

Candidate Answers:
{context.answers}

Evaluations:
{context.evaluations}

Candidate:
{context.candidate}

Generate a concise but useful final interview performance report.

Return ONLY valid JSON.
Do not use markdown code fences.
Do not include any explanation before or after the JSON.

Use EXACTLY these keys:

summary
overall_score
questions_answered
strengths
gaps
next_steps
skills
topics

Requirements:

1. summary:
   A short 2-3 sentence overall assessment.

2. overall_score:
   An integer from 0 to 100 based on the candidate's overall interview performance.

3. questions_answered:
   The number of questions the candidate answered.

4. strengths:
   A JSON array of 3-5 concise strengths.

5. gaps:
   A JSON array of 3-5 concise areas for improvement.

6. next_steps:
   A JSON array of 3-5 specific recommendations for improvement.

7. skills:
   Return an object containing scores from 0 to 100 for:
   - technical_skills
   - communication
   - problem_solving
   - system_reasoning

8. topics:
   Return an array of objects.

   Each object must contain:
   - topic
   - score
   - comment

Use only topics that are actually relevant to the interview questions and answers.

Important:
- Do not invent achievements that are not supported by the interview.
- Base scores on the candidate's actual answers and evaluations.
- Keep comments concise.
- Make the report specific to this candidate.
"""

        response = generate_response(prompt)

        # =====================================================
        # CLEAN LLM RESPONSE
        # =====================================================

        response = response.strip()

        if response.startswith("```json"):
            response = response[7:]

        elif response.startswith("```"):
            response = response[3:]

        if response.endswith("```"):
            response = response[:-3]

        response = response.strip()


        # =====================================================
        # PARSE FEEDBACK
        # =====================================================

        feedback = json.loads(response)


        # =====================================================
        # TRUE AVERAGE ACCURACY
        # =====================================================

        evaluations = context.evaluations

        accuracy_scores = []

        if isinstance(evaluations, list):

            for evaluation in evaluations:

                if not isinstance(evaluation, dict):
                    continue

                accuracy =evaluation.get("accuracy")

                if accuracy is None:
                    continue

                try:

                    accuracy = float(accuracy)

                    if 0 <= accuracy <= 100:

                        accuracy_scores.append(
                            accuracy
                        )

                except (
                    TypeError,
                    ValueError
                ):

                    pass


        # =====================================================
        # SAVE TRUE AVERAGE ACCURACY
        # =====================================================

        if accuracy_scores:

            average_accuracy = (
                sum(accuracy_scores)
                / len(accuracy_scores)
            )

            feedback["average_accuracy"] = round(
                average_accuracy,
                1
            )

        else:

            feedback["average_accuracy"] = None


        return feedback