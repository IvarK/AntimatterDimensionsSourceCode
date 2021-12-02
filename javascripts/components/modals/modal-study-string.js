Vue.component("modal-study-string", {
  props: {
    modalConfig: Object
  },
  data() {
    return {
      input: "",
      name: "",
    };
  },
  // Needs to be assigned in created() or else they will end up being undefined when importing
  created() {
    this.input = this.isImporting ? "" : player.timestudy.presets[this.modalConfig.id].studies;
    this.name = this.isImporting ? "" : player.timestudy.presets[this.modalConfig.id].name;
  },
  computed: {
    // This modal is used by both study importing and preset editing but only has a prop actually passed in when
    // editing (which is the preset index). Needs to be an undefined check because index can be zero
    isImporting() {
      return this.modalConfig.id === undefined;
    },
    importedTree() {
      if (!this.inputIsValidTree) return false;
      const importedTree = new TimeStudyTree(this.truncatedInput, Currency.timeTheorems.value, V.spaceTheorems);
      return {
        totalTT: importedTree.spentTheorems[0],
        totalST: importedTree.spentTheorems[1],
        newStudies: makeEnumeration(importedTree.purchasedStudies),
        invalidStudies: importedTree.invalidStudies,
        firstPaths: makeEnumeration(importedTree.firstSplitPaths),
        secondPaths: makeEnumeration(importedTree.secondSplitPaths),
        ec: importedTree.ec,
      };
    },
    // This is only shown when importing; when modifying a preset we assume that generally the current state of the
    // tree is irrelevant because if it mattered then the player would simply import instead
    combinedTree() {
      if (!this.inputIsValidTree) return false;
      // We know that we have enough for all existing studies because we actually purchased them, so setting initial
      // theorem values to e308 ensures we have enough to actually properly initialize a Tree object with all the
      // current studies. Then we set theorem totals to their proper values immediately AFTER everything is bought
      const currentStudyTree = TimeStudyTree.currentTree();
      const importedTree = new TimeStudyTree(this.truncatedInput, Currency.timeTheorems.value, V.spaceTheorems);
      const compositeTree = currentStudyTree.createCombinedTree(importedTree);
      return {
        missingTT: compositeTree.spentTheorems[0] - currentStudyTree.spentTheorems[0],
        missingST: compositeTree.spentTheorems[1] - currentStudyTree.spentTheorems[1],
        newStudies: makeEnumeration(compositeTree.purchasedStudies
          .filter(s => !currentStudyTree.purchasedStudies.includes(s))),
        firstPaths: makeEnumeration(compositeTree.firstSplitPaths),
        secondPaths: makeEnumeration(compositeTree.secondSplitPaths),
        ec: compositeTree.ec,
      };
    },
    // We show information about the after-load tree, but which tree (imported from empty vs combined) info is shown
    // depends on if we're importing vs editing
    treeStatus() {
      const showingTree = this.isImporting ? this.combinedTree : this.importedTree;
      return {
        firstPaths: showingTree.firstPaths,
        secondPaths: showingTree.secondPaths,
        ec: showingTree.ec,
      };
    },
    modalTitle() {
      return this.isImporting ? "Input your tree" : `Editing Study Preset "${this.name}"`;
    },
    invalidMessage() {
      if (!this.inputIsValidTree || this.importedTree.invalidStudies.length === 0) return null;
      // Pad the input with non-digits which we remove later in order to not cause erroneous extra matches within IDs
      let coloredString = `.${this.truncatedInput}.`;
      for (const id of this.importedTree.invalidStudies) {
        coloredString = coloredString.replaceAll(new RegExp(`(\\D)(${id})(\\D)`, "gu"),
          `$1<span style="color: var(--color-bad);">$2</span>$3`);
      }
      return `Your import string has invalid study IDs: ${coloredString.replaceAll(".", "")}`;
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
    confirm() {
      if (this.isImporting) this.importTree();
      else this.savePreset();
    },
    importTree() {
      if (!this.inputIsValid) return;
      if (this.inputIsSecret) SecretAchievement(37).unlock();
      Modal.hide();
      TimeStudyTree.importIntoCurrentTree(this.truncatedInput);
    },
    savePreset() {
      if (this.inputIsValid) {
        player.timestudy.presets[this.modalConfig.id].studies = this.input;
        GameUI.notify.eternity(`Study tree ${this.name} successfully edited.`);
        this.emitClose();
      }
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
      <h3>{{ modalTitle }}</h3>
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
          <div v-if="isImporting" class="l-modal-import-tree__tree-info-line">
            <div v-if="combinedTree.missingTT === 0">
              <i>Importing this with your current tree will not purchase any new Time Studies.</i>
            </div>
            <div v-else>
              Importing with your current tree will also purchase:
              <br>
              {{ combinedTree.newStudies }}
              (Cost: {{ formatTheoremCost(combinedTree.missingTT, combinedTree.missingST) }})
            </div>
          </div>
          <br>
          <div class="l-modal-import-tree__tree-info-line">
            <div v-if="importedTree.totalTT === 0">
              <i>Importing this into an empty tree will not purchase any Time Studies.</i>
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
          <div v-if="treeStatus.firstPaths || treeStatus.ec > 0">
            <b>Tree status after loading:</b>
          </div>
          <div v-if="treeStatus.firstPaths" class="l-modal-import-tree__tree-info-line">
            Dimension split: {{ treeStatus.firstPaths }}
          </div>
          <div v-if="treeStatus.secondPaths" class="l-modal-import-tree__tree-info-line">
            Pace split: {{ treeStatus.secondPaths }}
          </div>
          <div v-if="treeStatus.ec > 0" class="l-modal-import-tree__tree-info-line">
            Eternity challenge: {{ treeStatus.ec }}
          </div>
        </template>
        <div v-else-if="hasInput">Not a valid tree</div>
      </div>
      <primary-button
        v-if="inputIsValid"
        class="o-primary-btn--width-medium c-modal-import-tree__import-btn c-modal__confirm-btn"
        @click="confirm"
      >
        {{ isImporting ? "Import" : "Save" }}
      </primary-button>
    </div>`
});
