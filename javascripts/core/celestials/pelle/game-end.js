export const GameEnd = {
  get endState() {
    if (this.removeAdditionalEnd) return this.additionalEnd;
    return Math.max((Math.log10(player.celestials.pelle.records.totalAntimatter.plus(1).log10() + 1) - 8.7) /
      (Math.log10(9e15) - 8.7) + this.additionalEnd, 0);
  },

  _additionalEnd: 0,
  get additionalEnd() {
    return (player.isGameEnd || this.removeAdditionalEnd) ? this._additionalEnd : 0;
  },
  set additionalEnd(x) {
    this._additionalEnd = (player.isGameEnd || this.removeAdditionalEnd) ? x : 0;
  },

  removeAdditionalEnd: false,

  gameLoop(diff) {
    if (this.removeAdditionalEnd) {
      this.additionalEnd -= 0.12;
      if (this.additionalEnd < 4) {
        this.additionalEnd = 0;
        this.removeAdditionalEnd = false;
      }
    }
    if (this.endState >= 1 && ui.$viewModel.modal.progressBar === undefined) {
      player.isGameEnd = true;
      this.additionalEnd += Math.min(diff / 1000 / 20, 0.1);
      // If we don't cap this, it keeps accumulating the longer the player stays on the final New Game screen
      if (this.additionalEnd >= 12.5) this.additionalEnd = 12.5;
    }
  }
};
