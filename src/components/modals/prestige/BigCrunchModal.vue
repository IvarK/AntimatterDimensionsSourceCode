<script>
import ModalWrapperChoice from "@/components/modals/ModalWrapperChoice";

export default {
  name: "BigCrunchModal",
  components: {
    ModalWrapperChoice
  },
  data() {
    return {
      gainedInfinities: new Decimal(),
      gainedInfinityPoints: new Decimal(),
    };
  },
  computed: {
    message() {
      return `Upon Infinity, all Dimensions, Dimension Boosts, and Antimatter Galaxies are reset. You will gain
      ${quantify("Infinity Point", this.gainedInfinityPoints, 2, 2)}
      and ${quantify("Infinity", this.gainedInfinities)}.`;
    },
  },
  created() {
    this.$on(GAME_EVENT.INFINITY_RESET_AFTER, this.emitClose);
    this.$on(GAME_EVENT.ETERNITY_RESET_AFTER, this.emitClose);
    this.$on(GAME_EVENT.REALITY_RESET_AFTER, this.emitClose);
  },
  methods: {
    update() {
      this.gainedInfinities = gainedInfinities().round();
      this.gainedInfinityPoints = gainedInfinityPoints().round();
    },
    handleYesClick() {
      bigCrunchResetRequest();
    },
  },
};
</script>

<template>
  <ModalWrapperChoice @confirm="handleYesClick">
    <template #header>
      You are about to Infinity
    </template>
    <div class="c-modal-message__text">
      {{ message }}
    </div>
  </ModalWrapperChoice>
</template>
