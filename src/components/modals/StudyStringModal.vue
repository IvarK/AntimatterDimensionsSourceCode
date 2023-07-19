<script>
import { sha512_256 } from "js-sha512";

import ModalWrapperChoice from "@/components/modals/ModalWrapperChoice";
import PrimaryButton from "@/components/PrimaryButton";
import StudyStringLine from "@/components/modals/StudyStringLine";

import StudyStringPreview from "./time-study-modal-preview/StudyStringPreview";
import StudyTreeInfo from "./StudyTreeInfo";

let savedImportString = "";

export default {
  name: "StudyStringModal",
  components: {
    ModalWrapperChoice,
    StudyStringLine,
    PrimaryButton,
    StudyStringPreview,
    StudyTreeInfo
  },
  props: {
    id: {
      type: Number,
      required: true,
    },
    deleting: {
      type: Boolean,
      required: false,
      default: false,
    }
  },
  data() {
    return {
      input: "",
      name: "",
      respecAndLoad: false,
      canEternity: false
    };
  },
  computed: {
    // This modal is used by both study importing and preset editing, but is given an id of -1 when importing
    isImporting() {
      return this.id === -1;
    },
    // This represents the state reached from importing into an empty tree
    importedTree() {
      if (!this.inputIsValidTree) return {};
      const importedTree = new TimeStudyTree(this.truncatedInput);
      const newStudiesArray = importedTree.purchasedStudies.map(s => this.studyString(s));
      return {
        timeTheorems: importedTree.spentTheorems[0],
        spaceTheorems: importedTree.spentTheorems[1],
        newStudies: makeEnumeration(newStudiesArray),
        newStudiesArray,
        invalidStudies: importedTree.invalidStudies,
        firstPaths: makeEnumeration(importedTree.dimensionPaths),
        secondPaths: makeEnumeration(importedTree.pacePaths),
        ec: importedTree.ec,
        startEC: importedTree.startEC,
        hasInfo: makeEnumeration(importedTree.dimensionPaths) || importedTree.ec > 0,
      };
    },
    // This is only shown when importing; when modifying a preset we assume that generally the current state of the
    // tree is irrelevant because if it mattered then the player would simply import instead
    combinedTree() {
      if (!this.inputIsValidTree) return {};
      const currentStudyTree = GameCache.currentStudyTree.value;
      const combinedTree = this.combinedTreeObject;
      const newStudiesArray = combinedTree.purchasedStudies
        .filter(s => !currentStudyTree.purchasedStudies.includes(s)).map(s => this.studyString(s));
      // To start an EC using the ! functionality, we want to make sure all the following are true:
      // - The imported string needs to end with "!" (this is parsed out in time-study-tree.js and stored into the
      //   canStart prop for tree objects)
      // - We can unlock the EC in the string. This requires either no EC currently unlocked, or we coincidentally
      //   already have it unlocked
      // - The ECs in the tree object and the import string MUST match; the only EC we want to try to enter is the
      //   one which is being imported, and the tree object will contain a different EC if we already have one
      const stringEC = TimeStudyTree.getECFromString(this.truncatedInput);
      const hasExclamationPoint = combinedTree.startEC;
      const canUnlockEC = [0, stringEC].includes(player.challenge.eternity.current);
      const hasECMismatch = combinedTree.ec !== stringEC;
      return {
        timeTheorems: combinedTree.spentTheorems[0] - currentStudyTree.spentTheorems[0],
        spaceTheorems: combinedTree.spentTheorems[1] - currentStudyTree.spentTheorems[1],
        newStudies: makeEnumeration(newStudiesArray),
        newStudiesArray,
        firstPaths: makeEnumeration(combinedTree.dimensionPaths),
        secondPaths: makeEnumeration(combinedTree.pacePaths),
        ec: combinedTree.ec,
        startEC: hasExclamationPoint && canUnlockEC && !hasECMismatch,
        hasInfo: makeEnumeration(combinedTree.dimensionPaths) || combinedTree.ec > 0,
      };
    },
    combinedTreeObject() {
      const combinedTree = new TimeStudyTree();
      combinedTree.attemptBuyArray(TimeStudyTree.currentStudies, false);
      combinedTree.attemptBuyArray(combinedTree.parseStudyImport(this.truncatedInput), true);
      return combinedTree;
    },
    modalTitle() {
      if (this.deleting) return `Deleting Study Preset "${this.name}"`;
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
      return `Your import string has invalid study IDs: ${coloredString.replaceAll("#", "").replaceAll(",", ", ")}
        <br><br>`;
    },
    truncatedInput() {
      return TimeStudyTree.truncateInput(this.input);
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
      // The button to open the modal and the actual modal itself display two different strings;
      // we should allow either to unlock the secret achievement
      const secretStrings = [
        "08b819f253b684773e876df530f95dcb85d2fb052046fa16ec321c65f3330608",
        "bb450c2a3869bae412ed0b4304dc229521fc69f0fdcc95b3b61460aaf5658fc4"
      ];
      return secretStrings.includes(sha512_256(this.input.toLowerCase()));
    },
    confirmText() {
      if (this.deleting) return "Delete";
      return this.isImporting ? "Import" : "Save";
    }
  },
  watch: {
    input(newInput) {
      savedImportString = newInput;
    }
  },
  // Needs to be assigned in created() or else they will end up being undefined when importing
  created() {
    const preset = player.timestudy.presets[this.id];
    this.input = preset ? preset.studies : savedImportString;
    this.name = preset ? preset.name : "";
  },
  mounted() {
    this.$refs.input.select();
  },
  methods: {
    update() {
      this.canEternity = Player.canEternity;
    },
    confirm() {
      if (this.deleting) {
        this.deletePreset();
      } else if (this.isImporting) {
        if (this.respecAndLoad && Player.canEternity) {
          player.respec = true;
          const tree = new TimeStudyTree(this.truncatedInput);
          animateAndEternity(() =>
            TimeStudyTree.commitToGameState(tree.purchasedStudies, false, this.combinedTree.startEC));
          return;
        }
        this.importTree();
      } else {
        this.savePreset();
      }
    },
    convertInputShorthands() {
      this.input = TimeStudyTree.formatStudyList(this.input);
    },
    importTree() {
      if (!this.inputIsValid) return;
      if (this.inputIsSecret) SecretAchievement(37).unlock();
      savedImportString = "";
      this.emitClose();
      // We need to use a combined tree for committing to the game state, or else it won't buy studies in the imported
      // tree are only reachable if the current tree is already bought
      TimeStudyTree.commitToGameState(this.combinedTreeObject.purchasedStudies, false, this.combinedTree.startEC);
    },
    savePreset() {
      if (this.inputIsValid) {
        player.timestudy.presets[this.id].studies = this.input;
        GameUI.notify.eternity(`Study Tree ${this.name} successfully edited.`);
        this.emitClose();
      }
    },
    deletePreset() {
      const name = player.timestudy.presets[this.id].name;
      const presetName = name ? `Study preset "${name}"` : "Study preset";
      player.timestudy.presets[this.id].studies = "";
      player.timestudy.presets[this.id].name = "";
      GameUI.notify.eternity(`${presetName} deleted from slot ${this.id + 1}`);
    },
    studyString(study) {
      return study instanceof ECTimeStudyState ? `EC${study.id}` : `${study.id}`;
    }
  },
};
</script>

