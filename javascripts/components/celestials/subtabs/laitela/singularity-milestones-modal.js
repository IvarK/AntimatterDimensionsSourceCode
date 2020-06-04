"use strict";

Vue.component("singularity-milestones-modal", {
  data: () => ({
    milestones: []
  }),
  methods: {
    update() {
      this.milestones = SingularityMilestones.sortedForCompletions;
    }
  },
  beforeDestroy() {
    player.celestials.laitela.lastCheckedMilestones = player.celestials.laitela.singularities;
  },
  template: `
    <div>
      <modal-close-button @click="emitClose"/>
      <div class="l-singularity-milestone-modal-container-outer">
        <div class="l-singularity-milestone-modal-container-inner">
          <singularity-milestone v-for="milestone in milestones" :key="milestone.id" :milestone="milestone"/>
        </div>
      </div>
    </div>
    `
});
