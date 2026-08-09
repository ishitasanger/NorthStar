document.addEventListener("DOMContentLoaded", () => {

    const candidateGrid =
        document.getElementById("candidateGrid");

    const candidateCount =
        document.getElementById("candidateCount");


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

            const candidates =
                data.candidates;

            candidateCount.textContent =
                String(candidates.length)
                    .padStart(2, "0");

            candidateGrid.innerHTML = "";


            candidates.forEach((candidate, index) => {

                const member =
                    candidate.member;

                const missions =
                    candidate.missions;


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
                                ${member.name}
                            </h3>

                            <p>
                                ${member.jobRole}
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

});