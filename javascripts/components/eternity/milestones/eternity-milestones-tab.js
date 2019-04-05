Vue.component("eternity-milestones-tab", {
  data: function() {
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
      return this.milestones.length / 3;
    }
  },
  methods: {
    update() {
      this.eternityCount = player.eternities;
    },
    getMilestone(row, column) {
      return () => this.milestones[(row - 1) * 3 + column - 1];
    }
  },
  template:
    `<div class="l-eternity-milestone-grid">
      <div>You have eternitied {{shorten(eternityCount, 6)}} {{"time" | pluralize(eternityCount)}}.</div>
      <div v-for="row in rows" class="l-eternity-milestone-grid__row">
        <eternity-milestone
          v-for="column in 3"
          :key="row * 3 + column"
          :getMilestone="getMilestone(row, column)"
          class="l-eternity-milestone-grid__cell"
        />
      </div>
    </div>`
});