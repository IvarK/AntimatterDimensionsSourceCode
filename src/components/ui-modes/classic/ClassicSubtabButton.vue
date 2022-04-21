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
      hasNotification: false,
      isCurrentSubtab: false
    };
  },
  methods: {
    update() {
      this.isAvailable = this.subtab.isAvailable;
      this.hasNotification = this.subtab.hasNotification;
      this.isCurrentSubtab = this.subtab.isOpen;
    }
  },
};
</script>

<template>
  <button
    v-if="isAvailable"
    class="o-tab-btn o-tab-btn--secondary"
    :class="{ 'o-subtab-btn--active': isCurrentSubtab }"
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
.o-tab-btn {
  vertical-align: middle;
}

.o-subtab-btn--active {
  border-bottom-width: 0.4rem;
}
</style>
