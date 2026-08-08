class AnswerEvaluator:
    def __init__(self, llm=None):
        self.llm = llm

    def evaluate(self, question, answer):
        prompt = f"""
Question:
{question}

Candidate Answer:
{answer}

Evaluate the candidate's answer based on:
- correctness
- depth
- technical understanding
- clarity

Return JSON with:
accuracy
depth
clarity
strength
gap
recommendation
"""

        return prompt