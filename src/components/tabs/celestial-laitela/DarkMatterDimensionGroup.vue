<script>
import DarkMatterDimensionRow from "./DarkMatterDimensionRow";

export default {
  name: "DarkMatterDimensionGroup",
  components: {
    DarkMatterDimensionRow
  }
};
</script>

<template>
  <span>
    <DarkMatterDimensionRow
      v-for="tier in 4"
      :key="tier"
      :tier="tier"
    />
  </span>
</template>
