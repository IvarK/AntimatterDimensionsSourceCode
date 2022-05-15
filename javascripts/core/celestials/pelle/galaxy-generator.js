import { DC } from "../../constants";
import { RebuyableMechanicState } from "../../game-mechanics/rebuyable";

import { PelleRifts } from "./rifts";

export const GalaxyGenerator = {
  get generationCaps() {
    return PelleRifts.all
      .map(x => ({ rift: x.config.key, cap: x.config.galaxyGeneratorThreshold }))
      .sort((a, b) => a.cap - b.cap);
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
    if (!Pelle.hasGalaxyGenerator) return 0;
    // Pretend it's here to avoid softlocks and not because the bottom code returns 1 when you don't have this upg
    if (!GalaxyGeneratorUpgrades.additive.canBeApplied) return 0.1;
    return DC.D1.timesEffectsOf(
      GalaxyGeneratorUpgrades.additive,
      GalaxyGeneratorUpgrades.multiplicative,
      GalaxyGeneratorUpgrades.antimatterMult,
      GalaxyGeneratorUpgrades.IPMult,
      GalaxyGeneratorUpgrades.EPMult,
    ).toNumber();
  },

  get capObj() {
    return this.generationCaps[player.celestials.pelle.galaxyGenerator.phase];
  },

  get generationCap() {
    return this.capObj ? this.capObj.cap : Infinity;
  },

  get capRift() {
    return PelleRifts[this.capObj?.rift];
  },

  get isCapped() {
    return this.generationCap === this.generatedGalaxies;
  },

  get sacrificeActive() {
    return player.celestials.pelle.galaxyGenerator.sacrificeActive;
  },

  startSacrifice() {
    player.celestials.pelle.collapsed.rifts = false;
    player.celestials.pelle.galaxyGenerator.sacrificeActive = true;
  },

  loop(diff) {
    if (this.isCapped) {
      Pelle.quotes.show(Pelle.quotes.GALAXY_GENERATOR_RIFTS);
    }
    if (this.sacrificeActive) {
      this.capRift.reducedTo = Math.max(this.capRift.reducedTo - 0.03 * diff / 1000, 0);
      if (this.capRift.reducedTo === 0) {
        player.celestials.pelle.galaxyGenerator.sacrificeActive = false;
        player.celestials.pelle.galaxyGenerator.phase++;

        const phase = player.celestials.pelle.galaxyGenerator.phase;
        if (phase === 1) {
          Pelle.quotes.show(Pelle.quotes.GALAXY_GENERATOR_PHASE_1);
        } else if (phase === 4) {
          Pelle.quotes.show(Pelle.quotes.GALAXY_GENERATOR_PHASE_4);
        }

        if (!this.capObj) {
          Pelle.quotes.show(Pelle.quotes.END);
        }
      }
      PelleRifts.all.forEach(x => x.checkMilestoneStates());
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

export class GalaxyGeneratorUpgrade extends RebuyableMechanicState {
  get currency() {
    return this.config.currency();
  }

  get boughtAmount() {
    return player.celestials.pelle.rebuyables[this.id];
  }

  set boughtAmount(value) {
    player.celestials.pelle.rebuyables[this.id] = value;
  }

  get isCustomEffect() { return true; }

  get effectValue() {
    return this.config.effect(this.boughtAmount);
  }
}

export const GalaxyGeneratorUpgrades = (function() {
  return mapGameDataToObject(
    GameDatabase.celestials.pelle.galaxyGeneratorUpgrades,
    config => new GalaxyGeneratorUpgrade(config)
  );
}());
