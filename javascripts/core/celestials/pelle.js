"use strict";

const Pelle = {
  // This will check if a specific mechanic is disabled, like old PelleFlag(x).isActive,
  // Initially it will only have isDoomed check but we will have upgrades that let you get stuff back
  isDisabled(mechanic) {
    if (!this.cel.doomed) return false;

    switch (mechanic) {

      // case: "glyphs"
      default:
        return true;
    }
  },

  get cel() {
    return player.celestials.pelle;
  }
};