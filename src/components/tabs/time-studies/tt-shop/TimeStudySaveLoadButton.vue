<script>
import HoverMenu from "./HoverMenu";

export default {
  name: "TimeStudySaveLoadButton",
  components: {
    HoverMenu,
  },
  props: {
    saveslot: Number
  },
  data() {
    return {
      name: player.timestudy.presets[this.saveslot - 1].name,
    };
  },
  computed: {
    preset() {
      return player.timestudy.presets[this.saveslot - 1];
    },
    displayName() {
      return this.name === "" ? this.saveslot : this.name;
    }
  },
  methods: {
    nicknameBlur(event) {
      this.preset.name = event.target.value.slice(0, 4);
      this.name = this.preset.name;
    },
    hideContextMenu() {
      this.$viewModel.currentContextMenu = null;
    },
    save() {
      this.hideContextMenu();
      this.preset.studies = TimeStudyTree.formatStudyList(GameCache.currentStudyTree.value.exportString);
      const presetName = this.name ? `Study preset "${this.name}"` : "Study preset";
      GameUI.notify.eternity(`${presetName} saved in slot ${this.saveslot}`);
    },
    load() {
      this.hideContextMenu();
      if (this.preset.studies) {
        // We need to use a combined tree for committing to the game state, or else it won't buy studies in the imported
        // tree are only reachable if the current tree is already bought
        const combinedTree = new TimeStudyTree();
        combinedTree.attemptBuyArray(TimeStudyTree.currentStudies, false);
        combinedTree.attemptBuyArray(combinedTree.parseStudyImport(this.preset.studies), true);
        TimeStudyTree.commitToGameState(combinedTree.purchasedStudies);

        const presetName = this.name ? `Study preset "${this.name}"` : "Study preset";
        GameUI.notify.eternity(`${presetName} loaded from slot ${this.saveslot}`);
      } else {
        Modal.message.show("This Time Study list currently contains no Time Studies.");
      }
    },
    handleExport() {
      this.hideContextMenu();
      copyToClipboard(this.preset.studies);
      const presetName = this.name ? `Study preset "${this.name}"` : "Study preset";
      GameUI.notify.eternity(`${presetName} exported from slot ${this.saveslot} to your clipboard`);
    },
    edit() {
      Modal.studyString.show({ id: this.saveslot - 1 });
    }
  },
};
</script>

<template>
  <HoverMenu class="tt-save-load-btn__wrapper">
    <template #object>
      <button
        class="tt-save-load-btn c-tt-buy-button c-tt-buy-button--unlocked"
        @click.shift.exact="save"
        @click.exact="load"
      >
        {{ displayName }}
      </button>
    </template>
    <template #menu>
      <div class="tt-save-load-btn__menu">
        <span ach-tooltip="Set a custom name (up to 4 characters)">
          <input
            type="text"
            size="4"
            maxlength="4"
            class="tt-save-load-btn__menu-rename"
            :value="name"
            @keyup.esc="hideContextMenu"
            @blur="nicknameBlur"
          >
        </span>
        <div
          class="tt-save-load-btn__menu-item"
          @click="edit"
        >
          Edit
        </div>
        <div
          class="lt-save-load-btn__menu-item"
          @click="handleExport"
        >
          Export
        </div>
        <div
          class="tt-save-load-btn__menu-item"
          @click="save"
        >
          Save
        </div>
        <div
          class="tt-save-load-btn__menu-item"
          @click="load"
        >
          Load
        </div>
      </div>
    </template>
  </HoverMenu>
</template>

<style scoped>
.tt-save-load-btn__wrapper {
  margin: 0.3em;
  position: relative;
}

.tt-save-load-btn {
  min-width: 2em;
}

.tt-save-load-btn__menu {
  position: absolute;
  top: -0.5rem;
  left: 50%;
  transform: translate(-50%, -100%);
  padding: 0.5rem 0;
  color: white;
  background: black;
  border-radius: 0.5rem;
  text-align: left;
  font-weight: bold;
  font-family: Typewriter;
  font-size: 1.4rem;
}

.tt-save-load-btn__menu::after {
  content: "";
  position: absolute;
  top: 100%;
  left: 50%;
  margin-left: -0.5rem;
  border-width: 0.5rem;
  border-style: solid;
  border-color: black transparent transparent;
}

.tt-save-load-btn__menu-rename {
  margin: 0.3rem 0.5rem 0.5rem 0.7rem;
  text-align: left;
  font-weight: bold;
  font-family: Typewriter;
  font-size: 1.4rem;
  border: none;
  border-radius: 0.3rem;
  padding: 0.2rem;
}

.tt-save-load-btn__menu-item {
  padding: 0.25rem 1rem;
  cursor: pointer;
}

.tt-save-load-btn__menu-item:hover {
  background: white;
  color: black;
}
</style>