import os
from dotenv import load_dotenv
from groq import Groq

load_dotenv()

print("API KEY FOUND:", bool(os.getenv("GROQ_API_KEY")))


client = Groq(
    api_key=os.getenv("GROQ_API_KEY")
)


def generate_response(prompt: str) -> str:
    response = client.chat.completions.create(
        model="llama-3.3-70b-versatile",
        messages=[
            {
                "role": "user",
                "content": prompt
            }
        ],
        temperature=0.7
    )

    return response.choices[0].message.content
