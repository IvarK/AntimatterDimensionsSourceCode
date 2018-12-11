Vue.component("break-infinity-tab", {
  data: function() {
    return {
      isUnlocked: false
    };
  },
  computed: {
    grid: function() {
      return breakInfinityUpgradeViewModels();
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
        <div v-for="(column, columnIdx) in grid" class="l-break-infinity-upgrade-grid__row">
          <infinity-upgrade-button
            v-for="(upgrade, rowIdx) in column"
            :key="rowIdx"
            :upgrade="upgrade"
            :class="btnClassObject(columnIdx)"
          />
        </div>
      </div>
    </div>`
});

class BreakInfinityUpgradeViewModel extends InfinityUpgradeViewModel {
  constructor(props) {
    super(props);
  }

  formatCost(formatter) {
    return formatter.shortenCosts(this._upgrade.cost);
  }
}

// [ [row], [row], [row], [row] ]
const breakInfinityUpgradeViewModels = () => [
  [
    new BreakInfinityUpgradeViewModel({
      upgrade: BreakInfinityUpgrade.totalAMMult,
      description: "Normal dimensions gain a multiplier based on total antimatter produced",
      formatCurrentEffect: value => `${value.toFixed(2)}x`
    }),
    new BreakInfinityUpgradeViewModel({
      upgrade: BreakInfinityUpgrade.currentAMMult,
      description: "Normal dimensions gain a multiplier based on current antimatter",
      formatCurrentEffect: value => `${value.toFixed(2)}x`
    }),
    new BreakInfinityUpgradeViewModel({
      upgrade: BreakInfinityUpgrade.galaxyBoost,
      description: "Galaxies are 50% stronger"
    })
  ],
  [
    new BreakInfinityUpgradeViewModel({
      upgrade: BreakInfinityUpgrade.infinitiedMult,
      description: "Normal dimensions gain a multiplier based on amount infinitied",
      formatCurrentEffect: value => `${value.toFixed(2)}x`
    }),
    new BreakInfinityUpgradeViewModel({
      upgrade: BreakInfinityUpgrade.achievementMult,
      description: "Normal dimensions gain a multiplier based on achievements completed",
      formatCurrentEffect: value => `${value.toFixed(2)}x`
    }),
    new BreakInfinityUpgradeViewModel({
      upgrade: BreakInfinityUpgrade.slowestChallengeMult,
      description: "Normal dimensions gain a multiplier based on slowest challenge run",
      formatCurrentEffect: value => `${value.toFixed(2)}x`
    })
  ],
  [
    new BreakInfinityUpgradeViewModel({
      upgrade: BreakInfinityUpgrade.infinitiedGen,
      description: "You passively generate Infinitied stat based on your fastest infinity",
      formatComplexEffect: function() {
        const period = player.bestInfinityTime === 999999999999  ?
          "hundred or so years" :
          Time.bestInfinity.multiply(5);
        return `Currently: 1 Infinity every ${period}`;
      }
    }),
    new BreakInfinityUpgradeViewModel({
      upgrade: BreakInfinityUpgrade.bulkDimBoost,
      description: "Option to bulk buy Dimension Boosts"
    }),
    new BreakInfinityUpgradeViewModel({
      upgrade: BreakInfinityUpgrade.autobuyerSpeed,
      description: "Autobuyers work twice as fast"
    })
  ],
  [
    new BreakInfinityUpgradeViewModel({
      upgrade: BreakInfinityUpgrade.tickspeedCostMult,
      description: "Decrease Tickspeed cost multiplier growth by",
      formatComplexEffect: function() {
        const upgrade = BreakInfinityUpgrade.tickspeedCostMult;
        let tickspeedScaleDecimalPoints = player.eternityChalls.eterc11 == undefined ? 0 : 3;
        const current = (upgrade.maxValue - upgrade.effectValue).toFixed(tickspeedScaleDecimalPoints);
        if (upgrade.isBought) {
          return `${current}x`;
        }
        if (current === 0) {
          return `${current + 1}x`;
        }
        return `${current}x => ${current + 1}x`;
      }
    }),
    new BreakInfinityUpgradeViewModel({
      upgrade: BreakInfinityUpgrade.dimCostMult,
      description: "Decrease Dimension cost multiplier growth by",
      formatComplexEffect: function() {
        const upgrade = BreakInfinityUpgrade.dimCostMult;
        const current = upgrade.maxValue - upgrade.effectValue;
        if (upgrade.isBought) {
          return `${current}x`;
        }
        if (current === 0) {
          return `${current + 1}x`;
        }
        return `${current}x => ${current + 1}x`;
      }
    }),
    new BreakInfinityUpgradeViewModel({
      upgrade: BreakInfinityUpgrade.ipGen,
      description: function() {
        let generation = `Generate ${player.offlineProd}%`;
        if (!BreakInfinityUpgrade.ipGen.isBought) {
          generation += ` > ${player.offlineProd + 5}%`;
        }
        return `${generation} of your best IP/min from last 10 infinities, works offline`;
      },
      formatComplexEffect: function(formatter) {
        return `Currently: ${formatter.shortenMoney(bestRunIppm.times(player.offlineProd / 100))} IP/min`;
      }
    })
  ]
];