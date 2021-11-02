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
        <div class="l-automator-points-list-side-col c-automator-points-list-col">
          <span class="c-automator-points-list-ap--large">{{ formatInt(fromPerks) }} AP</span>
          <span style="font-size: 1.8rem;">
            Perks
          </span>
          <div
            v-for="perk in perkSources"
            class="c-automator-points-list-single-entry"
            :style="textColor(perk.isBought)"
          >
            <b>{{ perk.label }}</b> - {{ perk.shortDescription }}
            <span class="c-automator-points-list-ap">{{ perk.automatorPoints }} AP</span>
          </div>
        </div>
        <div class="l-automator-points-list-center-col">
          <div class="c-automator-points-list-cell" v-for="source in otherSources">
            <span class="c-automator-points-list-ap--large">{{ formatInt(source.automatorPoints()) }} AP</span>
            <span style="font-size: 1.8rem;">
              {{ source.name }}
            </span>
            <br>
            <br>
            <span :style="textColor(source.automatorPoints() > 0)">
              {{ source.shortDescription() }}
            </span>
            <span class="c-automator-points-list-symbol" v-html="source.symbol" />
          </div>
        </div>
        <div class="l-automator-points-list-side-col c-automator-points-list-col">
          <span class="c-automator-points-list-ap--large">{{ formatInt(fromUpgrades) }} AP</span>
          <span style="font-size: 1.8rem;">
            Reality Upgrades
          </span>
          <div
            v-for="upgrade in upgradeSources"
            class="c-automator-points-list-single-entry"
            :style="textColor(upgrade.isBought)"
            style="font-size: 1.3rem;"
          >
            <b>{{ upgrade.name }}</b>
            <span class="c-automator-points-list-ap">{{ upgrade.automatorPoints }} AP</span>
            <br>
            {{ upgrade.shortDescription }}
          </div>
        </div>
      </div>
    </div>`
});
