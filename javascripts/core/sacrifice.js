"use strict";

class Sacrifice {
  // This is tied to the "buying an 8th dimension" achievement in order to hide it from new players before they reach
  // sacrifice for the first time. It has the side-effect of hiding it in really early reality, which is probably fine.
  static get isVisible() {
    return Achievement(18).isUnlocked || PlayerProgress.realityUnlocked();
  }

  static get canSacrifice() {
    return DimBoost.totalBoosts > 4 && !EternityChallenge(3).isRunning && this.nextBoost.gt(1) &&
      AntimatterDimension(8).totalAmount.gt(0);
  }

  static get disabledCondition() {
    if (EternityChallenge(3).isRunning) return "Eternity Challenge 3";
    if (DimBoost.totalBoosts < 5) return `requires ${formatInt(5)} Dimension Boosts`;
    if (AntimatterDimension(8).totalAmount.eq(0)) return "no 8th Antimatter Dimensions";
    if (this.nextBoost.lte(1)) return `${formatX(1)} multiplier`;
    return "";
  }

  static getSacrificeDescription(changes) {
    const f = (name, condition) => (name in changes ? changes[name] : condition);
    let factor = 2;
    let places = 1;
    let base = `(log₁₀(AD1)/${formatInt(10)})`;
    if (f("Challenge8isRunning", NormalChallenge(8).isRunning)) {
      factor = 1;
      base = "x";
    } else if (f("InfinityChallenge2isCompleted", InfinityChallenge(2).isCompleted)) {
      factor = 1 / 120;
      places = 3;
      base = "AD1";
    }

    const exponent = (1 +
      (f('Achievement32', Achievement(32).isEffectActive) ? Achievement(32).config.effect : 0) +
      (f('Achievement57', Achievement(57).isEffectActive) ? Achievement(57).config.effect : 0)
    ) * (1 +
      (f('Achievement88', Achievement(88).isEffectActive) ? Achievement(88).config.effect : 0) +
      (f('TimeStudy228', TimeStudy(228).isEffectActive) ? TimeStudy(228).config.effect : 0)
    ) * factor;
    return base + (exponent === 1 ? "" : formatPow(exponent, places, places));
  }

  static get sacrificeExponent() {
    let factor;
    if (NormalChallenge(8).isRunning) {
      factor = 1;
    } else if (InfinityChallenge(2).isCompleted) {
      factor = 1 / 120;
    } else {
      factor = 2;
    }

    return (1 + Effects.sum(
      Achievement(32),
      Achievement(57)
    )) * (1 + Effects.sum(
      Achievement(88),
      TimeStudy(228)
    )) * factor;
  }

  static get nextBoost() {
    const nd1Amount = AntimatterDimension(1).amount;
    if (nd1Amount.eq(0)) return new Decimal(1);
    const sacrificed = player.sacrificed.clampMin(1);
    let prePowerSacrificeMult;
    // Pre-reality update C8 works really weirdly - every sacrifice, the current sacrifice multiplier gets applied to
    // ND8, then sacrificed amount is updated, and then the updated sacrifice multiplier then gets applied to a
    // different variable that is only applied during C8. However since sacrifice only depends on sacrificed ND1, this
    // can actually be done in a single calculation in order to handle C8 in a less hacky way.
    if (NormalChallenge(8).isRunning) {
      prePowerSacrificeMult = nd1Amount.pow(0.05).dividedBy(sacrificed.pow(0.04)).clampMin(1)
        .times(nd1Amount.pow(0.05).dividedBy(sacrificed.plus(nd1Amount).pow(0.04)));
    } else if (InfinityChallenge(2).isCompleted) {
      prePowerSacrificeMult = nd1Amount.dividedBy(sacrificed);
    } else {
      prePowerSacrificeMult = new Decimal((nd1Amount.log10() / 10) / Math.max(sacrificed.log10() / 10, 1));
    }

    return prePowerSacrificeMult.clampMin(1).pow(this.sacrificeExponent);
  }

  static get totalBoost() {
    if (player.sacrificed.eq(0)) return new Decimal(1);
    // C8 uses a variable that keeps track of a sacrifice boost that persists across sacrifice-resets and isn't
    // used anywhere else, which also naturally takes account of the exponent from achievements and time studies.
    if (NormalChallenge(8).isRunning) {
      return player.chall8TotalSacrifice;
    }

    let prePowerBoost;

    if (InfinityChallenge(2).isCompleted) {
      prePowerBoost = player.sacrificed;
    } else {
      prePowerBoost = new Decimal(player.sacrificed.log10() / 10);
    }

    return prePowerBoost.clampMin(1).pow(this.sacrificeExponent);
  }
}

function sacrificeReset(auto) {
  if (!Sacrifice.canSacrifice) return false;
  if ((!player.break || (!InfinityChallenge.isRunning && NormalChallenge.isRunning)) &&
    Currency.antimatter.gt(Decimal.NUMBER_MAX_VALUE) && !Enslaved.isRunning) return false;
  if (
    !Enslaved.isRunning &&
    NormalChallenge(8).isRunning &&
    (Sacrifice.totalBoost.gte(Decimal.NUMBER_MAX_VALUE))
  ) {
    return false;
  }
  EventHub.dispatch(GAME_EVENT.SACRIFICE_RESET_BEFORE);
  const nextBoost = Sacrifice.nextBoost;
  if (!auto) floatText(8, formatX(nextBoost, 2, 1));
  player.chall8TotalSacrifice = player.chall8TotalSacrifice.times(nextBoost);
  player.sacrificed = player.sacrificed.plus(AntimatterDimension(1).amount);
  const isAch118Unlocked = Achievement(118).isUnlocked;
  if (NormalChallenge(8).isRunning) {
    if (!isAch118Unlocked) {
      AntimatterDimensions.reset();
    }
    Currency.antimatter.reset();
  } else if (!isAch118Unlocked) {
    AntimatterDimensions.resetAmountUpToTier(NormalChallenge(12).isRunning ? 6 : 7);
  }
  player.achievementChecks.noSacrifices = false;
  EventHub.dispatch(GAME_EVENT.SACRIFICE_RESET_AFTER);
  return true;
}

function sacrificeBtnClick() {
  if (!Sacrifice.isVisible || !Sacrifice.canSacrifice) return;
  if (player.options.confirmations.sacrifice) {
    Modal.sacrifice.show(); 
  } else {
  sacrificeReset();
  }
}
