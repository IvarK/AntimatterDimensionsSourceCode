<script>
export default {
  name: "ClassicSubtabButton",
  props: {
    subtab: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      isAvailable: false,
      hasNotification: false
    };
  },
  methods: {
    update() {
      this.isAvailable = this.subtab.isAvailable;
      this.hasNotification = this.subtab.hasNotification;
    }
  },
};
</script>

<template>
  <button
    v-if="isAvailable"
    class="o-tab-btn o-tab-btn--secondary"
    @click="subtab.show(true)"
  >
    {{ subtab.name }}
    <i
      v-if="hasNotification"
      class="fas fa-exclamation"
    />
  </button>
</template>

<style scoped>

</style>
