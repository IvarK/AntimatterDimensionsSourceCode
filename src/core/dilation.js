import { RebuyableMechanicState, SetPurchasableMechanicState } from "./game-mechanics";
import { DC } from "./constants";
import FullScreenAnimationHandler from "./full-screen-animation-handler";
import { SpeedrunMilestones } from "./speedrun";

export function animateAndDilate() {
  FullScreenAnimationHandler.display("a-dilate", 2);
  setTimeout(startDilatedEternity, 1000);
}

// eslint-disable-next-line no-empty-function
export function animateAndUndilate(callback) {
  FullScreenAnimationHandler.display("a-undilate", 2);
  setTimeout(() => {
    eternity(false, false, { switchingDilation: true });
    if (callback) callback();
  }, 1000);
}

export function startDilatedEternityRequest() {
  if (!PlayerProgress.dilationUnlocked() || (Pelle.isDoomed && !Pelle.canDilateInPelle)) return;
  const playAnimation = player.options.animations.dilation && !FullScreenAnimationHandler.isDisplaying;
  if (player.dilation.active) {
    if (player.options.confirmations.dilation) {
      Modal.exitDilation.show();
    } else if (playAnimation) {
      animateAndUndilate();
    } else {
      eternity(false, false, { switchingDilation: true });
    }
  } else if (player.options.confirmations.dilation) {
    Modal.enterDilation.show();
  } else if (playAnimation) {
    animateAndDilate();
  } else {
    startDilatedEternity();
  }
}

export function startDilatedEternity(auto) {
  if (!PlayerProgress.dilationUnlocked()) return false;
  if (GameEnd.creditsEverClosed) return false;
  if (player.dilation.active) {
    eternity(false, auto, { switchingDilation: true });
    return false;
  }
  Achievement(136).unlock();
  eternity(false, auto, { switchingDilation: true });
  player.dilation.active = true;
  if (Pelle.isDoomed) PelleStrikes.dilation.trigger();
  return true;
}

const DIL_UPG_NAMES = [
  null, "dtGain", "galaxyThreshold", "tachyonGain", "doubleGalaxies", "tdMultReplicanti",
  "ndMultDT", "ipMultDT", "timeStudySplit", "dilationPenalty", "ttGenerator",
  "dtGainPelle", "galaxyMultiplier", "tickspeedPower", "galaxyThresholdPelle", "flatDilationMult"
];

export function buyDilationUpgrade(id, bulk = 1) {
  if (GameEnd.creditsEverClosed) return false;
  // Upgrades 1-3 are rebuyable, and can be automatically bought in bulk with a perk shop upgrade
  const upgrade = DilationUpgrade[DIL_UPG_NAMES[id]];
  if (id > 3 && id < 11) {
    if (player.dilation.upgrades.has(id)) return false;
    if (!Currency.dilatedTime.purchase(upgrade.cost)) return false;
    player.dilation.upgrades.add(id);
    if (id === 4) player.dilation.totalTachyonGalaxies *= 2;
  } else {
    const upgAmount = player.dilation.rebuyables[id];
    if (Currency.dilatedTime.lt(upgrade.cost) || upgAmount >= upgrade.config.purchaseCap) return false;

    let buying = Decimal.affordGeometricSeries(Currency.dilatedTime.value,
      upgrade.config.initialCost, upgrade.config.increment, upgAmount).toNumber();
    buying = Math.clampMax(buying, bulk);
    buying = Math.clampMax(buying, upgrade.config.purchaseCap - upgAmount);
    const cost = Decimal.sumGeometricSeries(buying, upgrade.config.initialCost, upgrade.config.increment, upgAmount);
    Currency.dilatedTime.subtract(cost);
    player.dilation.rebuyables[id] += buying;
    if (id === 2) {
      if (!Perk.bypassTGReset.isBought || Pelle.isDoomed) Currency.dilatedTime.reset();
      player.dilation.nextThreshold = DC.E3;
      player.dilation.baseTachyonGalaxies = 0;
      player.dilation.totalTachyonGalaxies = 0;
    }

    if (id === 3 && !Pelle.isDisabled("tpMults")) {
      let retroactiveTPFactor = Effects.max(
        1,
        Perk.retroactiveTP1,
        Perk.retroactiveTP2,
        Perk.retroactiveTP3,
        Perk.retroactiveTP4
      );
      if (Enslaved.isRunning) {
        retroactiveTPFactor = Math.pow(retroactiveTPFactor, Enslaved.tachyonNerf);
      }
      Currency.tachyonParticles.multiply(Decimal.pow(retroactiveTPFactor, buying));
    }
  }
  return true;
}

