Vue.component("infinity-upgrades-tab", {
  computed: {
    grid: function() {
      return infinityUpgradeGridViewModels();
    }
  },
  methods: {
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
      <div class="l-infinity-upgrade-grid l-infinity-upgrades-tab__grid">
        <div v-for="(column, columnIdx) in grid" class="l-infinity-upgrade-grid__column">
          <infinity-upgrade-button
            v-for="(upgrade, rowIdx) in column"
            :key="rowIdx"
            :upgrade="upgrade"
            :class="btnClassObject(columnIdx)"
          />
        </div>
      </div>
      <ip-multiplier-button class="l-infinity-upgrades-tab__mult-btn"/>
    </div>`
});

// [ [column], [column], [column], [column] ]
const infinityUpgradeGridViewModels = () => [
  [
    new InfinityUpgradeViewModel({
      upgrade: InfinityUpgrade.totalTimeMult,
      description: "Normal dimensions gain a multiplier based on time played",
      formatCurrentEffect: value => `${value.toFixed(2)}x`
    }),
    new InfinityUpgradeViewModel({
      upgrade: InfinityUpgrade.dim18mult,
      description: "First and Eighth Dimensions gain a multiplier based on infinitied stat",
      formatCurrentEffect: (value, formatter) => `${formatter.shortenMultiplier(value)}x`
    }),
    new InfinityUpgradeViewModel({
      upgrade: InfinityUpgrade.dim36mult,
      description: "Third and Sixth Dimensions gain a multiplier based on infinitied stat",
      formatCurrentEffect: (value, formatter) => `${formatter.shortenMultiplier(value)}x`
    }),
    new InfinityUpgradeViewModel({
      upgrade: InfinityUpgrade.resetBoost,
      description: "Decrease the number of Dimensions needed for Dimensional Boosts and Antimatter Galaxies by 9"
    }),
  ],
  [
    new InfinityUpgradeViewModel({
      upgrade: InfinityUpgrade.buy10Mult,
      description: "Increase the multiplier for buying 10 Dimensions",
      staticEffect: "2x => 2.2x"
    }),
    new InfinityUpgradeViewModel({
      upgrade: InfinityUpgrade.dim27mult,
      description: "Second and Seventh Dimensions gain a multiplier based on infinitied stat",
      formatCurrentEffect: (value, formatter) => `${formatter.shortenMultiplier(value)}x`
    }),
    new InfinityUpgradeViewModel({
      upgrade: InfinityUpgrade.dim45mult,
      description: "Fourth and Fifth Dimensions gain a multiplier based on infinitied stat",
      formatCurrentEffect: (value, formatter) => `${formatter.shortenMultiplier(value)}x`
    }),
    new InfinityUpgradeViewModel({
      upgrade: InfinityUpgrade.galaxyBoost,
      description: "Galaxies are twice as effective"
    }),
  ],
  [
    new InfinityUpgradeViewModel({
      upgrade: InfinityUpgrade.thisInfinityTimeMult,
      description: "Normal dimensions gain a multiplier based on time spent in current infinity",
      formatCurrentEffect: value => `${value.toFixed(2)}x`
    }),
    new InfinityUpgradeViewModel({
      upgrade: InfinityUpgrade.unspentIPMult,
      description: "Multiplier for unspent Infinity Points on 1st Dimension",
      formatCurrentEffect: (value, formatter) => `${formatter.shorten(value)}x`
    }),
    new InfinityUpgradeViewModel({
      upgrade: InfinityUpgrade.dimboostMult,
      description: "Increase Dimension Boost multiplier",
      staticEffect: "2x => 2.5x"
    }),
    new InfinityUpgradeViewModel({
      upgrade: InfinityUpgrade.ipGen,
      description: "Infinity Point generation based on fastest infinity",
      formatComplexEffect: function(formatter) {
        const income = formatter.shortenDimensions(totalIPMult());
        const period = player.bestInfinityTime === 999999999999  ?
          "hundred or so years" :
          Time.bestInfinity.multiply(10);
        return `Currently: ${income} every ${period}`;
      }
    }),
  ],
  [
    new InfinityUpgradeViewModel({
      upgrade: InfinityUpgrade.skipReset1,
      description: "You start with the 5th dimension unlocked"
    }),
    new InfinityUpgradeViewModel({
      upgrade: InfinityUpgrade.skipReset2,
      description: "You start with the 6th dimension unlocked"
    }),
    new InfinityUpgradeViewModel({
      upgrade: InfinityUpgrade.skipReset3,
      description: "You start with the 7th dimension unlocked"
    }),
    new InfinityUpgradeViewModel({
      upgrade: InfinityUpgrade.skipResetGalaxy,
      description: "You start with the 8th dimension unlocked, and an Antimatter Galaxy"
    }),
  ]
];