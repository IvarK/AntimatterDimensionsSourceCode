"use strict";

Vue.component("modal-import", {
  data() {
    return {
      input: ""
    };
  },
  mounted() {
    this.$refs.input.select();
  },
  computed: {
    saveCheckString() {
      const save = GameSaveSerializer.deserialize(this.input);
      const rawString = GameStorage.checkPlayerObject(save);
      // Keep the length bounded; we don't want the modal to be too big for the screen for particularly bad errors
      return rawString.length > 300 ? `${rawString.slice(0, 297)}...` : rawString;
    },
    player() {
      return this.saveCheckString === "" ? GameSaveSerializer.deserialize(this.input) : undefined;
    },
    progress() {
      return PlayerProgress.of(this.player);
    },
    antimatter() {
      return this.player.antimatter || this.player.money;
    },
    infinities() {
      // Infinity count data is stored in either player.infinitied or player.infinities based on if the save is before
      // or after the reality update, and this explicit check is needed as it runs before any migration code.
      const infinityData = this.player.infinitied ? this.player.infinitied : this.player.infinities;
      return new Decimal(infinityData);
    },
    hasInput() {
      return this.input !== "";
    },
    inputIsValid() {
      return this.inputIsValidSave || this.inputIsSecret;
    },
    inputIsValidSave() {
      return this.player !== undefined;
    },
    inputIsSecret() {
      return isSecretImport(this.input) || Theme.isSecretTheme(this.input);
    }
  },
  methods: {
    importSave() {
      if (!this.inputIsValid) return;
      Modal.hide();
      GameStorage.import(this.input);
    },
  },
  template: `
    <div class="c-modal-import l-modal-content--centered">
      <modal-close-button @click="emitClose" />
      <h3>Input your save</h3>
      <input
        v-model="input"
        ref="input"
        type="text"
        class="c-modal-input c-modal-import__input"
        @keyup.enter="importSave"
        @keyup.esc="emitClose"
      />
      <div class="c-modal-import__save-info">
        <div v-if="inputIsSecret">???</div>
        <template v-else-if="inputIsValidSave">
          <div>Antimatter: {{ formatPostBreak(antimatter, 2, 1) }}</div>
          <div v-if="progress.isInfinityUnlocked">Infinities: {{ formatPostBreak(infinities, 2, 0) }}</div>
          <div v-if="progress.isEternityUnlocked">Eternities: {{ formatPostBreak(player.eternities, 2, 0) }}</div>
          <div v-if="progress.isRealityUnlocked">Realities: {{ formatPostBreak(player.realities, 2, 0) }}</div>
          <div class="c-modal-import__warning">(your current save file will be overwritten!)</div>
        </template>
        <div v-else-if="hasInput">
          Not a valid save
          <br>
          {{ saveCheckString }}
        </div>
      </div>
      <primary-button
        v-if="inputIsValid"
        class="o-primary-btn--width-medium c-modal-import__import-btn c-modal__confirm-btn"
        @click="importSave"
      >
        Import
      </primary-button>
    </div>`
});
