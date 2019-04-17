function sacrificeReset(auto) {
  if (!Sacrifice.isAffordable) return false;
  if (player.resets < 5) return false;
  if ((!player.break || (!InfinityChallenge.current() && NormalChallenge.current())) &&
    player.money.gte(Decimal.MAX_NUMBER) && !Enslaved.isRunning) return false;
  if (
    !Enslaved.isRunning &&
    NormalChallenge(8).isRunning &&
    (Sacrifice.totalBoost.gte(Decimal.MAX_NUMBER) || player.chall11Pow.gte(Decimal.MAX_NUMBER))
  ) {
    return false;
  }
  EventHub.dispatch(GameEvent.SACRIFICE_RESET_BEFORE);
  const nextBoost = Sacrifice.nextBoost;
  if (!auto) floatText(8, "x" + shortenMoney(nextBoost));
  NormalDimension(8).pow = NormalDimension(8).pow.times(nextBoost);
  player.sacrificed = player.sacrificed.plus(NormalDimension(1).amount);
  const isAch118Enabled = Achievement(118).isEnabled;
  if (NormalChallenge(8).isRunning) {
    player.chall11Pow = player.chall11Pow.times(nextBoost);
    if (!isAch118Enabled) resetDimensions();
    player.money = new Decimal(100);
  } else if (!isAch118Enabled) {
    clearDimensions(NormalChallenge(12).isRunning ? 6 : 7);
  }
  EventHub.dispatch(GameEvent.SACRIFICE_RESET_AFTER);
}

function sacrificeBtnClick() {
  if (player.options.confirmations.sacrifice) {
    if (!confirm("Dimensional Sacrifice will remove all of your first to seventh dimensions (with the cost and multiplier unchanged) for a boost to the Eighth Dimension based on the total amount of first dimensions sacrificed. It will take time to regain production.")) {
      return false;
    }
  }

  auto = false;
  return sacrificeReset();
}

class Sacrifice {
  static get isUnlocked() {
    return player.infinitied.gt(0) || player.resets > 4;
  }

  static get isAffordable() {
    return player.eightAmount.gt(0) && !EternityChallenge(3).isRunning;
  }

  static get nextBoost() {
    if (player.firstAmount.eq(0)) return new Decimal(1);

    if (InfinityChallenge(2).isCompleted) {
      const scale = Effects.max(
        0.01,
        Achievement(88),
        TimeStudy(228)
      );
      return player.firstAmount.dividedBy(player.sacrificed.clampMin(1)).pow(scale).clampMin(1);
    }

    if (!NormalChallenge(8).isRunning) {
      let sacrificePow = 2 + Effects.sum(
        Achievement(32),
        Achievement(57)
      );
      return Decimal.pow((player.firstAmount.e/10.0), sacrificePow).dividedBy(((Decimal.max(player.sacrificed.e, 1)).dividedBy(10.0)).pow(sacrificePow).max(1)).max(1);
    }

    return player.firstAmount.pow(0.05).dividedBy(player.sacrificed.pow(0.04).max(1)).max(1);
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

    if (!NormalChallenge(8).isRunning) {
      let sacrificePow = 2 + Effects.sum(
        Achievement(32),
        Achievement(57)
      );
      return Decimal.pow((player.sacrificed.e/10.0), sacrificePow);
    }

    return player.sacrificed.pow(0.05); //this is actually off but like im not sure how youd make it good. not that it matters
  }
}
