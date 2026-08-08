console.log("REPORT JS LOADED");

document.addEventListener("DOMContentLoaded", () => {

    // -----------------------------
    // GET SAVED INTERVIEW DATA
    // -----------------------------

    const feedbackData =
        sessionStorage.getItem("interviewFeedback");

    const candidateData =
        sessionStorage.getItem("interviewCandidate");


    if (!feedbackData) {

        console.warn("No interview feedback found.");

        return;
    }


    const feedback = JSON.parse(feedbackData);

    console.log("Report feedback:", feedback);


    // -----------------------------
    // SUMMARY
    // -----------------------------

    const summaryElements =
        document.querySelectorAll(".summary-item p");

    if (
        summaryElements.length > 0 &&
        feedback.summary
    ) {

        summaryElements[0].textContent =
            feedback.summary;

    }


    // -----------------------------
    // STRENGTHS
    // -----------------------------

    const strengthsSection =
        document.querySelector(
            ".green-label"
        )?.closest(".panel");


    if (strengthsSection && feedback.strengths) {

        const bulletList =
            strengthsSection.querySelector(
                ".bullet-list"
            );

        if (bulletList) {

            bulletList.innerHTML = "";

            feedback.strengths.forEach(strength => {

                const item =
                    document.createElement("div");

                item.innerHTML = `
                    <span>✓</span>
                    ${strength}
                `;

                bulletList.appendChild(item);

            });

        }

    }


    // -----------------------------
    // GAPS
    // -----------------------------

    const gapsSection =
        document.querySelector(
            ".red-label"
        )?.closest(".panel");


    if (gapsSection && feedback.gaps) {

        const bulletList =
            gapsSection.querySelector(
                ".bullet-list"
            );

        if (bulletList) {

            bulletList.innerHTML = "";

            feedback.gaps.forEach(gap => {

                const item =
                    document.createElement("div");

                item.innerHTML = `
                    <span>!</span>
                    ${gap}
                `;

                bulletList.appendChild(item);

            });

        }

    }


    // -----------------------------
    // NEXT STEPS
    // -----------------------------

    const revisionList =
        document.querySelector(
            ".revision-list"
        );


    if (revisionList && feedback.next_steps) {

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


    // -----------------------------
    // NEW INTERVIEW BUTTONS
    // -----------------------------

    const newInterviewBtn =
        document.getElementById(
            "newInterviewBtn"
        );

    const newInterviewTop =
        document.getElementById(
            "newInterviewTop"
        );


    function startNewInterview() {

        sessionStorage.removeItem(
            "interviewFeedback"
        );

        sessionStorage.removeItem(
            "interviewCandidate"
        );

        window.location.href =
            "../candidate.html";

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


    // -----------------------------
    // BACK BUTTON
    // -----------------------------

    const backBtn =
        document.getElementById("backBtn");


    if (backBtn) {

        backBtn.addEventListener(
            "click",
            () => {

                window.history.back();

            }
        );

    }

});