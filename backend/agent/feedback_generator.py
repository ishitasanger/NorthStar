class FeedbackGenerator:
    def __init__(self, llm=None):
        self.llm = llm
    def generate_feedback(self, context):
        prompt = f"""
Interview Questions:
{context.questions}

Candidate Answers:
{context.answers}

Evaluations:
{context.evaluations}

Generate the final interview feedback.
Include:
- summary
- strengths
- gaps
- next
"""

        return prompt