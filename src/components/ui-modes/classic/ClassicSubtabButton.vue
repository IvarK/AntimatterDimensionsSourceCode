<script>
export default {
  name: "ClassicSubtabButton",
  props: {
    subtab: {
      type: Object,
      required: true
    },
    tab: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      isAvailable: false,
      hasNotification: false,
      isCurrentSubtab: false,
      tabName: ""
    };
  },
  computed: {
    classObject() {
      return {
        "o-subtab-btn--active": this.isCurrentSubtab,
        "o-tab-btn--infinity": this.tab.name === "Infinity",
        "o-tab-btn--eternity": this.tab.name === "Eternity",
        "o-tab-btn--reality": this.tab.name === "Reality",
        "o-tab-btn--celestial": this.tab.name === "Celestials"
      };
    },
  },
  methods: {
    update() {
      this.isAvailable = this.subtab.isAvailable;
      this.hasNotification = this.subtab.hasNotification;
      this.isCurrentSubtab = this.subtab.isOpen && player.options.theme !== "S9";
      this.tabName = Pelle.transitionText(
        this.subtab.name,
        this.subtab.name,
        Math.max(Math.min(GameEnd.endState - (this.subtab.id) % 4 / 10, 1), 0)
      );
    }
  },
};
</script>

<template>
  <button
    v-if="isAvailable"
    class="o-tab-btn o-tab-btn--secondary"
    :class="classObject"
    @click="subtab.show(true)"
  >
    {{ tabName }}
    <i
      v-if="hasNotification"
      class="fas fa-exclamation"
    />
  </button>
</template>

<style scoped>
.o-tab-btn {
  height: 2.5rem;
  vertical-align: middle;
  padding-top: 0.2rem;
}

.o-subtab-btn--active {
  height: 2.5rem;
  border-bottom-width: 0.4rem;
}

.s-base--metro .o-subtab-btn--active {
  border-bottom-width: 0.4rem;
}
</style>
