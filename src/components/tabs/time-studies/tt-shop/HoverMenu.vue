<script>
/**
 * This slotted component manages a context menu that is accessible both
 * by right clicking and by hovering; this is mostly about wrangling timers.
 */

export default {
  name: "HoverMenu",
  props: {
    saveslot: {
      type: Number,
      default: 0
    }
  },
  data: () => ({
    componentID: UIID.next(),
    contextMenuHideTimer: null,
    contextMenuShowTimer: null,
  }),
  computed: {
    contextMenuIsVisible() {
      return this.$viewModel.currentContextMenu === this.componentID;
    },
    listeners() {
      return Object.assign({}, this.$listeners, {
        touchstart: () => this.startShowTimer(),
        mouseenter: () => this.startShowTimer(),
        mouseleave: () => this.startHideTimer(),
      });
    }
  },
  methods: {
    startShowTimer() {
      this.stopHideTimer();
      if (this.contextMenuIsVisible || this.contextMenuShowTimer) return;
      this.contextMenuShowTimer = setTimeout(() => {
        this.contextMenuShowTimer = null;
        this.showContextMenu();
      }, 250);
    },
    showContextMenu() {
      this.stopTimers();
      this.$viewModel.currentContextMenu = this.componentID;
    },
    startHideTimer() {
      this.stopShowTimer();
      if (!this.contextMenuIsVisible || this.contextMenuHideTimer) return;
      this.contextMenuHideTimer = setTimeout(() => {
        this.contextMenuHideTimer = null;
        this.hideContextMenu();
      }, 500);
    },
    hideContextMenu() {
      this.stopTimers();
      if (this.$viewModel.currentContextMenu === this.componentID) {
        this.$viewModel.currentContextMenu = null;
      }
    },
    toggleContextMenu() {
      if (this.contextMenuIsVisible) this.hideContextMenu();
      else this.showContextMenu();
    },
    stopTimers() {
      this.stopHideTimer();
      this.stopShowTimer();
    },
    stopHideTimer() {
      if (this.contextMenuHideTimer) {
        clearTimeout(this.contextMenuHideTimer);
        this.contextMenuHideTimer = null;
      }
    },
    stopShowTimer() {
      if (this.contextMenuShowTimer) {
        clearTimeout(this.contextMenuShowTimer);
        this.contextMenuShowTimer = null;
      }
    },
  },
};
</script>

<template>
  <div
    class="hover-menu__wrapper"
    v-on="listeners"
    @contextmenu.prevent="toggleContextMenu"
  >
    <slot
      ref="clown"
      name="object"
    />
    <slot
      v-if="contextMenuIsVisible"
      name="menu"
    />
  </div>
</template>


<style scoped>
.hover-menu__wrapper {
  position: relative;
}
</style>