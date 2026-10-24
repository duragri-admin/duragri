async function loadCards(sort=true) {
    // Load cards
    const response = await fetch("data/cartes.json");
    const data = await response.json();

    // Optionnal sorting of cards by "id"
    if (sort){
    data.cartes.sort((a,b) => a.id - b.id);
    }
    return data;
}

function displayCards(cards){
    // Display the card titles
    const list = document.getElementById("cards-list");
    for (const card of cards) {
        const element = document.createElement("li");
        element.textContent = card.id + " - " + card.titre;
        list.appendChild(element);
    }
}

function addRow(tbody,values) {
    const row = document.createElement("tr");
    for (const value of values) {
        const cell = document.createElement("td");
        cell.textContent = value;
        row.appendChild(cell);
    }
    tbody.appendChild(row);
}

function displayScores(plays,cards){
    // 1. Obtain list of scores
    const list = scoresByRound(plays,cards);
    // 2. 
    const tbody = document.getElementById("scores-body");
    tbody.textContent = "";
    // 3.
    for (let i=0; i < list.length; i++) {
        const moment = i ===0 ? "Départ" : "Tour " + i;
        addRow(tbody,[
            moment,
            list[i].environnement,
            list[i].social,
            list[i].economique,
            finalScore(list[i]).toFixed(2)
        ]);
    }

}

async function start() {
    // Load and display the card titles
    const data = await loadCards();
    displayCards(data.cartes);

    // Test of the different functions
    //console.log(canPlay(data.cartes.find(card => card.id === 3),[41,24,51],data.cartes));
    //console.log(addEffects({"environnement":19,"economique":1,"social":8},{"environnement":2,"economique":2,"social":0}));
    //console.log(roundEffects(plays = [{id: 8, round: 1}, {id: 3, round: 1}, {id: 1, round: 2}],data.cartes,4));
    //console.log(finalScore({environnement:8,social:8,economique:8}));
    //console.log(scoresByRound(plays = [{id: 8, round: 1}, {id: 3, round: 1}, {id: 1, round: 2}],data.cartes,round=4, start = 8));

    const plays = [{id: 8, round: 1}, {id: 3, round: 1}, {id: 1, round: 2}];
    displayScores(plays,data.cartes);
}

start();
