document.addEventListener("DOMContentLoaded", function () {
    const searchButton = document.getElementById("search-btn");
    const usernameInput = document.getElementById("user-input");
    const statsContainer = document.querySelector(".stats-container");
    const easyProgressCircle = document.querySelector(".easy-progress");
    const mediumProgressCircle = document.querySelector(".medium-progress");
    const hardProgressCircle = document.querySelector(".hard-progress");
    const easyLabel = document.getElementById("easy-label");
    const mediumLabel = document.getElementById("medium-label");
    const hardLabel = document.getElementById("hard-label");
    const cardStatsContainer = document.querySelector(".stats-cards");

    function validateUsername(username) {
        if (username.trim() === "") {
            alert("Username should not be empty");
            return false;
        }
        const regex = /^[a-zA-Z0-9_-]{1,15}$/;
        const isMatching = regex.test(username);
        if (!isMatching) {
            alert("Invalid Username");
        }
        return isMatching;
    }

    async function fetchUserDetails(username) {
        try {
            searchButton.textContent = "Searching...";
            searchButton.disabled = true;

            const url = `https://leetcode-stats-api.herokuapp.com/${username}`;
            const response = await fetch(url);

            if (!response.ok) {
                throw new Error("User not found or request failed.");
            }

            const data = await response.json();
            console.log("Fetched user data:", data);
            displayUserDataFromAPI(data);
        } catch (error) {
            statsContainer.innerHTML = `<p>${error.message}</p>`;
        } finally {
            searchButton.textContent = "Search";
            searchButton.disabled = false;
        }
    }

    function updateProgress(solved, total, label, circle) {
        const progressDegree = (solved / total) * 100;
        circle.style.setProperty("--progress-degree", `${progressDegree}%`);
        label.textContent = `${solved}/${total}`;
    }

    function displayUserDataFromAPI(data) {
        const easySolved = data.easySolved;
        const mediumSolved = data.mediumSolved;
        const hardSolved = data.hardSolved;

        const totalEasy = data.totalEasy;
        const totalMedium = data.totalMedium;
        const totalHard = data.totalHard;

        updateProgress(easySolved, totalEasy, easyLabel, easyProgressCircle);
        updateProgress(mediumSolved, totalMedium, mediumLabel, mediumProgressCircle);
        updateProgress(hardSolved, totalHard, hardLabel, hardProgressCircle);

        const cardsData = [
            { label: "Total Solved", value: data.totalSolved },
            { label: "Total Questions", value: data.totalQuestions },
            { label: "Ranking", value: data.ranking },
            { label: "Contribution Points", value: data.contributionPoints },
        ];

        cardStatsContainer.innerHTML = cardsData
            .map(
                (stat) => `
            <div class="card">
                <h4>${stat.label}</h4>
                <p>${stat.value}</p>
            </div>`
            )
            .join("");
    }

    searchButton.addEventListener("click", function () {
        const username = usernameInput.value;
        if (validateUsername(username)) {
            fetchUserDetails(username);
        }
    });
});
