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
    },
    changeEnabled: {
      type: Boolean,
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
    isModernUI() {
      return this.$viewModel.newUI;
    },
  },
  methods: {
    update() {
      this.hidable = this.subtab.hidable;
      this.hidden = this.subtab.isHidden && this.hidable;
    },
    toggleVisibility() {
      if (!this.changeEnabled) return;
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
    <div class="l-hide-modal-button">
      <div
        v-if="isModernUI"
        class="l-hide-modal-button__subtab-icon"
        v-html="subtab.symbol"
      />
      <div class="l-hide-modal-button__subtab-name">
        {{ subtab.name }}
      </div>
    </div>
  </div>
</template>

<style scoped>
.l-hide-modal-button {
  display: flex;
  flex-flow: row;
  align-items: center;
}

.l-hide-modal-button__subtab-icon {
  font-size: 1.5rem;
  width: 2rem;
  margin: 0.2rem;
}

.l-hide-modal-button__subtab-name {
  width: 8.2rem;
}
</style>
