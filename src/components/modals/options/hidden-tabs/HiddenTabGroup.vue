<script>
import HiddenSubtabsButton from "@/components/modals/options/hidden-tabs/HiddenSubtabsButton";

export default {
  name: "HiddenTabGroup",
  components: {
    HiddenSubtabsButton,
  },
  props: {
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
      isVisible: false,
      isHidable: false,
      isHidden: false,
      unlockedSubtabs: [],
    };
  },
  computed: {
    tabName() {
      return this.tab.name;
    },
    subtabs() {
      return this.tab.subtabs;
    },
    isCurrentTab() {
      return this.tab.id === Tabs.current.id;
    },
    alwaysVisible() {
      return !this.isHidable || this.isCurrentTab;
    },
    rowClass() {
      return {
        "c-hide-modal-all-subtab-container": true,
        "l-hide-modal-subtab-container": true,
        "c-hidden-tabs-background__visible": !this.isHidden,
        "c-hidden-tabs-background__hidden": this.isHidden,
        "c-hidden-tabs-background__always-visible": this.alwaysVisible
      };
    },
    rowVisibleIndicatorClass() {
      return {
        "c-indicator-icon": true,
        "fas": true,
        "fa-check": !this.isHidden,
        "fa-times": this.isHidden,
        "fa-exclamation": this.alwaysVisible,
      };
    },
    rowVisibleIndicatorTooltip() {
      if (this.isHidden) return "Click to unhide tab";
      if (!this.alwaysVisible) return "Click to hide tab";
      return "This tab cannot be hidden";
    },
  },
  methods: {
    update() {
      const tab = this.tab;
      this.isVisible = tab.isUnlocked;
      this.isHidable = tab.hidable;
      this.isHidden = tab.isHidden && this.isHidable;
      this.unlockedSubtabs = this.subtabs.filter(sub => sub.isUnlocked);
    },
    toggleVisibility() {
      if (!this.changeEnabled) return;
      // If this tab and all unlocked subtabs are hidden, unhide all subtabs in addition to the tab
      if (this.tab.isHidden && this.unlockedSubtabs.every(t => t.isHidden)) {
        for (const subtab of this.unlockedSubtabs) {
          subtab.toggleVisibility();
        }
        this.tab.unhideTab();
      } else {
        this.tab.toggleVisibility();
      }
    }
  },
};
</script>

<template>
  <div
    v-if="isVisible"
    :class="rowClass"
    @click.self="toggleVisibility"
  >
    <HiddenSubtabsButton
      v-for="(subtab, i) in unlockedSubtabs"
      :key="i"
      :subtab="subtab"
      :tab="tab"
      :change-enabled="changeEnabled"
    />
    <div
      v-tooltip="rowVisibleIndicatorTooltip"
      :class="rowVisibleIndicatorClass"
      @click="toggleVisibility"
    />
  </div>
</template>

<style scoped>
.c-indicator-icon {
  width: 2rem;
  position: absolute;
  top: 0;
  right: 0;
  color: black;
  text-shadow: none;
  padding: 0.2rem;
}

.c-hidden-tabs-background__visible {
  background-color: var(--color-good);
}

.c-hidden-tabs-background__hidden {
  background-color: var(--color-gh-purple);
}

.c-hidden-tabs-background__always-visible {
  background-color: var(--color-disabled);
  cursor: default;
}
</style>
