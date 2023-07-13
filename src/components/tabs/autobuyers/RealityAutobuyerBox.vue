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
  props: {
    isModal: {
      type: Boolean,
      required: false,
      default: false
    }
  },
  data() {
    return {
      mode: AUTO_REALITY_MODE.RM,
      levelCap: 0,
      isOverCap: false,
      hasAlternateInputs: false,
    };
  },
  computed: {
    autobuyer: () => Autobuyer.reality,
    hasRelicMode: () => TeresaUnlocks.effarig.canBeApplied,
    modes() {
      const availableModes = [
        AUTO_REALITY_MODE.RM,
        AUTO_REALITY_MODE.GLYPH,
        AUTO_REALITY_MODE.EITHER,
        AUTO_REALITY_MODE.BOTH,
        AUTO_REALITY_MODE.TIME
      ];
      if (this.hasRelicMode) availableModes.push(AUTO_REALITY_MODE.RELIC_SHARD);
      return availableModes;
    },
  },
  methods: {
    update() {
      this.mode = this.autobuyer.mode;
      this.levelCap = Glyphs.levelCap;
      this.isOverCap = this.autobuyer.glyph > this.levelCap;
      // The container only has room for 2 textboxes, so we switch what they go to based on the current mode
      this.hasAlternateInputs = Autobuyer.reality.mode > AUTO_REALITY_MODE.BOTH;
    },
    modeName(mode) {
      switch (mode) {
        case AUTO_REALITY_MODE.RM: return "Reality Machines";
        case AUTO_REALITY_MODE.GLYPH: return "Glyph level";
        case AUTO_REALITY_MODE.EITHER: return "RM OR Level";
        case AUTO_REALITY_MODE.BOTH: return "RM AND Level";
        case AUTO_REALITY_MODE.TIME: return "Real-time seconds";
        case AUTO_REALITY_MODE.RELIC_SHARD: return "Relic Shards";
      }
      throw new Error("Unknown Auto Reality mode");
    },
  }
};
</script>

<template>
  <AutobuyerBox
    :autobuyer="autobuyer"
    :is-modal="isModal"
    name="Automatic Reality"
  >
    <template #intervalSlot>
      <ExpandingControlBox :auto-close="true">
        <template #header>
          <div class="o-primary-btn c-autobuyer-box__mode-select c-autobuyer-box__mode-select-header">
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
      <div v-if="hasAlternateInputs">
        Target Time (seconds):
      </div>
      <div v-else>
        Target Reality Machines:
      </div>
      <AutobuyerInput
        :autobuyer="autobuyer"
        :type="hasAlternateInputs ? 'float' : 'decimal'"
        :property="hasAlternateInputs ? 'time' : 'rm'"
      />
    </template>
    <template #checkboxSlot>
      <div v-if="hasAlternateInputs && hasRelicMode">
        Target Relic Shards:
      </div>
      <div v-else>
        Target Glyph level:
      </div>
      <AutobuyerInput
        :autobuyer="autobuyer"
        :type="(hasAlternateInputs && hasRelicMode) ? 'decimal' : 'int'"
        :property="(hasAlternateInputs && hasRelicMode) ? 'shard' : 'glyph'"
      />
      <div v-if="isOverCap">
        Autobuyer will trigger at the Glyph level cap of {{ formatInt(levelCap) }}.
      </div>
    </template>
  </AutobuyerBox>
</template>

<style scoped>

</style>
