export const fisherYatesShuffle = function*(deck) {
  for (let i = deck.length - 1; i >= 0; i--) {
    const swapIndex = Math.floor(Math.random() * (i + 1));
    [deck[i], deck[swapIndex]] = [deck[swapIndex], deck[i]];
    yield deck[i];
  }
};
