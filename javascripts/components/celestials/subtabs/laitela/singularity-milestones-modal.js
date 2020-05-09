"use strict";

Vue.component("singularity-milestones-modal", {
  data: () => ({
    milestoneIds: []
  }),
  methods: {
    update() {
      this.milestoneIds = SingularityMilestones.sortedForCompletions.map(m => m.id);
    }
  },
  computed: {
    milestones() {
      return this.milestoneIds.map(id => SingularityMilestone(id));
    }
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
