<script>
import { S12Windows } from "./windows";

export default {
  name: "TaskbarIcon",
  props: {
    tab: {
      type: Object,
      required: true
    },
    tabPosition: {
      type: Number,
      required: true
    }
  },
  data() {
    return {
      isAvailable: true,
      isHidden: false,
      hasNotification: false,
      tabName: "",
      S12Windows,
    };
  },
  computed: {
    isCurrentTab() {
      return this.tab.isOpen && !S12Windows.isMinimised;
    }
  },
  methods: {
    update() {
      this.isAvailable = this.tab.isAvailable;
      this.isHidden = this.tab.isHidden;
      this.hasNotification = this.tab.hasNotification;
      if (this.tabPosition < Pelle.endTabNames.length) {
        this.tabName = Pelle.transitionText(
          this.tab.name,
          Pelle.endTabNames[this.tabPosition],
          Math.clamp(GameEnd.endState - (this.tab.id % 4) / 10, 0, 1)
        );
      } else {
        this.tabName = this.tab.name;
      }

      S12Windows.tabs.tabButtonPositions[this.tab.id] = this.getSubtabsPosition();
    },
    getSubtabsPosition() {
      if (!this.$refs.taskbarIcon) return "0px";
      return this.$refs.taskbarIcon.offsetLeft + this.$refs.taskbarIcon.offsetWidth / 2;
    },
  },
};
</script>

<template>
  <div
    ref="taskbarIcon"
    :class="{
      'c-taskbar-icon': true,
      'c-taskbar-icon--active': isCurrentTab
    }"
    :title="tab.name"
    @mouseenter="S12Windows.tabs.setHoveringTab(tab)"
    @mouseleave="S12Windows.tabs.unsetHoveringTab()"
    @click="tab.show(true); S12Windows.isMinimised = false; S12Windows.tabs.unsetHoveringTab(true);"
  >
    <img
      class="c-taskbar-icon__image"
      :src="`images/s12/${tab.key}.png`"
    >
    <div
      v-if="hasNotification"
      class="fas fa-circle-exclamation l-notification-icon"
    />
  </div>
</template>

<style scoped>
.c-taskbar-icon {
  display: flex;
  width: 6rem;
  height: 100%;
  position: relative;
  z-index: 2;
  justify-content: center;
  align-items: center;
  background-image: radial-gradient(at 5% -35%, white, transparent 50%);
  border: 0.15rem solid var(--s12-border-color);
  border-top: none;
  border-radius: 0.3rem;
  box-shadow: inset 0 0 0.3rem 0.1rem rgba(255, 255, 255, 0.8);
  margin-left: 0.4rem;
  transition: background-color 0.5s;
  cursor: pointer;
}

.c-taskbar-icon:hover {
  background-color: rgba(255, 255, 255, 0.35);
}

.c-taskbar-icon--active {
  background-color: rgba(255, 255, 255, 0.5);
}

.c-taskbar-icon--active:hover {
  background-color: rgba(240, 240, 240, 0.9);
}

.c-taskbar-icon__image {
  height: 80%;
  border-radius: 1rem;
}
</style>