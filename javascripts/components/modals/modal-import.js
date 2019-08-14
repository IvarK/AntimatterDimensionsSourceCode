Vue.component("modal-import", {
  data: function() {
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
          <div>Antimatter: {{ formatMoney(player.money) }}</div>
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
    player: function() {
      return parseSaveData(this.input);
    },
    progress: function() {
      return PlayerProgress.of(this.player);
    },
    hasInput: function() {
      return this.input !== "";
    },
    inputIsValid: function() {
      return this.inputIsValidSave || this.inputIsSecret;
    },
    inputIsValidSave: function() {
      return this.player !== undefined;
    },
    inputIsSecret: function() {
      return isSecretImport(this.input) || Theme.isSecretTheme(this.input);
    }
  },
  methods: {
    formatMoney: function(money) {
      return this.shortenPostBreak(money, 2, 1);
    },
    importSave: function() {
      if (!this.inputIsValid) return;
      Modal.hide();
      importSave(this.input);
    }
  },
  mounted: function() {
    this.$refs.input.select();
  }
});