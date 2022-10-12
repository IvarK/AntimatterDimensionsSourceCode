<script>
import AutobuyerBox from "./AutobuyerBox";
import AutobuyerDropdownEntry from "./AutobuyerDropdownEntry";
import AutobuyerInput from "./AutobuyerInput";
import ExpandingControlBox from "@/components/ExpandingControlBox";

export default {
  name: "EternityAutobuyerBox",
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
      isDoomed: false,
      mode: AUTO_ETERNITY_MODE.AMOUNT,
      hasAdditionalModes: false,
      increaseWithMult: true,
    };
  },
  computed: {
    autobuyer: () => Autobuyer.eternity,
    modes: () => [
      AUTO_ETERNITY_MODE.AMOUNT,
      AUTO_ETERNITY_MODE.TIME,
      AUTO_ETERNITY_MODE.X_HIGHEST,
    ],
    amountMode: () => AUTO_ETERNITY_MODE.AMOUNT
  },
  watch: {
    increaseWithMult(newValue) {
      this.autobuyer.increaseWithMult = newValue;
    }
  },
  methods: {
    update() {
      this.isDoomed = Pelle.isDoomed;
      this.mode = this.autobuyer.mode;
      this.hasAdditionalModes = this.autobuyer.hasAdditionalModes;
      this.increaseWithMult = this.autobuyer.increaseWithMult;
    },
    modeProps(mode) {
      switch (mode) {
        case AUTO_ETERNITY_MODE.AMOUNT: return {
          title: "Eternity at X EP",
          input: {
            property: "amount",
            type: "decimal"
          },
        };
        case AUTO_ETERNITY_MODE.TIME: return {
          title: "Seconds between Eternities",
          input: {
            property: "time",
            type: "float"
          },
        };
        case AUTO_ETERNITY_MODE.X_HIGHEST: return {
          title: "X times highest EP",
          input: {
            property: "xHighest",
            type: "decimal"
          },
        };
      }
      throw new Error("Unknown Auto Eternity mode");
    },
    modeName(mode) {
      return this.modeProps(mode).title;
    },
  }
};
</script>

<template>
  <AutobuyerBox
    :autobuyer="autobuyer"
    :is-modal="isModal"
    name="Automatic Eternity"
  >
    <template #intervalSlot>
      <ExpandingControlBox
        v-if="hasAdditionalModes"
        :auto-close="true"
      >
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
      <span v-else>{{ modeProps(mode).title }}:</span>
    </template>
    <template #toggleSlot>
      <AutobuyerInput
        :key="mode"
        :autobuyer="autobuyer"
        v-bind="modeProps(mode).input"
      />
    </template>
    <template
      v-if="mode === amountMode"
      #checkboxSlot
    >
      <label
        class="o-autobuyer-toggle-checkbox o-clickable"
      >
        <input
          v-model="increaseWithMult"
          type="checkbox"
          class="o-clickable"
        >
        Dynamic amount
      </label>
    </template>
  </AutobuyerBox>
</template>

<style scoped>
.o-clickable {
  cursor: pointer;
}
</style>
