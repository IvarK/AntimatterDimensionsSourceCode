"use strict";

class DimensionBoostReset extends PrestigeMechanic {
  get eventBefore() {
    return GAME_EVENT.DIMBOOST_BEFORE;
  }

  get eventAfter() {
    return GAME_EVENT.DIMBOOST_AFTER;
  }

  gain(bulk) {
    const amountGained = (BreakInfinityUpgrade.bulkDimBoost.isBought && bulk) ? purchasableDimensionBoostAmount() : 1;
    player.dimensionBoosts = Math.max(0, player.dimensionBoosts + amountGained);
  }

  reset() {
    if (!Player.isInAntimatterChallenge) {
      if (InfinityUpgrade.skipResetGalaxy.isBought) player.galaxies = Math.max(player.galaxies, 1);
      player.dimensionBoosts = Math.max(player.dimensionBoosts, DimBoost.startingDimensionBoosts);
    }

    const resetDimBoostPerk = Perk.dimboostNonReset.isBought;
    if (!resetDimBoostPerk) {
      AntimatterDimensions.reset();
      player.sacrificed = new Decimal(0);
      resetTickspeed();
    }
    resetChallengeStuff();

    const canKeepAntimatter = Achievement(111).isUnlocked || resetDimBoostPerk;
    if (!canKeepAntimatter) Currency.antimatter.reset();
  }

  get canBePerformed() {
    return DimBoost.canBeBought && DimBoost.requirement.isSatisfied;
  }
}

Reset.dimensionBoost = new DimensionBoostReset();
