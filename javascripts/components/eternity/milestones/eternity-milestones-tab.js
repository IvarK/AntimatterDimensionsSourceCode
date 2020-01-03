"use strict";

Vue.component("eternity-milestones-tab", {
  data() {
    return {
      eternityCount: new Decimal(0),
    };
  },
  computed: {
    milestones() {
      return Object.values(GameDatabase.eternity.milestones)
        .sort((a, b) => a.eternities - b.eternities)
        .map(config => new EternityMilestoneState(config));
    },
    rows() {
      return Math.ceil(this.milestones.length / 3);
    }
  },
  methods: {
    update() {
      this.eternityCount.copyFrom(player.eternities);
    },
    getMilestone(row, column) {
      return () => this.milestones[(row - 1) * 3 + column - 1];
    }
  },
  template:
    `<div class="l-eternity-milestone-grid">
      <div>You have eternitied {{format(eternityCount, 3)}} {{"time" | pluralize(eternityCount)}}.</div>
      <div v-for="row in rows" class="l-eternity-milestone-grid__row">
        <eternity-milestone
          v-for="column in 3"
          :key="row * 3 + column"
          :getMilestone="getMilestone(row, column)"
          class="l-eternity-milestone-grid__cell"
        />
      </div>
      <div>
        Offline eternities only generate when your eternity autobuyer is on and set to zero EP.
      </div>
      <div>
        Offline infinities only generate when your infinity autobuyer is on and set to time mode with
        less than 60 seconds.
      </div>

    </div>`
});
