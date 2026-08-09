console.log("SMART ANALYSIS JS LOADED");

document.addEventListener("DOMContentLoaded", () => {

    // =====================================================
    // DOM ELEMENTS
    // =====================================================

    const loadingSection =
        document.getElementById("loadingSection");

    const errorSection =
        document.getElementById("errorSection");

    const analysisSection =
        document.getElementById("analysisSection");

    const analysisContainer =
        document.getElementById("analysisContainer");

    const errorMessage =
        document.getElementById("errorMessage");

    const retryBtn =
        document.getElementById("retryBtn");

    const backBtn =
        document.getElementById("backBtn");

    const backToReport =
        document.getElementById("backToReport");


    // =====================================================
    // GET SAVED INTERVIEW DATA
    // =====================================================

    function getInterviewData() {

        let interviewHistory = null;

        let interviewCandidate = null;

        try {

            const historyRaw =
                sessionStorage.getItem(
                    "interviewHistory"
                );

            const candidateRaw =
                sessionStorage.getItem(
                    "interviewCandidate"
                );


            if (historyRaw) {

                interviewHistory =
                    JSON.parse(historyRaw);

            }


            if (candidateRaw) {

                interviewCandidate =
                    JSON.parse(candidateRaw);

            }

        }

        catch (error) {

            console.error(
                "Error reading sessionStorage:",
                error
            );

        }


        return {
            interviewHistory,
            interviewCandidate
        };

    }


    // =====================================================
    // GET SESSION ID
    // =====================================================

    function getSessionId() {

        return (

            sessionStorage.getItem("sessionId") ||

            sessionStorage.getItem(
                "interviewSessionId"
            ) ||

            null

        );

    }


    // =====================================================
    // SHOW / HIDE SECTIONS
    // =====================================================

    function showLoading() {

        if (loadingSection) {

            loadingSection.style.display =
                "flex";

        }

        if (errorSection) {

            errorSection.style.display =
                "none";

        }

        if (analysisSection) {

            analysisSection.style.display =
                "none";

        }

    }


    function showError(message) {

        if (loadingSection) {

            loadingSection.style.display =
                "none";

        }

        if (analysisSection) {

            analysisSection.style.display =
                "none";

        }

        if (errorMessage) {

            errorMessage.textContent =
                message ||
                "Something went wrong.";

        }

        if (errorSection) {

            errorSection.style.display =
                "flex";

        }

    }


    function showAnalysis() {

        if (loadingSection) {

            loadingSection.style.display =
                "none";

        }

        if (errorSection) {

            errorSection.style.display =
                "none";

        }

        if (analysisSection) {

            analysisSection.style.display =
                "block";

        }

    }


    // =====================================================
    // ESCAPE HTML
    // =====================================================

    function escapeHTML(value) {

        if (
            value === null ||
            value === undefined
        ) {

            return "";

        }


        return String(value)

            .replace(
                /&/g,
                "&amp;"
            )

            .replace(
                /</g,
                "&lt;"
            )

            .replace(
                />/g,
                "&gt;"
            )

            .replace(
                /"/g,
                "&quot;"
            )

            .replace(
                /'/g,
                "&#039;"
            );

    }


    // =====================================================
    // NORMALIZE LIST DATA
    // =====================================================

    function normalizeList(value) {

        if (!value) {

            return [];

        }


        if (Array.isArray(value)) {

            return value;

        }


        if (typeof value === "string") {

            return value

                .split("\n")

                .map(
                    item =>
                        item.trim()
                )

                .filter(Boolean);

        }


        return [];

    }


    // =====================================================
    // CREATE LIST HTML
    // =====================================================

    function createList(items) {

        const list =
            normalizeList(items);


        if (list.length === 0) {

            return `
                <li>
                    No specific points identified.
                </li>
            `;

        }


        return list

            .map(item => {

                return `
                    <li>
                        ${escapeHTML(item)}
                    </li>
                `;

            })

            .join("");

    }


    // =====================================================
    // GET VALUE FROM MULTIPLE POSSIBLE KEYS
    // =====================================================

    function getValue(
        object,
        keys,
        fallback = ""
    ) {

        if (
            !object ||
            typeof object !== "object"
        ) {

            return fallback;

        }


        for (const key of keys) {

            if (
                object[key] !== undefined &&
                object[key] !== null
            ) {

                return object[key];

            }

        }


        return fallback;

    }


    // =====================================================
    // CREATE QUESTION ANALYSIS CARD
    // =====================================================

    function createAnalysisCard(
        analysis,
        index
    ) {

        const question =
            getValue(
                analysis,
                [
                    "question",
                    "questionText",
                    "interview_question"
                ],
                `Question ${index + 1}`
            );


        const candidateAnswer =
            getValue(
                analysis,
                [
                    "candidate_answer",
                    "candidateAnswer",
                    "answer",
                    "user_answer"
                ],
                "No answer available."
            );


        const idealAnswer =
            getValue(
                analysis,
                [
                    "ideal_answer",
                    "idealAnswer",
                    "expected_answer",
                    "better_answer"
                ],
                "No ideal answer provided."
            );


        const missingConcepts =
            getValue(
                analysis,
                [
                    "missing_concepts",
                    "missingConcepts",
                    "concepts_missing"
                ],
                []
            );


        const additionalPoints =
            getValue(
                analysis,
                [
                    "additional_points",
                    "additionalPoints",
                    "points_to_add",
                    "improvements"
                ],
                []
            );


        const wrongPoints =
            getValue(
                analysis,
                [
                    "wrong_points",
                    "wrongPoints",
                    "incorrect_points",
                    "errors"
                ],
                []
            );


        const improvement =
            getValue(
                analysis,
                [
                    "improvement",
                    "improvement_suggestion",
                    "improvementSuggestion",
                    "suggestion"
                ],
                "Focus on explaining the concept more clearly and completely."
            );


        return `

            <article class="analysis-card">


                <!-- QUESTION -->

                <div class="question-header">

                    <span class="question-number">

                        QUESTION ${index + 1}

                    </span>


                    <h2>

                        ${escapeHTML(question)}

                    </h2>

                </div>


                <!-- CANDIDATE ANSWER -->

                <div class="answer-section">

                    <span>
                        YOUR ANSWER
                    </span>


                    <div class="candidate-answer">

                        ${escapeHTML(candidateAnswer)}

                    </div>

                </div>


                <!-- IDEAL ANSWER -->

                <div class="ideal-answer">

                    <span class="section-label">

                        STRONGER ANSWER

                    </span>


                    <p>

                        ${escapeHTML(idealAnswer)}

                    </p>

                </div>


                <!-- ANALYSIS GRID -->

                <div class="analysis-grid">


                    <!-- MISSING -->

                    <div
                        class="analysis-box missing-box"
                    >

                        <h3>
                            Missing Concepts
                        </h3>


                        <ul>

                            ${createList(
                                missingConcepts
                            )}

                        </ul>

                    </div>


                    <!-- ADDITIONAL -->

                    <div
                        class="analysis-box additional-box"
                    >

                        <h3>
                            Additional Points
                        </h3>


                        <ul>

                            ${createList(
                                additionalPoints
                            )}

                        </ul>

                    </div>


                    <!-- WRONG -->

                    <div
                        class="analysis-box wrong-box"
                    >

                        <h3>
                            Incorrect / Weak Points
                        </h3>


                        <ul>

                            ${createList(
                                wrongPoints
                            )}

                        </ul>

                    </div>


                </div>


                <!-- IMPROVEMENT -->

                <div class="improvement-box">

                    <h3>
                        How to Improve
                    </h3>


                    <p>

                        ${escapeHTML(improvement)}

                    </p>

                </div>


            </article>

        `;

    }


    // =====================================================
    // EXTRACT ANALYSIS ARRAY
    // =====================================================

    function extractAnalysis(response) {

        if (!response) {

            return [];

        }


        // DIRECT smart_analysis

        let smartAnalysis =
            response.smart_analysis;


        // data.smart_analysis

        if (
            !smartAnalysis &&
            response.data
        ) {

            smartAnalysis =
                response.data.smart_analysis;

        }


        // JSON STRING

        if (
            typeof smartAnalysis ===
            "string"
        ) {

            try {

                smartAnalysis =
                    JSON.parse(
                        smartAnalysis
                    );

            }

            catch (error) {

                console.warn(
                    "smart_analysis is not valid JSON."
                );

            }

        }


        // ARRAY

        if (
            Array.isArray(
                smartAnalysis
            )
        ) {

            return smartAnalysis;

        }


        // analysis ARRAY

        if (
            smartAnalysis &&
            Array.isArray(
                smartAnalysis.analysis
            )
        ) {

            return smartAnalysis.analysis;

        }


        // questions ARRAY

        if (
            smartAnalysis &&
            Array.isArray(
                smartAnalysis.questions
            )
        ) {

            return smartAnalysis.questions;

        }


        // question_analysis ARRAY

        if (
            smartAnalysis &&
            Array.isArray(
                smartAnalysis.question_analysis
            )
        ) {

            return (
                smartAnalysis.question_analysis
            );

        }


        // SINGLE OBJECT

        if (
            smartAnalysis &&
            typeof smartAnalysis ===
            "object"
        ) {

            return [
                smartAnalysis
            ];

        }


        return [];

    }


    // =====================================================
    // RENDER ANALYSIS
    // =====================================================

    function renderAnalysis(response) {

        const analysis =
            extractAnalysis(response);


        console.log(
            "Extracted smart analysis:",
            analysis
        );


        if (!analysisContainer) {

            console.error(
                "analysisContainer not found."
            );

            return;

        }


        // =================================================
        // NO ANALYSIS
        // =================================================

        if (
            analysis.length === 0
        ) {

            analysisContainer.innerHTML = `

                <div
                    class="panel empty-state"
                >

                    <div class="icon">
                        ✦
                    </div>


                    <h2>
                        No detailed analysis available
                    </h2>


                    <p>
                        The interview was received,
                        but the AI did not return
                        question-level analysis.
                    </p>

                </div>

            `;


            showAnalysis();

            return;

        }


        // =================================================
        // RENDER QUESTION CARDS
        // =================================================

        analysisContainer.innerHTML =

            analysis

                .map(
                    (item, index) =>

                        createAnalysisCard(
                            item,
                            index
                        )

                )

                .join("");


        showAnalysis();

    }


    // =====================================================
    // CALL SMART ANALYSIS API
    // =====================================================

    async function generateSmartAnalysis() {

        showLoading();


        // =================================================
        // GET SAVED DATA
        // =================================================

        const {
            interviewHistory,
            interviewCandidate
        } = getInterviewData();


        // =================================================
        // GET SESSION ID
        // =================================================

        const sessionId =
            getSessionId();


        console.log(
            "Interview history:",
            interviewHistory
        );

        console.log(
            "Interview candidate:",
            interviewCandidate
        );

        console.log(
            "Session ID:",
            sessionId
        );


        // =================================================
        // VALIDATE HISTORY
        // =================================================

        if (!interviewHistory) {

            showError(
                "Interview history was not found. Please complete an interview first."
            );

            return;

        }


        // =================================================
        // VALIDATE CANDIDATE
        // =================================================

        if (!interviewCandidate) {

            showError(
                "Candidate information was not found. Please select a candidate first."
            );

            return;

        }


        // =================================================
        // REQUEST BODY
        // =================================================

        const requestBody = {

            sessionId:

                sessionId,

            candidate:

                interviewCandidate,

            smartAnalysis:

                true,

            interviewHistory:

                interviewHistory

        };


        console.log(
            "Sending Smart Analysis request:",
            requestBody
        );


        // =================================================
        // API REQUEST
        // =================================================

        try {

            const response =

                await fetch(
                    "/api/interview",
                    {

                        method:
                            "POST",

                        headers: {

                            "Content-Type":
                                "application/json"

                        },

                        body:

                            JSON.stringify(
                                requestBody
                            )

                    }
                );


            console.log(
                "API status:",
                response.status
            );


            // =================================================
            // HTTP ERROR
            // =================================================

            if (!response.ok) {

                let errorText =
                    "Failed to generate smart analysis.";


                try {

                    const errorData =
                        await response.json();


                    errorText =

                        errorData.detail ||

                        errorData.message ||

                        errorText;

                }

                catch (error) {

                    console.warn(
                        "Could not parse API error."
                    );

                }


                throw new Error(
                    errorText
                );

            }


            // =================================================
            // READ RESPONSE
            // =================================================

            const data =
                await response.json();


            console.log(
                "Smart Analysis API response:",
                data
            );


            // =================================================
            // SAVE RESPONSE
            // =================================================

            sessionStorage.setItem(
                "smartAnalysis",
                JSON.stringify(data)
            );


            // =================================================
            // RENDER
            // =================================================

            renderAnalysis(data);

        }


        catch (error) {

            console.error(
                "Smart Analysis Error:",
                error
            );


            showError(

                error.message ||

                "Unable to generate smart analysis. Please try again."

            );

        }

    }


    // =====================================================
    // BACK TO REPORT
    // =====================================================

    function goBackToReport() {

        window.location.href =
            "report.html";

    }


    // =====================================================
    // BACK BUTTON
    // =====================================================

    if (backBtn) {

        backBtn.addEventListener(
            "click",
            goBackToReport
        );

    }


    // =====================================================
    // SIDEBAR BACK BUTTON
    // =====================================================

    if (backToReport) {

        backToReport.addEventListener(
            "click",
            goBackToReport
        );

    }


    // =====================================================
    // RETRY
    // =====================================================

    if (retryBtn) {

        retryBtn.addEventListener(
            "click",
            generateSmartAnalysis
        );

    }


    // =====================================================
    // START
    // =====================================================

    generateSmartAnalysis();

});