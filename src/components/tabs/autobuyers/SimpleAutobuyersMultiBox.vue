<script>
import MultipleAutobuyersBox from "./MultipleAutobuyersBox";
import MultipleSingleAutobuyersGroup from "./MultipleSingleAutobuyersGroup";

// This component, for some reason, contains every single autobuyer except for tickspeed and prestiges
export default {
  name: "SimpleAutobuyersMultiBox",
  components: {
    MultipleAutobuyersBox,
    MultipleSingleAutobuyersGroup
  },
  computed: {
    multiple() {
      return Autobuyers.display[0];
    },
  }
};
</script>

<template>
  <span class="l-autobuyers-tab">
    <MultipleAutobuyersBox
      v-for="(type, id) in multiple"
      :key="id"
      :type="type"
    />
    <MultipleSingleAutobuyersGroup />
  </span>
</template>

<style scoped>

</style>
