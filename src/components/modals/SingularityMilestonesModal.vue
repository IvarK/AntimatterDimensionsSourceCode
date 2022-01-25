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
      milestones: [],
      resourceVal: 0,
      sortVal: 0,
      completedVal: 0,
      orderVal: 0
    };
  },
  beforeDestroy() {
    player.celestials.laitela.lastCheckedMilestones = Currency.singularities.value;
  },
  watch: {
    resourceVal(newValue) {
      player.celestials.laitela.singularitySorting.displayResource = newValue;
    },
    sortVal(newValue) {
      player.celestials.laitela.singularitySorting.sortResource = newValue;
    },
    completedVal(newValue) {
      player.celestials.laitela.singularitySorting.showCompleted = newValue;
    },
    orderVal(newValue) {
      player.celestials.laitela.singularitySorting.sortOrder = newValue;
    },
  },
  computed: {
    resourceStr() {
      const states = ["Singularity Count", "Condense Count", "Manual Time", "Auto Time"];
      return states[this.resourceVal];
    },
    sortStr() {
      const states = ["Singularities needed", "Current Completions", "Progress to full completion",
        "Final Singularities", "Most Recent"];
      return states[this.sortVal];
    },
    completedStr() {
      const states = ["First", "Last", "Don't move"];
      return states[this.completedVal];
    },
    orderStr() {
      const states = ["Ascending", "Descending"];
      return states[this.orderVal];
    },
  },
  methods: {
    update() {
      this.milestones = SingularityMilestones.sortedForCompletions(true);
      const settings = player.celestials.laitela.singularitySorting;
      this.resourceVal = settings.displayResource;
      this.sortVal = settings.sortResource;
      this.completedVal = settings.showCompleted;
      this.orderVal = settings.sortOrder;
    },
    cycleButton(id) {
      const settings = player.celestials.laitela.singularitySorting;
      let stateCount;
      switch (id) {
        case 0:
          stateCount = Object.keys(SINGULARITY_MILESTONE_RESOURCE).length;
          settings.displayResource = (settings.displayResource + 1) % stateCount;
          break;
        case 1:
          stateCount = Object.keys(SINGULARITY_MILESTONE_SORT).length;
          settings.sortResource = (settings.sortResource + 1) % stateCount;
          break;
        case 2:
          stateCount = Object.keys(COMPLETED_MILESTONES).length;
          settings.showCompleted = (settings.showCompleted + 1) % stateCount;
          break;
        case 3:
          stateCount = Object.keys(SORT_ORDER).length;
          settings.sortOrder = (settings.sortOrder + 1) % stateCount;
          break;
        default:
          throw new Error("Unrecognized Singularity milestone sorting button");
      }
    },
  },
};
</script>

<template>
  <ModalWrapperChoice
    :show-cancel="false"
    :show-confirm="false"
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
    <button
      class="l-singularity-milestone-modal-sort-button"
      @click="cycleButton(0)"
    >
      To Milestone:
      <br>
      {{ resourceStr }}
    </button>
    <button
      class="l-singularity-milestone-modal-sort-button"
      @click="cycleButton(1)"
    >
      Sort by:
      <br>
      {{ sortStr }}
    </button>
    <button
      class="l-singularity-milestone-modal-sort-button"
      @click="cycleButton(2)"
    >
      Completed Milestones:
      <br>
      {{ completedStr }}
    </button>
    <button
      class="l-singularity-milestone-modal-sort-button"
      @click="cycleButton(3)"
    >
      Sort Order:
      <br>
      {{ orderStr }}
    </button>
  </ModalWrapperChoice>
</template>
