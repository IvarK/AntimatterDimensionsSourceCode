"use strict";

Vue.component("modal-import-tree", {
  data() {
    return {
      input: ""
    };
  },
  template:
    `<div class="c-modal-import l-modal-content--centered">
      <modal-close-button @click="emitClose"/>
      <h3>Input your tree</h3>
      <input
        v-model="input"
        ref="input"
        type="text"
        class="c-modal-input c-modal-import__input"
        @keyup.enter="importTree"
        @keyup.esc="emitClose"
      />
      <div class="c-modal-import__tree-info">
        <div v-if="inputIsSecret">???</div>
        <template v-else-if="inputIsValidTree">
          <div>
            Total tree cost: 
            {{ formatCost(tree.totalCost) }} {{ "Time Theorem" | pluralize(tree.totalCost, "Time Theorems") }}
          </div>
          <div>
            Cost of missing studies: 
            {{ formatCost(tree.currentCost) }} {{ "Time Theorem" | pluralize(tree.currentCost, "Time Theorems") }}
          </div>
          <div v-if="tree.hasFirstSplit">
            {{ "First split path:" | pluralize(tree.firstSplitPaths.size, "First split paths:") }} 
            {{ formatPaths(tree.firstSplitPaths) }}
          </div>
          <div v-if="tree.hasSecondSplit">
            {{ "Second split path:" | pluralize(tree.secondSplitPaths.size, "Second split paths:") }} 
            {{ formatPaths(tree.secondSplitPaths) }}
            </div>
          <div v-if="tree.hasEternityChallenge">Eternity challenge: {{ tree.eternityChallenge.id }}</div>
        </template>
        <div v-else-if="hasInput">Not a valid tree</div>
      </div>
      <primary-button
        v-if="inputIsValid"
        class="o-primary-btn--width-medium c-modal-import__import-btn"
        @click="importTree"
      >Import</primary-button>
    </div>`,
  computed: {
    tree() {
      return this.createTree();
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
      let text = "";
      let i = 0;
      for (const path of paths) {
        if (i === paths.size - 1) text += `${path}`;
        else text += `${path}, `;
        i++;
      }
      return text;
    },
    createTree() {
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
        if (EternityChallenge.current && EternityChallenge.current.id === eternityChallenge.id) {
          totalCost += eternityChallenge.cost;
        } else {
          totalCost += eternityChallenge.cost;
          currentCost += eternityChallenge.cost;
        }
      }
      const firstSplitPaths = new Set();
      const secondSplitPaths = new Set();
      let hasFirstSplit = false;
      let hasSecondSplit = false;
      studies.forEach(study => {
        if (player.timestudy.studies.includes(study.id)) {
          totalCost += study.cost;
        } else {
          totalCost += study.cost;
          currentCost += study.cost;
        }
        switch (study.path) {
          case TimeStudyPath.NORMAL_DIM: firstSplitPaths.add("Normal Dims");
            break;
          case TimeStudyPath.INFINITY_DIM: firstSplitPaths.add("Infinity Dims");
            break;
          case TimeStudyPath.TIME_DIM: firstSplitPaths.add("Time Dims");
            break;
          case TimeStudyPath.ACTIVE: secondSplitPaths.add("Active");
            break;
          case TimeStudyPath.PASSIVE: secondSplitPaths.add("Passive");
            break;
          case TimeStudyPath.IDLE: secondSplitPaths.add("Idle");
        }
      });
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
    }
  },
  mounted() {
    this.$refs.input.select();
  }
});
