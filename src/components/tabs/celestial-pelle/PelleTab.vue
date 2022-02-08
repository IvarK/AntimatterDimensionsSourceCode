<script>
import ArmageddonButton from "./ArmageddonButton";
import PelleStrike from "./PelleStrike.vue";
import PelleUpgradeVue from "./PelleUpgrade.vue";
import GalaxyGeneratorVue from "./GalaxyGenerator.vue";

export default {
  name: "PelleTab",
  components: {
    ArmageddonButton,
    PelleStrike,
    PelleUpgradeVue,
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
      isHovering: false,
    };
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
    showModal() {
      Modal.pelleEffects.show();
    }
  }
};
</script>

<template>
  <div class="l-pelle-celestial-tab">
    <div v-if="isDoomed">
      <div class="button-container">
        <button
          v-if="strikes.length"
          class="o-pelle-button"
          @click="toggleCompact"
        >
          {{ compact ? "Show all Strikes and Rifts" : "Condense Strikes and Rifts" }}
        </button>
        <button
          class="o-pelle-button"
          @click="showModal"
        >
          Show effects in Doomed Reality
        </button>
      </div>
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
      <span
        @mouseover="isHovering = true"
        @mouseleave="isHovering = false"
      >
        <ArmageddonButton />
      </span>
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
        {{ !showBought ? "Show bought upgrades" : "Hide bought upgrades" }}
      </button>
      <div class="c-pelle-upgrade-container">
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
    </div>
    <button
      v-else
      class="pelle-doom-button"
      @click="getDoomedScrub"
    >
      Doom<br>Your<br>Reality
      <div class="pelle-icon-container">
        <span class="pelle-icon">♅</span>
      </div>
    </button>
  </div>
</template>

<style scoped>
  .o-pelle-button {
    background: black;
    color: white;
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

  .pelle-doom-button {
    font-family: Typewriter;
    padding: 1rem;
    background: black;
    color: var(--color-pelle--base);
    font-size: 3rem;
    border: 2px solid var(--color-pelle--base);
    border-radius: 5px;
    width: 20rem;
    cursor: pointer;
    transition-duration: 0.4s;
  }

  .pelle-doom-button:hover {
    box-shadow: 0px 0px 20px var(--color-pelle--base);
  }


  .pelle-icon-container {
    background: white;
    border-radius: 50%;
    height: 15rem;
    width: 15rem;
    margin: auto;
    margin-top: 3rem;
    display: flex;
    justify-content: center;
    align-items: center;
    border: 4px solid var(--color-pelle--base);
    font-size: 10rem;
    transition-duration: 0.4s;
    text-shadow: 0px 0px 15px #9b0101;
    box-shadow: 0px 0px 15px #9b0101;
  }

  .pelle-doom-button:hover .pelle-icon-container {
    background: black;
    color: var(--color-pelle--base);
  }

  @keyframes roll {
    100% { transform: rotateY(360deg) }
  }

  .pelle-icon {
    animation: roll infinite 8s linear;
  }
</style>
