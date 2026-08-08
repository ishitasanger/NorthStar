import json
from backend.llm import generate_response

class FeedbackGenerator:
    def __init__(self, llm=None):
        self.llm = llm

    def generate_feedback(self, context):
        prompt = f"""
You are a professional technical interviewer reviewing a completed interview.

Interview Questions:
{context.questions}

Candidate Answers:
{context.answers}

Evaluations:
{context.evaluations}

Generate a concise final interview feedback report.

Include:
- summary
- strengths
- gaps
- next_steps

Return ONLY valid JSON.
Do not use markdown code fences.
Do not include explanations before or after the JSON.

Use exactly these keys:
summary
strengths
gaps
next_steps
"""

        response = generate_response(prompt)
        return json.loads(response)