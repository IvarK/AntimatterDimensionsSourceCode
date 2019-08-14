Vue.component("infinity-upgrades-tab", {
  data: function() {
    return {
      chargeUnlocked: false,
      chargesLeft: 0
    }
  },
  computed: {
    grid: function() {
      return [
        [
          InfinityUpgrade.totalTimeMult,
          InfinityUpgrade.dim18mult,
          InfinityUpgrade.dim36mult,
          InfinityUpgrade.resetBoost
        ],
        [
          InfinityUpgrade.buy10Mult,
          InfinityUpgrade.dim27mult,
          InfinityUpgrade.dim45mult,
          InfinityUpgrade.galaxyBoost
        ],
        [
          InfinityUpgrade.thisInfinityTimeMult,
          InfinityUpgrade.unspentIPMult,
          InfinityUpgrade.dimboostMult,
          InfinityUpgrade.ipGen
        ],
        [
          InfinityUpgrade.skipReset1,
          InfinityUpgrade.skipReset2,
          InfinityUpgrade.skipReset3,
          InfinityUpgrade.skipResetGalaxy
        ]
      ];
    }
  },
  methods: {
    update() {
      this.chargeUnlocked = Ra.superChargeUnlocked
      this.chargesLeft = Ra.chargesLeft
    },
    btnClassObject: function(column) {
      const classObject = {
        "l-infinity-upgrade-grid__cell": true
      };
      if (column > 0) {
        // indexing starts from 0, while css classes start from 2 (and first column has default css class)
        classObject[`o-infinity-upgrade-btn--color-${column + 1}`] = true;
      }
      return classObject;
    }
  },
  template:
    `<div class="l-infinity-upgrades-tab">
      <div v-if="chargeUnlocked">You can Supercharge {{ chargesLeft }} {{ "upgrade" | pluralize(chargesLeft) }}</div>
      <div class="l-infinity-upgrade-grid l-infinity-upgrades-tab__grid">
        <div v-for="(column, columnId) in grid" class="l-infinity-upgrade-grid__column">
          <infinity-upgrade-button
            v-for="upgrade in column"
            :key="upgrade.id"
            :upgrade="upgrade"
            :class="btnClassObject(columnId)"
          />
        </div>
      </div>
      <ip-multiplier-button class="l-infinity-upgrades-tab__mult-btn" />
    </div>`
});
