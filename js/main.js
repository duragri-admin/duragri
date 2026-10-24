//-------------
// Variables
//-------------
let cards = [];
let plays = [];

//-------------
// Constants
//-------------

const MAX_CARDS_PER_ROUND = 2;

//-------------
// Functions
//-------------

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

function fillCardSelect(){
    // IDs of played cards
    const history = plays.map(p => p.id);
    // Still playable "action" cards
    const playable = cards.filter(c => c.type === "action" && canPlay(c,history,cards));

    // Fill selectable list
    const select = document.getElementById("card-select");
    select.textContent="";
    for (const card of playable){
        const option = document.createElement("option");
        option.value = card.id;
        option.textContent = card.id + " - "+ card.titre;
        select.appendChild(option);
    }
}

function playCard(){
    // Prevent error if there is not playable card left
    const select = document.getElementById("card-select");
    if (select.value === ""){return;}
    // Retrieve played card and round
    const id = Number(select.value);
    const round = Number(document.getElementById("round-select").value);

    // Check number of cards played in this round
    const cardsThisRound = plays.filter(p => p.round === round).length;
    const message = document.getElementById("message");
    message.textContent = "";
    if (cardsThisRound >= MAX_CARDS_PER_ROUND){
        document.getElementById("message").textContent = "Maximum " + MAX_CARDS_PER_ROUND + " cartes par tour";
        return;
    }
    
    // Add played card to the list of already played cards
    plays.push({id:id,round:round});

    // Refresh
    displayScores(plays,cards);
    fillCardSelect();
}

function resetGame(){
    plays = [];
    document.getElementById("message").textContent = "";

    displayScores(plays,cards);
    fillCardSelect();
}

async function start() {
    // Load and display the card titles
    const data = await loadCards();
    cards = data.cartes;

    document.getElementById("play-button").addEventListener("click",playCard);
    document.getElementById("reset-button").addEventListener("click",resetGame);

    fillCardSelect();
    displayScores(plays,cards);

    displayCards(cards);
}


//-------------
// Content
//-------------
start();
