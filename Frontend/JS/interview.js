console.log("INTERVIEW JS LOADED");

document.addEventListener("DOMContentLoaded", async () => {

    const params = new URLSearchParams(window.location.search);
    const candidateId = params.get("candidate");

    console.log("Candidate ID:", candidateId);

    if (!candidateId) {
        console.error("No candidate ID found in URL");
        return;
    }

    const questionText =
        document.getElementById("questionText");

    const questionDescription =
        document.getElementById("questionDescription");

    const answerInput =
        document.getElementById("answerInput");

    const sendAnswerBtn =
        document.getElementById("sendAnswerBtn");

    const characterCount =
        document.getElementById("characterCount");

    const questionNumber =
        document.getElementById("questionNumber");

    const totalQuestions =
        document.getElementById("totalQuestions");

    const questionProgress =
        document.getElementById("questionProgress");

    const timerElement =
        document.getElementById("timer");

    const pauseBtn =
        document.getElementById("pauseBtn");

    const endInterviewBtn =
        document.getElementById("endInterviewBtn");


    // =====================================================
    // SESSION
    // =====================================================

    const sessionId = crypto.randomUUID();

    let currentQuestion = 1;
    const total = 10;

    totalQuestions.textContent = total;


    // =====================================================
    // TIMER
    // =====================================================

    let elapsedSeconds = 0;
    let timerInterval = null;
    let paused = false;


    function updateTimer() {

        if (paused) {
            return;
        }

        elapsedSeconds++;

        const minutes =
            Math.floor(elapsedSeconds / 60);

        const seconds =
            elapsedSeconds % 60;

        timerElement.textContent =
            `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
    }


    timerInterval = setInterval(updateTimer, 1000);


    // =====================================================
    // PAUSE / RESUME INTERVIEW
    // =====================================================

    pauseBtn.addEventListener("click", () => {

        paused = !paused;

        if (paused) {

            // Stop timer
            clearInterval(timerInterval);

            pauseBtn.innerHTML =
                "▶ Resume Interview";

            // Disable answering while paused
            answerInput.disabled = true;
            sendAnswerBtn.disabled = true;

            // Show pause state
            questionDescription.textContent =
                "Interview paused. Resume when you're ready.";

            console.log("Interview paused");

        } else {

            // Resume timer
            timerInterval =
                setInterval(updateTimer, 1000);

            pauseBtn.innerHTML =
                "❚❚ Pause Interview";

            // Enable answering again
            answerInput.disabled = false;
            sendAnswerBtn.disabled = false;

            questionDescription.textContent =
                "Explain your reasoning and support your answer with a practical example.";

            console.log("Interview resumed");
        }

    });


    // =====================================================
    // LOAD CANDIDATE
    // =====================================================

    let candidate;

    try {

        const response =
            await fetch("/data/candidates.json");

        if (!response.ok) {
            throw new Error(
                "Could not load candidates.json"
            );
        }

        const data =
            await response.json();

        candidate =
            data.candidates.find(
                item => item.member.id === candidateId
            );

        if (!candidate) {
            throw new Error("Candidate not found");
        }

        console.log(
            "Candidate loaded:",
            candidate
        );

    } catch (error) {

        console.error(
            "Candidate loading error:",
            error
        );

        questionText.textContent =
            "Unable to load candidate.";

        return;
    }


    // =====================================================
    // START INTERVIEW
    // =====================================================

    try {

        console.log("Starting interview...");

        const response =
            await fetch("/api/interview", {

                method: "POST",

                headers: {
                    "Content-Type": "application/json"
                },

                body: JSON.stringify({
                    sessionId: sessionId,
                    candidate: candidate
                })

            });


        console.log(
            "API status:",
            response.status
        );


        if (!response.ok) {

            const error =
                await response.json();

            throw new Error(
                error.detail ||
                "Interview API failed"
            );
        }


        const result =
            await response.json();


        console.log(
            "Interview response:",
            result
        );


        displayQuestion(result.reply);


    } catch (error) {

        console.error(
            "Interview error:",
            error
        );

        questionText.textContent =
            "Unable to start interview.";

        questionDescription.textContent =
            error.message;
    }


    // =====================================================
    // DISPLAY QUESTION
    // =====================================================

    function displayQuestion(question) {

        console.log(
            "Displaying question:",
            question
        );

        questionText.textContent =
            question;

        questionDescription.textContent =
            "Explain your reasoning and support your answer with a practical example.";

        questionNumber.textContent =
            currentQuestion;

        questionProgress.style.width =
            `${(currentQuestion / total) * 100}%`;

        answerInput.value = "";

        characterCount.textContent =
            "0 characters";
    }


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
    // SEND ANSWER
    // =====================================================

    sendAnswerBtn.addEventListener(
        "click",
        async () => {

            const answer =
                answerInput.value.trim();


            if (!answer) {
                return;
            }


            // Don't allow submission while paused

            if (paused) {
                return;
            }


            try {

                sendAnswerBtn.disabled = true;

                sendAnswerBtn.textContent =
                    "Thinking...";


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

                    const error =
                        await response.json();

                    throw new Error(
                        error.detail ||
                        "Failed to submit answer"
                    );
                }


                const result =
                    await response.json();


                console.log(
                    "Next response:",
                    result
                );


                // =========================================
                // INTERVIEW COMPLETED
                // =========================================

              if (result.done) {

                console.log("Interview completed.");
                console.log("Feedback:", result.feedback);

                // Save feedback for the report page
                sessionStorage.setItem(
                    "interviewFeedback",
                    JSON.stringify(result.feedback)
                );

                // Save candidate information too
                sessionStorage.setItem(
                    "interviewCandidate",
                    JSON.stringify(candidate)
                );

                // Go to report page
                window.location.href = "report.html";

                return;
   }


                // =========================================
                // NEXT QUESTION
                // =========================================

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

                if (!paused) {

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

                if (!paused) {
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
        () => {

            const confirmEnd =
                confirm(
                    "Are you sure you want to end the interview?"
                );


            if (!confirmEnd) {
                return;
            }


            clearInterval(
                timerInterval
            );


            console.log(
                "Interview ended by candidate"
            );


            questionText.textContent =
                "Interview ended.";

            questionDescription.textContent =
                "You ended this interview before completing all questions.";

            answerInput.disabled =
                true;

            sendAnswerBtn.disabled =
                true;

            pauseBtn.disabled =
                true;

            endInterviewBtn.disabled =
                true;

        }
    );

});