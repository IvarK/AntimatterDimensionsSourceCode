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
    template: `
    <div>
      <modal-close-button @click="emitClose"/>
      <div class="l-singularity-milestone-modal-container">
        <singularity-milestone v-for="milestone in milestones" :key="milestone.id" :milestone="milestone"/>
      </div>
    </div>
    `
});