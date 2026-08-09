from agent.interviewer import Interviewer


# =========================================================
# IN-MEMORY INTERVIEW SESSIONS
# =========================================================

interview_sessions = {}


def create_session(session_id, candidate, curriculum):
    """
    Create a completely new interview session.
    """

    interviewer = Interviewer()

    interviewer.start(
        candidate,
        curriculum
    )

    interview_sessions[session_id] = interviewer

    return interviewer


def get_session(session_id):
    """
    Retrieve an active interview session.
    """

    return interview_sessions.get(session_id)


def remove_session(session_id):
    """
    Remove a completed interview session from memory.
    """

    return interview_sessions.pop(
        session_id,
        None
    )