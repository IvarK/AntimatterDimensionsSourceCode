import PrimaryButton from "@/components/PrimaryButton";

Vue.component("modal-glyph-replace", {
  components: {
    PrimaryButton
  },
  props: {
    modalConfig: Object
  },
  data() {
    return {
      targetSlot: 0,
      idx: 0,
    };
  },
  methods: {
    update() {
      this.targetSlot = this.modalConfig.targetSlot;
      this.idx = this.modalConfig.inventoryIndex;
      this.glyph = Glyphs.findByInventoryIndex(this.idx);
    },
    handleYesClick() {
      Glyphs.swapIntoActive(this.glyph, this.targetSlot);
      this.emitClose();
    },
    handleNoClick() {
      this.emitClose();
    },
  },
  template: `
    <div class="c-modal-message l-modal-content--centered">
      <h2>You are about to replace a Glyph</h2>
      <div class="c-modal-message__text">
        Replacing a Glyph will restart this Reality.
      </div>
      <div class="l-options-grid__row">
        <PrimaryButton
          class="o-primary-btn--width-medium c-modal-message__okay-btn"
          @click="handleNoClick"
        >
          Cancel
        </PrimaryButton>
        <PrimaryButton
          class="o-primary-btn--width-medium c-modal-message__okay-btn c-modal__confirm-btn"
          @click="handleYesClick"
        >
          Confirm
        </PrimaryButton>
      </div>
    </div>`
});
