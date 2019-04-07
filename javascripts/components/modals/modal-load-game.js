Vue.component("modal-load-game", {
  components: {
    "save-game-record": {
      props: {
        saveId: Number
      },
      data() {
        const save = saves[this.saveId];
        return {
          antimatter: new Decimal(save ? save.money : 10)
        };
      },
      computed: {
        isSelected() {
          return currentSave === this.saveId;
        }
      },
      methods: {
        loadSave() {
          change_save(this.saveId);
        },
        formatMoney(money) {
          return this.shortenPostBreak(money, 2, 1);
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
            class="o-primary-btn--width-medium"
            @click="loadSave"
          >Load</primary-button>
        </div>`
    }
  },
  template:
    `<modal-options @close="emitClose">
        <save-game-record v-for="id in 3" :key="id" :saveId="id - 1" />
    </modal-options>`
});