"use strict";

class DimensionBoostReset extends PrestigeMechanic {
  get eventBefore() {
    return GAME_EVENT.DIMBOOST_BEFORE;
  }

  get eventAfter() {
    return GAME_EVENT.DIMBOOST_AFTER;
  }

  gain(bulk) {
    const amountGained = (BreakInfinityUpgrade.autobuyMaxDimboosts.isBought && bulk)
      ? purchasableDimensionBoostAmount()
      : 1;
    Currency.dimensionBoosts.add(amountGained);
  }

  reset(force) {
    const resetDimBoostPerk = Perk.antimatterNoReset.isBought;
    if (!resetDimBoostPerk && !force) {
      AntimatterDimensions.reset();
      player.sacrificed = new Decimal(0);
      resetTickspeed();
    }
    resetChallengeStuff();

    const canKeepAntimatter = Achievement(111).isUnlocked || resetDimBoostPerk;
    if (!canKeepAntimatter && !force) Currency.antimatter.reset();
  }

  get canBePerformed() {
    return DimBoost.canBeBought && DimBoost.requirement.isSatisfied;
  }
}

Reset.dimensionBoost = new DimensionBoostReset();
