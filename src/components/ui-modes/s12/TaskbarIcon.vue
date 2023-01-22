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
      subtabVisibilities: [],
      showSubtabs: false,
      hasNotification: false,
      tabName: "",
      S12Windows,
      windowWidth: 0,
    };
  },
  computed: {
    classObject() {
      return {
        "o-tab-btn": true,
        "o-tab-btn--modern-tabs": true,
        "o-tab-btn--subtabs": this.showSubtabs,
        "o-tab-btn--active": this.isCurrentTab && Theme.currentName() !== "S9"
      };
    },
    isCurrentTab() {
      return this.tab.isOpen;
    },
    subtabsLeft() {
      if (!this.$refs.taskbarIcon) return "0px";
      const centerPt = this.$refs.taskbarIcon.offsetLeft + this.$refs.taskbarIcon.offsetWidth / 2;
      const subtabsWidth = this.$refs.subtabs.offsetWidth;
      const minLeft = 5 + subtabsWidth / 2, maxLeft = this.windowWidth - minLeft;
      // Reference isAvailable and isHidden so this gets updated correctly
      return (this.isAvailable, this.isHidden, `${Math.clamp(centerPt, minLeft, maxLeft)}px`);
    }
  },
  mounted() {
    // Seems to initially break due to the v-if condition
    this.$recompute("subtabsLeft");
  },
  methods: {
    update() {
      this.isAvailable = this.tab.isAvailable;
      this.isHidden = this.tab.isHidden;
      this.subtabVisibilities = this.tab.subtabs.map(x => x.isAvailable);
      this.showSubtabs = this.isAvailable;
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
      this.windowWidth = window.innerWidth;
    },
    isCurrentSubtab(id) {
      return player.options.lastOpenSubtab[this.tab.id] === id && Theme.currentName() !== "S9";
    }
  },
};
</script>

<template>
  <div
    v-if="!isHidden && isAvailable"
    ref="taskbarIcon"
    :class="{
      'c-taskbar-icon': true,
      'c-taskbar-icon--active': isCurrentTab
    }"
    :title="tab.name"
    @mouseenter="S12Windows.setHoveringTab(tab)"
    @mouseleave="S12Windows.unsetHoveringTab()"
    @click="tab.show(true)"
  >
    <img
      class="c-taskbar-icon__image"
      :src="`images/s12/${tab.key}.png`"
    >
    <div
      v-if="hasNotification"
      class="fas fa-circle-exclamation l-notification-icon"
    />
    <div
      ref="subtabs"
      class="c-s12-subtabs"
      :class="{ 'c-s12-subtabs--show': S12Windows.hoveringTab === tab.id }"
      :style="{ left: subtabsLeft }"
    >
      <template
        v-for="(subtab, index) in tab.subtabs"
      >
        <div
          v-if="subtabVisibilities[index]"
          :key="index"
          class="c-s12-subtab-btn"
          :class="{ 'c-s12-subtab-btn--active': isCurrentSubtab(subtab.id) }"
          @click="subtab.show(true)"
        >
          <span class="c-s12-subtab-btn__text">
            {{ subtab.name }}
          </span>
          <span
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
  </div>
</template>

<style scoped>
.c-taskbar-icon {
  display: flex;
  width: 6rem;
  height: 100%;
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
  height: 90%;
}


.c-s12-subtabs {
  display: flex;
  visibility: hidden;
  position: absolute;
  bottom: 110%;
  opacity: 0;
  background-color: rgba(120, 120, 120, 0.7);
  background-image: repeating-linear-gradient(
    50deg,
    rgba(170, 170, 170, 0.1), rgba(170, 170, 170, 0.1) 2rem,
    rgba(255, 255, 255, 0.1) 4rem, rgba(255, 255, 255, 0.1) 5rem,
    rgba(170, 170, 170, 0.1) 6rem, rgba(170, 170, 170, 0.1) 8rem
  ),
  linear-gradient(
    -50deg,
    rgba(60, 60, 60, 0.3),
    transparent 20%,
    transparent 80%,
    rgba(60, 60, 60, 0.3)
  );
  border: 0.15rem solid var(--s12-border-color);
  border-radius: 0.5rem;
  box-shadow: 0 0 1rem 0.2rem var(--s12-border-color),
    inset 0 0 0.4rem 0.1rem rgba(255, 255, 255, 0.7);
  transform: translate(-50%, 20%);
  transition: transform 0.2s, opacity 0.1s, visibility 0.1s;
  pointer-events: none;

  /* If anyone can figure out why these two aren't working that would be great */
  -webkit-backdrop-filter: blur(0.3rem);
  backdrop-filter: blur(0.3rem);
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
  width: 16rem;
  height: 12rem;
  border-radius: 0.5rem;
  margin: 0.5rem;
  padding: 0.5rem;
  transition: background-color 0.5s, border 0.5s;
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
  align-self: flex-start;
  color: white;
  text-shadow: 0 0 5px var(--s12-border-color);
}

.c-s12-subtab-btn__symbol {
  display: flex;
  height: 100%;
  justify-content: center;
  align-items: center;
  align-self: center;
  font-size: 6rem;
  color: white;
  text-shadow: 0 0 5px var(--s12-border-color);
}
</style>