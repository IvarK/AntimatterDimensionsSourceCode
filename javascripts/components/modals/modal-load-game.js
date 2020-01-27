"use strict";

Vue.component("modal-load-game", {
  components: {
    "save-game-record": {
      props: {
        saveId: Number
      },
      data() {
        const save = GameStorage.saves[this.saveId];
        return {
          antimatter: new Decimal(save ? save.antimatter || save.money : 10)
        };
      },
      computed: {
        isSelected() {
          return GameStorage.currentSlot === this.saveId;
        }
      },
      methods: {
        load() {
          GameStorage.loadSlot(this.saveId);
          Modal.hide();
        },
        formatAntimatter(antimatter) {
          return formatPostBreak(antimatter, 2, 1);
        },
        update() {
          if (this.isSelected) {
            this.antimatter.copyFrom(player.antimatter);
          }
        }
      },
      template:
        `<div class="l-modal-options__save-record">
          <strong>Save #{{ saveId + 1 }}:<span v-if="isSelected"> (selected)</span></strong>
          <span>Antimatter: {{ formatAntimatter(antimatter) }}</span>
          <primary-button
            class="o-primary-btn--width-medium"
            @click="load"
          >Load</primary-button>
        </div>`
    }
  },
  template:
    `<modal-options @close="emitClose">
        <save-game-record v-for="id in 3" :key="id" :saveId="id - 1" />
    </modal-options>`
});
