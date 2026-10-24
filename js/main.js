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

async function start() {
    // Load and display the card titles
    const data = await loadCards();
    displayCards(data.cartes);
    console.log(canPlay(data.cartes.find(card => card.id === 3),[41,24,51],data.cartes));
    console.log(addEffects({"environnement":19,"economique":1,"social":8},{"environnement":2,"economique":2,"social":0}));
    console.log(roundEffects(plays = [{id: 8, round: 1}, {id: 3, round: 1}, {id: 1, round: 2}],data.cartes,4));
    console.log(finalScore({environnement:8,social:8,economique:8}));
    console.log(scoresByRound(plays = [{id: 8, round: 1}, {id: 3, round: 1}, {id: 1, round: 2}],data.cartes,round=4, start = 8));
}

start();
