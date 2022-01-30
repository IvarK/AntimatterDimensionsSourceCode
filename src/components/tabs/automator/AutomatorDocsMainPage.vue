<script>
import AutomatorDocsInfo from "./AutomatorDocsInfo";
import AutomatorDocsCommandList from "./AutomatorDocsCommandList";
import AutomatorDocsTemplateList from "./AutomatorDocsTemplateList";

export default {
  name: "AutomatorDocsMainPage",
  components: {
    AutomatorDocsInfo,
    AutomatorDocsCommandList,
    AutomatorDocsTemplateList
  },
  data() {
    return {
      listState: 0,
    };
  },
  methods: {
    buttonStyle(id) {
      return {
        "color": this.listState === id ? "green" : ""
      };
    },
  }
};
</script>

<template>
  <div>
    <button
      v-tooltip="'Page Information'"
      :style="buttonStyle(0)"
      class="fas fa-info-circle"
      @click="listState = 0"
    />
    <button
      v-tooltip="'Show Command List'"
      :style="buttonStyle(1)"
      class="fas fa-laptop-code"
      @click="listState = 1"
    />
    <button
      v-tooltip="'Show Template List'"
      :style="buttonStyle(2)"
      class="fas fa-file-code"
      @click="listState = 2"
    />
    <br>
    <AutomatorDocsInfo v-if="listState === 0" />
    <AutomatorDocsCommandList v-else-if="listState === 1" />
    <AutomatorDocsTemplateList v-else-if="listState === 2" />
  </div>
</template>

<style scoped>

</style>
