const teams = [
    {
        id: 1,
        name: "City Football Club",
        sport: "Football",
        location: "City Sports Ground",
        emoji: "⚽"
    },
    {
        id: 2,
        name: "Weekend Cricket Team",
        sport: "Cricket",
        location: "Community Cricket Ground",
        emoji: "🏏"
    },
    {
        id: 3,
        name: "Basketball Stars",
        sport: "Basketball",
        location: "Indoor Sports Court",
        emoji: "🏀"
    },
    {
        id: 4,
        name: "Badminton Players",
        sport: "Badminton",
        location: "Sports Club",
        emoji: "🏸"
    },
    {
        id: 5,
        name: "Football Warriors",
        sport: "Football",
        location: "Central Playground",
        emoji: "⚽"
    },
    {
        id: 6,
        name: "Cricket Champions",
        sport: "Cricket",
        location: "Local Cricket Ground",
        emoji: "🏏"
    }
];

let joinedTeams = JSON.parse(
    localStorage.getItem("joinedTeams") || "[]"
);

let matches = JSON.parse(
    localStorage.getItem("matches") || "[]"
);

const teamList = document.getElementById("teamList");
const search = document.getElementById("search");
const sportFilter = document.getElementById("sportFilter");
const matchList = document.getElementById("matchList");

// Display teams
function displayTeams() {
    const searchText = search.value.toLowerCase();
    const selectedSport = sportFilter.value;

    const filteredTeams = teams.filter(team => {
        const matchesSearch =
            team.name.toLowerCase().includes(searchText) ||
            team.location.toLowerCase().includes(searchText);

        const matchesSport =
            selectedSport === "All" ||
            team.sport === selectedSport;

        return matchesSearch && matchesSport;
    });

    teamList.innerHTML = "";

    if (filteredTeams.length === 0) {
        teamList.textContent = "No teams found.";
        return;
    }

    filteredTeams.forEach(team => {
        const card = document.createElement("div");
        card.className = "team-card";

        const emoji = document.createElement("div");
        emoji.className = "emoji";
        emoji.textContent = team.emoji;

        const title = document.createElement("h3");
        title.textContent = team.name;

        const sport = document.createElement("p");
        sport.textContent = "Sport: " + team.sport;

        const location = document.createElement("p");
        location.textContent = "Location: " + team.location;

        const button = document.createElement("button");
        button.className = "btn";

        const isJoined = joinedTeams.includes(team.id);

        button.textContent = isJoined ? "Leave Team" : "Join Team";

        if (isJoined) {
            button.classList.add("joined");
        }

        button.addEventListener("click", () => {
            if (joinedTeams.includes(team.id)) {
                joinedTeams = joinedTeams.filter(
                    id => id !== team.id
                );
                alert("You left the team.");
            } else {
                joinedTeams.push(team.id);
                alert("You joined " + team.name + "!");
            }

            localStorage.setItem(
                "joinedTeams",
                JSON.stringify(joinedTeams)
            );

            displayTeams();
        });

        card.append(emoji, title, sport, location, button);
        teamList.appendChild(card);
    });
}

// Search and filter teams
search.addEventListener("input", displayTeams);
sportFilter.addEventListener("change", displayTeams);

// Create a match
document.getElementById("matchForm").addEventListener(
    "submit",
    function (event) {
        event.preventDefault();

        const name = document.getElementById("matchName").value.trim();
        const sport = document.getElementById("matchSport").value;
        const date = document.getElementById("matchDate").value;
        const time = document.getElementById("matchTime").value;
        const location = document.getElementById("matchLocation").value.trim();

        if (!name || !date || !time || !location) {
            alert("Please fill in all fields.");
            return;
        }

        const today = new Date();
        today.setHours(0, 0, 0, 0);

        if (new Date(date + "T00:00:00") < today) {
            alert("Please select today or a future date.");
            return;
        }

        const match = {
            id: Date.now(),
            name: name,
            sport: sport,
            date: date,
            time: time,
            location: location
        };

        matches.push(match);

        localStorage.setItem(
            "matches",
            JSON.stringify(matches)
        );

        displayMatches();
        this.reset();

        alert("Match scheduled successfully!");
    }
);

// Display scheduled matches
function displayMatches() {
    matchList.innerHTML = "";

    if (matches.length === 0) {
        matchList.textContent = "No matches scheduled yet.";
        return;
    }

    const sortedMatches = [...matches].sort((a, b) =>
        (a.date + a.time).localeCompare(b.date + b.time)
    );

    sortedMatches.forEach(match => {
        const card = document.createElement("div");
        card.className = "match-card";

        const title = document.createElement("h3");
        title.textContent = match.name;

        const sport = document.createElement("p");
        sport.textContent = "Sport: " + match.sport;

        const date = document.createElement("p");
        date.textContent = "Date: " + match.date;

        const time = document.createElement("p");
        time.textContent = "Time: " + match.time;

        const location = document.createElement("p");
        location.textContent = "Location: " + match.location;

        const cancelButton = document.createElement("button");
        cancelButton.className = "cancel-btn";
        cancelButton.textContent = "Cancel Match";

        cancelButton.addEventListener("click", () => {
            matches = matches.filter(
                item => item.id !== match.id
            );

            localStorage.setItem(
                "matches",
                JSON.stringify(matches)
            );

            displayMatches();
        });

        card.append(
            title,
            sport,
            date,
            time,
            location,
            cancelButton
        );

        matchList.appendChild(card);
    });
}

// Initial display
displayTeams();
displayMatches();