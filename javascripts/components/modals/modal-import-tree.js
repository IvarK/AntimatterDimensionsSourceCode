Vue.component("modal-import-tree", {
  data() {
    return {
      input: ""
    };
  },
  mounted() {
    this.$refs.input.select();
  },
  computed: {
    importedTree() {
      if (!this.inputIsValidTree) return false;
      const importedTree = new TimeStudyTree(this.truncatedInput, Currency.timeTheorems.value, V.spaceTheorems);
      return {
        totalTT: importedTree.runningCost[0],
        totalST: importedTree.runningCost[1],
        newStudies: makeEnumeration(importedTree.purchasedStudies),
        invalidStudies: importedTree.invalidStudies,
      };
    },
    combinedTree() {
      if (!this.inputIsValidTree) return false;
      const currentStudies = player.timestudy.studies.map(s => `${s}`)
        .concat(player.celestials.v.triadStudies.map(s => `T${s}`));
      if (player.challenge.eternity.current !== 0) currentStudies.push(`EC${player.challenge.eternity.current}`);

      // We know that we have enough for all existing studies because we actually purchased them, so setting initial
      // theorem values to e308 ensures we have enough to actually properly initialize a Tree object with all the
      // current studies. Then we set theorem totals to their proper values immediately AFTER everything is bought
      const currentStudyTree = new TimeStudyTree(currentStudies, Number.MAX_VALUE, Number.MAX_VALUE);
      currentStudyTree.remainingTheorems = [Currency.timeTheorems.value, V.spaceTheorems];
      const importedTree = new TimeStudyTree(this.truncatedInput, Currency.timeTheorems.value, V.spaceTheorems);
      const compositeTree = currentStudyTree.createCombinedTree(importedTree);
      return {
        missingTT: compositeTree.runningCost[0] - currentStudyTree.runningCost[0],
        missingST: compositeTree.runningCost[1] - currentStudyTree.runningCost[1],
        newStudies: makeEnumeration(compositeTree.purchasedStudies
          .filter(s => !currentStudyTree.purchasedStudies.includes(s))),
        firstPaths: makeEnumeration(compositeTree.firstSplitPaths),
        secondPaths: makeEnumeration(compositeTree.secondSplitPaths),
        ec: compositeTree.ec,
      };
    },
    invalidMessage() {
      if (!this.inputIsValidTree || this.importedTree.invalidStudies.length === 0) return null;
      let coloredString = this.truncatedInput;
      for (const id of this.importedTree.invalidStudies) {
        coloredString = coloredString.replaceAll(new RegExp(`(,)?(${id})(,)?`, "gu"),
          `$1<span style="color: var(--color-bad);">$2</span>$3`);
      }
      return `Your import string has invalid study IDs: ${coloredString}`;
    },
    truncatedInput() {
      // If last character is "," remove it
      return this.input.replace(/,$/u, "");
    },
    hasInput() {
      return this.truncatedInput !== "";
    },
    inputIsValid() {
      return this.inputIsValidTree || this.inputIsSecret;
    },
    inputIsValidTree() {
      return TimeStudyTree.isValidImportString(this.truncatedInput);
    },
    inputIsSecret() {
      return sha512_256(this.truncatedInput) === "08b819f253b684773e876df530f95dcb85d2fb052046fa16ec321c65f3330608";
    },
    formatWithCommas() {
      return formatWithCommas;
    },
  },
  methods: {
    importTree() {
      if (!this.inputIsValid) return;
      if (this.inputIsSecret) SecretAchievement(37).unlock();
      Modal.hide();
      importStudyTree(this.truncatedInput);
    },
    formatCost(cost) {
      return formatWithCommas(cost);
    },
    formatTheoremCost(tt, st) {
      const strTT = `${formatWithCommas(tt)} TT`;
      const strST = `${formatWithCommas(st)} ST`;
      return st === 0 ? strTT : `${strTT} + ${strST}`;
    }
  },
  template: `
    <div class="c-modal-import-tree l-modal-content--centered">
      <modal-close-button @click="emitClose" />
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
            <div v-if="combinedTree.missingTT === 0">
              <i>Importing this with your current studies will not purchase anything.</i>
            </div>
            <div v-else>
              Importing with your current studies will purchase:
              <br>
              {{ combinedTree.newStudies }}
              (Cost: {{ formatTheoremCost(combinedTree.missingTT, combinedTree.missingST) }})
            </div>
          </div>
          <div class="l-modal-import-tree__tree-info-line">
            <div v-if="importedTree.totalTT === 0">
              <i>Importing this into an empty tree will not purchase anything.</i>
            </div>
            <div v-else>
              Importing into an empty tree will purchase:
              <br>
              {{ importedTree.newStudies }}
              (Cost: {{ formatTheoremCost(importedTree.totalTT, importedTree.totalST) }})
            </div>
          </div>
          <br>
          <div v-if="invalidMessage" class="l-modal-import-tree__tree-info-line" v-html="invalidMessage" />
          <br>
          <div v-if="combinedTree.firstPaths" class="l-modal-import-tree__tree-info-line">
            First split: {{ combinedTree.firstPaths }}
          </div>
          <div v-if="combinedTree.secondPaths" class="l-modal-import-tree__tree-info-line">
            Second split: {{ combinedTree.secondPaths }}
          </div>
          <div v-if="combinedTree.ec > 0" class="l-modal-import-tree__tree-info-line">
            Eternity challenge: {{ combinedTree.ec }}
          </div>
        </template>
        <div v-else-if="hasInput">Not a valid tree</div>
      </div>
      <primary-button
        v-if="inputIsValid"
        class="o-primary-btn--width-medium c-modal-import-tree__import-btn c-modal__confirm-btn"
        @click="importTree"
      >
        Import
      </primary-button>
    </div>`
});
