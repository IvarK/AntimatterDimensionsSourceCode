<script>
export default {
  name: "ModernTabButton",
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
        "o-tab-btn--subtabs": this.showSubtabs,
        "o-tab-btn--active": this.isCurrentTab
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
          Math.max(Math.min(Pelle.endState - (this.tab.id) % 4 / 10, 1), 0)
        );
      } else {
        this.tabName = this.tab.name;
      }
    },
    isCurrentSubtab(name) {
      return name === this.tab._currentSubtab.name && player.options.theme !== "S9";
    }
  },
};
</script>

<template>
  <div
    v-if="!isHidden && isAvailable"
    :class="[classObject, tab.config.UIClass]"
  >
    <div class="o-tab-btn-active-indicator" />
    <div
      class="l-tab-btn-inner"
      @click="tab.show(true)"
    >
      {{ tabName }} <i
        v-if="hasNotification"
        class="fas fa-exclamation"
      />
    </div>
    <div
      v-if="showSubtabs"
      class="subtabs"
    >
      <span
        v-for="(subtab, index) in tab.subtabs"
        :key="index"
      >
        <div
          v-if="subtabVisibilities[index]"
          class="o-tab-btn o-tab-btn--subtab"
          :class="
            [tab.config.UIClass,
             {'o-subtab-btn--active': isCurrentSubtab(subtab.name)}]
          "
          @click="subtab.show(true)"
        >
          <span v-html="subtab.symbol">
            <i
              v-if="subtab.hasNotification"
              class="fas fa-exclamation"
            />
          </span>
          <div class="o-subtab__tooltip">
            {{ subtab.name }}
          </div>
        </div>
      </span>
    </div>
  </div>
</template>

<style scoped>
.o-tab-btn::before {
  content: '';
  width: 0;
  height: 100%;
  position: absolute;
  left: 0;
  right: 0;
  background-color: var(--color-accent);
  transition: width 0.15s;
}

.o-tab-btn--active::before {
  width: 0.5rem;
}

.o-tab-btn--infinity::before {
  background-color: var(--color-infinity);
}

.o-tab-btn--eternity::before {
  background-color: var(--color-eternity);
}

.o-tab-btn--reality::before {
  background-color: var(--color-reality);
}

.o-tab-btn--celestials::before {
  background-color: var(--color-celestials);
}

.o-subtab-btn--active {
  border-bottom-width: 0.5rem;
}
</style>
