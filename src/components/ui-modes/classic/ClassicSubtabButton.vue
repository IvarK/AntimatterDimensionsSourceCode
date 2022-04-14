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
      this.isCurrentSubtab = Tabs.current._currentSubtab === this.subtab;
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
  height: 3rem;
  padding: 0 0.6rem;
  vertical-align: middle;
}

.o-subtab-btn--active {
  border-bottom-width: 0.5rem;
  padding-top: 0.3rem;
}
</style>
