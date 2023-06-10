import { UpgradeableAutobuyerState } from "./autobuyer";

export class GalaxyAutobuyerState extends UpgradeableAutobuyerState {
  get data() {
    return player.auto.galaxy;
  }

  get name() {
    return `Antimatter Galaxy`;
  }

  get isUnlocked() {
    if (Pelle.isDisabled("galaxyAutobuyer")) return false;
    return this.canBeUpgraded;
  }

  get canBeUpgraded() {
    return NormalChallenge(11).isCompleted;
  }

  get baseInterval() {
    return Player.defaultStart.auto.galaxy.interval;
  }

  get limitGalaxies() {
    return this.data.limitGalaxies;
  }

  set limitGalaxies(value) {
    this.data.limitGalaxies = value;
  }

  get maxGalaxies() {
    return this.data.maxGalaxies;
  }

  set maxGalaxies(value) {
    this.data.maxGalaxies = value;
  }

  get buyMaxInterval() {
    return this.data.buyMaxInterval;
  }

  set buyMaxInterval(value) {
    this.data.buyMaxInterval = value;
  }

  get isBuyMaxUnlocked() {
    return EternityMilestone.autobuyMaxGalaxies.isReached;
  }

  get interval() {
    return this.isBuyMaxUnlocked
      ? TimeSpan.fromSeconds(this.buyMaxInterval).totalMilliseconds
      : super.interval;
  }

  get canTick() {
    return Galaxy.canBeBought && Galaxy.requirement.isSatisfied && super.canTick;
  }

  get resetTickOn() {
    return PRESTIGE_EVENT.INFINITY;
  }

  tick() {
    super.tick();
    const limit = this.limitGalaxies ? this.maxGalaxies : Number.MAX_VALUE;
    requestGalaxyReset(this.isBuyMaxUnlocked, limit);
  }
}
