import PrimaryButton from "@/components/PrimaryButton";

Vue.component("modal-delete-all-rejected-glyphs", {
  components: {
    PrimaryButton
  },
  data() {
    return {
      glyphsTotal: Number,
      glyphsDeleted: Number,
      isRefining: Boolean,
    };
  },
  computed: {
    refiningOrSacrificing() {
      if (this.isRefining) return `Refine`;
      return `Sacrifice`;
    },
    topLabel() {
      return `You are about to ${this.refiningOrSacrificing} all rejected Glyphs`;
    },
    message() {
      return `Are you sure you want to ${this.refiningOrSacrificing} all rejected Glyphs? This will remove
      all Glyphs that would be rejected by your new Glyph Filter settings that were previously not removed.
      This process is irreversible!`;
    },
    extraMessage() {
      if (this.glyphsDeleted === 0) return `This will remove no Glyphs.`;
      if (this.glyphsDeleted === this.glyphsTotal) return `This will remove all your Glyphs.`;
      return `This process will remove ${this.glyphsDeleted}/${this.glyphsTotal} Glyphs.`;
    }
  },
  methods: {
    update() {
      this.glyphsTotal = Glyphs.inventory.filter(slot => slot !== null).length;
      this.glyphsDeleted = Glyphs.deleteAllRejected(false);
      this.isRefining = GlyphSacrificeHandler.isRefining;
    },
    handleYesClick() {
      this.emitClose();
      Glyphs.deleteAllRejected(true);
    },
    handleNoClick() {
      this.emitClose();
    }
  },
  template: `
  <div class="c-modal-message l-modal-content--centered">
    <h2>{{ topLabel }}</h2>
    <div class="c-modal-message__text">
      {{ message }}
    </div>
    <div class="c-modal-hard-reset-danger">
      {{ extraMessage }}
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
