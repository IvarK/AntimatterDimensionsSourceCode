<script>
import AutobuyerBox from "./AutobuyerBox";
import AutobuyerDropdownEntry from "./AutobuyerDropdownEntry";
import AutobuyerInput from "./AutobuyerInput";
import ExpandingControlBox from "@/components/ExpandingControlBox";

export default {
  name: "RealityAutobuyerBox",
  components: {
    AutobuyerBox,
    AutobuyerInput,
    ExpandingControlBox,
    AutobuyerDropdownEntry
  },
  data() {
    return {
      mode: AUTO_REALITY_MODE.RM,
      levelCap: 0,
      isOverCap: false
    };
  },
  computed: {
    autobuyer: () => Autobuyer.reality,
    modes: () => [
      AUTO_REALITY_MODE.RM,
      AUTO_REALITY_MODE.GLYPH,
      AUTO_REALITY_MODE.EITHER,
      AUTO_REALITY_MODE.BOTH
    ]
  },
  methods: {
    update() {
      this.mode = this.autobuyer.mode;
      this.levelCap = Glyphs.levelCap;
      this.isOverCap = this.autobuyer.glyph > this.levelCap;
    },
    modeName(mode) {
      switch (mode) {
        case AUTO_REALITY_MODE.RM: return "Reality Machines";
        case AUTO_REALITY_MODE.GLYPH: return "Glyph level";
        case AUTO_REALITY_MODE.EITHER: return "Either";
        case AUTO_REALITY_MODE.BOTH: return "Both";
      }
      throw new Error("Unknown Auto Reality mode");
    },
  }
};
</script>

<template>
  <AutobuyerBox
    :autobuyer="autobuyer"
    name="Automatic Reality"
  >
    <template #intervalSlot>
      <ExpandingControlBox>
        <template #header>
          <div class="c-autobuyer-box__mode-select c-autobuyer-box__mode-select-header">
            ▼ Current Setting: ▼
            <br>
            {{ modeName(mode) }}
          </div>
        </template>
        <template #dropdown>
          <AutobuyerDropdownEntry
            :autobuyer="autobuyer"
            :modes="modes"
            :mode-name-fn="modeName"
          />
        </template>
      </ExpandingControlBox>
    </template>
    <template #toggleSlot>
      <div>Target Reality Machines:</div>
      <AutobuyerInput
        :autobuyer="autobuyer"
        type="decimal"
        property="rm"
      />
    </template>
    <template #checkboxSlot>
      <div>Target glyph level:</div>
      <AutobuyerInput
        :autobuyer="autobuyer"
        type="int"
        property="glyph"
      />
      <div v-if="isOverCap">
        Autobuyer will trigger at the Glyph level cap of {{ formatInt(levelCap) }}.
      </div>
    </template>
  </AutobuyerBox>
</template>

<style scoped>

</style>
