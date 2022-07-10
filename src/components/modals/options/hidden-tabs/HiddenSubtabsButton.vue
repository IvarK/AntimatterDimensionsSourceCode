<script>
export default {
  name: "HiddenSubtabsButton",
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
      hidable: false,
      hidden: false,
    };
  },
  computed: {
    isCurrentSubtab() {
      return this.tab.id === Tabs.current.id &&
        this.subtab.id === Tabs.current._currentSubtab.id;
    },
    classObject() {
      return {
        "c-hide-modal-tab-button": true,
        "c-hide-modal-button--active": !this.hidden,
        "c-hide-modal-button--inactive": this.hidden,
        "c-hide-modal-button--always-visible": !this.hidable || this.isCurrentSubtab,
        [`c-hide-modal-tab-button--${this.tab.key}`]: !this.isCurrentSubtab,
      };
    },
  },
  methods: {
    update() {
      this.hidable = this.subtab.hidable;
      this.hidden = this.subtab.isHidden && this.hidable;
    },
    toggleVisibility() {
      this.subtab.toggleVisibility();
    },
  },
};
</script>

<template>
  <div
    v-tooltip="hidable ? isCurrentSubtab ? 'You cannot hide the tab you are on' : '' : 'Options tabs cannot be hidden'"
    :class="classObject"
    @click="toggleVisibility"
  >
    <div class="l-hide-modal-button--subtab-container">
      <div
        class="l-hide-modal-button--subtab-icon"
        v-html="subtab.symbol"
      />
      <div class="l-hide-modal-button--subtab-name">
        {{ subtab.name }}
      </div>
    </div>
  </div>
</template>

<style scoped>
.l-hide-modal-button--subtab-container {
  position: relative;
  width: 100%;
  height: 100%;
}

.l-hide-modal-button--subtab-icon {
  filter: opacity(40%);
  font-size: 2rem;
  position: absolute;
  width: 2.6rem;
  height: 100%;
  left: -5%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.l-hide-modal-button--subtab-name {
  position: absolute;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>
