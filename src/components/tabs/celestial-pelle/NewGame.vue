<script>
export default {
  name: "NewGame",
  data() {
    return {
      opacity: 0,
      visible: false,
      hasMoreCosmetics: false,
      selectedSetName: "",
    };
  },
  computed: {
    style() {
      return {
        opacity: this.opacity,
        visibility: this.visible ? "visible" : "hidden",
      };
    }
  },
  methods: {
    update() {
      this.visible = GameEnd.endState > END_STATE_MARKERS.SHOW_NEW_GAME && !GameEnd.removeAdditionalEnd;
      this.opacity = (GameEnd.endState - END_STATE_MARKERS.SHOW_NEW_GAME) * 2;
      this.hasMoreCosmetics = GlyphAppearanceHandler.lockedSets.length > 0;
      this.selectedSetName = GlyphAppearanceHandler.chosenFromModal?.name ?? "None (will choose randomly)";
    },
    startNewGame() {
      NG.startNewGame();
    },
    openSelectionModal() {
      Modal.cosmeticSetChoice.show();
    }
  }
};
</script>

<template>
  <div
    class="c-new-game-container"
    :style="style"
  >
    <h2>
      Reset the entire game, but keep Automator Scripts, Secret Themes, Secret Achievements, and Options.
    </h2>
    <h3>You can use the button in the top-right to view the game as it is right now.</h3>
    <div class="c-new-game-button-container">
      <button
        class="c-new-game-button"
        @click="startNewGame"
      >
        Start over?
      </button>
    </div>
    <br>
    <h3 v-if="hasMoreCosmetics">
      For completing the game, you also unlock a new cosmetic set of your choice for Glyphs. These are freely
      modifiable once you reach Reality again, but are purely visual and offer no gameplay bonuses.
      <br>
      <button
        class="c-new-game-button"
        @click="openSelectionModal"
      >
        Choose Cosmetic Set
      </button>
      <br>
      <br>
      Selected Set: {{ selectedSetName }}
    </h3>
    <h3 v-else>
      You have unlocked all Glyph cosmetic sets!
    </h3>
    <br>
    <h3>
      You can also import "speedrun" to start the game again with additional tracking for speedrunning purposes.
    </h3>
  </div>
</template>

<style scoped>
.c-new-game-container {
  display: flex;
  flex-direction: column;
  position: absolute;
  top: 50%;
  left: 50%;
  z-index: 9;
  justify-content: center;
  align-items: center;
  transform: translate(-50%, -50%);
  pointer-events: auto;
}

.t-s12 .c-new-game-container {
  color: white;
}

.c-new-game-button-container {
  display: flex;
  flex-direction: column;
  align-items: stretch;
}

.c-new-game-button {
  font-family: Typewriter;
  background: grey;
  border: black;
  border-radius: var(--var-border-radius, 0.5rem);
  margin-top: 1rem;
  padding: 1rem;
  cursor: pointer;
}
</style>
