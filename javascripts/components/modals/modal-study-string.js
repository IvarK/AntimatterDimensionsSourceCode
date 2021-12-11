import "../eternity/time-studies/tree-import-info.js";

Vue.component("modal-study-string", {
  props: {
    modalConfig: {
      type: Object,
      required: true,
    }
  },
  data() {
    return {
      input: "",
      name: "",
    };
  },
  // Needs to be assigned in created() or else they will end up being undefined when importing
  created() {
    const preset = player.timestudy.presets[this.modalConfig.id];
    this.input = preset ? preset.studies : "";
    this.name = preset ? preset.name : "";
  },
  mounted() {
    this.$refs.input.select();
  },
  computed: {
    // This modal is used by both study importing and preset editing but only has a prop actually passed in when
    // editing (which is the preset index). Needs to be an undefined check because index can be zero
    isImporting() {
      return this.modalConfig.id === undefined;
    },
    // This represents the state reached from importing into an empty tree
    importedTree() {
      if (!this.inputIsValidTree) return false;
      const importedTree = new TimeStudyTree(this.truncatedInput, false);
      const studyMap = study => (study instanceof ECTimeStudyState ? `EC${study.id}` : `${study.id}`);
      return {
        timeTheorems: importedTree.spentTheorems[0],
        spaceTheorems: importedTree.spentTheorems[1],
        newStudies: makeEnumeration(importedTree.purchasedStudies.map(s => studyMap(s))),
        invalidStudies: importedTree.invalidStudies,
        firstPaths: makeEnumeration(importedTree.dimensionPaths),
        secondPaths: makeEnumeration(importedTree.pacePaths),
        ec: importedTree.ec,
      };
    },
    // This is only shown when importing; when modifying a preset we assume that generally the current state of the
    // tree is irrelevant because if it mattered then the player would simply import instead
    combinedTree() {
      if (!this.inputIsValidTree) return false;
      const currentStudyTree = GameCache.currentStudyTree.value;
      const combinedTree = new TimeStudyTree([], true);
      combinedTree.attemptBuyArray(TimeStudyTree.currentStudies);
      combinedTree.attemptBuyArray(combinedTree.parseStudyImport(this.truncatedInput));
      const studyMap = study => (study instanceof ECTimeStudyState ? `EC${study.id}` : `${study.id}`);
      return {
        timeTheorems: combinedTree.spentTheorems[0] - currentStudyTree.spentTheorems[0],
        spaceTheorems: combinedTree.spentTheorems[1] - currentStudyTree.spentTheorems[1],
        newStudies: makeEnumeration(combinedTree.purchasedStudies
          .filter(s => !currentStudyTree.purchasedStudies.includes(s)).map(s => studyMap(s))),
        firstPaths: makeEnumeration(combinedTree.dimensionPaths),
        secondPaths: makeEnumeration(combinedTree.pacePaths),
        ec: combinedTree.ec,
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
      // and limit the string length to stop excessive UI stretch
      let coloredString = `#${this.truncatedInput}#`;
      if (coloredString.length > 300) coloredString = `${coloredString.slice(0, 297)}...`;

      for (const study of this.importedTree.invalidStudies) {
        const id = `${study}`.match(/(EC)?(\d+)/u);
        const num = parseInt(id[2], 10);
        switch (id[1]) {
          case "EC":
            coloredString = coloredString.replaceAll(new RegExp(`\\|(${num})`, "gu"),
              `|<span style="color: var(--color-bad);">$1</span>`);
            break;
          default:
            coloredString = coloredString.replaceAll(new RegExp(`(\\D)(${num})(\\D)`, "gu"),
              `$1<span style="color: var(--color-bad);">$2</span>$3`);
            break;
        }
      }
      return `Your import string has invalid study IDs: ${coloredString.replaceAll("#", "")}`;
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
      return sha512_256(this.truncatedInput.toLowerCase()) ===
        "08b819f253b684773e876df530f95dcb85d2fb052046fa16ec321c65f3330608";
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
      this.emitClose();
      const imported = new TimeStudyTree(this.truncatedInput, false);
      TimeStudyTree.commitToGameState(imported.purchasedStudies);
    },
    savePreset() {
      if (this.inputIsValid) {
        player.timestudy.presets[this.modalConfig.id].studies = this.input;
        GameUI.notify.eternity(`Study Tree ${this.name} successfully edited.`);
        this.emitClose();
      }
    },
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
          <div v-if="invalidMessage" class="l-modal-import-tree__tree-info-line" v-html="invalidMessage" />
          <tree-import-info
            v-if="isImporting"
            :tree="combinedTree"
            :intoEmpty="false"
          />
          <tree-import-info
            :tree="importedTree"
            :intoEmpty="true"
          />
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
