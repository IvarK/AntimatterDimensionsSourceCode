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
      hasRaisedCap: false,
      replicantiCap: new Decimal(0),
      effarigInfinityBonusRG: 0,
      nextEffarigRGThreshold: 0
    };
  },
  computed: {
    replicantiChanceSetup() {
      return new ReplicantiUpgradeButtonSetup(ReplicantiUpgrade.chance,
        value => `Replicate chance: ${Math.round(value * 100)}%`,
        cost => `+1% Costs: ${this.shortenCosts(cost)} IP`
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
        return `${shorten(actualInterval, 2, 2)}ms`;
      }
      return new ReplicantiUpgradeButtonSetup(upgrade,
        value => `Interval: ${formatInterval(value)}`,
        cost => `➜ ${formatInterval(upgrade.nextValue)} Costs: ${this.shortenCosts(cost)} IP`
      );
    },
    maxGalaxySetup() {
      const upgrade = ReplicantiUpgrade.galaxies;
      return new ReplicantiUpgradeButtonSetup(upgrade,
        value => {
          let description = `Max Replicanti galaxies: ${shortenSmallInteger(value)}`;
          const extra = upgrade.extra;
          if (extra > 0) {
            description += `+${shortenSmallInteger(extra)}`;
          }
          return description;
        },
        cost => `+${shortenSmallInteger(1)} Costs: ${this.shortenCosts(cost)} IP`
      );
    }
  },
  methods: {
    update() {
      this.isUnlocked = Replicanti.areUnlocked;
      if (!this.isUnlocked) {
        this.isUnlockAffordable = player.infinityPoints.gte(1e140);
        return;
      }
      this.isInEC8 = EternityChallenge(8).isRunning;
      if (this.isInEC8) {
        this.ec8Purchases = player.eterc8repl;
      }
      this.amount.copyFrom(Replicanti.amount);
      this.mult.copyFrom(replicantiMult());
      this.hasRaisedCap = EffarigUnlock.infinity.isUnlocked;
      this.replicantiCap.copyFrom(replicantiCap());
      this.effarigInfinityBonusRG = Effarig.bonusRG;
      this.nextEffarigRGThreshold = Decimal.MAX_NUMBER.pow(Effarig.bonusRG + 2);
    }
  },
  template:
    `<div class="l-replicanti-tab">
      <br>
      <primary-button
        v-if="!isUnlocked"
        :enabled="isUnlockAffordable"
        class="o-primary-btn--replicanti-unlock"
        onclick="Replicanti.unlock();"
      >Unlock Replicanti<br>Cost: {{shortenCosts(1e140)}} IP</primary-button>
      <template v-else>
        <div v-if="isInEC8">You have {{ec8Purchases}} {{"purchase" | pluralize(ec8Purchases)}} left.</div>
        <div v-if="hasRaisedCap">
          Your replicanti cap without study 192 has been raised to {{shorten(replicantiCap, 2)}}
          and is giving you {{shortenSmallInteger(effarigInfinityBonusRG)}} extra RG due to Effarig Infinity.
          (Next RG at {{shorten(nextEffarigRGThreshold, 2)}})
        </div>
        <p class="c-replicanti-description">
          You have
          <span class="c-replicanti-description__accent">{{shortenDimensions(amount)}}</span> Replicanti.
          Translated to
          <span class="c-replicanti-description__accent">{{shortenRateOfChange(mult)}}</span>x
          multiplier on all Infinity Dimensions.
        </p>
        <br>
        <div class="l-replicanti-upgrade-row">
          <replicanti-upgrade-button :setup="replicantiChanceSetup" />
          <replicanti-upgrade-button :setup="replicantiIntervalSetup" />
          <replicanti-upgrade-button :setup="maxGalaxySetup" />
        </div>
        <br>
        <br>
        <replicanti-gain-text />
        <br>
        <replicanti-galaxy-button />
      </template>
    </div>`
});

