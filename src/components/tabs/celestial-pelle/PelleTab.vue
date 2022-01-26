<template>
  <div class="l-pelle-celestial-tab">
    <div v-if="isDoomed">
      <div class="c-pelle-upgrade-container">
        <PelleStrike
          v-for="strike in strikes"
          :key="strike.config.id"
          :strike="strike"
        />
      </div>
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
      <div class="c-pelle-upgrade-container">
        <PelleUpgradeVue
          v-for="upgrade in upgrades"
          :key="upgrade.config.id"
          :upgrade="upgrade"
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
export default {
  components: {
    ArmageddonButton,
    PelleUpgradeVue,
    PelleStrike
  },
  data() {
    return {
      isDoomed: false,
      remnants: 0,
      realityShards: new Decimal(0)
    };
  },
  methods: {
    update() {
      this.isDoomed = Pelle.isDoomed;
      this.remnants = Pelle.cel.remnants;
      this.realityShards.copyFrom(Pelle.cel.realityShards);
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
    upgrades: () => PelleUpgrade.all,
    strikes: () => PelleStrikes.all.filter(s => s.hasStrike),
  }
};
</script>

<style scoped>
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