<script>
import SingleAutobuyerBox from "./SingleAutobuyerBox";

// This component contains all of the "special" autobuyers which don't fit within existing groups (eg. RG, TT, etc.)
export default {
  name: "MultipleSingleAutobuyersGroup",
  components: {
    SingleAutobuyerBox
  },
  computed: {
    singles() {
      return Autobuyers.display[1];
    },
    entryCount() {
      return this.singles.length;
    },
    rowCount() {
      return Math.ceil(this.entryCount / 4);
    },
    entryCountPerRow() {
      return this.rowCount === 1 ? this.entryCount : 4;
    },
    boxSize() {
      // The 2% reduced flex-basis is used to prevent wrapping due to the margins.
      // It would be 1%, but apparently the margins are larger here.
      return `flex: 1 0 ${100 / this.entryCountPerRow - 2}%`;
    }
  }
};
</script>

<template>
  <span class="l-autobuyer-singlet-group">
    <template
      v-for="(type, id) in singles"
    >
      <SingleAutobuyerBox
        :key="id"
        :autobuyer="type"
        :style="boxSize"
      />
      <br
        v-if="id % entryCountPerRow === entryCountPerRow"
        :key="id"
      >
    </template>
  </span>
</template>

<style scoped>

</style>
