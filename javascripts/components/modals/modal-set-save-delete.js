import PrimaryButton from "@/components/PrimaryButton";
import GlyphSetPreview from "@/components/GlyphSetPreview";

Vue.component("modal-set-save-delete", {
  components: {
    PrimaryButton,
    GlyphSetPreview
  },
  props: {
    modalConfig: Object
  },
  data() {
    return {
      glyphSet: []
    };
  },
  methods: {
    update() {
      this.glyphSet = Glyphs.copyForRecords(player.reality.glyphs.sets[this.modalConfig.glyphSetId]);
    },
    handleNoClick() {
      this.emitClose();
    },
    handleYesClick() {
      player.reality.glyphs.sets[this.modalConfig.glyphSetId] = [];
      EventHub.dispatch(GAME_EVENT.GLYPH_SET_SAVE_CHANGE);
      this.emitClose();
    },
  },
  template: `
    <div class="c-modal-message l-modal-content--centered">
      <h2>Delete this Glyph Set</h2>
      <div class="c-modal-message__text">
        Please confirm your desire to delete this Glyph Set:
        <GlyphSetPreview
          :isInModal="true"
          :glyphs="glyphSet"
        />
        This will not affect your actual glyphs, only the saved preset.
        <br>
        This is permanent and irreversible.
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
          Delete
        </PrimaryButton>
      </div>
    </div>`
});
