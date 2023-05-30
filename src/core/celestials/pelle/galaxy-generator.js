import { RebuyableMechanicState } from "../../game-mechanics/rebuyable";

import { PelleRifts } from "./rifts";

export const GalaxyGenerator = {
  // This is used for a slightly annoying workaround in order to visually update the glyph tab when the rifts
  // are refilling and the single glyph slot (which was lost during the drain) becomes available again
  hasReturnedGlyphSlot: false,

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
    return new Decimal(GalaxyGeneratorUpgrades.additive.effectValue).timesEffectsOf(
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
      Pelle.quotes.galaxyGeneratorRifts.show();
    }
    if (this.sacrificeActive) {
      this.capRift.reducedTo = Math.max(this.capRift.reducedTo - 0.03 * diff / 1000, 0);
      if (this.capRift.reducedTo === 0) {
        player.celestials.pelle.galaxyGenerator.sacrificeActive = false;
        player.celestials.pelle.galaxyGenerator.phase++;

        const phase = player.celestials.pelle.galaxyGenerator.phase;
        if (phase === 1) {
          Pelle.quotes.galaxyGeneratorPhase1.show();
        } else if (phase === 4) {
          Pelle.quotes.galaxyGeneratorPhase4.show();
        }

        if (!this.capObj) {
          Pelle.quotes.end.show();
        }
      }
      PelleRifts.all.forEach(x => x.checkMilestoneStates());

      // Force-unequip glyphs when the player loses the respective milestone. We call the respec option as normally
      // except for one particular case - when we want to respec into protected slots but have no room to do so. In
      // that case, we force-respec into the inventory instead
      if (!PelleRifts.vacuum.milestones[0].canBeApplied && Glyphs.active.filter(g => g).length > 0) {
        Glyphs.unequipAll(player.options.respecIntoProtected && Glyphs.findFreeIndex(true) === -1);
        Glyphs.refreshActive();
      }

    }
    player.celestials.pelle.galaxyGenerator.generatedGalaxies += this.gainPerSecond * diff / 1000;
    player.celestials.pelle.galaxyGenerator.generatedGalaxies = Math.min(
      player.celestials.pelle.galaxyGenerator.generatedGalaxies,
      this.generationCap
    );

    if (!this.capRift) {
      PelleRifts.all.forEach(r => r.reducedTo = Math.min(r.reducedTo + 0.03 * diff / 1000, 2));
      if (PelleRifts.vacuum.milestones[0].canBeApplied && !this.hasReturnedGlyphSlot) {
        Glyphs.refreshActive();
        EventHub.dispatch(GAME_EVENT.GLYPHS_EQUIPPED_CHANGED);
        this.hasReturnedGlyphSlot = true;
      }
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

export const GalaxyGeneratorUpgrades = mapGameDataToObject(
  GameDatabase.celestials.pelle.galaxyGeneratorUpgrades,
  config => new GalaxyGeneratorUpgrade(config)
);
