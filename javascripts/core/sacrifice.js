function sacrificeReset(auto) {
  if (!Sacrifice.isAffordable) return false;
  if (player.resets < 5) return false;
  if ((!player.break || (!player.currentChallenge.includes("post") && player.currentChallenge !== "")) && player.money.gte(Number.MAX_VALUE)) return false;
  const totalBoost = Sacrifice.totalBoost;
  if (player.currentChallenge === "challenge11" && (totalBoost.gte(Number.MAX_VALUE) || player.chall11Pow.gte(Number.MAX_VALUE))) return false;
  const nextBoost = Sacrifice.nextBoost;
  if (!auto) floatText(8, "x" + shortenMoney(nextBoost));
  if (nextBoost.gte(Number.MAX_VALUE)) giveAchievement("Yet another infinity reference");
  player.eightPow = player.eightPow.times(nextBoost);
  player.sacrificed = player.sacrificed.plus(player.firstAmount);
  const isAch118Enabled = isAchEnabled("r118");
  if (player.currentChallenge !== "challenge11") {
    if (player.currentChallenge === "challenge7" && !isAch118Enabled) clearDimensions(6);
    else if (!isAch118Enabled) clearDimensions(7);
  } else {
    player.chall11Pow = player.chall11Pow.times(nextBoost);
    if (!isAch118Enabled) resetDimensions();
    player.money = new Decimal(100);

  }
  if (totalBoost >= 600) giveAchievement("The Gods are pleased");
  if (totalBoost.gte("1e9000")) giveAchievement("IT'S OVER 9000");
}

function sacrificeBtnClick() {
  if (!player.options.noSacrificeConfirmation) {
    if (!confirm("Dimensional Sacrifice will remove all of your first to seventh dimensions (with the cost and multiplier unchanged) for a boost to the Eighth Dimension based on the total amount of first dimensions sacrificed. It will take time to regain production.")) {
      return false;
    }
  }

  auto = false;
  return sacrificeReset();
}

class Sacrifice {
  static get isUnlocked() {
    return player.infinitied > 0 || player.resets > 4;
  }

  static get isAffordable() {
    return player.eightAmount > 0 && player.currentEternityChall !== "eterc3";
  }

  static get nextBoost() {
    if (player.firstAmount === 0) return new Decimal(1);

    if (player.challenges.includes("postc2")) {
      if (player.timestudy.studies.includes(228)) return player.firstAmount.dividedBy(player.sacrificed.max(1)).pow(0.013).max(1);
      if (isAchEnabled("r88")) return player.firstAmount.dividedBy(player.sacrificed.max(1)).pow(0.011).max(1);
      return player.firstAmount.dividedBy(player.sacrificed.max(1)).pow(0.01).max(1);
    }

    if (player.currentChallenge !== "challenge11") {
      let sacrificePow = 2;
      if (isAchEnabled("r32")) sacrificePow += 0.2;
      if (isAchEnabled("r57")) sacrificePow += 0.2; //this upgrade was too OP lol
      return Decimal.pow((player.firstAmount.e/10.0), sacrificePow).dividedBy(((Decimal.max(player.sacrificed.e, 1)).dividedBy(10.0)).pow(sacrificePow).max(1)).max(1);
    }

    return player.firstAmount.pow(0.05).dividedBy(player.sacrificed.pow(0.04).max(1)).max(1);
  }

  static get totalBoost() {
    if (player.sacrificed === 0) return new Decimal(1);

    if (player.challenges.includes("postc2")) {
      if (player.timestudy.studies.includes(228)) return player.sacrificed.pow(0.013).max(1);
      if (isAchEnabled("r88")) return player.sacrificed.pow(0.011).max(1);
      else return player.sacrificed.pow(0.01);
    }

    if (player.currentChallenge !== "challenge11") {
      let sacrificePow = 2;
      if (isAchEnabled("r32")) sacrificePow += 0.2;
      if (isAchEnabled("r57")) sacrificePow += 0.2;
      return Decimal.pow((player.sacrificed.e/10.0), sacrificePow);
    }

    return player.sacrificed.pow(0.05); //this is actually off but like im not sure how youd make it good. not that it matters
  }
}