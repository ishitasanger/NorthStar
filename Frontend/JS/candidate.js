document.addEventListener("DOMContentLoaded", () => {

    const candidateGrid =
        document.getElementById("candidateGrid");

    const candidateCount =
        document.getElementById("candidateCount");

    const candidateSearch =
        document.getElementById("candidateSearch");

    const clearSearch =
        document.getElementById("clearSearch");

    const searchResultText =
        document.getElementById("searchResultText");

    const noCandidates =
        document.getElementById("noCandidates");


    // =====================================================
    // STORE ALL CANDIDATES
    // =====================================================

    let allCandidates = [];


    // =====================================================
    // LOAD CANDIDATES
    // =====================================================

    fetch("/data/candidates.json")

        .then(response => {

            if (!response.ok) {

                throw new Error(
                    "Failed to load candidates.json"
                );

            }

            return response.json();

        })

        .then(data => {

            allCandidates =
                data.candidates || [];


            candidateCount.textContent =
                String(allCandidates.length)
                    .padStart(2, "0");


            candidateGrid.innerHTML = "";


            renderCandidates(
                allCandidates
            );

        })

        .catch(error => {

            console.error(
                "Error loading candidates:",
                error
            );


            candidateGrid.innerHTML = `

                <p style="color:#ff6b6b;">

                    Unable to load candidates.

                </p>

            `;

        });


    // =====================================================
    // RENDER CANDIDATES
    // =====================================================

    function renderCandidates(candidates) {

        candidateGrid.innerHTML = "";


        // =================================================
        // NO RESULTS
        // =================================================

        if (candidates.length === 0) {

            noCandidates.style.display =
                "flex";

        } else {

            noCandidates.style.display =
                "none";

        }


        updateSearchResultText(
            candidates.length
        );


        // =================================================
        // CREATE CANDIDATE CARDS
        // =================================================

        candidates.forEach((candidate, index) => {

            const member =
                candidate.member || {};

            const missions =
                candidate.missions || [];


            const completedMissions =
                missions.filter(
                    mission =>
                        mission.passed === true
                );


            const topics =
                completedMissions
                    .slice(0, 3)
                    .map(
                        mission =>
                            mission.title
                    );


            const card =
                document.createElement("a");


            // =================================================
            // CARD
            // =================================================

            card.href =
                `pages/interview.html?candidate=${encodeURIComponent(member.id)}`;


            card.className =
                "candidate-card";


            card.dataset.candidateId =
                member.id;


            const colors = [
                "",
                "blue",
                "pink",
                "cyan",
                "orange",
                "green"
            ];


            const colorClass =
                colors[index % colors.length];


            card.innerHTML = `

                <div class="candidate-visual">

                    <div class="profile-glow ${colorClass}"></div>


                    <div class="human-avatar ${colorClass ? "avatar-" + colorClass : ""}">

                        <div class="avatar-head"></div>

                        <div class="avatar-body"></div>

                    </div>


                    <div class="availability">

                        <span></span>

                        Ready

                    </div>

                </div>


                <div class="candidate-content">

                    <div>

                        <h3>
                            ${member.name || "Unknown Candidate"}
                        </h3>

                        <p>
                            ${member.jobRole || "Candidate"}
                        </p>

                    </div>


                    <span class="card-arrow">
                        →
                    </span>

                </div>


                <div class="candidate-tags">

                    ${topics.map(topic => `
                        <span>${topic}</span>
                    `).join("")}

                </div>


                <div class="candidate-footer">

                    <span>
                        ${completedMissions.length} topics completed
                    </span>

                    <span>
                        Start →
                    </span>

                </div>

            `;


            // =================================================
            // SELECT CANDIDATE
            // =================================================

            card.addEventListener(
                "click",
                (event) => {

                    /*
                     * Stop the anchor from navigating
                     * automatically.
                     *
                     * We will navigate manually AFTER
                     * clearing the previous interview state.
                     */

                    event.preventDefault();


                    console.log(
                        "Selecting candidate:",
                        member.id
                    );


                    // =============================================
                    // REMOVE OLD INTERVIEW STATE
                    // =============================================

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
                        "interviewCandidate"
                    );


                    // =============================================
                    // SAVE NEW CANDIDATE
                    // =============================================

                    sessionStorage.setItem(
                        "selectedCandidateId",
                        member.id
                    );


                    console.log(
                        "New candidate saved:",
                        sessionStorage.getItem(
                            "selectedCandidateId"
                        )
                    );


                    console.log(
                        "Old interview session cleared."
                    );


                    // =============================================
                    // START COMPLETELY NEW INTERVIEW
                    // =============================================

                    window.location.href =
                        `pages/interview.html?candidate=${encodeURIComponent(member.id)}`;

                }
            );


            candidateGrid.appendChild(card);

        });

    }


    // =====================================================
    // SEARCH CANDIDATES
    // =====================================================

    function searchCandidates(searchTerm) {

        const query =
            searchTerm
                .trim()
                .toLowerCase();


        // =================================================
        // EMPTY SEARCH
        // SHOW ALL CANDIDATES
        // =================================================

        if (!query) {

            renderCandidates(
                allCandidates
            );

            return;

        }


        // =================================================
        // FILTER CANDIDATES
        // =================================================

        const filteredCandidates =
            allCandidates.filter(candidate => {

                const member =
                    candidate.member || {};

                const missions =
                    candidate.missions || [];


                // =============================================
                // SEARCH BY NAME
                // =============================================

                const name =
                    String(
                        member.name || ""
                    ).toLowerCase();


                // =============================================
                // SEARCH BY JOB ROLE
                // =============================================

                const jobRole =
                    String(
                        member.jobRole || ""
                    ).toLowerCase();


                // =============================================
                // SEARCH BY COMPLETED TOPICS
                // =============================================

                const topics =
                    missions

                        .filter(
                            mission =>
                                mission.passed === true
                        )

                        .map(
                            mission =>
                                String(
                                    mission.title || ""
                                ).toLowerCase()
                        );


                const topicMatch =
                    topics.some(
                        topic =>
                            topic.includes(query)
                    );


                // =============================================
                // RETURN MATCH
                // =============================================

                return (

                    name.includes(query) ||

                    jobRole.includes(query) ||

                    topicMatch

                );

            });


        renderCandidates(
            filteredCandidates
        );

    }


    // =====================================================
    // SEARCH INPUT
    // =====================================================

    if (candidateSearch) {

        candidateSearch.addEventListener(
            "input",
            () => {

                searchCandidates(
                    candidateSearch.value
                );

            }
        );

    }


    // =====================================================
    // CLEAR SEARCH
    // =====================================================

    if (clearSearch) {

        clearSearch.addEventListener(
            "click",
            () => {

                candidateSearch.value = "";

                searchCandidates("");

                candidateSearch.focus();

            }
        );

    }


    // =====================================================
    // SEARCH RESULT TEXT
    // =====================================================

    function updateSearchResultText(
        resultCount
    ) {

        if (!searchResultText) {
            return;
        }


        const query =
            candidateSearch
                ? candidateSearch.value.trim()
                : "";


        // =============================================
        // NO SEARCH
        // =============================================

        if (!query) {

            searchResultText.textContent =
                "";

            return;

        }


        // =============================================
        // ZERO RESULTS
        // =============================================

        if (resultCount === 0) {

            searchResultText.textContent =
                "No matching candidates.";

            return;

        }


        // =============================================
        // ONE RESULT
        // =============================================

        if (resultCount === 1) {

            searchResultText.textContent =
                "1 candidate found.";

            return;

        }


        // =============================================
        // MULTIPLE RESULTS
        // =============================================

        searchResultText.textContent =
            `${resultCount} candidates found.`;

    }

});