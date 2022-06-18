import { GameMechanicState } from "../../utils";

class RiftMilestoneState extends GameMechanicState {

  lastChecked = false;

  get requirement() {
    return this.config.requirement;
  }

  get resource() {
    return this.config.resource;
  }

  checkMilestoneState() {
    if (this.lastChecked !== this.isUnlocked) {
      this.config.onStateChange?.();
    }
    this.lastChecked = this.isUnlocked;
  }

  get isUnlocked() {
    if (this.resource === "decay" && PelleRifts.chaos.milestones[0].isEffectActive) return true;
    return this.requirement <= PelleRifts[this.resource].percentage;
  }

  get isEffectActive() {
    return this.isUnlocked;
  }

  get description() {
    const d = this.config.description;
    return typeof d === "function" ? d() : d;
  }

  get formattedEffect() {
    if (this.canBeApplied) return this.config.formatEffect(this.effectValue);
    return false;
  }
}

class RiftState extends GameMechanicState {
  constructor(config) {
    super(config);
    this._milestones = this.config.milestones.map(x => new RiftMilestoneState(x));
  }

  get fillCurrency() {
    return this.config.currency();
  }

  get strike() {
    return this.config.strike();
  }

  get canBeApplied() {
    return this.strike.hasStrike;
  }

  get name() {
    return this.config.name;
  }

  get reducedTo() {
    return this.rift.reducedTo;
  }

  set reducedTo(value) {
    this.rift.reducedTo = value;
  }

  get rift() {
    return player.celestials.pelle.rifts[this.config.key];
  }

  get totalFill() {
    return this.rift.fill;
  }

  set totalFill(value) {
    this.rift.fill = value;
  }

  get isActive() {
    return this.rift.active;
  }

  get realPercentage() {
    return this.config.percentage(this.totalFill);
  }

  get spentPercentage() {
    return this.rift.percentageSpent || 0;
  }

  get percentage() {
    if (this.reducedTo > 1) return this.reducedTo;
    if (!this.config.spendable) return Math.min(this.realPercentage, this.reducedTo);
    return Math.min(this.config.percentage(this.totalFill) - this.spentPercentage, this.reducedTo);
  }

  get milestones() {
    return this._milestones;
  }

  get description() {
    return this.config.description;
  }

  get drainResource() {
    return this.config.drainResource;
  }

  get effects() {
    const base = this.config.baseEffect(this.effectValue);
    const additional = this.config.additionalEffects?.().map(x => x.formattedEffect) ?? [];
    return [base, ...additional];
  }

  get isCustomEffect() { return true; }

  get effectValue() {
    return this.config.effect(this.config.percentageToFill(this.percentage));
  }

  get maxValue() {
    return this.config.percentageToFill(1 + this.spentPercentage);
  }

  get isMaxed() {
    return this.percentage >= 1;
  }

  get galaxyGeneratorText() {
    return this.config.galaxyGeneratorText;
  }

  toggle() {
    const active = PelleRifts.all.filter(r => r.isActive).length;
    if (!this.isActive && active === 2) GameUI.notify.error(`You can only have 2 rifts active at the same time!`);
    else this.rift.active = !this.rift.active;
  }

  checkMilestoneStates() {
    this.milestones.forEach(x => x.checkMilestoneState());
  }

  fill(diff) {
    // The UI removes the fill button after 100%, so we need to turn it off here
    if (this.isActive && this.isMaxed) {
      this.rift.active = false;
      return;
    }
    if (!this.isActive || this.isMaxed) return;

    if (this.fillCurrency.value instanceof Decimal) {
      // Don't drain resources if you only have 1 of it.
      // This is in place due to the fix to replicanti below.
      if (this.fillCurrency.value.lte(1)) return;
      const afterTickAmount = this.fillCurrency.value.times((1 - Pelle.riftDrainPercent) ** (diff / 1000));
      const spent = this.fillCurrency.value.minus(afterTickAmount);
      // We limit this to 1 instead of 0 specifically for the case of replicanti; certain interactions with offline
      // time can cause it to drain to 0, where it gets stuck unless you reset it with some prestige
      this.fillCurrency.value = this.fillCurrency.value.minus(spent).max(1);
      this.totalFill = this.totalFill.plus(spent).min(this.maxValue);
    } else {
      const afterTickAmount = this.fillCurrency.value * (1 - Pelle.riftDrainPercent) ** (diff / 1000);
      const spent = this.fillCurrency.value - afterTickAmount;
      this.fillCurrency.value = Math.max(this.fillCurrency.value - spent, 0);
      this.totalFill = Math.clampMax(this.totalFill + spent, this.maxValue);
    }
    if (PelleRifts.vacuum.milestones[0].canBeApplied) Glyphs.refreshActive();
    this.checkMilestoneStates();
  }
}

export const PelleRifts = mapGameDataToObject(
  GameDatabase.celestials.pelle.rifts,
  config => new RiftState(config)
);

PelleRifts.totalMilestones = () => PelleRifts.all.flatMap(x => x.milestones).countWhere(x => x.canBeApplied);
