Vue.component('modal-import', {
  data: function() {
    return {
      input: ""
    };
  },
  template:
    `<div class="modal-import">
        <modal-close-button @click="emitClose"></modal-close-button>
        <h3>Input your save</h3>
        <input ref="input" type="text" v-model="input" @keyup.enter="importSave">
        <div v-if="inputIsSecret">???</div>
        <template v-else-if="inputIsValidSave">
          <div>Antimatter: {{ formatMoney(player.money) }}</div>
          <div v-if="progress.infinityUnlocked()">Infinities: {{ shortenDimensions(player.infinitied) }}</div>
          <div v-if="progress.eternityUnlocked()">Eternities: {{ shortenDimensions(player.eternities) }}</div>
          <div v-if="progress.realityUnlocked()">Realities: {{ shortenDimensions(player.realities) }}</div>
          <div style="font-size: 75%">(your current save file will be overwritten!)</div>
        </template>
        <div v-else-if="hasInput">Not a valid save</div>
        <store-button v-if="inputIsValid" style="margin-top: 3px" @click="importSave">Import</store-button>
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
      formatPostBreak = true;
      let formatted = shortenMoney(new Decimal(money));
      formatPostBreak = false;
      return formatted;
    },
    shortenDimensions: function(value) {
      return shortenDimensions(value);
    },
    importSave: function() {
      Modal.hide();
      importSave(this.input);
    }
  },
  mounted: function() {
    this.$refs.input.select();
  }
});