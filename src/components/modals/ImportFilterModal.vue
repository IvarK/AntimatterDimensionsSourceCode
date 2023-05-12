<script>
import ModalWrapperChoice from "@/components/modals/ModalWrapperChoice";
import PrimaryButton from "@/components/PrimaryButton";

export default {
  name: "ImportFilterModal",
  components: {
    ModalWrapperChoice,
    PrimaryButton
  },
  data() {
    return {
      input: "",
    };
  },
  computed: {
    inputIsValid() {
      let decoded;
      try {
        decoded = GameSaveSerializer.decodeText(this.input, "glyph filter");
        return decoded.length > 0 && decoded.match(/^[0-9,.|]*$/u) !== null;
      } catch {
        return false;
      }
    },
  },
  mounted() {
    this.$refs.input.select();
  },
  methods: {
    importFilter() {
      if (!this.inputIsValid) return;
      this.emitClose();

      const decoded = GameSaveSerializer.decodeText(this.input, "glyph filter");
      const parts = decoded.split("|");
      player.reality.glyphs.filter.select = Number(parts[0]);
      player.reality.glyphs.filter.simple = Number(parts[1]);
      player.reality.glyphs.filter.trash = Number(parts[2]);

      const typeInfo = {};
      let partIndex = 3;
      for (const type of ALCHEMY_BASIC_GLYPH_TYPES) {
        if (!type) continue;
        const subparts = parts[partIndex].split(",");
        typeInfo[type] = {
          rarity: Number(subparts[0]),
          score: Number(subparts[1]),
          effectCount: Number(subparts[2]),
          specifiedMask: Number(subparts[3]),
          effectScores: subparts[4].split(".").map(s => Number(s)),
        };
        partIndex++;
      }
      player.reality.glyphs.filter.types = typeInfo;
    },
  },
};
</script>

<template>
  <ModalWrapperChoice
    :show-cancel="!inputIsValid"
    :show-confirm="false"
  >
    <template #header>
      Import Glyph filter settings
    </template>
    Note: Importing Glyph filter options will overwrite settings
    <br>
    in all filter modes, not just the currently-selected one.
    <input
      ref="input"
      v-model="input"
      type="text"
      class="c-modal-input c-modal-import__input"
      @keyup.enter="importSave"
      @keyup.esc="emitClose"
    >
    <div class="c-modal-import__save-info">
      <div v-if="!input" />
      <div v-else-if="inputIsValid">
        PLACEHOLDER FOR BEFORE/AFTER FILTER INFO
      </div>
      <div v-else>
        Not a valid Glyph filter string
      </div>
    </div>

    <PrimaryButton
      v-if="inputIsValid"
      class="o-primary-btn--width-medium c-modal-message__okay-btn c-modal__confirm-btn"
      @click="importFilter"
    >
      Import
    </PrimaryButton>
  </ModalWrapperChoice>
</template>