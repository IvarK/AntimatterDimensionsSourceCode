<script>
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
      isAvailable: false,
      isHidden: false,
      subtabVisibilities: [],
      showSubtabs: false,
      hasNotification: false,
      tabName: ""
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
    }
  },
  methods: {
    update() {
      this.isAvailable = this.tab.isAvailable;
      this.isHidden = this.tab.isHidden;
      this.subtabVisibilities = this.tab.subtabs.map(x => x.isAvailable);
      this.showSubtabs = this.isAvailable && this.subtabVisibilities.length >= 1;
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
    :class="{
      'c-taskbar-icon': true,
      'c-taskbar-icon--active': isCurrentTab
    }"
    :title="tab.name"
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
  </div>
</template>

<style scoped>
.c-taskbar-icon {
  display: flex;
  width: 6rem;
  height: 100%;
  position: relative;
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
</style>