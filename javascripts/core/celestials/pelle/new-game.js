export const NG = {
  get current() {
    return player.newGame.current;
  },

  get bestPositive() {
    return player.newGame.bestPlus;
  },

  get bestNegative() {
    return player.newGame.bestMinus;
  },

  get isNegative() {
    return this.current < 0;
  },

  get multiplier() {
    if (!this.isNegative) return 2 ** this.current;
    return 0.8 ** Math.abs(this.current);
  },

  get power() {
    if (!this.isNegative) return 1 + this.current * 0.02;
    return 0.99 ** Math.abs(this.current);
  }
};