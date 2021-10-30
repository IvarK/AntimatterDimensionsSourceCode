"use strict";

Vue.component("automator-points-list", {
  data() {
    return {
      currentPoints: 0,
      unlockThreshold: 0,
      fromPerks: 0,
      fromUpgrades: 0,
      fromOther: 0,
    };
  },
  computed: {
    perkSources: () => Perks.all.filter(p => p.config.automatorPoints),
    upgradeSources: () => RealityUpgrades.all.filter(p => p.config.automatorPoints),
    otherSources: () => GameDatabase.reality.otherAutomatorPoints,
  },
  methods: {
    update() {
      const ap = AutomatorPoints;
      this.currentPoints = ap.totalPoints;
      this.unlockThreshold = ap.requiredPoints;
      this.fromPerks = ap.pointsFromPerks;
      this.fromUpgrades = ap.pointsFromUpgrades;
      this.fromOther = ap.pointsFromOther;
    },
    textColor(hasBought) {
      return {
        color: hasBought ? "var(--color-good)" : "var(--color-bad)"
      };
    }
  },
  template: `
    <div>
      <div style="font-size: 2rem;">
        You have {{ formatInt(currentPoints) }} / {{ formatInt(unlockThreshold) }}
        Automator Points for unlocking the Automator.
        <br>
        You gain Automator Points from the following sources:
      </div>
      <div class="l-automator-points-list-container">
        <div class="l-automator-points-list-col c-automator-points-list-col">
          <span style="font-size: 1.5rem;">
            Having Perks: ({{ formatInt(fromPerks) }})
          </span>
          <br>
          <div v-for="perk in perkSources" :style="textColor(perk.isBought)">
            <b>{{ perk.config.label }}</b> ({{ perk.config.automatorPoints }}) - {{ perk.config.shortDescription() }}
          </div>
        </div>
        <div class="l-automator-points-list-col c-automator-points-list-col">
          <span style="font-size: 1.5rem;">
            Purchasing Reality Upgrades: ({{ formatInt(fromUpgrades) }})
          </span>
          <br>
          <div v-for="upgrade in upgradeSources" :style="textColor(upgrade.isBought)">
            <b>{{ upgrade.config.name }}</b> ({{ upgrade.config.automatorPoints }})
            <br>
            {{ upgrade.config.shortDescription() }}
            <br>
            <br>
          </div>
        </div>
        <div class="l-automator-points-list-col c-automator-points-list-col">
          <span style="font-size: 1.5rem;">
            Other Sources: ({{ formatInt(fromOther) }})
          </span>
          <br>
          <div v-for="source in otherSources">
            <b>{{ source.name }}</b>
            <br>
            {{ source.shortDescription() }}
            <br>
            {{ source.formattedValue() }}
            <br>
            <br>
          </div>
        </div>
      </div>
    </div>`
});
