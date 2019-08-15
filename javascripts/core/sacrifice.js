"use strict";

class Sacrifice {
  static get isVisible() {
    return DimBoost.totalBoosts > 4;
  }

  static get canSacrifice() {
    return this.isVisible && NormalDimension(8).amount.gt(0) && !EternityChallenge(3).isRunning;
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

    if (NormalChallenge(8).isRunning) {
      return nd1Amount.pow(0.05).dividedBy(sacrificed.pow(0.04)).clampMin(1);
    }

    const sacrificePow = 2 + Effects.sum(
      Achievement(32),
      Achievement(57)
    );
    return Decimal.pow(nd1Amount.log10() / Math.max(sacrificed.log10(), 1), sacrificePow).clampMin(1);
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

    if (NormalChallenge(8).isRunning) {
      return player.sacrificed.pow(0.05);
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
    (Sacrifice.totalBoost.gte(Decimal.MAX_NUMBER) || player.chall11Pow.gte(Decimal.MAX_NUMBER))
  ) {
    return false;
  }
  EventHub.dispatch(GameEvent.SACRIFICE_RESET_BEFORE);
  const nextBoost = Sacrifice.nextBoost;
  if (!auto) floatText(8, `x${shorten(nextBoost, 2, 1)}`);
  NormalDimension(8).power = NormalDimension(8).power.times(nextBoost);
  player.sacrificed = player.sacrificed.plus(NormalDimension(1).amount);
  const isAch118Enabled = Achievement(118).isEnabled;
  if (NormalChallenge(8).isRunning) {
    player.chall11Pow = player.chall11Pow.times(nextBoost);
    if (!isAch118Enabled) NormalDimensions.reset();
    player.antimatter = new Decimal(100);
  } else if (!isAch118Enabled) {
    clearDimensions(NormalChallenge(12).isRunning ? 6 : 7);
  }
  player.noSacrifices = false;
  EventHub.dispatch(GameEvent.SACRIFICE_RESET_AFTER);
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
