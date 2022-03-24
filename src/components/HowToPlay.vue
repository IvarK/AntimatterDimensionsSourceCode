<script>
export default {
  name: "HowToPlay",
  methods: {
    showModal() {
      Modal.h2p.show();
    }
  }
};
</script>

<template>
  <div
    class="o-tab-btn l-help-me"
    @click="showModal"
  >
    ?
  </div>
</template>

<style scoped>

</style>