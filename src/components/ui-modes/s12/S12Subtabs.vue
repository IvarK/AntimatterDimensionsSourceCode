<script>
import { S12Windows } from "./windows";

export default {
  name: "S12Subtabs",
  props: {
    tab: {
      type: Object,
      required: true
    },
  },
  data() {
    return {
      isAvailable: true,
      isHidden: false,
      subtabVisibilities: [],
      tabName: "",
      S12Windows,
      windowWidth: 0,
      left: "0px",
      useCompact: false,
    };
  },
  methods: {
    update() {
      this.isAvailable = this.tab.isAvailable;
      this.isHidden = this.tab.isHidden;
      this.subtabVisibilities = this.tab.subtabs.map(x => x.isAvailable);
      this.windowWidth = window.innerWidth;
      this.useCompact = this.subtabVisibilities.reduce((a, v) => a + v) * 180 > window.innerWidth - 10;

      this.left = this.getSubtabsPosition();
    },
    isCurrentSubtab(id) {
      return player.options.lastOpenSubtab[this.tab.id] === id && !S12Windows.isMinimised;
    },
    getSubtabsPosition() {
      if (!this.$refs.subtabs) return "0px";
      const centerPt = S12Windows.tabs.tabButtonPositions[this.tab.id];
      const subtabsWidth = this.$refs.subtabs.offsetWidth;
      const minLeft = 5 + subtabsWidth / 2, maxLeft = this.windowWidth - minLeft;
      // Reference isAvailable and isHidden so this gets updated correctly
      return (this.isAvailable, this.isHidden, `${Math.clamp(centerPt, minLeft, maxLeft)}px`);
    },
  },
};
</script>

<template>
  <div
    ref="subtabs"
    class="c-s12-subtabs"
    :class="{
      'c-s12-subtabs--show': S12Windows.tabs.hoveringTab === tab.id,
      'c-s12-subtabs--compact': useCompact,
    }"
    :style="{ left }"
    @mouseenter="S12Windows.tabs.setHoveringTab(tab)"
    @mouseleave="S12Windows.tabs.unsetHoveringTab()"
  >
    <template
      v-for="(subtab, index) in tab.subtabs"
    >
      <div
        v-if="subtabVisibilities[index]"
        :key="index"
        class="c-s12-subtab-btn"
        :class="{ 'c-s12-subtab-btn--active': isCurrentSubtab(subtab.id) }"
        @click="subtab.show(true); S12Windows.isMinimised = false; S12Windows.tabs.unsetHoveringTab(true);"
      >
        <span class="c-s12-subtab-btn__text">
          <span
            v-if="useCompact"
            class="c-s12-subtab-btn__symbol--small"
            v-html="subtab.symbol"
          />
          {{ subtab.name }}
        </span>
        <span
          v-if="!useCompact"
          class="c-s12-subtab-btn__symbol"
          v-html="subtab.symbol"
        />
        <div
          v-if="subtab.hasNotification"
          class="fas fa-circle-exclamation l-notification-icon"
        />
      </div>
    </template>
  </div>
</template>

<style scoped>
.c-s12-subtabs {
  display: flex;
  visibility: hidden;
  position: absolute;
  bottom: calc(var(--s12-taskbar-height) + 0.5rem);
  z-index: 6;
  opacity: 0;
  background-color: rgba(120, 120, 120, 0.7);
  background-image: var(--s12-background-gradient);
  border: 0.15rem solid var(--s12-border-color);
  border-radius: 0.5rem;
  box-shadow: 0 0 1rem 0.2rem var(--s12-border-color),
    inset 0 0 0.4rem 0.1rem rgba(255, 255, 255, 0.7);
  transform: translate(-50%, 20%);
  transition: transform 0.2s, opacity 0.2s, visibility 0.2s;
  pointer-events: none;

  /* If anyone can figure out why these two aren't working that would be great */
  -webkit-backdrop-filter: blur(0.3rem);
  backdrop-filter: blur(0.3rem);
}

.c-s12-subtabs--compact {
  flex-direction: column;
  padding: 0.5rem;
  padding-bottom: 0;
}

.c-s12-subtabs--show {
  visibility: visible;
  opacity: 1;
  transform: translate(-50%, 0);
  pointer-events: auto;
}

.c-s12-subtab-btn {
  display: flex;
  flex-direction: column;
  width: 17rem;
  height: 12rem;
  position: relative;
  border: 0.1rem solid transparent;
  border-radius: 0.5rem;
  margin: 0.5rem;
  padding: 0.3rem;
  transition: background-color 0.5s, border 0.5s;
  user-select: none;
  cursor: pointer;
}

.c-s12-subtabs--compact .c-s12-subtab-btn {
  height: auto;
  margin: 0;
  margin-bottom: 0.5rem;
  padding: 0.6rem;
}

.c-s12-subtab-btn:hover {
  background-color: rgba(255, 255, 255, 0.1);
  border: 0.1rem solid rgba(255, 255, 255, 0.5);
}

.c-s12-subtab-btn--active {
  background-color: rgba(255, 255, 255, 0.4);
  border: 0.1rem solid white;
}

.c-s12-subtab-btn--active:hover {
  background-color: rgba(255, 255, 255, 0.6);
}

.c-s12-subtab-btn__text {
  display: flex;
  align-self: flex-start;
  color: white;
  text-shadow: 0 0 0.5rem var(--s12-border-color);
}

.c-s12-subtab-btn__symbol {
  display: flex;
  height: 100%;
  justify-content: center;
  align-items: center;
  align-self: center;
  font-size: 6rem;
  color: white;
  text-shadow: 0 0 0.5rem var(--s12-border-color);
}

.c-s12-subtab-btn__symbol--small {
  width: 1.4rem;
  margin-right: 0.5rem;
}
</style>