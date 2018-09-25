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
        <input type="text" v-model="input">
        <div v-if="inputIsSecretTheme">???</div>
        <template v-else-if="inputIsValidSave">
          <div>Antimatter: {{ formatMoney(player.money) }}</div>
          <div v-if="progress.infinityUnlocked()">Infinities: {{ shortenDimensions(player.infinitied) }}</div>
          <div v-if="progress.eternityUnlocked()">Eternities: {{ shortenDimensions(player.eternities) }}</div>
          <div v-if="progress.realityUnlocked()">Realities: {{ shortenDimensions(player.realities) }}</div>
          <div style="font-size: 75%">(your current save file will be overwritten!)</div>
        </template>
        <div v-else-if="hasInput">Not a valid save</div>
        <primary-button v-if="inputIsValid" style="margin-top: 3px" @click="importSave">Import</primary-button>
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
      return this.inputIsValidSave || this.inputIsSecretTheme;
    },
    inputIsValidSave: function() {
      return this.player !== undefined;
    },
    inputIsSecretTheme: function() {
      return Theme.isSecretTheme(this.input);
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
  }
});