Vue.component("replicanti-tab", {
  data: function() {
    return {
      isUnlocked: false,
      isUnlockAffordable: false,
      isInEC8: false,
      ec8Purchases: 0,
      amount: new Decimal(0),
      mult: new Decimal(0),
      hasRaisedCap: false,
      replicantiCap: new Decimal(Number.MAX_VALUE),
      teresaInfinityBonusRG: 0
    };
  },
  computed: {
    replicantiChanceSetup: function() {
      return new ReplicantiUpgradeButtonSetup(ReplicantiUpgrade.chance,
        value => `Replicate chance: ${Math.round(value * 100)}%`,
        cost => `+1% Costs: ${this.shortenCosts(cost)} IP`
      );
    },
    replicantiIntervalSetup: function() {
      const upgrade = ReplicantiUpgrade.interval;
      function formatInterval(interval) {
        const actualInterval = upgrade.applyModifiers(interval);
        return actualInterval < 1000 ?
          `${actualInterval.toPrecision(3)}ms` :
          upgrade.isCapped ?
            TimeSpan.fromMilliseconds(actualInterval).toString():
            `${Math.floor(actualInterval)}ms`;
      }
      return new ReplicantiUpgradeButtonSetup(upgrade,
        value => `Interval: ${formatInterval(value)}`,
        cost => `➜ ${formatInterval(upgrade.next)} Costs: ${this.shortenCosts(cost)} IP`
      );
    },
    maxGalaxySetup: function() {
      const upgrade = ReplicantiUpgrade.galaxies;
      return new ReplicantiUpgradeButtonSetup(upgrade,
        value => {
          let description =`Max Replicanti galaxies: ${value}`;
          const extra = upgrade.extra;
          if (extra > 0) {
            description += `+${extra}`;
          }
          return description;
        },
        cost => `+1 Costs: ${this.shortenCosts(cost)} IP`
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
      this.hasRaisedCap = Teresa.has(TERESA_UNLOCKS.INFINITY_COMPLETE);
      this.replicantiCap.copyFrom(replicantiCap());
      this.teresaInfinityBonusRG = Teresa.bonusRG;
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
        <div v-if="isInEC8">You have {{ec8Purchases}} {{"purchases" | pluralize(ec8Purchases)}} left.</div>
        <div v-if="hasRaisedCap">Your replicanti cap without study 192 has been raised to {{shorten(replicantiCap, 2)}} and is giving you {{teresaInfinityBonusRG}} extra RG due to Teresa Infinity.</div>
        <p class="c-replicanti-description">
          You have <span class="c-replicanti-description__accent">{{shortenDimensions(amount)}}</span> Replicanti.
          Translated to <span class="c-replicanti-description__accent">{{shortenRateOfChange(mult)}}</span>x multiplier on all Infinity Dimensions.
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

