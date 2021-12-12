import "./singularity-milestone.js";
import ModalCloseButton from "@/components/modals/ModalCloseButton";

Vue.component("singularity-milestones-modal", {
  components: {
    ModalCloseButton,
  },
  data: () => ({
    milestones: []
  }),
  beforeDestroy() {
    player.celestials.laitela.lastCheckedMilestones = Currency.singularities.value;
  },
  methods: {
    update() {
      this.milestones = SingularityMilestones.sortedForCompletions;
    }
  },
  template: `
    <div>
      <ModalCloseButton @click="emitClose" />
      <div class="l-singularity-milestone-modal-container-outer">
        <div class="l-singularity-milestone-modal-container-inner">
          <singularity-milestone v-for="milestone in milestones" :key="milestone.id" :milestone="milestone" />
        </div>
      </div>
    </div>`
});
