<script>
import PelleStrike from "./PelleStrike";
import PelleRiftBar from "./PelleRiftBar";

export default {
  name: "PelleRift",
  components: {
    PelleStrike,
    PelleRiftBar
  },
  props: {
    strike: {
      type: Object,
      required: true
    },
  },
  data() {
    return {
      isActive: false,
      isMaxed: false,
      totalFill: new Decimal(),
      resource: new Decimal(),
      hasEffectiveFill: false,
      effects: []
    };
  },
  computed: {
    rift() {
      return this.strike.rift;
    }
  },
  methods: {
    update() {
      const rift = this.rift;
      this.effects = this.rift.effects;
      this.isActive = rift.isActive;
      this.isMaxed = rift.isMaxed || Pelle.hasGalaxyGenerator;
      this.setValue("totalFill", rift.totalFill);
      this.setValue("resource", rift.fillCurrency.value);
      this.hasEffectiveFill = rift.key === "pestilence" && PelleRifts.chaos.milestones[0].canBeApplied;
    },
    // One rift has a number and the others are all Decimals; this reduces boilerplate for setting multiple values
    setValue(key, value) {
      if (typeof value === "number") this[key] = value;
      else this[key].copyFrom(value);
    },
    // One-off formatting function; needs to format large Decimals and a small number assumed to be a percentage
    formatRift(value) {
      return typeof value === "number" ? formatPercents(value, 3) : format(value, 2);
    }
  },
};
</script>

<template>
  <div class="c-pelle-rift">
    <div class="c-pelle-rift-row">
      <div class="c-pelle-rift-column c-pelle-rift-status">
        <h2 class="c-pelle-rift-name-header">
          {{ rift.name }}
        </h2>
        <div class="c-pelle-rift-rift-info-container">
          <div
            v-for="(effect, idx) in effects"
            :key="idx"
          >
            {{ effect || "" }}
          </div>
        </div>
      </div>
      <div class="c-pelle-rift-column">
        <PelleStrike :strike="strike" />
        <PelleRiftBar :rift="rift" />
      </div>
      <div class="c-pelle-rift-status">
        <div class="c-pelle-rift-fill-status">
          <h2 class="c-pelle-rift-name-header">
            {{ rift.name }}
          </h2>
          <div class="c-pelle-rift-rift-info-container">
            Drains {{ rift.drainResource }} to fill.
            <br>
            <template v-if="!isMaxed">
              Current Amount: {{ formatRift(resource) }}
            </template>
            <br>
            Total Filled: {{ formatRift(rift.totalFill) }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.c-pelle-rift {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 1rem;
  border: 0.2rem solid var(--color-pelle--base);
  border-radius: 0.5rem;
  /* transparent crimson */
  box-shadow: inset 0 0 1rem 0.1rem rgba(237, 20, 61, 0.45), 0 0 1rem 0.1rem rgba(237, 20, 61, 0.45;
}

.c-pelle-rift-row {
  display: flex;
  justify-content: center;
  align-items: center;
}

.c-pelle-rift-column {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.c-pelle-rift-rift-info-container {
  height: 5rem;
  color: var(--color-text);
  font-weight: 400;
}

.c-pelle-rift-status {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 26rem;
}

.c-pelle-rift-name-header {
  color: var(--color-pelle--base);
  font-weight: bold;
  padding: 0.2rem;
}


.s-base--metro .c-pelle-rift {
  border-radius: 0;
}
</style>
