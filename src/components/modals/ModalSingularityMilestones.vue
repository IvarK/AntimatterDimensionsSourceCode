<script>
import "../../../javascripts/components/celestials/subtabs/laitela/singularity-milestone.js";
import ModalCloseButton from "@/components/modals/ModalCloseButton";

export default {
  components: {
    ModalCloseButton,
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
  <div>
    <ModalCloseButton @click="emitClose" />
    <div class="l-singularity-milestone-modal-container-outer">
      <div class="l-singularity-milestone-modal-container-inner">
        <singularity-milestone
          v-for="milestone in milestones"
          :key="milestone.id"
          :milestone="milestone"
        />
      </div>
    </div>
  </div>
</template>
