from agent.interviewer import Interviewer

interview_sessions = {}


def create_session(session_id, candidate, curriculum):
    interviewer = Interviewer()

    interviewer.start(
        candidate,
        curriculum
    )

    interview_sessions[session_id] = interviewer

    return interviewer


def get_session(session_id):
    return interview_sessions.get(session_id)


def remove_session(session_id):
    return interview_sessions.pop(session_id, None)