<script>
export default {
  name: "InfoButton",
  methods: {
    showModal() {
      Modal.information.show();
    }
  }
};
</script>

<template>
  <div
    class="o-tab-btn l-information l-help-me"
    @click="showModal"
  >
    i
  </div>
</template>

<style scoped>

</style>