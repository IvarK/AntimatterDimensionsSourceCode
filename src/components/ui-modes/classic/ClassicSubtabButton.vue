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
      this.isCurrentSubtab = this.subtab.isOpen && player.options.theme !== "S9";
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
  padding-top: 0.2rem;
  vertical-align: middle;
  height: 2.5rem;
}

.o-subtab-btn--active {
  border-bottom-width: 0.4rem;
  height: 2.5rem;
}

.s-base--metro .o-subtab-btn--active {
  border-bottom-width: 0.4rem;
}
</style>
