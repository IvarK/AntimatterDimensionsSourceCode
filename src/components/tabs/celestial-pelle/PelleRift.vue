<script>
import PelleRiftBar from "./PelleRiftBar";
import PelleStrike from "./PelleStrike";

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
  border: var(--var-border-width, 0.2rem) solid var(--color-pelle--base);
  border-radius: var(--var-border-radius, 0.5rem);

  /* transparent crimson */
  box-shadow: inset 0 0 1rem 0.1rem rgba(237, 20, 61, 45%), 0 0 1rem 0.1rem rgba(237, 20, 61, 45%);
  margin-top: 1rem;
}

.t-s1 .c-pelle-rift {
  box-shadow: none;
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
  font-weight: 400;
  color: var(--color-text);
}

.c-pelle-rift-status {
  display: flex;
  flex-direction: column;
  width: 26rem;
  align-items: center;
}

.c-pelle-rift-name-header {
  font-weight: bold;
  color: var(--color-pelle--base);
  padding: 0.2rem;
}
</style>
