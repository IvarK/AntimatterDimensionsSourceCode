"use strict";

Vue.component("singularity-milestone-pane", {
  data() {
    return {
      milestones: [],
      hasNew: false,
      showingCondense: false,
    };
  },
  computed: {
    glowStyle() {
      if (this.hasNew) return { "box-shadow": "inset 0 0 1rem 0.5rem var(--color-celestials)" };
      return {};
    },
    milestoneMode() {
      return this.showingCondense ? "Condense Count" : "Singularities";
    }
  },
  methods: {
    update() {
      this.milestones = SingularityMilestones.nextMilestoneGroup;
      this.hasNew = SingularityMilestones.unseenMilestones.length !== 0;
      this.showingCondense = player.options.showCondenseToMilestone;
    },
    toggleMilestoneMode() {
      player.options.showCondenseToMilestone = !player.options.showCondenseToMilestone;
    }
  },
  template: `
    <div class="c-laitela-next-milestones">
      <div class="o-laitela-singularity-modal-button"
        onclick="Modal.singularityMilestones.show()"
        :style="glowStyle"
      >
        Show all milestones
      </div>
      <div class="o-laitela-singularity-modal-button"
        @click="toggleMilestoneMode"
      >
        To Milestones: {{ milestoneMode }}
      </div>
      <singularity-milestone
        v-for="milestone in milestones"
        :key="milestone.id"
        :milestone="milestone"
        :suppressGlow="true"
      />
    </div>`
});
