<script>
import PelleUpgradeVue from "./PelleUpgrade";

export default {
  name: "PelleUpgradePanel",
  components: {
    PelleUpgradeVue,
  },
  props: {
    isHovering: {
      type: Boolean,
      required: true
    }
  },
  data() {
    return {
      showBought: false,
      isCollapsed: false,
    };
  },
  computed: {
    collapseIcon() {
      return this.isCollapsed
        ? "fas fa-expand-arrows-alt"
        : "fas fa-compress-arrows-alt";
    },
    rebuyables: () => PelleUpgrade.rebuyables,
    upgrades() { return PelleUpgrade.singles.filter(u => !u.isBought); },
    boughtUpgrades() { return PelleUpgrade.singles.filter(u => u.isBought); },
    visibleUpgrades() { return this.upgrades.slice(0, 5); },
    fadedUpgrades() { return this.upgrades.slice(5, 10); },
    allUpgrades() {
      let upgrades = [];
      if (this.showBought) upgrades = this.boughtUpgrades;
      upgrades = upgrades.concat(this.visibleUpgrades);
      return upgrades;
    },
  },
  methods: {
    update() {
      this.showBought = Pelle.cel.showBought;
      this.isCollapsed = player.celestials.pelle.collapsed.upgrades;
    },
    toggleBought() {
      Pelle.cel.showBought = !Pelle.cel.showBought;
      this.$recompute("upgrades");
    },
    toggleCollapse() {
      player.celestials.pelle.collapsed.upgrades = !this.isCollapsed;
    }
  }
};
</script>

<template>
  <div class="l-pelle-panel-container">
    <div class="c-pelle-panel-title">
      <i
        :class="collapseIcon"
        class="c-collapse-icon-clickable"
        @click="toggleCollapse"
      />
      Pelle Upgrades
    </div>
    <div
      v-if="!isCollapsed"
      class="l-pelle-content-container"
    >
      <div class="c-pelle-upgrade-container">
        <PelleUpgradeVue
          v-for="upgrade in rebuyables"
          :key="upgrade.config.id"
          :upgrade="upgrade"
          :show-improved-estimate="isHovering"
        />
      </div>
      <button
        class="o-pelle-button"
        @click="toggleBought"
      >
        {{ showBought ? "Showing bought upgrades" : "Bought upgrades hidden" }}
      </button>
      <div
        v-if="allUpgrades.length"
        class="c-pelle-upgrade-container"
      >
        <PelleUpgradeVue
          v-for="upgrade in allUpgrades"
          :key="upgrade.config.id"
          :upgrade="upgrade"
          :show-improved-estimate="isHovering"
        />
        <PelleUpgradeVue
          v-for="upgrade in fadedUpgrades"
          :key="upgrade.config.id"
          :upgrade="upgrade"
          faded
        />
      </div>
      <div v-else>
        No upgrades to show!
      </div>
    </div>
  </div>
</template>

<style scoped>
.c-pelle-panel-title {
  font-weight: bold;
  font-size: 3rem;
  color: var(--color-pelle--base);
}

.l-pelle-panel-container {
  padding: 1rem;
  margin: 1rem;
  border: 2px solid var(--color-pelle--base);
  border-radius: 5px;
  user-select: none;
  background-color: #1a1a1a;
  color: #888888;
}

.l-pelle-content-container {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.o-pelle-button {
  background: var(--color-prestige--accent);
  color: var(--color-text);
  border: 1px solid var(--color-pelle--base);
  border-radius: 5px;
  padding: 1rem;
  font-family: Typewriter;
  margin: 0 1rem;
  margin-bottom: 1rem;
  cursor: pointer;
  transition-duration: 0.12s;
}

.o-pelle-button:hover {
  box-shadow: 1px 1px 3px var(--color-pelle--base);
}

.c-pelle-upgrade-container {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  max-width: 110rem;
}

.c-collapse-icon-clickable {
  cursor: pointer;
}
</style>
