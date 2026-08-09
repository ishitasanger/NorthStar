console.log("REPORT JS LOADED");

document.addEventListener("DOMContentLoaded", () => {

    // =====================================================
    // GET SAVED INTERVIEW DATA
    // =====================================================

    const feedbackData =
        sessionStorage.getItem("interviewFeedback");

    const candidateData =
        sessionStorage.getItem("interviewCandidate");

    const durationData =
        sessionStorage.getItem("interviewDuration");

    const avgResponseTimeData =
        sessionStorage.getItem("interviewAvgResponseTime");


    // =====================================================
    // NO COMPLETED INTERVIEW
    // =====================================================

    if (!feedbackData) {

        console.log("No completed interview found.");

        showNoReportMessage();

        return;
    }


    // =====================================================
    // PARSE DATA
    // =====================================================

    let feedback;
    let candidate = null;

    try {

        feedback = JSON.parse(feedbackData);

        if (candidateData) {
            candidate = JSON.parse(candidateData);
        }

    } catch (error) {

        console.error(
            "Could not parse interview data:",
            error
        );

        showNoReportMessage();

        return;
    }


    console.log("Report feedback:", feedback);
    console.log("Report candidate:", candidate);


    // =====================================================
    // CANDIDATE NAME
    // =====================================================

    if (
        candidate &&
        candidate.member
    ) {

        const reportDescription =
            document.querySelector(".report-header p");

        if (reportDescription) {

            reportDescription.textContent =
                `Interview performance report for ${candidate.member.name}.`;
        }
    }


    // =====================================================
    // SMART ANALYSIS BUTTON
    // =====================================================

    /*
     * The Smart Analysis button already exists
     * inside report.html.
     *
     * DO NOT create another button here.
     */

    const smartAnalysisBtn =
        document.getElementById("smartAnalysisBtn");

    if (smartAnalysisBtn) {

        smartAnalysisBtn.addEventListener(
            "click",
            () => {

                console.log(
                    "Opening Smart Analysis..."
                );

                window.location.href =
                    "smartanalysis.html";
            }
        );
    }


    // =====================================================
    // OVERALL SCORE
    // =====================================================

    const score =
        Number(feedback.overall_score);

    const scoreNumber =
        document.querySelector(".score-number");

    const scoreBadge =
        document.querySelector(".small-badge");

    const scoreLabel =
        document.querySelector(".score-card h2");

    const scoreDescription =
        document.querySelector(".score-content p");


    if (!Number.isNaN(score)) {

        if (scoreNumber) {

            scoreNumber.textContent =
                `${score}%`;
        }


        if (scoreBadge) {

            scoreBadge.textContent =
                `${score}% Overall`;
        }


        if (scoreLabel) {

            if (score >= 85) {

                scoreLabel.textContent =
                    "Strong Performance";

            } else if (score >= 70) {

                scoreLabel.textContent =
                    "Good Performance";

            } else if (score >= 50) {

                scoreLabel.textContent =
                    "Needs Improvement";

            } else {

                scoreLabel.textContent =
                    "Needs More Practice";
            }
        }


        if (scoreDescription) {

            if (score >= 85) {

                scoreDescription.textContent =
                    "Strong performance across the interview.";

            } else if (score >= 70) {

                scoreDescription.textContent =
                    "Good performance with some areas to improve.";

            } else if (score >= 50) {

                scoreDescription.textContent =
                    "Some fundamentals were demonstrated, but improvement is needed.";

            } else {

                scoreDescription.textContent =
                    "More preparation is recommended before another interview.";
            }
        }
    }


    // =====================================================
    // STAT CARDS
    // =====================================================

    const statCards =
        document.querySelectorAll(".stat-card");


    // =====================================================
    // QUESTIONS ANSWERED
    // =====================================================

    if (
        statCards.length > 0 &&
        feedback.questions_answered !== undefined
    ) {

        const value =
            statCards[0].querySelector("strong");

        const status =
            statCards[0].querySelector("small");


        if (value) {

            value.textContent =
                feedback.questions_answered;
        }


        if (status) {

            status.textContent =
                "Completed";
        }
    }


    // =====================================================
    // AVERAGE ACCURACY
    // =====================================================

    if (statCards.length > 1) {

        const value =
            statCards[1].querySelector("strong");

        const status =
            statCards[1].querySelector("small");


        let averageAccuracy =
            feedback.average_accuracy;


        if (
            averageAccuracy === undefined ||
            averageAccuracy === null
        ) {

            averageAccuracy = score;
        }


        averageAccuracy =
            Number(averageAccuracy);


        if (!Number.isNaN(averageAccuracy)) {

            if (value) {

                value.textContent =
                    `${averageAccuracy.toFixed(1)}%`;
            }


            if (status) {

                if (averageAccuracy >= 85) {

                    status.textContent =
                        "Excellent accuracy";

                } else if (averageAccuracy >= 70) {

                    status.textContent =
                        "Good accuracy";

                } else if (averageAccuracy >= 50) {

                    status.textContent =
                        "Room for improvement";

                } else {

                    status.textContent =
                        "Needs improvement";
                }
            }

        } else {

            if (value) {
                value.textContent = "N/A";
            }

            if (status) {
                status.textContent =
                    "Accuracy unavailable";
            }
        }
    }


    // =====================================================
    // AVERAGE RESPONSE TIME
    // =====================================================

    if (statCards.length > 2) {

        const value =
            statCards[2].querySelector("strong");

        const status =
            statCards[2].querySelector("small");


        if (
            avgResponseTimeData !== null &&
            avgResponseTimeData !== ""
        ) {

            const avgResponseTime =
                Number(avgResponseTimeData);


            if (
                !Number.isNaN(avgResponseTime) &&
                avgResponseTime >= 0
            ) {

                if (value) {

                    if (avgResponseTime < 60) {

                        value.textContent =
                            `${avgResponseTime.toFixed(1)} sec`;

                    } else {

                        const minutes =
                            Math.floor(
                                avgResponseTime / 60
                            );

                        const seconds =
                            Math.round(
                                avgResponseTime % 60
                            );


                        if (seconds === 60) {

                            value.textContent =
                                `${minutes + 1}m 0s`;

                        } else {

                            value.textContent =
                                `${minutes}m ${seconds}s`;
                        }
                    }
                }


                if (status) {

                    if (avgResponseTime <= 30) {

                        status.textContent =
                            "Fast response";

                    } else if (avgResponseTime <= 60) {

                        status.textContent =
                            "Good pace";

                    } else {

                        status.textContent =
                            "Take more time to structure answers";
                    }
                }

            } else {

                if (value) {
                    value.textContent = "N/A";
                }

                if (status) {
                    status.textContent =
                        "Response time unavailable";
                }
            }

        } else {

            if (value) {
                value.textContent = "N/A";
            }

            if (status) {
                status.textContent =
                    "Response time unavailable";
            }
        }
    }


    // =====================================================
    // INTERVIEW DURATION
    // =====================================================

    if (statCards.length > 3) {

        const value =
            statCards[3].querySelector("strong");

        const status =
            statCards[3].querySelector("small");


        if (durationData) {

            if (value) {

                value.textContent =
                    durationData;
            }

            if (status) {

                status.textContent =
                    "Completed";
            }

        } else {

            if (value) {

                value.textContent =
                    "N/A";
            }

            if (status) {

                status.textContent =
                    "Duration unavailable";
            }
        }
    }


    // =====================================================
    // SUMMARY
    // =====================================================

    const summaryPanel =
        document.querySelector(".summary-panel");


    if (
        summaryPanel &&
        feedback.summary
    ) {

        const summaryItem =
            summaryPanel.querySelector(".summary-item");


        if (summaryItem) {

            const title =
                summaryItem.querySelector("strong");

            const paragraph =
                summaryItem.querySelector("p");


            if (title) {

                title.textContent =
                    "Overall Interview Assessment";
            }


            if (paragraph) {

                paragraph.textContent =
                    feedback.summary;
            }
        }
    }


    // =====================================================
    // SKILLS
    // =====================================================

    if (feedback.skills) {

        const skillRows =
            document.querySelectorAll(".skill-row");


        skillRows.forEach(row => {

            const label =
                row.querySelector(".skill-info span");

            const scoreElement =
                row.querySelector(".skill-info strong");

            const fill =
                row.querySelector(".skill-fill");


            if (!label) {
                return;
            }


            const skillName =
                label.textContent
                    .trim()
                    .toLowerCase();


            let value = null;


            if (
                skillName.includes("technical")
            ) {

                value =
                    feedback.skills.technical_skills;

            } else if (
                skillName.includes("communication")
            ) {

                value =
                    feedback.skills.communication;

            } else if (
                skillName.includes("problem")
            ) {

                value =
                    feedback.skills.problem_solving;

            } else if (
                skillName.includes("system")
            ) {

                value =
                    feedback.skills.system_reasoning;
            }


            if (
                value !== null &&
                value !== undefined
            ) {

                value =
                    Number(value);


                if (scoreElement) {

                    scoreElement.textContent =
                        `${value}%`;
                }


                if (fill) {

                    fill.style.width =
                        `${value}%`;
                }
            }

        });
    }


    // =====================================================
    // TECHNICAL PERFORMANCE BADGE
    // =====================================================

    const technicalBadge =
        document.querySelector(
            ".panel .small-badge"
        );


    if (
        technicalBadge &&
        !Number.isNaN(score)
    ) {

        technicalBadge.textContent =
            `${score}% Overall`;
    }


    // =====================================================
    // TOPIC PERFORMANCE
    // =====================================================

    const topicGrid =
        document.querySelector(".topic-grid");


    if (topicGrid) {

        topicGrid.innerHTML = "";


        if (
            Array.isArray(feedback.topics) &&
            feedback.topics.length > 0
        ) {

            feedback.topics.forEach(topic => {

                const topicCard =
                    document.createElement("div");


                topicCard.className =
                    "topic-card";


                const topicScore =
                    Number(topic.score) || 0;


                if (topicScore < 60) {

                    topicCard.classList.add("weak");
                }


                const comment =
                    topic.comment ||
                    "Performance recorded.";


                topicCard.innerHTML = `

                    <div class="topic-top">

                        <span>
                            ${topic.topic}
                        </span>

                        <strong>
                            ${topicScore}%
                        </strong>

                    </div>

                    <div class="topic-track">

                        <div
                            class="topic-fill"
                            style="width:${topicScore}%"
                        ></div>

                    </div>

                    <small>
                        ${comment}
                    </small>

                `;


                topicGrid.appendChild(
                    topicCard
                );
            });

        } else {

            topicGrid.innerHTML = `

                <div class="topic-card">

                    <div class="topic-top">

                        <span>
                            No topic data available
                        </span>

                    </div>

                    <small>
                        Topic-level analysis was not generated for this interview.
                    </small>

                </div>

            `;
        }
    }


    // =====================================================
    // STRENGTHS
    // =====================================================

    const strengthsPanel =
        document
            .querySelector(".green-label")
            ?.closest(".panel");


    if (
        strengthsPanel &&
        Array.isArray(feedback.strengths)
    ) {

        const bulletList =
            strengthsPanel.querySelector(
                ".bullet-list"
            );


        if (bulletList) {

            bulletList.innerHTML = "";


            feedback.strengths.forEach(
                strength => {

                    const item =
                        document.createElement("div");


                    item.innerHTML = `
                        <span>✓</span>
                        ${strength}
                    `;


                    bulletList.appendChild(item);
                }
            );
        }
    }


    // =====================================================
    // GAPS
    // =====================================================

    const gapsPanel =
        document
            .querySelector(".red-label")
            ?.closest(".panel");


    if (
        gapsPanel &&
        Array.isArray(feedback.gaps)
    ) {

        const bulletList =
            gapsPanel.querySelector(
                ".bullet-list"
            );


        if (bulletList) {

            bulletList.innerHTML = "";


            feedback.gaps.forEach(
                gap => {

                    const item =
                        document.createElement("div");


                    item.innerHTML = `
                        <span>!</span>
                        ${gap}
                    `;


                    bulletList.appendChild(item);
                }
            );
        }
    }


    // =====================================================
    // NEXT STEPS
    // =====================================================

    const revisionList =
        document.querySelector(".revision-list");


    if (
        revisionList &&
        Array.isArray(feedback.next_steps)
    ) {

        revisionList.innerHTML = "";


        feedback.next_steps.forEach(
            (step, index) => {

                const item =
                    document.createElement("div");


                item.className =
                    "revision-item";


                item.innerHTML = `

                    <div class="number">
                        ${String(index + 1).padStart(2, "0")}
                    </div>

                    <div>

                        <strong>
                            ${step}
                        </strong>

                        <p>
                            Recommended based on your interview performance.
                        </p>

                    </div>

                    <span class="priority medium">
                        Recommended
                    </span>

                `;


                revisionList.appendChild(item);
            }
        );
    }


    // =====================================================
    // NEW INTERVIEW
    // =====================================================

    const newInterviewBtn =
        document.getElementById(
            "newInterviewBtn"
        );

    const newInterviewTop =
        document.getElementById(
            "newInterviewTop"
        );


    function startNewInterview() {

        console.log(
            "Starting another interview..."
        );


        let candidateId =
            sessionStorage.getItem(
                "selectedCandidateId"
            );


        if (!candidateId) {

            const candidateData =
                sessionStorage.getItem(
                    "interviewCandidate"
                );


            if (candidateData) {

                try {

                    const candidate =
                        JSON.parse(candidateData);


                    candidateId =
                        candidate?.member?.id ||
                        null;

                } catch (error) {

                    console.error(
                        "Could not recover candidate:",
                        error
                    );
                }
            }
        }


        // Clear previous interview data

        sessionStorage.removeItem(
            "interviewFeedback"
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
            "interviewHistory"
        );

        sessionStorage.removeItem(
            "interviewSessionId"
        );


        // Keep candidate

        if (candidateId) {

            sessionStorage.setItem(
                "selectedCandidateId",
                candidateId
            );


            window.location.href =
                `interview.html?candidate=${encodeURIComponent(candidateId)}`;

        } else {

            window.location.href =
                "../candidate.html";
        }
    }


    if (newInterviewBtn) {

        newInterviewBtn.addEventListener(
            "click",
            startNewInterview
        );
    }


    if (newInterviewTop) {

        newInterviewTop.addEventListener(
            "click",
            startNewInterview
        );
    }


    // =====================================================
    // BACK BUTTON
    // =====================================================

    const backBtn =
        document.getElementById(
            "backBtn"
        );


    if (backBtn) {

        backBtn.addEventListener(
            "click",
            () => {

                window.history.back();
            }
        );
    }

});


