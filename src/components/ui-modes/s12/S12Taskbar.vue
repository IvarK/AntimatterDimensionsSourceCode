<script>
import S12Subtabs from "./S12Subtabs";
import TaskbarIcon from "./TaskbarIcon";

import { S12Windows } from "./windows";

const startupSound = new Audio("audio/s12-startup.mp3");
export default {
  name: "S12Taskbar",
  components: {
    TaskbarIcon,
    S12Subtabs,
  },
  data() {
    return {
      isHidden: false,
      tabVisibilities: [],
      S12Windows,
      startupSound,
    };
  },
  computed: {
    tabs: () => Tabs.newUI
  },
  methods: {
    update() {
      this.isHidden = AutomatorData.isEditorFullscreen;
      this.tabVisibilities = Tabs.newUI.map(x => !x.isHidden && x.isAvailable);
    },
  },
};
</script>

<template>
  <span
    v-if="!isHidden"
  >
    <div class="c-taskbar">
      <img
        class="c-start-icon"
        src="images/s12/win7-start-menu-inactive.png"
        @click="startupSound.play()"
      >
      <template
        v-for="(tab, tabPosition) in tabs"
      >
        <TaskbarIcon
          v-if="tabVisibilities[tabPosition]"
          :key="tab.name"
          :tab="tab"
          :tab-position="tabPosition"
        />
      </template>
      <div
        class="c-s12-show-desktop"
        @click="S12Windows.isMinimised = true;"
      />
    </div>
    <template
      v-for="(tab, tabPosition) in tabs"
    >
      <S12Subtabs
        v-if="tabVisibilities[tabPosition]"
        :key="tab.name"
        :tab="tab"
      />
    </template>
  </span>
</template>

<style scoped>
.c-taskbar {
  display: flex;
  width: 100%;
  height: 4.5rem;
  background-color: rgba(120, 120, 120, 0.15);
  background-image:
  repeating-linear-gradient(
    50deg,
    rgba(170, 170, 170, 0.1), rgba(170, 170, 170, 0.1) 2rem,
    rgba(255, 255, 255, 0.1) 4rem, rgba(255, 255, 255, 0.1) 5rem,
    rgba(170, 170, 170, 0.1) 6rem, rgba(170, 170, 170, 0.1) 8rem
  ),
  linear-gradient(
    to right,
    rgba(40, 40, 40, 0.4),
    transparent 10%,
    transparent 70%,
    rgba(0, 0, 0, 0.4) 90%
  );
  border-top: 0.15rem solid var(--s12-border-color);

  -webkit-backdrop-filter: blur(0.3rem);

  backdrop-filter: blur(0.3rem);
}

.c-taskbar::before {
  content: "";
  display: inline-block;
  width: 110%;
  height: 110%;
  position: absolute;
  box-shadow: inset 0 0 0.3rem 0.1rem rgba(255, 255, 255, 0.5);
  margin-right: -5%;
  margin-left: -5%;
  pointer-events: none;
}

.c-start-icon {
  height: 100%;
  margin: 0 2rem 0 1rem;
  cursor: pointer;
}

.c-s12-show-desktop {
  width: 1rem;
  height: 100%;
  position: absolute; right: 0;
  border: 0.15rem solid var(--s12-border-color);
  border-style: none none solid solid;
  border-radius: 0.2rem 0 0 0.2rem;
  cursor: pointer;
}

.c-s12-show-desktop::before {
  content: "";
  display: block;
  width: 200%;
  height: 100%;
  border-radius: inherit;
  box-shadow: inset 0 0 0.5rem 0.1rem rgba(255, 255, 255, 0.5);
  transition: box-shadow 0.4s;
}

.c-s12-show-desktop:hover::before {
  box-shadow: inset 0 0 0.5rem 0.1rem white;
}
</style>
