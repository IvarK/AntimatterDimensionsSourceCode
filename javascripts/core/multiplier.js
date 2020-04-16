"use strict";

class Multipliers {
  constructor() {
    this.all = [];
  }

  addMulti(effect, ...ref) {
    this.all.push({
      effect,
      ref
    });
  }

}

const MULTIPLIERS_TAB = new Multipliers();

GameDatabase.achievements.normal.filter(x => x.effect)
