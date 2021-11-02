"use strict";

Vue.component("automator-points-list", {
  data() {
    return {
      totalPoints: 0,
    };
  },
  computed: {
    pointsForAutomator: () => AutomatorPoints.pointsForAutomator,
    fromPerks: () => AutomatorPoints.pointsFromPerks,
    fromUpgrades: () => AutomatorPoints.pointsFromUpgrades,
    perkSources: () => AutomatorPoints.perks,
    upgradeSources: () => AutomatorPoints.upgrades,
    otherSources: () => GameDatabase.reality.otherAutomatorPoints,
  },
  methods: {
    update() {
      this.totalPoints = AutomatorPoints.totalPoints;
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
        You have {{ formatInt(totalPoints) }} / {{ formatInt(pointsForAutomator) }}
        Automator Points for unlocking the Automator.
        <br>
        You gain Automator Points from the following sources:
      </div>
      <div class="l-automator-points-list-container">
        <div class="l-automator-points-list-col c-automator-points-list-col">
          <span class="c-automator-points-list-ap">{{ formatInt(fromPerks) }} AP</span>
          <span style="font-size: 1.5rem;">
            Perks
          </span>
          <br>
          <div v-for="perk in perkSources" :style="textColor(perk.isBought)">
            <b>{{ perk.label }}</b> ({{ perk.automatorPoints }}) - {{ perk.shortDescription }}
          </div>
        </div>
        <div class="l-automator-points-list-col">
          <div class="c-automator-points-list-cell" v-for="source in otherSources">
            <span class="c-automator-points-list-ap">{{ formatInt(source.automatorPoints()) }} AP</span>
            <span style="font-size: 1.5rem;">
              {{ source.name }}
            </span>
            <br>
            <br>
            {{ source.shortDescription() }}
            <span class="c-automator-points-list-symbol" v-html="source.symbol" />
          </div>
        </div>
        <div class="l-automator-points-list-col c-automator-points-list-col">
          <span class="c-automator-points-list-ap">{{ formatInt(fromUpgrades) }} AP</span>
          <span style="font-size: 1.5rem;">
            Reality Upgrades
          </span>
          <br>
          <div v-for="upgrade in upgradeSources" :style="textColor(upgrade.isBought)">
            <b>{{ upgrade.name }}</b> ({{ upgrade.automatorPoints }})
            <br>
            {{ upgrade.shortDescription }}
            <br>
            <br>
          </div>
        </div>
      </div>
    </div>`
});
