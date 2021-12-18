import PrimaryButton from "@/components/PrimaryButton";

Vue.component("modal-load-game", {
  components: {
    "save-game-record": {
      components: {
        PrimaryButton
      },
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
            this.antimatter.copyFrom(Currency.antimatter);
          }
        }
      },
      template: `
        <div class="l-modal-options__save-record">
          <h3>Save #{{ saveId + 1 }}:<span v-if="isSelected"> (selected)</span></h3>
          <span>Antimatter: {{ formatAntimatter(antimatter) }}</span>
          <PrimaryButton
            class="o-primary-btn--width-medium"
            @click="load"
          >
            Load
          </PrimaryButton>
        </div>`
    }
  },
  template: `
    <modal-options @close="emitClose">
        <save-game-record v-for="id in 3" :key="id" :saveId="id - 1" />
    </modal-options>`
});
