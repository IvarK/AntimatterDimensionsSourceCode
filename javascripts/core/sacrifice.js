"use strict";

class Sacrifice {
  // This is tied to the "buying an 8th dimension" achievement in order to hide it from new players before they reach
  // sacrifice for the first time. It has the side-effect of hiding it in really early reality, which is probably fine.
  static get isVisible() {
    return Achievement(18).isUnlocked;
  }

  static get canSacrifice() {
    return DimBoost.totalBoosts > 4 && NormalDimension(8).amount.gt(0) && !EternityChallenge(3).isRunning;
  }

  static get disabledCondition() {
    if (EternityChallenge(3).isRunning) return "Eternity Challenge 3";
    if (DimBoost.totalBoosts <= DimBoost.maxShiftTier - 4) return "Requires a boost";
    if (NormalDimension(8).amount.eq(0)) return "No 8th dimensions";
    return "";
  }

  static get nextBoost() {
    const nd1Amount = NormalDimension(1).amount;
    const sacrificed = player.sacrificed.clampMin(1);
    if (nd1Amount.eq(0)) return new Decimal(1);
    if (InfinityChallenge(2).isCompleted) {
      const sacrificePow = Effects.max(
        0.01,
        Achievement(88),
        TimeStudy(228)
      );
      return nd1Amount.dividedBy(sacrificed).pow(sacrificePow).clampMin(1);
    }

    // Pre-reality update C8 works really weirdly - every sacrifice, the current sacrifice multiplier gets applied to
    // ND8, then sacrificed amount is updated, and then the updated sacrifice multiplier then gets applied to a
    // different variable that is only applied during C8. However since sacrifice only depends on sacrificed ND1, this
    // can actually be done in a single calculation in order to handle C8 in a less hacky way.
    if (NormalChallenge(8).isRunning) {
      return nd1Amount.pow(0.05).dividedBy(sacrificed.pow(0.04)).clampMin(1)
        .times(nd1Amount.pow(0.05).dividedBy(sacrificed.plus(nd1Amount).pow(0.04)).clampMin(1));
    }

    const sacrificePow = 2 + Effects.sum(
      Achievement(32),
      Achievement(57)
    );
    return Decimal.pow((nd1Amount.log10() / 10) / Math.max(sacrificed.log10() / 10, 1), sacrificePow).clampMin(1);
  }

  static get totalBoost() {
    if (player.sacrificed.eq(0)) return new Decimal(1);

    if (InfinityChallenge(2).isCompleted) {
      const scale = Effects.max(
        0.01,
        Achievement(88),
        TimeStudy(228)
      );
      return player.sacrificed.pow(scale).clampMin(1);
    }

    // C8 uses a variable that keeps track of a sacrifice boost that persists across sacrifice-resets and isn't
    // used anywhere else
    if (NormalChallenge(8).isRunning) {
      return player.chall8TotalSacrifice;
    }

    const sacrificePow = 2 + Effects.sum(
      Achievement(32),
      Achievement(57)
    );
    return Decimal.pow(player.sacrificed.log10() / 10.0, sacrificePow);
  }
}

function sacrificeReset(auto) {
  if (!Sacrifice.canSacrifice) return false;
  if ((!player.break || (!InfinityChallenge.isRunning && NormalChallenge.isRunning)) &&
    player.antimatter.gte(Decimal.MAX_NUMBER) && !Enslaved.isRunning) return false;
  if (
    !Enslaved.isRunning &&
    NormalChallenge(8).isRunning &&
    (Sacrifice.totalBoost.gte(Decimal.MAX_NUMBER))
  ) {
    return false;
  }
  EventHub.dispatch(GAME_EVENT.SACRIFICE_RESET_BEFORE);
  const nextBoost = Sacrifice.nextBoost;
  if (!auto) floatText(8, `x${format(nextBoost, 2, 1)}`);
  player.chall8TotalSacrifice = player.chall8TotalSacrifice.times(nextBoost);
  player.sacrificed = player.sacrificed.plus(NormalDimension(1).amount);
  const isAch118Unlocked = Achievement(118).isUnlocked;
  if (NormalChallenge(8).isRunning) {
    if (!isAch118Unlocked) {
      NormalDimensions.reset();
    }
    player.antimatter = new Decimal(100);
  } else if (!isAch118Unlocked) {
    NormalDimensions.resetAmount(NormalChallenge(12).isRunning ? 6 : 7);
  }
  player.noSacrifices = false;
  EventHub.dispatch(GAME_EVENT.SACRIFICE_RESET_AFTER);
  return true;
}

function sacrificeBtnClick() {
  if (!Sacrifice.isVisible || !Sacrifice.canSacrifice) return false;
  if (player.options.confirmations.sacrifice) {
    if (!confirm("Dimensional Sacrifice will remove all of your first to seventh dimensions " +
      "with the cost and multiplier unchanged) for a boost to the Eighth Dimension based on the total " +
      "amount of first dimensions sacrificed. It will take time to regain production.")) {
      return false;
    }
  }

  return sacrificeReset();
}
