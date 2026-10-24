//-------------
// Constants
//-------------

const AXES = ["environnement","social","economique"]

//-------------
// Functions
//-------------

function canPlay(card,history,cards) {
    // 1. For every card played ...
    for (const id of history){
        // 2. ... find the full info of card based on its id ...
        const played = cards.find(c => c.id === id);
        // 3. ... if card is in played.exclusions, return false
        if ((played.exclusions ?? []).includes(card.id)){
            return false;
        }
    }

    // Check that the card meets all the prerequisites
    const prerequis = card.prerequis ?? {};

    const tous = prerequis.tous ?? [];
    if (!tous.every(id => history.includes(id))){
        return false;
    }

    const unParmi = prerequis.un_parmi;
    if (unParmi !== undefined && !unParmi.some(id => history.includes(id))){
        return false;
    }
    return true;
}

function addEffects(scores,effects){
    const result = {};
    for (const axe of AXES){
        result[axe] = Math.max(0,Math.min(20,scores[axe]+effects[axe]));
    }
    return result;
}

function roundEffects(plays,cards,round){
    const total = {environnement : 0, social : 0, economique : 0};
    for (const play of plays) {
        // 1. Find the full info of a card based on its id
        const card = cards.find(c=> c.id === play.id);

        // 2. Choose effect : tour1 if the card has been played this round,
        //    tour2 if it has been played the round before
        let effect;
        if (play.round=== round) {
            effect = card.effets?.tour1;
        } else if (play.round=== round - 1) {
            effect = card.effets?.tour2;
        }

        // 3. If there is an effect, add it to the total (axe by axe)
        if (effect !== undefined) {
            for (const axe of AXES) {
                total[axe] += effect[axe];
            }
        }
    }

    return total;
}

function scoresByRound(plays,cards,rounds = 5, start = 8) {
    // 1. Start scores
    let scores = {environnement:start,social:start,economique:start};
    // 2. List of scores
    const list = [scores];
    // 3. One loop per round
    for (let r = 1; r <= rounds; r++) {
        // 3a. Total effect of round
        const effects = roundEffects(plays,cards,r);
        // 3b. New scores
        scores = addEffects(scores,effects);
        // 3c. Add new scores to list
        list.push(scores);
    }
    // 4. Return list of scores
    return list;
}

function finalScore(scores) {
    return Math.cbrt(scores.economique*scores.environnement*scores.social);
}