import "./singularity-milestone.js";

Vue.component("singularity-milestone-pane", {
  data() {
    return {
      milestones: [],
      hasNew: false,
      milestoneMode: false,
      hasAutoSingularity: false,
    };
  },
  computed: {
    glowStyle() {
      if (this.hasNew) return { "box-shadow": "inset 0 0 1rem 0.5rem var(--color-celestials)" };
      return {};
    },
    milestoneText() {
      switch (this.milestoneMode) {
        case SINGULARITY_MILESTONE_RESOURCE.SINGULARITIES:
          return "Singularity Count";
        case SINGULARITY_MILESTONE_RESOURCE.CONDENSE_COUNT:
          return "Condense Count";
        case SINGULARITY_MILESTONE_RESOURCE.MANUAL_TIME:
          return "Manual Time";
        case SINGULARITY_MILESTONE_RESOURCE.AUTO_TIME:
          return "Auto Time";
        default:
          throw new Error("Unrecognized Singularity Milestone mode");
      }
    }
  },
  methods: {
    update() {
      this.milestones = SingularityMilestones.nextMilestoneGroup;
      this.hasNew = SingularityMilestones.unseenMilestones.length !== 0;
      this.milestoneMode = player.options.singularityMilestoneResource;
      this.hasAutoSingularity = Number.isFinite(SingularityMilestone.autoCondense.effectValue);
    },
    cycleMilestoneMode() {
      const modeCount = Object.keys(SINGULARITY_MILESTONE_RESOURCE).length;
      player.options.singularityMilestoneResource = (player.options.singularityMilestoneResource + 1) % modeCount;
      const isAutoTime = player.options.singularityMilestoneResource === SINGULARITY_MILESTONE_RESOURCE.AUTO_TIME;
      if (!this.hasAutoSingularity && isAutoTime) this.cycleMilestoneMode();
    }
  },
  template: `
    <div class="c-laitela-next-milestones">
      <div
        class="o-laitela-singularity-modal-button"
        onclick="Modal.singularityMilestones.show()"
        :style="glowStyle"
      >
        Show all milestones
      </div>
      <div
        class="o-laitela-singularity-modal-button"
        @click="cycleMilestoneMode"
      >
        To Milestone: {{ milestoneText }}
      </div>
      <singularity-milestone
        v-for="milestone in milestones"
        :key="milestone.id"
        :milestone="milestone"
        :suppressGlow="true"
      />
    </div>`
});
