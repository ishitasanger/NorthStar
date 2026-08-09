import json
from llm import generate_response


class AnswerEvaluator:

    def __init__(self, llm=None):
        self.llm = llm


    def evaluate(self, question, answer):

        # =====================================================
        # DO NOT EVALUATE EMPTY ANSWERS
        # =====================================================

        if answer is None or not str(answer).strip():

            return {
                "accuracy": 0,
                "depth": 0,
                "clarity": 0,
                "problem_solving": 0,
                "communication": 0,
                "system_reasoning": 0,
                "strength": "No answer provided.",
                "gap": "The candidate did not provide an answer.",
                "recommendation": "Complete the interview questions before evaluating performance."
            }


        # =====================================================
        # EVALUATE ANSWER
        # =====================================================

        prompt = f"""
You are a professional technical interviewer.

Question:
{question}

Candidate Answer:
{answer}

Evaluate the candidate's answer based on:

- correctness
- depth
- technical understanding
- clarity
- problem solving
- communication
- system reasoning

Give scores from 0 to 100.

Return ONLY valid JSON.
Do not use markdown code fences.
Do not include explanations before or after the JSON.

Use exactly these keys:

accuracy
depth
clarity
problem_solving
communication
system_reasoning
strength
gap
recommendation

The values for accuracy, depth, clarity, problem_solving,
communication and system_reasoning MUST be numbers from 0 to 100.

The values for strength, gap and recommendation MUST be
short strings.
"""


        response = generate_response(prompt)

        return json.loads(response)