Vue.component("replicanti-tab", {
  data: function() {
    return {
      isUnlocked: false,
      isUnlockAffordable: false,
      isInEC8: false,
      ec8Purchases: 0,
      amount: new Decimal(0),
      mult: new Decimal(0)
    };
  },
  computed: {
    replicantiChanceSetup: function() {
      return new ReplicantiUpgradeButtonSetup(0, ReplicantiUpgrade.chance,
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
      return new ReplicantiUpgradeButtonSetup(1, upgrade,
        value => `Interval: ${formatInterval(value)}`,
        cost => `-> ${formatInterval(upgrade.next)} Costs: ${this.shortenCosts(cost)} IP`
      );
    },
    maxGalaxySetup: function() {
      const upgrade = ReplicantiUpgrade.galaxies;
      return new ReplicantiUpgradeButtonSetup(2, upgrade,
        function(value) {
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
        <div v-if="isInEC8">You have {{ec8Purchases}} purchases left.</div>
        <p class="c-replicanti-description">
          You have <span class="c-replicanti-description__accent">{{shortenDimensions(amount)}}</span> Replicanti.
          Translated to <span class="c-replicanti-description__accent">{{shorten(mult)}}</span>x multiplier on all Infinity Dimensions.
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

