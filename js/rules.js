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