export function getTachyonGalaxyMult(thresholdUpgrade) {
  // This specifically needs to be an undefined check because sometimes thresholdUpgrade is zero
  const upgrade = thresholdUpgrade === undefined ? DilationUpgrade.galaxyThreshold.effectValue : thresholdUpgrade;
  const thresholdMult = 3.65 * upgrade + 0.35;
  const glyphEffect = getAdjustedGlyphEffect("dilationgalaxyThreshold");
  const glyphReduction = glyphEffect === 0 ? 1 : glyphEffect;
  const power = DilationUpgrade.galaxyThresholdPelle.canBeApplied
    ? DilationUpgrade.galaxyThresholdPelle.effectValue : 1;
  return (1 + thresholdMult * glyphReduction) ** power;
}

export function getDilationGainPerSecond() {
  if (Pelle.isDoomed) {
    const tachyonEffect = Currency.tachyonParticles.value.pow(PelleRifts.paradox.milestones[1].effectOrDefault(1));
    return new Decimal(tachyonEffect)
      .timesEffectsOf(DilationUpgrade.dtGain, DilationUpgrade.dtGainPelle, DilationUpgrade.flatDilationMult)
      .times(ShopPurchase.dilatedTimePurchases.currentMult ** 0.5)
      .times(Pelle.specialGlyphEffect.dilation).div(1e5);
  }
  let dtRate = new Decimal(Currency.tachyonParticles.value)
    .timesEffectsOf(
      DilationUpgrade.dtGain,
      Achievement(132),
      Achievement(137),
      RealityUpgrade(1),
      AlchemyResource.dilation,
      Ra.unlocks.continuousTTBoost.effects.dilatedTime,
      Ra.unlocks.peakGamespeedDT
    );
  dtRate = dtRate.times(getAdjustedGlyphEffect("dilationDT"));
  dtRate = dtRate.times(ShopPurchase.dilatedTimePurchases.currentMult);
  dtRate = dtRate.times(
    Math.clampMin(Decimal.log10(Replicanti.amount) * getAdjustedGlyphEffect("replicationdtgain"), 1));
  if (Enslaved.isRunning && !dtRate.eq(0)) dtRate = Decimal.pow10(Math.pow(dtRate.plus(1).log10(), 0.85) - 1);
  if (V.isRunning) dtRate = dtRate.pow(0.5);
  return dtRate;
}

export function tachyonGainMultiplier() {
  if (Pelle.isDisabled("tpMults")) return new Decimal(1);
  const pow = Enslaved.isRunning ? Enslaved.tachyonNerf : 1;
  return DC.D1.timesEffectsOf(
    DilationUpgrade.tachyonGain,
    GlyphSacrifice.dilation,
    Achievement(132),
    RealityUpgrade(4),
    RealityUpgrade(8),
    RealityUpgrade(15)
  ).pow(pow);
}

export function rewardTP() {
  Currency.tachyonParticles.bumpTo(getTP(player.records.thisEternity.maxAM, true));
  player.dilation.lastEP = Currency.eternityPoints.value;
}

