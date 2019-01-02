class Lazy {
  constructor(getValue) {
    this._getValue = getValue;
  }

  get value() {
    if (this._value === undefined) {
      this._value = this._getValue();
    }
    return this._value;
  }

  invalidate() {
    this._value = undefined;
  }
}

const GameCache = {
  worstChallengeTime: new Lazy(() => Math.max(player.challengeTimes.max(), 100)),
  invalidate() {
    for (let key in this) {
      if (!this.hasOwnProperty(key)) continue;
      const property = this[key];
      if (property instanceof Lazy) {
        property.invalidate();
      }
    }
  }
};
