"use strict";

Vue.component("modal-edit-tree", {
  props: {
    modalConfig: Object
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
      let missingCost = 0;
      if (hasEternityChallenge) {
        totalCost += eternityChallenge.cost;
        if (player.challenge.eternity.unlocked !== eternityChallenge.id) {
          missingCost += eternityChallenge.cost;
        }
      }
      const firstSplitPaths = new Set();
      const secondSplitPaths = new Set();
      for (const study of studies) {
        if (study.cost) {
          totalCost += study.cost;
          if (!study.isBought) {
            missingCost += study.cost;
          }
        }
        switch (study.path) {
          case TIME_STUDY_PATH.ANTIMATTER_DIM: firstSplitPaths.add("Antimatter Dims");
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
      const totalST = this.calculateMissingSTCost([...studies], true);
      const missingST = this.calculateMissingSTCost([...studies], false);
      return {
        totalST,
        missingST,
        totalCost,
        missingCost,
        firstSplitPaths,
        secondSplitPaths,
        eternityChallenge,
        hasEternityChallenge
      };
    },
    editLabel() {
      return `Editing ${this.name}`;
    },
    inputIsValid() {
      return this.inputIsValidTree;
    },
    inputIsValidTree() {
      const formattedInput = this.input.split("|")[0].split(",");
      let isValid = true;
      for (const study of formattedInput) {
        if (TimeStudy(study) === undefined) isValid = false;
      }
      return isValid;
    }
  },
  data() {
    return {
      input: player.timestudy.presets[this.modalConfig.id].studies,
      name: player.timestudy.presets[this.modalConfig.id].name,
    };
  },
  methods: {
    confirmEdits() {
      if (this.inputIsValid) { 
        player.timestudy.presets[this.modalConfig.id].studies = this.input;
        GameUI.notify.info(`Study tree ${this.name} successfully edited.`);
        this.emitClose();
      }
    },
    formatWithCommas(cost) {
      return formatWithCommas(cost);
    },
    formatPaths(paths) {
      return Array.from(paths).join(", ");
    },
    calculateMissingSTCost(studiesToBuy, ignoreCurrentStudies) {
      // Explicitly hardcoding how the study tree affects total ST should be fine here, as it massively simplifies
      // the code and the study tree structure is very unlikely to change. Note that all studies within the same
      // set also have identical ST costs. Triads also have identical costs too.
      const conflictingStudySets = [
        [121, 122, 123],
        [131, 132, 133],
        [141, 142, 143],
        [221, 222],
        [223, 224],
        [225, 226],
        [227, 228],
        [231, 232],
        [233, 234],
      ];
      let totalSTSpent = 0;
      for (const studySet of conflictingStudySets) {
        const studiesInSet = studiesToBuy.filter(study => studySet.includes(study.id));
        if (studiesInSet.length > 1) {
          totalSTSpent += TimeStudy(studySet[0]).STCost * (studiesInSet.length - 1);
          if (!ignoreCurrentStudies) {
            const currStudies = player.timestudy.studies;
            const alreadyBought = studiesInSet.filter(study => currStudies.includes(study.id));
            totalSTSpent -= TimeStudy(studySet[0]).STCost * Math.clampMin(alreadyBought.length - 1, 0);
          }
        }
      }
      // Triad studies don't have .cost
      const triads = studiesToBuy.filter(study => !study.cost);
      if (ignoreCurrentStudies) {
        totalSTSpent += triads.length * TriadStudy(1).STCost;
      } else {
        totalSTSpent += TriadStudy(1).STCost * triads
          .filter(study => !player.celestials.v.triadStudies.includes(study))
          .length;
      }
      return totalSTSpent;
    },
  },
  template:
    `<div class="c-modal-import-tree l-modal-content--centered">
      <modal-close-button @click="emitClose"/>
      <h3>{{ editLabel }}</h3>
      <input
        v-model="input"
        ref="input"
        type="text"
        class="c-modal-input c-modal-import-tree__input"
        @keyup.esc="emitClose"
        @keyup.enter="confirmEdits"
      />
      <div class="c-modal-import-tree__tree-info">
          <div class="l-modal-import-tree__tree-info-line">
            Total tree cost:
            {{ formatWithCommas(tree.totalCost) }} {{ "Time Theorem" | pluralize(tree.totalCost, "Time Theorems") }}
            <span v-if="tree.totalST !== 0">
              and {{ formatWithCommas(tree.totalST) }} {{ "Space Theorem" | pluralize(tree.totalST, "Space Theorems") }}
            </span>
          </div>
          <div class="l-modal-import-tree__tree-info-line">
            Cost of missing studies:
            {{ formatWithCommas(tree.missingCost) }} {{ "Time Theorem" | pluralize(tree.missingCost, "Time Theorems") }}
            <span v-if="tree.missingST !== 0">
              and {{ formatWithCommas(tree.missingST) }} {{ "Space Theorem" | pluralize(tree.missingST, "Space Theorems") }}
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
      </div>
      <div v-if="!inputIsValid">Invalid tree</div>
      <primary-button
        class="o-primary-btn--width-medium c-modal-import-tree__import-btn"
        @click="confirmEdits"
        :enabled="inputIsValid"
      >Confirm</primary-button>
    </div>`
});

// We goin to flavortown USA
// hi i'm guy fieri and we're rolling out
// looking for america's greatest
// diners, drive-ins, and dives.