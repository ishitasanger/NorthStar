from fastapi import FastAPI
from fastapi.staticfiles import StaticFiles

from api.interview import router as interview_router


app = FastAPI(
    title="AI Interview Agent",
    description="AI-powered technical interview agent",
    version="1.0.0"
)


# Interview API
app.include_router(interview_router)


# Candidate and curriculum data
app.mount(
    "/data",
    StaticFiles(directory="data"),
    name="data"
)


# Frontend
app.mount(
    "/",
    StaticFiles(directory="../Frontend", html=True),
    name="frontend"
)


@app.get("/api-status")
def api_status():
    return {
        "message": "AI Interview Agent is running"
    }