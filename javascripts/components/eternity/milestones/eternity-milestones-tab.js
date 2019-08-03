"use strict";

Vue.component("eternity-milestones-tab", {
  data() {
    return {
      eternityCount: 0,
    };
  },
  computed: {
    milestones() {
      return Object.values(GameDatabase.eternity.milestones)
        .sort((a, b) => a.eternities - b.eternities)
        .map(config => new EternityMilestoneState(config));
    },
    rows() {
      return Math.ceil(this.milestones.length / 2);
    }
  },
  methods: {
    update() {
      this.eternityCount = player.eternities;
    },
    getMilestone(row, column) {
      return () => this.milestones[(row - 1) * 2 + column - 1];
    }
  },
  template:
    `<div class="l-eternity-milestone-grid">
      <div>You have eternitied {{shorten(eternityCount, 3)}} {{"time" | pluralize(eternityCount)}}.</div>
      <div v-for="row in rows" class="l-eternity-milestone-grid__row">
        <eternity-milestone
          v-for="column in 2"
          :key="row * 2 + column"
          :getMilestone="getMilestone(row, column)"
          class="l-eternity-milestone-grid__cell"
        />
      </div>
    </div>`
});