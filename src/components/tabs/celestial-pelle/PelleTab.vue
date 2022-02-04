<template>
  <div class="l-pelle-celestial-tab">
    <div v-if="isDoomed">
      <button
        v-if="strikes.length"
        class="o-pelle-button"
        @click="toggleCompact"
      >
        {{ compact ? "Show all Strikes and Rifts" : "Condense Strikes and Rifts" }}
      </button>
      <div class="c-pelle-upgrade-container">
        <PelleStrike
          v-for="strike in strikes"
          :key="strike.config.id"
          :strike="strike"
          :compact="compact"
        />
      </div>
      <GalaxyGeneratorVue v-if="hasGalaxyGenerator" />
      You have <span class="c-remnants-amount">{{ format(remnants, 2, 0) }}</span> remnants <br>
      You have <span class="c-remnants-amount">{{ format(realityShards, 2, 0) }}</span> Reality Shards
      <ArmageddonButton />
      <div class="c-pelle-upgrade-container">
        <PelleUpgradeVue
          v-for="upgrade in rebuyables"
          :key="upgrade.config.id"
          :upgrade="upgrade"
        />
      </div>
      <button
        class="o-pelle-button"
        @click="toggleBought"
      >
        {{ !showBought ? "Show bought upgrades" : "Hide bought upgrades" }}
      </button>
      <div class="c-pelle-upgrade-container">
        <PelleUpgradeVue
          v-for="upgrade in allUpgrades"
          :key="upgrade.config.id"
          :upgrade="upgrade"
        />
        <PelleUpgradeVue
          v-for="upgrade in fadedUpgrades"
          :key="upgrade.config.id"
          :upgrade="upgrade"
          faded
        />
      </div>
    </div>
    <button
      v-else
      class="c-pelle-doom-button"
      @click="getDoomedScrub"
    >
      Doom your Reality
    </button>
  </div>
</template>

<script>
import ArmageddonButton from "./ArmageddonButton";
import PelleStrike from "./PelleStrike.vue";
import PelleUpgradeVue from "./PelleUpgrade.vue";
import GalaxyGeneratorVue from "./GalaxyGenerator.vue";
export default {
  components: {
    ArmageddonButton,
    PelleUpgradeVue,
    PelleStrike,
    GalaxyGeneratorVue
  },
  data() {
    return {
      isDoomed: false,
      remnants: 0,
      realityShards: new Decimal(0),
      compact: false,
      showBought: false,
      hasGalaxyGenerator: false,
    };
  },
  methods: {
    update() {
      this.isDoomed = Pelle.isDoomed;
      this.remnants = Pelle.cel.remnants;
      this.realityShards.copyFrom(Pelle.cel.realityShards);
      this.compact = Pelle.cel.compact;
      this.showBought = Pelle.cel.showBought;
      this.hasGalaxyGenerator = PelleRifts.war.hasMilestone(2) || GalaxyGenerator.spentGalaxies > 0;
    },
    toggleCompact() {
      Pelle.cel.compact = !Pelle.cel.compact;
    },
    toggleBought() {
      Pelle.cel.showBought = !Pelle.cel.showBought;
      this.$recompute("upgrades");
    },
    getDoomedScrub() {
      player.celestials.pelle.doomed = true;
      Pelle.armageddon(false);
      Glyphs.unequipAll();
      respecTimeStudies(true);
      Currency.infinityPoints.reset();
      player.infMult = 0;
      Autobuyer.bigCrunch.mode = AUTO_CRUNCH_MODE.AMOUNT;
      disChargeAll();
    },
  },
  computed: {
    rebuyables: () => PelleRebuyableUpgrade.all,
    upgrades() { return PelleUpgrade.all.filter(u => !u.isBought); },
    boughtUpgrades() { return PelleUpgrade.all.filter(u => u.isBought); },
    visibleUpgrades() { return this.upgrades.slice(0, 5); },
    fadedUpgrades() { return this.upgrades.slice(5, 10); },
    allUpgrades() {
      let upgrades = [];
      if (this.showBought) upgrades = this.boughtUpgrades;
      upgrades = upgrades.concat(this.visibleUpgrades);
      return upgrades;
    },
    strikes: () => PelleStrikes.all.filter(s => s.hasStrike),
  }
};
</script>

<style scoped>
  .o-pelle-button {
    background: black;
    color: white;
    border: 1px solid var(--color-pelle--base);
    border-radius: 5px;
    padding: 1rem;
    font-family: Typewriter;
    margin-bottom: 1rem;
    cursor: pointer;
    transition-duration: 0.12s;
  }

  .o-pelle-button:hover {
    box-shadow: 1px 1px 3px var(--color-pelle--base);
  }
  .c-remnants-amount {
    font-weight: bold;
    font-size: 2rem;
    color: var(--color-pelle--base);
  }

  .c-pelle-upgrade-container {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
  }
</style>