// This function exists to apply Teresa-25 in a consistent way; TP multipliers can be very volatile and
// applying the reward only once upon unlock promotes min-maxing the upgrade by unlocking dilation with
// TP multipliers as large as possible. Applying the reward to a base TP value and letting the multipliers
// act dynamically on this fixed base value elsewhere solves that issue
export function getBaseTP(antimatter, requireEternity) {
  if (!Player.canEternity && requireEternity) return DC.D0;
  const am = (isInCelestialReality() || Pelle.isDoomed)
    ? antimatter
    : Ra.unlocks.unlockDilationStartingTP.effectOrDefault(antimatter);
  let baseTP = Decimal.pow(Decimal.log10(am) / 400, 1.5);
  if (Enslaved.isRunning) baseTP = baseTP.pow(Enslaved.tachyonNerf);
  return baseTP;
}

// Returns the TP that would be gained this run
export function getTP(antimatter, requireEternity) {
  return getBaseTP(antimatter, requireEternity).times(tachyonGainMultiplier());
}

// Returns the amount of TP gained, subtracting out current TP; used for displaying gained TP, text on the
// "exit dilation" button (saying whether you need more antimatter), and in last 10 eternities
export function getTachyonGain(requireEternity) {
  return getTP(Currency.antimatter.value, requireEternity).minus(Currency.tachyonParticles.value).clampMin(0);
}

// Returns the minimum antimatter needed in order to gain more TP; used only for display purposes
export function getTachyonReq() {
  let effectiveTP = Currency.tachyonParticles.value.dividedBy(tachyonGainMultiplier());
  if (Enslaved.isRunning) effectiveTP = effectiveTP.pow(1 / Enslaved.tachyonNerf);
  return Decimal.pow10(
    effectiveTP
      .times(Math.pow(400, 1.5))
      .pow(2 / 3)
      .toNumber()
  );
}

export function getDilationTimeEstimate(goal) {
  const currentDTGain = getDilationGainPerSecond();
  const rawDTGain = currentDTGain.times(getGameSpeedupForDisplay());
  const currentDT = Currency.dilatedTime.value;
  if (currentDTGain.eq(0)) return null;
  if (PelleRifts.paradox.isActive) {
    const drain = Pelle.riftDrainPercent;
    const goalNetRate = rawDTGain.minus(Decimal.multiply(goal, drain));
    const currNetRate = rawDTGain.minus(currentDT.times(drain));
    if (goalNetRate.lt(0)) return "Never affordable due to Rift drain";
    return TimeSpan.fromSeconds(currNetRate.div(goalNetRate).ln() / drain).toTimeEstimate();
  }
  return TimeSpan.fromSeconds(Decimal.sub(goal, currentDT)
    .div(rawDTGain).toNumber()).toTimeEstimate();
}

export function dilatedValueOf(value) {
  const log10 = value.log10();
  const dilationPenalty = 0.75 * Effects.product(DilationUpgrade.dilationPenalty);
  return Decimal.pow10(Math.sign(log10) * Math.pow(Math.abs(log10), dilationPenalty));
}

class DilationUpgradeState extends SetPurchasableMechanicState {
  get currency() {
    return Currency.dilatedTime;
  }

  get set() {
    return player.dilation.upgrades;
  }

  onPurchased() {
    if (this.id === 4) player.dilation.totalTachyonGalaxies *= 2;
    if (this.id === 10) SpeedrunMilestones(15).tryComplete();
  }
}

class RebuyableDilationUpgradeState extends RebuyableMechanicState {
  get currency() {
    return Currency.dilatedTime;
  }

  get boughtAmount() {
    return player.dilation.rebuyables[this.id];
  }

  set boughtAmount(value) {
    player.dilation.rebuyables[this.id] = value;
  }

  get isCapped() {
    return this.config.reachedCap();
  }

  purchase(bulk) {
    buyDilationUpgrade(this.config.id, bulk);
  }
}

export const DilationUpgrade = mapGameDataToObject(
  GameDatabase.eternity.dilation,
  config => (config.rebuyable
    ? new RebuyableDilationUpgradeState(config)
    : new DilationUpgradeState(config))
);

export const DilationUpgrades = {
  rebuyable: [
    DilationUpgrade.dtGain,
    DilationUpgrade.galaxyThreshold,
    DilationUpgrade.tachyonGain,
  ],
  fromId: id => DilationUpgrade.all.find(x => x.id === Number(id))
};
