"use strict";

Vue.component("modal-import", {
  data() {
    return {
      input: ""
    };
  },
  template:
    `<div class="c-modal-import l-modal-content--centered">
      <modal-close-button @click="emitClose"/>
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
          <div>Antimatter: {{ formatAntimatter(player.antimatter || player.money) }}</div>
          <div v-if="progress.isInfinityUnlocked">Infinities: {{ shortenDimensions(player.infinitied) }}</div>
          <div v-if="progress.isEternityUnlocked">Eternities: {{ shortenDimensions(player.eternities) }}</div>
          <div v-if="progress.isRealityUnlocked">Realities: {{ shortenDimensions(player.realities) }}</div>
          <div class="c-modal-import__warning">(your current save file will be overwritten!)</div>
        </template>
        <div v-else-if="hasInput">Not a valid save</div>
      </div>
      <primary-button
        v-if="inputIsValid"
        class="o-primary-btn--width-medium c-modal-import__import-btn"
        @click="importSave"
      >Import</primary-button>
    </div>`,
  computed: {
    player() {
      const save = GameSaveSerializer.deserialize(this.input);
      return GameStorage.verifyPlayerObject(save) ? save : undefined;
    },
    progress() {
      return PlayerProgress.of(this.player);
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
    formatAntimatter(antimatter) {
      return this.shortenPostBreak(antimatter, 2, 1);
    },
    importSave() {
      if (!this.inputIsValid) return;
      Modal.hide();
      GameStorage.import(this.input);
    }
  },
  mounted() {
    this.$refs.input.select();
  }
});
