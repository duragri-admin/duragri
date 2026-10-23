async function loadCards(sort="True") {
    // Load cards
    const response = await fetch("data/cartes.json");
    const data = await response.json();

    // Sort cards by "id"
    if (sort === "True"){
    data.cartes.sort((a,b) => a.id - b.id);
    }
    return data;
}

function displayCards(cards){
    // Display the title of the cards
    const list = document.getElementById("cards-list");
    for (const card of cards) {
        const element = document.createElement("li");
        element.textContent = card.id + " - " + card.titre;
        list.appendChild(element);
    }
}

async function start() {
    const data = await loadCards();
    displayCards(data.cartes);
}

start();
