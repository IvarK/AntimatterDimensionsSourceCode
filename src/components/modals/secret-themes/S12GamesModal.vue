<script>
import ModalWrapper from "@/components/modals/ModalWrapper";
import S12GameEntries from "./S12GameEntries";

import S12Games from "./s12-games";

export default {
  name: "S12GamesModal",
  components: {
    ModalWrapper,
    S12GameEntries,
  },
  data() {
    return {
      S12Games,
    };
  },
  methods: {
    update() {
      if (this.$viewModel.theme !== "S12") EventHub.dispatch(GAME_EVENT.CLOSE_MODAL);
    }
  }
};
</script>

<template>
  <ModalWrapper class="c-modal-s12-games">
    <div class="c-modal__title">
      Games
    </div>
    <S12GameEntries />
    <div class="c-modal-s12-games__magnified-display">
      <template v-if="S12Games.selected !== -1">
        <img
          class="c-modal-s12-games__magnified-display__img"
          :src="`images/s12/${S12Games.entries[S12Games.selected].image}`"
        >
        <b class="c-modal-s12-games__magnified-display__text">
          {{ S12Games.entries[S12Games.selected].name }}
        </b>
      </template>
    </div>
  </ModalWrapper>
</template>

<style scoped>
.c-modal-s12-games {
  display: flex;
  width: 64rem;
}

.c-modal-s12-games__magnified-display {
  width: 100%;
  align-self: stretch;
  text-align: center;
  border-left: 0.1rem solid #86b2df;
  padding: 2rem;
}

.c-modal-s12-games__magnified-display__img {
  width: 100%;
  margin: 2rem 0 6rem;
}
</style>
