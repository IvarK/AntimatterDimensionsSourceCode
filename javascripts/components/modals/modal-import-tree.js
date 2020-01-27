"use strict";

Vue.component("modal-import-tree", {
  data() {
    return {
      input: ""
    };
  },
  computed: {
    tree() {
      if (!this.inputIsValidTree) return false;
      const formattedInput = this.input.split("|")[0].split(",");
      const eternityChallenge = TimeStudy.eternityChallenge(this.input.split("|")[1]);
      const hasEternityChallenge = eternityChallenge !== undefined;
      const studies = new Set();
      for (const study of formattedInput) {
        studies.add(TimeStudy(study));
      }
      let totalCost = 0;
      let currentCost = 0;
      if (hasEternityChallenge) {
        totalCost += eternityChallenge.cost;
        if (player.challenge.eternity.unlocked !== eternityChallenge.id) {
          currentCost += eternityChallenge.cost;
        }
      }
      const firstSplitPaths = new Set();
      const secondSplitPaths = new Set();
      let hasFirstSplit = false;
      let hasSecondSplit = false;
      for (const study of studies) {
        totalCost += study.cost;
        if (!study.isBought) {
          currentCost += study.cost;
        }
        switch (study.path) {
          case TIME_STUDY_PATH.NORMAL_DIM: firstSplitPaths.add("Normal Dims");
            break;
          case TIME_STUDY_PATH.INFINITY_DIM: firstSplitPaths.add("Infinity Dims");
            break;
          case TIME_STUDY_PATH.TIME_DIM: firstSplitPaths.add("Time Dims");
            break;
          case TIME_STUDY_PATH.ACTIVE: secondSplitPaths.add("Active");
            break;
          case TIME_STUDY_PATH.PASSIVE: secondSplitPaths.add("Passive");
            break;
          case TIME_STUDY_PATH.IDLE: secondSplitPaths.add("Idle");
        }
      }
      if (firstSplitPaths.size > 0) hasFirstSplit = true;
      if (secondSplitPaths.size > 0) hasSecondSplit = true;
      return {
        totalCost,
        currentCost,
        hasFirstSplit,
        hasSecondSplit,
        firstSplitPaths,
        secondSplitPaths,
        eternityChallenge,
        hasEternityChallenge
      };
    },
    hasInput() {
      return this.input !== "";
    },
    inputIsValid() {
      return this.inputIsValidTree || this.inputIsSecret;
    },
    inputIsValidTree() {
      const formattedInput = this.input.split("|")[0].split(",");
      let isValid = true;
      for (const study of formattedInput) {
        if (TimeStudy(study) === undefined) isValid = false;
      }
      return isValid;
    },
    inputIsSecret() {
      return sha512_256(this.input) === "08b819f253b684773e876df530f95dcb85d2fb052046fa16ec321c65f3330608";
    }
  },
  mounted() {
    this.$refs.input.select();
  },
  methods: {
    importTree() {
      if (!this.inputIsValid) return;
      if (this.inputIsSecret) SecretAchievement(37).unlock();
      Modal.hide();
      importStudyTree(this.input);
    },
    formatCost(cost) {
      return formatWithCommas(cost);
    },
    formatPaths(paths) {
      return Array.from(paths).join(", ");
    }
  },
  template:
    `<div class="c-modal-import-tree l-modal-content--centered">
      <modal-close-button @click="emitClose"/>
      <h3>Input your tree</h3>
      <input
        v-model="input"
        ref="input"
        type="text"
        class="c-modal-input c-modal-import-tree__input"
        @keyup.enter="importTree"
        @keyup.esc="emitClose"
      />
      <div class="c-modal-import-tree__tree-info">
        <div v-if="inputIsSecret">???</div>
        <template v-else-if="inputIsValidTree">
          <div class="l-modal-import-tree__tree-info-line">
            Total tree cost:
            {{ formatCost(tree.totalCost) }} {{ "Time Theorem" | pluralize(tree.totalCost, "Time Theorems") }}
          </div>
          <div class="l-modal-import-tree__tree-info-line">
            Cost of missing studies:
            {{ formatCost(tree.currentCost) }} {{ "Time Theorem" | pluralize(tree.currentCost, "Time Theorems") }}
          </div>
          <div v-if="tree.hasFirstSplit" class="l-modal-import-tree__tree-info-line">
            {{ "First split path:" | pluralize(tree.firstSplitPaths.size, "First split paths:") }}
            {{ formatPaths(tree.firstSplitPaths) }}
          </div>
          <div v-if="tree.hasSecondSplit" class="l-modal-import-tree__tree-info-line">
            {{ "Second split path:" | pluralize(tree.secondSplitPaths.size, "Second split paths:") }}
            {{ formatPaths(tree.secondSplitPaths) }}
            </div>
          <div v-if="tree.hasEternityChallenge" class="l-modal-import-tree__tree-info-line">
            Eternity challenge: {{ tree.eternityChallenge.id }}
          </div>
        </template>
        <div v-else-if="hasInput">Not a valid tree</div>
      </div>
      <primary-button
        v-if="inputIsValid"
        class="o-primary-btn--width-medium c-modal-import-tree__import-btn"
        @click="importTree"
      >Import</primary-button>
    </div>`
});
