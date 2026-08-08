import json
from backend.llm import generate_response

class AnswerEvaluator:
    def __init__(self, llm=None):
        self.llm = llm

    def evaluate(self, question, answer):
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

Return ONLY valid JSON.
Do not use markdown code fences.
Do not include explanations before or after the JSON.

Use exactly these keys:
accuracy
depth
clarity
strength
gap
recommendation
"""

        response = generate_response(prompt)
        return json.loads(response)
