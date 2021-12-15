<script>
export default {
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
      hidden: Boolean,
    };
  },
  computed: {
    isCurrentSubtab() {
      return this.tab.id === Tabs.current.id &&
        this.subtab.id === Tabs.current._currentSubtab.id;
    },
    classObject() {
      return {
        "o-primary-btn": true,
        "c-hide-modal-tab-button": true,
        "c-hide-modal-button--active": !this.hidden,
        "c-hide-modal-button--inactive": this.hidden,
        "c-hide-modal-button--always-visible": !this.subtab.config.hidable || this.isCurrentSubtab,
        "c-hide-modal-button--current": this.isCurrentSubtab,
        [`c-hide-modal-tab-button--${this.tab.key}`]: !this.isCurrentSubtab,
      };
    },
  },
  methods: {
    update() {
      this.hidden = this.subtab.isHidden && this.subtab.config.hidable;
    },
    toggleVisibility() {
      this.subtab.toggleVisibility();
    },
  },
};
</script>

<template>
  <div
    :class="classObject"
    @click="toggleVisibility()"
  >
    {{ subtab.name }}
  </div>
</template>
