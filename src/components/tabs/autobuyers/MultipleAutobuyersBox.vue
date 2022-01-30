<script>
import SingleAutobuyerInRow from "./SingleAutobuyerInRow";
import AutobuyerIntervalLabel from "./AutobuyerIntervalLabel";

export default {
  name: "MultipleAutobuyersBox",
  components: {
    SingleAutobuyerInRow,
    AutobuyerIntervalLabel,
  },
  props: {
    type: {
      type: Function,
      required: true,
    },
  },
  data() {
    return {
      continuumActive: false,
      anyUnlocked: false,
      displayIntervalAsGroup: false,
      displayBulkAsGroup: false,
    };
  },
  computed: {
    autobuyers() {
      return this.type.zeroIndexed;
    },
    name() {
      return this.type.groupName;
    },
    entryCount() {
      return this.type.entryCount;
    },
    rowCount() {
      return Math.ceil(this.entryCount / 8);
    },
    entryCountPerRow() {
      return this.rowCount === 1 ? this.entryCount : 5;
    },
    boxSize() {
      // The 1% reduced flex-basis is used to prevent wrapping due to the margins.
      return `flex: 1 0 ${100 / this.entryCountPerRow - 1}%`;
    },
    isADBox() {
      return this.name === Autobuyer.antimatterDimension.groupName;
    },
    showAutobuyers() {
      // Only display the Antimatter Dimension Autobuyers if the bulk is the same and there are any of them unlocked
      if (this.isADBox) return this.anyUnlocked && this.displayBulkAsGroup && this.displayIntervalAsGroup;
      return this.anyUnlocked;
    },
  },
  methods: {
    update() {
      this.continuumActive = Laitela.continuumActive;
      const type = this.type;
      this.anyUnlocked = type.anyUnlocked();
      this.displayIntervalAsGroup = type.allMaxedInterval?.() ?? true;
      this.displayBulkAsGroup = type.allUnlimitedBulk?.() ?? true;
    },
  }
};
</script>

<template>
  <span
    v-if="showAutobuyers && !(isADBox && continuumActive)"
    class="c-autobuyer-box-row"
  >
    <div class="l-autobuyer-box__title">
      {{ name }}<br>Autobuyers
      <AutobuyerIntervalLabel
        :autobuyer="autobuyers[0]"
        :show-interval="displayIntervalAsGroup"
        :show-bulk="displayBulkAsGroup"
      />
    </div>
    <div class="l-autobuyer-box__autobuyers">
      <template
        v-for="(autobuyer, id) in autobuyers"
      >
        <SingleAutobuyerInRow
          :key="id"
          class="l-autobuyer-box__autobuyers-internal"
          :style="boxSize"
          :autobuyer="autobuyer"
          :show-interval="!displayIntervalAsGroup"
          :show-bulk="!displayBulkAsGroup"
        />
        <br
          v-if="id % entryCountPerRow === entryCountPerRow"
          :key="id"
        >
      </template>
    </div>
  </span>
  <span
    v-else-if="isADBox && continuumActive"
    class="c-autobuyer-box-row"
  >
    Continuum makes Antimatter Dimension and Tickspeed Autobuyers obsolete, as you now automatically have a
    <br>
    certain amount of simulated Antimatter Dimension and Tickspeed purchases based on your antimatter.
  </span>
</template>

<style scoped>

</style>
