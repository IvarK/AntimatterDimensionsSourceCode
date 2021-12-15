<script>
import ModalSubtabButton from "@/components/modals/options/hidden-tabs/ModalSubtabButton";

export default {
  components: {
    ModalSubtabButton,
  },
  props: {
    tab: {
      type: Object,
      required: true
    },
  },
  data() {
    return {
      tabName: String,
      subtabs: Object,
      hidden: Boolean,
    };
  },
  computed: {
    styleObjectRow() {
      return {
        "background-color": this.hidden ? "var(--color-bad)" : "var(--color-good)",
      };
    },
    isCurrentTab() {
      return this.tab.id === Tabs.current.id;
    },
    classObjectButton() {
      return {
        "o-primary-btn": true,
        "c-hide-modal-tab-button": true,
        "c-hide-modal-button--active": !this.hidden,
        "c-hide-modal-button--inactive": this.hidden,
        "c-hide-modal-button--always-visible": !this.tab.config.hidable || this.isCurrentTab,
        "c-hide-modal-button--current": this.isCurrentTab,
        [`c-hide-modal-tab-button--${this.tab.key}`]: !this.isCurrentTab,
      };
    },
    unlockedSubtabs() {
      return this.subtabs.filter(sub => sub.isUnlocked);
    }
  },
  methods: {
    update() {
      this.tabName = this.tab.config.name;
      this.subtabs = this.tab.subtabs;
      this.hidden = this.tab.isHidden && this.tab.config.hidable;
    },
    toggleVisibility() {
      // If this tab and all subtabs are hidden, unhide all subtabs too
      if (this.tab.isHidden && this.subtabs.every(t => t.isHidden || !t.isUnlocked)) {
        for (const subtab of this.subtabs) {
          if (subtab.isUnlocked) subtab.toggleVisibility();
        }
        this.tab.unhideTab();
      } else this.tab.toggleVisibility();
    },
    getKey(subtab) {
      return `${this.tab.id} ${subtab.id} ${subtab.isHidden}`;
    }
  },
};
</script>

<template>
  <div
    v-if="tab.isUnlocked"
    class="c-hide-modal-all-subtab-container l-hide-modal-subtab-container"
    :style="styleObjectRow"
  >
    <div
      :class="classObjectButton"
      @click="toggleVisibility()"
    >
      {{ tabName }}
      <br>
      (all subtabs)
    </div>
    <br>
    <ModalSubtabButton
      v-for="subtab in unlockedSubtabs"
      :key="getKey(subtab)"
      :subtab="subtab"
      :tab="tab"
    />
  </div>
</template>
