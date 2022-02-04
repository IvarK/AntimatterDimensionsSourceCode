export const GalaxyGenerator = {
  get generationCaps() {
    return [
      {
        cap: 1000,
        rift: PelleRifts.famine
      },
      {
        cap: 1e5,
        rift: PelleRifts.death
      },
      {
        cap: 1e7,
        rift: PelleRifts.pestilence
      },
      {
        cap: 1e9,
        rift: PelleRifts.chaos
      },
      {
        cap: 1e10,
        rift: PelleRifts.war
      }
    ];
  },

  get spentGalaxies() {
    return player.celestials.pelle.galaxyGenerator.spentGalaxies;
  },

  get generatedGalaxies() {
    return player.celestials.pelle.galaxyGenerator.generatedGalaxies;
  },

  get galaxies() {
    return this.generatedGalaxies - this.spentGalaxies;
  },

  get gainPerSecond() {
    if (!PelleRifts.war.hasMilestone(2)) return 0;
    let base = PelleRebuyableUpgrade.additive.effectValue;
    base *= PelleRebuyableUpgrade.multiplicative.effectValue.toNumber();
    base *= PelleRebuyableUpgrade.antimatterMult.effectValue.toNumber();
    base *= PelleRebuyableUpgrade.IPMult.effectValue.toNumber();
    base *= PelleRebuyableUpgrade.EPMult.effectValue.toNumber();
    return base;
  },

  get capObj() {
    return this.generationCaps[player.celestials.pelle.galaxyGenerator.phase];
  },

  get generationCap() {
    return this.capObj ? this.capObj.cap : Infinity;
  },

  get capRift() {
    return this.capObj?.rift;
  },

  get isCapped() {
    return this.generationCap === this.generatedGalaxies;
  },

  get sacrificeActive() {
    return player.celestials.pelle.galaxyGenerator.sacrificeActive;
  },

  startSacrifice() {
    player.celestials.pelle.galaxyGenerator.sacrificeActive = true;
  },

  loop(diff) {
    if (this.sacrificeActive) {
      this.capRift.reducedTo = Math.max(this.capRift.reducedTo - 0.03 * diff / 1000, 0);
      if (this.capRift.reducedTo === 0) {
        player.celestials.pelle.galaxyGenerator.sacrificeActive = false;
        player.celestials.pelle.galaxyGenerator.phase++;
      }
    }
    player.celestials.pelle.galaxyGenerator.generatedGalaxies += this.gainPerSecond * diff / 1000;
    player.celestials.pelle.galaxyGenerator.generatedGalaxies = Math.min(
      player.celestials.pelle.galaxyGenerator.generatedGalaxies,
      this.generationCap
    );

    if (!this.capRift) {
      PelleRifts.all.forEach(r => r.reducedTo = Math.min(r.reducedTo + 0.03 * diff / 1000, 2));
    }
  }
};