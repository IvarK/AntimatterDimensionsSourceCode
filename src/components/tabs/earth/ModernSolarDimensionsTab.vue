<script>
import ModernSolarDimensionRow from "@/components/tabs/earth/ModernSolarDimensionRow";
import PrimaryButton from "@/components/PrimaryButton";

export default {
  name: "ModernSolarDimensionsTab",
  components: {
    ModernSolarDimensionRow,
    PrimaryButton
  },
  data() {
    return {
      watts: new Decimal(0),
      wattsPerSecond: new Decimal(0)
    };
  },
  methods: {
    update() {
      this.watts.copyFrom(Currency.watts);
      this.wattsPerSecond.copyFrom(SolarDimension(1).productionPerSecond);
    },
    maxAll() {
      maxAllSolarDimensions();
    }
  }
};
</script>

<template>
  <div class="l-time-dim-tab l-centered-vertical-tab">
    <div class="c-subtab-option-container">
      <PrimaryButton
        class="o-primary-btn--subtab-option"
        @click="maxAll"
      >
        Max all
      </PrimaryButton>
    </div>
    <div>
      <p>
        You have gained
        <span class="c-solar-dim-description__accent">{{ format(watts, 2, 1) }}</span> Watts.
      </p>
    </div>
    <div>You are getting {{ format(wattsPerSecond, 2, 0) }} Watts per second.</div>
    <div class="l-dimensions-container">
      <ModernSolarDimensionRow
        v-for="tier in 8"
        :key="tier"
        :tier="tier"
      />
    </div>
  </div>
</template>

<style scoped>
.c-solar-dim-description__accent {
  font-size: 3.5rem;
  color: var(--color-earth);
}

.t-metro .c-solar-dim-description__accent,
.t-s8 .c-solar-dim-description__accent {
  text-shadow: 0 0 0.1rem rgba(0, 0, 0, 50%), -0.1rem 0.1rem 0.1rem black;
}

.t-dark .c-time-dim-description__accent,
.t-amoled .c-time-dim-description__accent,
.t-amoled-metro .c-time-dim-description__accent,
.t-s6 .c-time-dim-description__accent,
.t-s10 .c-time-dim-description__accent,
.t-s11 .c-time-dim-description__accent {
  color: var(--color-earth);
  text-shadow: 0 0 0.7rem var(--color-earth);
}
</style>