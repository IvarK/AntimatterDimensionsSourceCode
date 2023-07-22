<script>
export default {
  name: "PlanetButton",
  data() {
    return {
      gainedPP: new Decimal(0)
    };
  },
  computed: {
    buttonClassObject() {
      return {
        "o-planet-button": true
      };
    }
  },
  methods: {
    update() {
      this.gainedPP.copyFrom(gainedPlanetPoints());
    },
    explore() {
      planetResetRequest();
    }
  }
};
</script>

<template>
  <button
    :class="buttonClassObject"
    class="o-prestige-button"
    @click="explore"
  >
    Explore the planets for
    <span>{{ format(gainedPP, 2) }}</span>
    Planet {{ pluralize("Point", gainedPP) }}
  </button>
</template>