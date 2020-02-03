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
      for (const study of studies) {
        if (study.cost) {
          totalCost += study.cost;
          if (!study.isBought) {
            currentCost += study.cost;
          }
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

      // Take advantage of all extra studies within the same row costing the same amount
      const extraStudyRows = [12, 13, 14, 22, 23];
      const maxStudiesBeforeExtra = [1, 1, 1, 4, 2];
      let totalST = 0;
      let currentST = 0;
      for (let row = 0; row < extraStudyRows.length; row++) {
        // Triads only have .STCost and not .cost
        const studiesInRow = [...studies]
          .filter(study => study.cost && Math.floor(study.id / 10) === extraStudyRows[row]);
        if (studiesInRow.length > 1) {
          const costPerExtra = studiesInRow[0].STCost;
          totalST += costPerExtra * Math.clampMin(studiesInRow.length - maxStudiesBeforeExtra[row], 0);
          currentST += costPerExtra * 
            Math.clampMin(studiesInRow.filter(study => !study.isBought).length - maxStudiesBeforeExtra[row], 0);
        }
      }
      totalST += [...studies].filter(study => !study.cost).length * TriadStudy(1).STCost;
      currentST += player.celestials.v.triadStudies.length * TriadStudy(1).STCost;

      return {
        totalST,
        currentST,
        totalCost,
        currentCost,
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
            <span v-if="tree.totalST !== 0">
              and {{ formatCost(tree.totalST) }} {{ "Space Theorem" | pluralize(tree.totalST, "Space Theorems") }}
            </span>
          </div>
          <div class="l-modal-import-tree__tree-info-line">
            Cost of missing studies:
            {{ formatCost(tree.currentCost) }} {{ "Time Theorem" | pluralize(tree.currentCost, "Time Theorems") }}
            <span v-if="tree.currentST !== 0">
              and {{ formatCost(tree.currentST) }} {{ "Space Theorem" | pluralize(tree.currentST, "Space Theorems") }}
            </span>
          </div>
          <div v-if="tree.firstSplitPaths.size > 0" class="l-modal-import-tree__tree-info-line">
            {{ "First split path:" | pluralize(tree.firstSplitPaths.size, "First split paths:") }}
            {{ formatPaths(tree.firstSplitPaths) }}
          </div>
          <div v-if="tree.secondSplitPaths.size > 0" class="l-modal-import-tree__tree-info-line">
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
