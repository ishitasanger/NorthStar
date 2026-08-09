console.log("INTERVIEW JS LOADED");


document.addEventListener(
    "DOMContentLoaded",
    async () => {


        // =====================================================
        // DOM ELEMENTS
        // =====================================================

        const questionText =
            document.getElementById(
                "questionText"
            );


        const questionDescription =
            document.getElementById(
                "questionDescription"
            );


        const answerInput =
            document.getElementById(
                "answerInput"
            );


        const sendAnswerBtn =
            document.getElementById(
                "sendAnswerBtn"
            );


        const characterCount =
            document.getElementById(
                "characterCount"
            );


        const questionNumber =
            document.getElementById(
                "questionNumber"
            );


        const totalQuestions =
            document.getElementById(
                "totalQuestions"
            );


        const questionProgress =
            document.getElementById(
                "questionProgress"
            );


        const timerElement =
            document.getElementById(
                "timer"
            );


        const startInterviewBtn =
            document.getElementById(
                "startInterviewBtn"
            );


        const pauseBtn =
            document.getElementById(
                "pauseBtn"
            );


        const endInterviewBtn =
            document.getElementById(
                "endInterviewBtn"
            );

        const difficultyPill =
            document.getElementById(
                "difficultyPill"
            );

        // =====================================================
        // UPDATE ADAPTIVE DIFFICULTY PILL
        // =====================================================

        function updateDifficultyPill(
            difficulty
        ) {

            if (!difficultyPill) {
                return;
            }


            if (!difficulty) {
                return;
            }


            difficultyPill.textContent =
                `Adaptive • ${difficulty}`;


            console.log(
                "Interview difficulty updated:",
                difficulty
            );
        }


        // =====================================================
        // GET CANDIDATE ID
        // =====================================================

        const params =
            new URLSearchParams(
                window.location.search
            );


        const urlCandidateId =
            params.get("candidate");


        const storedCandidateId =
            sessionStorage.getItem(
                "selectedCandidateId"
            );


        const candidateId =
            urlCandidateId ||
            storedCandidateId;


        console.log(
            "Candidate ID:",
            candidateId
        );


        if (!candidateId) {

            console.error(
                "No candidate selected."
            );


            questionText.textContent =
                "No candidate selected.";


            questionDescription.textContent =
                "Please select a candidate before starting an interview.";


            startInterviewBtn.disabled =
                true;


            return;
        }


        // Keep selected candidate available

        sessionStorage.setItem(
            "selectedCandidateId",
            candidateId
        );


        // =====================================================
        // SESSION
        // =====================================================

        let sessionId =
            sessionStorage.getItem(
                "interviewSessionId"
            );


        const interviewSessionCandidateId =
            sessionStorage.getItem(
                "interviewSessionCandidateId"
            );


        const candidateChanged =
            interviewSessionCandidateId &&
            interviewSessionCandidateId !== candidateId;


        if (
            !sessionId ||
            candidateChanged
        ) {

            console.log(
                "Creating NEW interview session."
            );


            console.log(
                "Previous session:",
                sessionId
            );


            console.log(
                "Previous session candidate:",
                interviewSessionCandidateId
            );


            console.log(
                "New candidate:",
                candidateId
            );


            // =============================================
            // CLEAR OLD INTERVIEW STATE
            // =============================================

            sessionStorage.removeItem(
                "interviewSessionId"
            );


            sessionStorage.removeItem(
                "interviewSessionCandidateId"
            );


            sessionStorage.removeItem(
                "interviewFeedback"
            );


            sessionStorage.removeItem(
                "interviewHistory"
            );


            sessionStorage.removeItem(
                "interviewDuration"
            );


            sessionStorage.removeItem(
                "interviewAvgResponseTime"
            );


            sessionStorage.removeItem(
                "interviewResponseTimes"
            );


            sessionStorage.removeItem(
                "interviewCandidate"
            );


            // =============================================
            // CLEAR ANSWER COUNT FOR NEW INTERVIEW
            // =============================================

            sessionStorage.removeItem(
                "interviewAnsweredQuestions"
            );


            // =============================================
            // CREATE NEW SESSION
            // =============================================

            sessionId =
                crypto.randomUUID();


            sessionStorage.setItem(
                "interviewSessionId",
                sessionId
            );


            sessionStorage.setItem(
                "interviewSessionCandidateId",
                candidateId
            );


        } else {

            console.log(
                "Continuing existing interview session."
            );
        }


        console.log(
            "Interview Session ID:",
            sessionId
        );


        console.log(
            "Interview Session Candidate:",
            sessionStorage.getItem(
                "interviewSessionCandidateId"
            )
        );


        // =====================================================
        // INTERVIEW STATE
        // =====================================================

        let currentQuestion = 1;


        const total = 10;


        totalQuestions.textContent =
            total;


        // =====================================================
        // INTERVIEW STATUS
        // =====================================================

        let interviewStarted = false;


        // =====================================================
        // ANSWER COUNT
        // =====================================================

        /*
         * This tracks how many answers were actually
         * submitted successfully.
         *
         * It is stored in sessionStorage so the count
         * survives navigation during the same interview.
         */

        let answeredQuestions =
            Number(
                sessionStorage.getItem(
                    "interviewAnsweredQuestions"
                )
            ) || 0;


        console.log(
            "Previously answered questions:",
            answeredQuestions
        );


        // =====================================================
        // RESPONSE TIME TRACKING
        // =====================================================

        let questionShownAt =
            null;


        let responseTimes = [];


        let responseTimerPausedAt =
            null;


        let pausedResponseDuration =
            0;


        function startResponseTimer() {

            questionShownAt =
                Date.now();


            responseTimerPausedAt =
                null;


            pausedResponseDuration =
                0;
        }


        function pauseResponseTimer() {

            if (
                questionShownAt !== null &&
                responseTimerPausedAt === null
            ) {

                responseTimerPausedAt =
                    Date.now();
            }
        }


        function resumeResponseTimer() {

            if (
                questionShownAt !== null &&
                responseTimerPausedAt !== null
            ) {

                pausedResponseDuration +=
                    Date.now() -
                    responseTimerPausedAt;


                responseTimerPausedAt =
                    null;
            }
        }


        function recordResponseTime() {

            if (
                questionShownAt === null
            ) {

                return;
            }


            if (
                responseTimerPausedAt !== null
            ) {

                return;
            }


            const elapsedMilliseconds =
                Date.now() -
                questionShownAt -
                pausedResponseDuration;


            const responseTime =
                Math.max(
                    0,
                    elapsedMilliseconds / 1000
                );


            responseTimes.push(
                responseTime
            );


            console.log(
                "Response time:",
                responseTime.toFixed(2),
                "seconds"
            );


            questionShownAt =
                null;


            responseTimerPausedAt =
                null;


            pausedResponseDuration =
                0;
        }


        function getAverageResponseTime() {

            if (
                responseTimes.length === 0
            ) {

                return 0;
            }


            const totalTime =
                responseTimes.reduce(
                    (sum, time) =>
                        sum + time,
                    0
                );


            return (
                totalTime /
                responseTimes.length
            );
        }


        // =====================================================
        // INTERVIEW TIMER
        // =====================================================

        let elapsedSeconds =
            0;


        let timerInterval =
            null;


        let paused =
            false;


        function updateTimer() {

            if (paused) {
                return;
            }


            elapsedSeconds++;


            const minutes =
                Math.floor(
                    elapsedSeconds / 60
                );


            const seconds =
                elapsedSeconds % 60;


            timerElement.textContent =
                `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
        }


        function startTimer() {

            if (timerInterval !== null) {
                return;
            }


            timerInterval =
                setInterval(
                    updateTimer,
                    1000
                );
        }


        function stopTimer() {

            if (
                timerInterval !== null
            ) {

                clearInterval(
                    timerInterval
                );


                timerInterval =
                    null;
            }
        }


        // =====================================================
        // LOAD CANDIDATE
        // =====================================================

        let candidate;


        try {

            const response =
                await fetch(
                    "/data/candidates.json"
                );


            if (!response.ok) {

                throw new Error(
                    "Could not load candidates.json"
                );
            }


            const data =
                await response.json();


            candidate =
                data.candidates.find(
                    item =>
                        item.member.id ===
                        candidateId
                );


            if (!candidate) {

                throw new Error(
                    "Candidate not found"
                );
            }


            console.log(
                "Candidate loaded:",
                candidate
            );


            sessionStorage.setItem(
                "interviewCandidate",
                JSON.stringify(candidate)
            );


            sessionStorage.setItem(
                "interviewSessionCandidateId",
                candidateId
            );


        } catch (error) {

            console.error(
                "Candidate loading error:",
                error
            );


            questionText.textContent =
                "Unable to load candidate.";


            questionDescription.textContent =
                error.message;


            startInterviewBtn.disabled =
                true;


            return;
        }


        // =====================================================
        // INITIAL UI STATE
        // =====================================================

        questionText.textContent =
            "Ready to begin your interview.";


        questionDescription.textContent =
            "Click Start Interview when you're ready. Your first question will be generated by the AI interviewer.";


        timerElement.textContent =
            "00:00";


        questionNumber.textContent =
            "1";


        questionProgress.style.width =
            "0%";


        answerInput.value =
            "";


        answerInput.disabled =
            true;


        sendAnswerBtn.disabled =
            true;


        pauseBtn.disabled =
            true;


        endInterviewBtn.disabled =
            true;


        startInterviewBtn.disabled =
            false;


        // =====================================================
        // DISPLAY QUESTION
        // =====================================================

        function displayQuestion(
    question
) {

    questionText.textContent =
        question;


    questionDescription.textContent =
        "Explain your reasoning and support your answer with a practical example.";


    questionNumber.textContent =
        currentQuestion;


    questionProgress.style.width =
        `${(currentQuestion / total) * 100}%`;


    answerInput.value =
        "";


    // Update the textbox placeholder after
    // the interview has started
    answerInput.placeholder =
        "Type your answer here... Explain your reasoning, implementation details, and practical examples.";


    characterCount.textContent =
        "0 characters";


    answerInput.disabled =
        false;


    sendAnswerBtn.disabled =
        false;


    startResponseTimer();
}


        // =====================================================
        // START INTERVIEW
        // =====================================================

        async function startInterview() {

            if (interviewStarted) {
                return;
            }


            if (!candidate) {

                console.error(
                    "Cannot start interview without candidate."
                );


                return;
            }


            interviewStarted =
                true;


            startInterviewBtn.disabled =
                true;


            startInterviewBtn.innerHTML =
                "<span>⏳</span> Starting...";


            questionText.textContent =
                "Preparing your first question...";


            questionDescription.textContent =
                "The AI interviewer is preparing your personalized question.";


            answerInput.disabled =
                true;


            sendAnswerBtn.disabled =
                true;


            pauseBtn.disabled =
                true;


            endInterviewBtn.disabled =
                true;


            try {

                console.log(
                    "Starting interview..."
                );


                console.log(
                    "Sending session:",
                    sessionId
                );


                console.log(
                    "Sending candidate:",
                    candidate.member.id
                );


                const response =
                    await fetch(
                        "/api/interview",
                        {
                            method: "POST",

                            headers: {
                                "Content-Type":
                                    "application/json"
                            },

                            body: JSON.stringify({

                                sessionId:
                                    sessionId,

                                candidate:
                                    candidate

                            })
                        }
                    );


                if (!response.ok) {

                    let errorMessage =
                        "Interview API failed";


                    try {

                        const error =
                            await response.json();


                        errorMessage =
                            error.detail ||
                            errorMessage;

                    } catch (parseError) {

                        console.error(
                            "Could not parse API error:",
                            parseError
                        );
                    }


                    throw new Error(
                        errorMessage
                    );
                }


                const result =
                    await response.json();


                console.log(
                    "Interview response:",
                    result
                );

                updateDifficultyPill(
                    result.difficulty
                );


                if (!result.reply) {

                    throw new Error(
                        "The interview API did not return a question."
                    );
                }


                interviewStarted =
                    true;


                paused =
                    false;


                startInterviewBtn.innerHTML =
                    "<span>✓</span> Interview Started";


                pauseBtn.disabled =
                    false;


                endInterviewBtn.disabled =
                    false;


                startTimer();


                displayQuestion(
                    result.reply
                );


            } catch (error) {

                console.error(
                    "Interview error:",
                    error
                );


                interviewStarted =
                    false;


                stopTimer();


                questionText.textContent =
                    "Unable to start interview.";


                questionDescription.textContent =
                    error.message;


                startInterviewBtn.disabled =
                    false;


                startInterviewBtn.innerHTML =
                    "<span>▶</span> Start Interview";


                pauseBtn.disabled =
                    true;


                endInterviewBtn.disabled =
                    true;


                answerInput.disabled =
                    true;


                sendAnswerBtn.disabled =
                    true;
            }
        }


        // =====================================================
        // START BUTTON
        // =====================================================

        startInterviewBtn.addEventListener(
            "click",
            startInterview
        );


        // =====================================================
        // PAUSE / RESUME
        // =====================================================

        pauseBtn.addEventListener(
            "click",
            () => {

                if (!interviewStarted) {
                    return;
                }


                paused =
                    !paused;


                if (paused) {

                    stopTimer();


                    pauseResponseTimer();


                    pauseBtn.innerHTML =
                        "▶ Resume Interview";


                    answerInput.disabled =
                        true;


                    sendAnswerBtn.disabled =
                        true;


                    questionDescription.textContent =
                        "Interview paused. Resume when you're ready.";


                } else {

                    resumeResponseTimer();


                    startTimer();


                    pauseBtn.innerHTML =
                        "❚❚ Pause Interview";


                    answerInput.disabled =
                        false;


                    sendAnswerBtn.disabled =
                        false;


                    questionDescription.textContent =
                        "Explain your reasoning and support your answer with a practical example.";
                }

            }
        );


        // =====================================================
        // CHARACTER COUNT
        // =====================================================

        answerInput.addEventListener(
            "input",
            () => {

                characterCount.textContent =
                    `${answerInput.value.length} characters`;
            }
        );


        // =====================================================
        // SAVE FINAL INTERVIEW DATA
        // =====================================================

        function saveInterviewData(
            feedback,
            interviewHistory
        ) {

            // =============================================
            // SAVE FEEDBACK
            // =============================================

            if (feedback) {

                sessionStorage.setItem(
                    "interviewFeedback",
                    JSON.stringify(
                        feedback
                    )
                );
            }


            // =============================================
            // SAVE INTERVIEW HISTORY
            // =============================================

            if (interviewHistory) {

                sessionStorage.setItem(
                    "interviewHistory",
                    JSON.stringify(
                        interviewHistory
                    )
                );


                console.log(
                    "Interview history saved for Smart Analysis:",
                    interviewHistory
                );
            }


            // =============================================
            // SAVE CANDIDATE
            // =============================================

            sessionStorage.setItem(
                "interviewCandidate",
                JSON.stringify(
                    candidate
                )
            );


            sessionStorage.setItem(
                "selectedCandidateId",
                candidate.member.id
            );


            sessionStorage.setItem(
                "interviewSessionCandidateId",
                candidate.member.id
            );


            // =============================================
            // SAVE DURATION
            // =============================================

            sessionStorage.setItem(
                "interviewDuration",
                timerElement.textContent
            );


            // =============================================
            // SAVE RESPONSE TIME
            // =============================================

            const averageResponseTime =
                getAverageResponseTime();


            sessionStorage.setItem(
                "interviewAvgResponseTime",
                averageResponseTime.toFixed(1)
            );


            sessionStorage.setItem(
                "interviewResponseTimes",
                JSON.stringify(
                    responseTimes
                )
            );


            console.log(
                "Final duration:",
                timerElement.textContent
            );


            console.log(
                "Response times:",
                responseTimes
            );


            console.log(
                "Average response time:",
                averageResponseTime.toFixed(1),
                "seconds"
            );
        }


        // =====================================================
        // SEND ANSWER
        // =====================================================

        sendAnswerBtn.addEventListener(
            "click",
            async () => {

                if (!interviewStarted) {
                    return;
                }


                const answer =
                    answerInput.value.trim();


                if (!answer) {
                    return;
                }


                if (paused) {
                    return;
                }


                recordResponseTime();


                try {

                    sendAnswerBtn.disabled =
                        true;


                    sendAnswerBtn.innerHTML =
                        "<span>⏳</span> Thinking...";


                    const response =
                        await fetch(
                            "/api/interview",
                            {
                                method: "POST",

                                headers: {
                                    "Content-Type":
                                        "application/json"
                                },

                                body: JSON.stringify({

                                    sessionId:
                                        sessionId,

                                    message:
                                        answer

                                })
                            }
                        );


                    if (!response.ok) {

                        let errorMessage =
                            "Failed to submit answer";


                        try {

                            const error =
                                await response.json();


                            errorMessage =
                                error.detail ||
                                errorMessage;

                        } catch (parseError) {

                            console.error(
                                "Could not parse answer error:",
                                parseError
                            );
                        }


                        throw new Error(
                            errorMessage
                        );
                    }


                    const result =
                        await response.json();


                    console.log(
                        "Next response:",
                        result
                    );

                    updateDifficultyPill(
                            result.difficulty
                        );


                    // =============================================
                    // ANSWER SUCCESSFULLY SUBMITTED
                    // =============================================

                    answeredQuestions++;


                    sessionStorage.setItem(
                        "interviewAnsweredQuestions",
                        String(answeredQuestions)
                    );


                    console.log(
                        "Answers submitted:",
                        answeredQuestions
                    );


                    // =============================================
                    // NATURAL COMPLETION
                    // =============================================

                    if (result.done) {

                        console.log(
                            "Interview completed naturally."
                        );


                        saveInterviewData(
                            result.feedback,
                            result.interview_history
                        );


                        stopTimer();


                        interviewStarted =
                            false;


                        window.location.href =
                            "report.html";


                        return;
                    }


                    // =============================================
                    // NEXT QUESTION
                    // =============================================

                    currentQuestion++;


                    displayQuestion(
                        result.reply
                    );


                } catch (error) {

                    console.error(
                        "Answer error:",
                        error
                    );


                    alert(
                        error.message
                    );


                } finally {

                    if (
                        interviewStarted &&
                        !paused
                    ) {

                        sendAnswerBtn.disabled =
                            false;
                    }


                    sendAnswerBtn.innerHTML =
                        "<span>➤</span> Send Answer";
                }

            }
        );


        // =====================================================
        // CTRL + ENTER
        // =====================================================

        answerInput.addEventListener(
            "keydown",
            event => {

                if (
                    event.ctrlKey &&
                    event.key === "Enter"
                ) {

                    event.preventDefault();


                    if (
                        interviewStarted &&
                        !paused
                    ) {

                        sendAnswerBtn.click();
                    }
                }
            }
        );


        // =====================================================
        // END INTERVIEW
        // =====================================================

        endInterviewBtn.addEventListener(
            "click",
            async () => {

                if (!interviewStarted) {
                    return;
                }


                // =================================================
                // DO NOT END AN INTERVIEW WITH ZERO ANSWERS
                // =================================================

                if (
                    answeredQuestions === 0
                ) {

                    alert(
                        "Please answer at least one question before ending the interview."
                    );


                    return;
                }


                const confirmEnd =
                    confirm(
                        "Are you sure you want to end the interview?"
                    );


                if (!confirmEnd) {
                    return;
                }


                try {

                    if (!paused) {

                        recordResponseTime();
                    }


                    stopTimer();


                    endInterviewBtn.disabled =
                        true;


                    pauseBtn.disabled =
                        true;


                    sendAnswerBtn.disabled =
                        true;


                    answerInput.disabled =
                        true;


                    endInterviewBtn.innerHTML =
                        "<span>⏳</span> Generating Report...";


                    console.log(
                        "Ending interview..."
                    );


                    console.log(
                        "Answers submitted:",
                        answeredQuestions
                    );


                    const response =
                        await fetch(
                            "/api/interview",
                            {
                                method: "POST",

                                headers: {
                                    "Content-Type":
                                        "application/json"
                                },

                                body: JSON.stringify({

                                    sessionId:
                                        sessionId,

                                    endInterview:
                                        true

                                })
                            }
                        );


                    if (!response.ok) {

                        let errorMessage =
                            "Failed to generate interview report";


                        try {

                            const error =
                                await response.json();


                            errorMessage =
                                error.detail ||
                                errorMessage;

                        } catch (parseError) {

                            console.error(
                                "Could not parse end interview error:",
                                parseError
                            );
                        }


                        throw new Error(
                            errorMessage
                        );
                    }


                    const result =
                        await response.json();


                    console.log(
                        "Final interview result:",
                        result
                    );


                    // =============================================
                    // SAVE FEEDBACK + INTERVIEW HISTORY
                    // =============================================

                    saveInterviewData(
                        result.feedback,
                        result.interview_history
                    );


                    interviewStarted =
                        false;


                    window.location.href =
                        "report.html";


                } catch (error) {

                    console.error(
                        "End interview error:",
                        error
                    );


                    alert(
                        error.message
                    );


                    if (interviewStarted) {

                        if (!paused) {

                            startTimer();
                        }


                        endInterviewBtn.disabled =
                            false;


                        pauseBtn.disabled =
                            false;


                        answerInput.disabled =
                            paused;


                        sendAnswerBtn.disabled =
                            paused;
                    }


                    endInterviewBtn.innerHTML =
                        "<span>■</span> End Interview";
                }

            }
        );


    }
);