// =========================================================
// NO REPORT MESSAGE
// =========================================================

function showNoReportMessage() {

    const mainContent =
        document.querySelector(
            ".main-content"
        );


    if (!mainContent) {
        return;
    }


    mainContent.innerHTML = `

        <section
            style="
                min-height:70vh;
                display:flex;
                align-items:center;
                justify-content:center;
                text-align:center;
            "
        >

            <div
                style="
                    max-width:520px;
                    padding:50px;
                "
            >

                <div
                    style="
                        font-size:48px;
                        margin-bottom:20px;
                    "
                >
                    ◈
                </div>

                <div
                    style="
                        font-size:12px;
                        letter-spacing:2px;
                        margin-bottom:12px;
                        opacity:.7;
                    "
                >
                    INTERVIEW REPORT
                </div>

                <h1
                    style="
                        margin-bottom:15px;
                    "
                >
                    Complete an interview first
                </h1>

                <p
                    style="
                        line-height:1.7;
                        opacity:.75;
                        margin-bottom:30px;
                    "
                >
                    Your performance report will be
                    generated automatically after you
                    complete an interview.
                </p>

                <button
                    id="startInterviewFromReport"
                    class="primary-btn"
                >
                    + Start Interview
                </button>

            </div>

        </section>

    `;


    const startButton =
        document.getElementById(
            "startInterviewFromReport"
        );


    if (startButton) {

        startButton.addEventListener(
            "click",
            () => {

                let candidateId =
                    sessionStorage.getItem(
                        "selectedCandidateId"
                    );


                if (!candidateId) {

                    const candidateData =
                        sessionStorage.getItem(
                            "interviewCandidate"
                        );


                    if (candidateData) {

                        try {

                            const candidate =
                                JSON.parse(candidateData);


                            candidateId =
                                candidate?.member?.id ||
                                null;

                        } catch (error) {

                            console.error(
                                "Could not recover candidate:",
                                error
                            );
                        }
                    }
                }


                if (candidateId) {

                    sessionStorage.removeItem(
                        "interviewSessionId"
                    );

                    sessionStorage.removeItem(
                        "interviewFeedback"
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
                        "interviewHistory"
                    );


                    sessionStorage.setItem(
                        "selectedCandidateId",
                        candidateId
                    );


                    window.location.href =
                        `interview.html?candidate=${encodeURIComponent(candidateId)}`;

                } else {

                    window.location.href =
                        "../candidate.html";
                }
            }
        );
    }
}