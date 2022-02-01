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
    automatorInterval: () => AutomatorBackend.currentInterval,
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
        Automator Points towards unlocking the Automator.
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
            <span class="c-automator-points-list-perk-label">{{ perk.label }}</span>
             - {{ perk.shortDescription }}
            <span class="c-automator-points-list-ap">{{ formatInt(perk.automatorPoints) }} AP</span>
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
            <span class="c-automator-points-list-ap">{{ formatInt(upgrade.automatorPoints) }} AP</span>
            <br>
            {{ upgrade.shortDescription }}
          </div>
        </div>
      </div>
      <br>
      <div>
        The automator uses a custom scripting language which allows (amongst other things) buying full
        Time Study Trees, entering Eternity Challenges, or starting Dilation. It can also force prestige
        events on certain conditions independently from your Autobuyers or modify some of your Autobuyer settings.
        <br>
        The speed of the Automator gradually speeds up as you get more Realities. If unlocked right now,
        it would run {{ format(1000 / automatorInterval, 2, 2) }} commands per real-time second.
      </div>
    </div>`
});
