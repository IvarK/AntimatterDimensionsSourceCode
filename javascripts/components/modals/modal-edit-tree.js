Vue.component("modal-edit-tree", {
  props: {
    modalConfig: Object
  },
  data() {
    return {
      input: player.timestudy.presets[this.modalConfig.id].studies,
      name: player.timestudy.presets[this.modalConfig.id].name,
    };
  },
  computed: {
    importedTree() {
      if (!this.inputIsValidTree) return false;
      const importedTree = new TimeStudyTree(this.input, Currency.timeTheorems.value, V.spaceTheorems);
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
    invalidMessage() {
      if (!this.inputIsValidTree || this.importedTree.invalidStudies.length === 0) return null;
      // Pad the input with non-digits which we remove later in order to not cause erroneous extra matches within IDs
      let coloredString = `.${this.input}.`;
      for (const id of this.importedTree.invalidStudies) {
        coloredString = coloredString.replaceAll(new RegExp(`(\\D)(${id})(\\D)`, "gu"),
          `$1<span style="color: var(--color-bad);">$2</span>$3`);
      }
      return `Your import string has invalid study IDs: ${coloredString.replaceAll(".", "")}`;
    },
    editLabel() {
      return `Editing ${this.name}`;
    },
    inputIsValid() {
      return this.inputIsValidTree;
    },
    inputIsValidTree() {
      return TimeStudyTree.isValidImportString(this.input);
    },
    formatWithCommas() {
      return formatWithCommas;
    },
  },
  methods: {
    confirmEdits() {
      if (this.inputIsValid) {
        player.timestudy.presets[this.modalConfig.id].studies = this.input;
        GameUI.notify.eternity(`Study tree ${this.name} successfully edited.`);
        this.emitClose();
      }
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
        <div v-if="!inputIsValid">Invalid tree</div>
        <template v-if="inputIsValidTree">
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
          <div v-if="importedTree.firstPaths" class="l-modal-import-tree__tree-info-line">
            Dimension split: {{ importedTree.firstPaths }}
          </div>
          <div v-if="importedTree.secondPaths" class="l-modal-import-tree__tree-info-line">
            Pace split: {{ importedTree.secondPaths }}
          </div>
          <div v-if="importedTree.ec > 0" class="l-modal-import-tree__tree-info-line">
            Eternity challenge: {{ importedTree.ec }}
          </div>
        </template>
      </div>
      <primary-button
        class="o-primary-btn--width-medium c-modal-import-tree__import-btn c-modal__confirm-btn"
        @click="confirmEdits"
        :enabled="inputIsValid"
      >
        Confirm
      </primary-button>
    </div>`
});
