<script>
import "../../../javascripts/components/celestials/subtabs/laitela/singularity-milestone.js";
import ModalWrapperChoice from "@/components/modals/ModalWrapperChoice";

export default {
  name: "SingularityMilestonesModal",
  components: {
    ModalWrapperChoice,
  },
  data() {
    return {
      milestones: []
    };
  },
  beforeDestroy() {
    player.celestials.laitela.lastCheckedMilestones = Currency.singularities.value;
  },
  methods: {
    update() {
      this.milestones = SingularityMilestones.sortedForCompletions;
    }
  },
};
</script>

<template>
  <ModalWrapperChoice
    :show-cancel="false"
    :show-confirm="false"
    @close="emitClose"
  >
    <template #header>
      Singularity Milestones
    </template>
    <div class="l-singularity-milestone-modal-container-outer">
      <div class="l-singularity-milestone-modal-container-inner">
        <singularity-milestone
          v-for="milestone in milestones"
          :key="milestone.id"
          :milestone="milestone"
        />
      </div>
    </div>
  </ModalWrapperChoice>
</template>
