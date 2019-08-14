Vue.component("break-infinity-tab", {
  data: function() {
    return {
      isUnlocked: false
    };
  },
  computed: {
    grid: function() {
      return [
        [
          BreakInfinityUpgrade.totalAMMult,
          BreakInfinityUpgrade.currentAMMult,
          BreakInfinityUpgrade.galaxyBoost,
        ],
        [
          BreakInfinityUpgrade.infinitiedMult,
          BreakInfinityUpgrade.achievementMult,
          BreakInfinityUpgrade.slowestChallengeMult,
        ],
        [
          BreakInfinityUpgrade.infinitiedGen,
          BreakInfinityUpgrade.bulkDimBoost,
          BreakInfinityUpgrade.autobuyerSpeed
        ],
        [
          BreakInfinityUpgrade.tickspeedCostMult,
          BreakInfinityUpgrade.dimCostMult,
          BreakInfinityUpgrade.ipGen
        ]
      ];
    }
  },
  methods: {
    update() {
      this.isUnlocked = Autobuyer.infinity.isUnlocked && Autobuyer.infinity.hasMaxedInterval;
    },
    btnClassObject: function(column) {
      return {
        "l-infinity-upgrade-grid__cell": true,
        "o-infinity-upgrade-btn--multiplier": column === 3
      };
    }
  },
  template:
    `<div class="l-break-infinity-tab">
      <div v-if="!isUnlocked">You need to get Automated Big Crunch interval to 0.1 to be able to break infinity</div>
      <break-infinity-button class="l-break-infinity-tab__break-btn" />
      <div v-if="isUnlocked" class="l-break-infinity-upgrade-grid l-break-infinity-tab__grid">
        <div v-for="(column, columnId) in grid" class="l-break-infinity-upgrade-grid__row">
          <infinity-upgrade-button
            v-for="upgrade in column"
            :key="upgrade.id"
            :upgrade="upgrade"
            :class="btnClassObject(columnId)"
          />
        </div>
      </div>
    </div>`
});