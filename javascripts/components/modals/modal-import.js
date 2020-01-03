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
          <div>Antimatter: {{ formatAntimatter(antimatter) }}</div>
          <div v-if="progress.isInfinityUnlocked">Infinities: {{ format(player.infinitied, 2, 0) }}</div>
          <div v-if="progress.isEternityUnlocked">Eternities: {{ format(player.eternities, 2, 0) }}</div>
          <div v-if="progress.isRealityUnlocked">Realities: {{ format(player.realities, 2, 0) }}</div>
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
    antimatter() {
      return this.player.antimatter || this.player.money;
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
      return formatPostBreak(antimatter, 2, 1);
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