<template>
  <ModalWrapperChoice
    :show-cancel="!inputIsValid"
    :show-confirm="inputIsValid"
    class="c-modal-import-tree"
    @confirm="confirm"
  >
    <template #header>
      {{ modalTitle }}
    </template>
    <input
      ref="input"
      v-model="input"
      type="text"
      maxlength="1500"
      class="c-modal-input c-modal-import-tree__input"
      :class="{ 'l-delete-input' : deleting }"
      :disabled="deleting"
      @keyup.enter="confirm"
      @keyup.esc="emitClose"
    >
    <div class="c-two-column">
      <div class="c-study-info l-modal-import-tree__tree-info">
        <div v-if="inputIsSecret">
          ???
        </div>
        <template v-else-if="inputIsValidTree">
          <div
            v-if="invalidMessage"
            class="l-modal-import-tree__tree-info-line"
            v-html="invalidMessage"
          />
          <StudyStringLine
            v-if="isImporting"
            :tree="combinedTree"
            :into-empty="false"
          />
          <StudyStringLine
            :tree="importedTree"
            :into-empty="true"
          />
          <StudyTreeInfo
            v-if="deleting && importedTree.hasInfo"
            header-text="Study Preset contains:"
            :tree-status="importedTree"
          />
          <StudyTreeInfo
            v-if="!deleting && !isImporting && importedTree.hasInfo"
            header-text="Status after loading with <b>no studies</b>:"
            :tree-status="importedTree"
          />
          <StudyTreeInfo
            v-if="!deleting && combinedTree.hasInfo"
            header-text="Status after loading with <b>current tree</b>:"
            :tree-status="combinedTree"
          />
        </template>
        <div v-if="!deleting && !inputIsValidTree && hasInput">
          Not a valid tree
        </div>
      </div>
      <div class="c-study-preview">
        <StudyStringPreview
          :show-preview="inputIsValidTree"
          :new-studies="!isImporting || (canEternity && respecAndLoad) ? importedTree.newStudiesArray
            : combinedTree.newStudiesArray"
          :disregard-current-studies="!isImporting || (canEternity && respecAndLoad)"
        />
      </div>
    </div>
    <div v-if="!isImporting && inputIsValidTree">
      <br>
      <PrimaryButton
        v-if="!deleting"
        v-tooltip="'This will format the study preset text, for example, changing \'a,b,c|d\' to \'a, b, c | d\'.'"
        @click="convertInputShorthands"
      >
        Format Preset Text
      </PrimaryButton>
    </div>
    <span v-if="isImporting">
      <br>
      <div
        v-tooltip="canEternity ? '' : 'You are currently unable to eternity, so this will only do a normal load.'"
        class="c-modal__confirmation-toggle"
        @click="respecAndLoad = !respecAndLoad"
      >
        <div
          :class="{
            'c-modal__confirmation-toggle__checkbox': true,
            'c-modal__confirmation-toggle__checkbox--active': respecAndLoad,
          }"
        >
          <span
            v-if="respecAndLoad"
            class="fas fa-check"
          />
        </div>
        <span class="c-modal__confirmation-toggle__text">
          Also respec tree and eternity
          <span
            v-if="!canEternity"
            class="c-modal__confirmation-toggle__warning"
          >
            !
          </span>
        </span>
      </div>
    </span>
    <template #confirm-text>
      {{ confirmText }}
    </template>
  </ModalWrapperChoice>
</template>

<style scoped>
.c-two-column {
  display: flex;
  flex-direction: row;
  align-items: center;
}

.c-study-info {
  width: 30rem;
  padding: 0 2rem;
}

.c-study-preview {
  height: 100%;
  margin-right: 3rem;
}

.l-delete-input {
  color: var(--color-text);
  background-color: var(--color-disabled);
  pointer-events: none;
  user-select: none;
}

.c-modal__confirmation-toggle__text {
  opacity: 1;
}

.c-modal__confirmation-toggle__warning {
  display: inline-flex;
  /* stylelint-disable-next-line unit-allowed-list */
  width: 1em;
  /* stylelint-disable-next-line unit-allowed-list */
  height: 1em;
  justify-content: center;
  align-items: center;
  color: #332222;
  background: var(--color-bad);
  border-radius: 100%;
  margin-left: 0.3rem;
}
</style>
