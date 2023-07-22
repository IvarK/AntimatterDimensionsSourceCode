<script>
import ResetModal from "@/components/modals/prestige/ResetModal";

export default {
  name: "PlanetsModal",
  components: {
    ResetModal
  },
  data() {
    return {
      gainedPlanetPoints: new Decimal()
    };
  },
  computed: {
    gainedResources() {
      return `You will gain ${quantify("Planet Point", this.gainedPlanetPoints, 2, 0)}.`;
    }
  },
  methods: {
    update() {
      this.gainedPlanetPoints = gainedPlanetPoints().round();
    },
    handleYesClick() {
      planetsReset();
    },
  },
};
</script>

<template>
  <ResetModal
    header="You are about to Explore"
    message="Nice going, Genghis. I bet that'll last a long time"
    :gained-resources="gainedResources"
    :confirm-fn="handleYesClick"
  />
</template>