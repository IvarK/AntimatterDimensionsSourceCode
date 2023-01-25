<script>
import DesktopIcons from "./desktop-icons";

let isSelectingIcon = false;
export default {
  name: "DesktopIcons",
  data() {
    return {
      DesktopIcons
    };
  },
  mounted() {
    document.body.addEventListener("click", this.clearSelected);
  },
  beforeDestroy() {
    document.body.removeEventListener("click", this.clearSelected);
    this.clearSelected();
  },
  methods: {
    clearSelected() {
      if (isSelectingIcon) return;
      DesktopIcons.selected = -1;
    },
    handleClick(idx) {
      // This makes what everything is doing clearer
      // eslint-disable-next-line no-negated-condition
      if (DesktopIcons.selected !== idx) {
        DesktopIcons.selected = idx;
        isSelectingIcon = true;
        setTimeout(() => isSelectingIcon = false, 0);
      } else {
        DesktopIcons.entries[idx].action();
      }
    }
  }
};
</script>

<template>
  <div class="c-s12-desktop-icons-container">
    <div
      v-for="(icon, idx) in DesktopIcons.entries"
      :key="icon.name"
      class="c-s12-desktop-icon"
      :class="{ 'c-s12-desktop-icon--selected': DesktopIcons.selected === idx, }"
      @click="handleClick(idx)"
    >
      <div class="c-s12-desktop-icon__inner">
        <img
          :src="`images/s12/${icon.image}`"
          class="c-s12-desktop-icon__img"
        >
        <div class="c-s12-desktop-icon__text">
          {{ icon.name }}
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.c-s12-desktop-icons-container {
  --icon-font-size: 1.1rem;
  --icon-line-height: 1.1;
  --icon-size: 4rem;
  --icon-margin: 0.2rem;
  --icon-inner-padding: 0.3rem;
  --total-icon-height: calc(
    var(--icon-size) + var(--icon-margin) * 2 +
    var(--icon-font-size) * var(--icon-line-height) * 2 +
    var(--icon-inner-padding) * 2
  );

  display: inline-flex;
  flex-direction: column;
  flex-wrap: wrap;
  height: calc(100% - var(--s12-taskbar-height));
  position: absolute;
  top: 0;
  left: 0;
  align-items: flex-start;
  user-select: none;
}

.c-s12-desktop-icon {
  overflow: hidden;
  width: 7rem;
  height: var(--total-icon-height);
  position: relative;
  z-index: 0;
  margin: 0.2rem;
}

.c-s12-desktop-icon__inner {
  display: flex;
  overflow: hidden;
  flex-direction: column;
  width: 100%;
  position: relative;
  align-items: center;
  padding: var(--icon-inner-padding);
  cursor: pointer;
}

.c-s12-desktop-icon--selected {
  overflow: visible;
  z-index: 1;
}

.c-s12-desktop-icon__inner::before {
  content: "";
  position: absolute;
  inset: 0;
  z-index: -1;
  opacity: 0;
  background-color: rgba(190, 190, 190, 0.3);
  background-image: var(--s12-background-gradient);
  border: 0.1rem solid white;
  border-radius: 0.5rem;
  transition: opacity 0.2s;
}

.c-s12-desktop-icon:hover .c-s12-desktop-icon__inner::before {
  opacity: 0.5;
}

.c-s12-desktop-icon.c-s12-desktop-icon--selected .c-s12-desktop-icon__inner::before {
  opacity: 1;
}

.c-s12-desktop-icon__img {
  height: var(--icon-size);
  margin: var(--icon-margin);
}

.c-s12-desktop-icon__text {
  overflow: hidden;
  width: 100%;
  font-family: "Segoe UI", Typewriter;
  font-size: var(--icon-font-size);
  font-weight: normal;
  line-height: var(--icon-line-height);
  color: white;
  text-shadow: 0 0 0.3rem var(--s12-border-color);
}
</style>