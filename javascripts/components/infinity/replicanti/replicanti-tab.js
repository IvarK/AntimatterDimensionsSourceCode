"use strict";

Vue.component("replicanti-tab", {
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
      hasRaisedCap: false,
      replicantiCap: new Decimal(0),
      distantRG: 0,
      remoteRG: 0,
      effarigInfinityBonusRG: 0,
      nextEffarigRGThreshold: 0
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
    }
  },
  methods: {
    update() {
      this.isUnlocked = Replicanti.areUnlocked;
      if (!this.isUnlocked) {
        this.isUnlockAffordable = Currency.infinityPoints.gte(1e140);
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
      this.hasRaisedCap = EffarigUnlock.infinity.canBeApplied;
      this.replicantiCap.copyFrom(replicantiCap());
      this.distantRG = ReplicantiUpgrade.galaxies.distantRGStart;
      this.remoteRG = ReplicantiUpgrade.galaxies.remoteRGStart;
      this.effarigInfinityBonusRG = Effarig.bonusRG;
      this.nextEffarigRGThreshold = Decimal.NUMBER_MAX_VALUE.pow(Effarig.bonusRG + 2);
    }
  },
  template: `
    <div class="l-replicanti-tab">
      <br>
      <primary-button
        v-if="!isUnlocked"
        :enabled="isUnlockAffordable"
        class="o-primary-btn--replicanti-unlock"
        onclick="Replicanti.unlock();"
      >
        Unlock Replicanti
        <br>
        Cost: {{ format(1e140) }} IP
      </primary-button>
      <template v-else>
        <div v-if="isInEC8">
          You have {{ formatInt(ec8Purchases) }} {{ "purchase" | pluralize(ec8Purchases) }} left.
        </div>
        <div v-if="hasRaisedCap">
          Your Replicanti cap without Time Study 192 has been raised to {{ format(replicantiCap, 2) }}
          and is giving you {{ formatInt(effarigInfinityBonusRG) }} extra Replicanti
          {{ "Galaxy" | pluralize(effarigInfinityBonusRG, "Galaxies") }}
          <br>
          due to the reward from Effarig's Infinity. (Next Replicanti Galaxy at {{ format(nextEffarigRGThreshold, 2) }})
        </div>
        <p class="c-replicanti-description">
          You have
          <span class="c-replicanti-description__accent">{{ format(amount, 2, 0) }}</span>
          Replicanti, translated to a
          <br>
          <span class="c-replicanti-description__accent">{{ formatX(mult, 2, 2) }}</span>
          multiplier on all Infinity Dimensions
          <span v-if="hasTDMult">
            <br>
            and a
            <span class="c-replicanti-description__accent">{{ formatX(multTD, 2, 2) }}</span>
            multiplier on all Time Dimensions
          </span>
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
        <replicanti-galaxy-button />
      </template>
    </div>`
});
