Vue.component('modal-load-game', {
  template:
    `<modal-options @close="emitClose">
        <modal-load-record v-for="id in 3" :key="id" :saveId="id - 1" />
    </modal-options>`
});

Vue.component('modal-load-record', {
  props: {
    saveId: Number
  },
  data: function() {
    const save = saves[this.saveId];
    return {
      antimatter: new Decimal(save ? save.money : 10)
    };
  },
  computed: {
    isSelected: function() {
      return currentSave === this.saveId;
    }
  },
  methods: {
    loadSave: function() {
      change_save(this.saveId);
    },
    formatMoney: function(money) {
      formatPostBreak = true;
      let formatted = this.shortenMoney(money);
      formatPostBreak = false;
      return formatted;
    },
    update() {
      if (this.isSelected) {
        this.antimatter.copyFrom(player.money);
      }
    }
  },
  template:
    `<div class="l-modal-options__save-record">
      <strong>Save #{{ saveId + 1 }}:<span v-if="isSelected"> (selected)</span></strong>
      <span>Antimatter: {{ formatMoney(antimatter) }}</span>
      <primary-button
        class="c-primary-btn--width-medium"
        @click="loadSave"
      >Load</primary-button>
    </div>`
});