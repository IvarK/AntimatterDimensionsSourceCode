import "./replicanti-gain-text.js";
import "./replicanti-galaxy-button.js";
import { ReplicantiUpgradeButtonSetup } from "./replicanti-upgrade-button.js";
import PrimaryButton from "@/components/PrimaryButton";

Vue.component("replicanti-tab", {
  components: {
    PrimaryButton
  },
  data() {
    return {
      isUnlocked: false,
      isUnlockAffordable: false,
      isInEC8: false,
      ec8Purchases: 0,
      amount: new Decimal(0),
      mult: new Decimal(0),
      hasTDMult: false,
      multTD: new Decimal(0),
      hasDTMult: false,
      multDT: new Decimal(0),
      hasRaisedCap: false,
      replicantiCap: new Decimal(0),
      distantRG: 0,
      remoteRG: 0,
      effarigInfinityBonusRG: 0,
      isUncapped: false,
      nextEffarigRGThreshold: 0,
      canSeeGalaxyButton: false,
      unlockCost: new Decimal()
    };
  },
  computed: {
    replicantiChanceSetup() {
      return new ReplicantiUpgradeButtonSetup(ReplicantiUpgrade.chance,
        value => `Replicate chance: ${formatPercents(value)}`,
        cost => `+${formatPercents(0.01)} Costs: ${format(cost)} IP`
      );
    },
    replicantiIntervalSetup() {
      const upgrade = ReplicantiUpgrade.interval;
      function formatInterval(interval) {
        const actualInterval = upgrade.applyModifiers(interval);
        const intervalNum = actualInterval.toNumber();
        if (Number.isFinite(intervalNum) && intervalNum > 1 && upgrade.isCapped) {
          // Checking isCapped() prevents text overflow when formatted as "__ ➜ __"
          return TimeSpan.fromMilliseconds(intervalNum).toStringShort(false);
        }
        if (actualInterval.lt(0.01)) return `< ${format(0.01, 2, 2)}ms`;
        if (actualInterval.gt(1000)) return `${format(actualInterval.div(1000), 2, 2)}s`;
        return `${format(actualInterval, 2, 2)}ms`;
      }
      return new ReplicantiUpgradeButtonSetup(upgrade,
        value => `Interval: ${formatInterval(value)}`,
        cost => `➜ ${formatInterval(upgrade.nextValue)} Costs: ${format(cost)} IP`
      );
    },
    maxGalaxySetup() {
      const upgrade = ReplicantiUpgrade.galaxies;
      return new ReplicantiUpgradeButtonSetup(upgrade,
        value => {
          let description = `Max Replicanti Galaxies: ${formatInt(value)}`;
          const extra = upgrade.extra;
          if (extra > 0) {
            description += `+${formatInt(extra)}`;
          }
          return description;
        },
        cost => `+${formatInt(1)} Costs: ${format(cost)} IP`
      );
    },
    boostText() {
      const boostList = [];
      boostList.push(`a <span class="c-replicanti-description__accent">${formatX(this.mult, 2, 2)}</span>
        multiplier on all Infinity Dimensions`);
      if (this.hasTDMult) {
        boostList.push(`a <span class="c-replicanti-description__accent">${formatX(this.multTD, 2, 2)}</span>
          multiplier on all Time Dimensions from a Dilation Upgrade`);
      }
      if (this.hasDTMult) {
        const additionalEffect = GlyphAlteration.isAdded("replication") ? "and Replicanti speed " : "";
        boostList.push(`a <span class="c-replicanti-description__accent">${formatX(this.multDT, 2, 2)}</span>
          multiplier to Dilated Time ${additionalEffect}from Glyphs`);
      }
      if (boostList.length === 1) return `${boostList[0]}.`;
      if (boostList.length === 2) return `${boostList[0]}<br> and ${boostList[1]}.`;
      return `${boostList.slice(0, -1).join(",<br>")},<br> and ${boostList[boostList.length - 1]}.`;
    },
  },
  methods: {
    update() {
      this.isUnlocked = Replicanti.areUnlocked;
      this.unlockCost = PelleRifts.famine.hasMilestone(1) ? 1e10 : 1e140;
      if (!this.isUnlocked) {
        this.isUnlockAffordable = Currency.infinityPoints.gte(this.unlockCost);
        return;
      }
      this.isInEC8 = EternityChallenge(8).isRunning;
      if (this.isInEC8) {
        this.ec8Purchases = player.eterc8repl;
      }
      this.amount.copyFrom(Replicanti.amount);
      this.mult.copyFrom(replicantiMult());
      this.hasTDMult = DilationUpgrade.tdMultReplicanti.isBought;
      this.multTD.copyFrom(DilationUpgrade.tdMultReplicanti.effectValue);
      this.hasDTMult = getAdjustedGlyphEffect("replicationdtgain") !== 0;
      this.multDT = Math.clampMin(Decimal.log10(Replicanti.amount) * getAdjustedGlyphEffect("replicationdtgain"), 1);
      this.isUncapped = PelleRifts.pestilence.hasMilestone(2);
      this.hasRaisedCap = EffarigUnlock.infinity.isUnlocked && !this.isUncapped;
      this.replicantiCap.copyFrom(replicantiCap());
      this.distantRG = ReplicantiUpgrade.galaxies.distantRGStart;
      this.remoteRG = ReplicantiUpgrade.galaxies.remoteRGStart;
      this.effarigInfinityBonusRG = Effarig.bonusRG;
      this.nextEffarigRGThreshold = Decimal.NUMBER_MAX_VALUE.pow(Effarig.bonusRG + 2);
      this.canSeeGalaxyButton = Replicanti.galaxies.max >= 1 || PlayerProgress.eternityUnlocked();
    }
  },
  template: `
    <div class="l-replicanti-tab">
      <br>
      <PrimaryButton
        v-if="!isUnlocked"
        :enabled="isUnlockAffordable"
        class="o-primary-btn--replicanti-unlock"
        onclick="Replicanti.unlock();"
      >
        Unlock Replicanti
        <br>
        Cost: {{ format(this.unlockCost) }} IP
      </PrimaryButton>
      <template v-else>
        <div v-if="isInEC8">
          You have {{ quantifyInt("purchase", ec8Purchases) }} left.
        </div>
        <div v-if="isUncapped">
          Your Replicanti cap has been removed due to the second Famine milestone.
          <br>
          Any rewards from Effarig's Infinity have been disabled.
        </div>
        <div v-if="hasRaisedCap">
          Your Replicanti cap without Time Study 192 has been raised to {{ format(replicantiCap, 2) }}
          and is giving you {{ quantifyInt("extra Replicanti Galaxy", effarigInfinityBonusRG) }}
          <br>
          due to the reward from Effarig's Infinity. (Next Replicanti Galaxy at {{ format(nextEffarigRGThreshold, 2) }})
        </div>
        <p class="c-replicanti-description">
          You have
          <span class="c-replicanti-description__accent">{{ format(amount, 2, 0) }}</span>
          Replicanti, translated to
          <br>
          <span v-html="boostText" />
        </p>
        <br>
        <div class="l-replicanti-upgrade-row">
          <replicanti-upgrade-button :setup="replicantiChanceSetup" />
          <replicanti-upgrade-button :setup="replicantiIntervalSetup" />
          <replicanti-upgrade-button :setup="maxGalaxySetup" />
        </div>
        <div>
          The Max Replicanti Galaxy upgrade can be purchased endlessly, but costs increase
          <br>
          more rapidly above {{ formatInt(distantRG) }} Replicanti Galaxies
          and even more so above {{ formatInt(remoteRG) }} Replicanti Galaxies.
        </div>
        <br><br>
        <replicanti-gain-text />
        <br>
        <replicanti-galaxy-button v-if="canSeeGalaxyButton" />
      </template>
    </div>`
});
