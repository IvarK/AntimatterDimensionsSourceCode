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
        <div v-if="!player && hasInput">Not a valid save</div>
        <div v-if="player">Antimatter: {{ formatMoney(player.money) }}</div>
        <div v-if="player && progress.infinityUnlocked()">Infinities: {{ shortenDimensions(player.infinitied) }}</div>
        <div v-if="player && progress.eternityUnlocked()">Eternities: {{ shortenDimensions(player.eternities) }}</div>
        <div v-if="player && progress.realityUnlocked()">Realities: {{ shortenDimensions(player.realities) }}</div>
        <primary-button v-if="hasInput" style="margin-top: 3px" @click="importSave">Import</primary-button>
        <div v-if="hasInput" style="font-size: 75%">(if you import a valid save, your current save file will be overwritten!)</div>
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