<script>
import AutobuyerBox from "./AutobuyerBox";
import AutobuyerInput from "./AutobuyerInput";

export default {
  name: "SacrificeAutobuyerBox",
  components: {
    AutobuyerBox,
    AutobuyerInput
  },
  computed: {
    autobuyer: () => Autobuyer.sacrifice
  }
};
</script>

<template>
  <AutobuyerBox
    :autobuyer="autobuyer"
    name="Automatic Sacrifice"
  >
    <template slot="intervalSlot">
      <span>Dimensional Sacrifice at X multiplier:</span>
      <AutobuyerInput
        :autobuyer="autobuyer"
        type="decimal"
        property="multiplier"
      />
    </template>
  </AutobuyerBox>
</template>

<style scoped>

</style>
