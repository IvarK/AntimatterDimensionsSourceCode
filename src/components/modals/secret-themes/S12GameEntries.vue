<script>
import S12Games from "./s12-games";

let isSelectingGame = false;
export default {
  name: "S12Games",
  data() {
    return {
      S12Games
    };
  },
  mounted() {
    document.body.addEventListener("click", this.clearSelected);
  },
  beforeDestroy() {
    document.body.removeEventListener("click", this.clearSelected);
    this.clearSelected();
  },
  methods: {
    clearSelected() {
      if (isSelectingGame) return;
      S12Games.selected = -1;
    },
    handleClick(idx) {
      // This makes what everything is doing clearer
      // eslint-disable-next-line no-negated-condition
      if (S12Games.selected !== idx) {
        S12Games.selected = idx;
        isSelectingGame = true;
        setTimeout(() => isSelectingGame = false, 0);
      } else {
        window.open(S12Games.entries[idx].link);
      }
    }
  }
};
</script>

<template>
  <div class="c-s12-games-container">
    <div
      v-for="(game, idx) in S12Games.entries"
      :key="game.name"
      class="c-s12-game"
      :class="{ 'c-s12-game--selected': S12Games.selected === idx, }"
      @click="handleClick(idx)"
    >
      <div class="c-s12-game__inner">
        <img
          :src="`images/s12/${game.image}`"
          class="c-s12-game__img"
        >
        <div class="c-s12-game__text">
          {{ game.name }}
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.c-s12-games-container {
  --icon-font-size: 1.1rem;
  --icon-line-height: 1.1;
  --icon-size: 8rem;
  --icon-margin: 0.4rem;
  --icon-inner-padding: 0.5rem;
  --total-icon-height: calc(
    var(--icon-size) + var(--icon-margin) * 2 +
    var(--icon-font-size) * var(--icon-line-height) * 2 +
    var(--icon-inner-padding) * 2
  );
  --total-game-width: 10rem;
  --game-margin: 0.2rem;

  display: flex;
  overflow-y: auto;
  flex: 1 0 auto;
  flex-wrap: wrap;
  width: calc(4 * (var(--total-game-width) + var(--game-margin) * 2));
  height: 40rem;
  user-select: none;
}

.c-s12-game {
  overflow: hidden;
  width: var(--total-game-width);
  height: var(--total-icon-height);
  position: relative;
  z-index: 0;
  margin: var(--game-margin);
}

.c-s12-game__inner {
  display: flex;
  overflow: hidden;
  flex-direction: column;
  width: 100%;
  position: relative;
  align-items: center;
  padding: var(--icon-inner-padding);
  cursor: pointer;
}

.c-s12-game--selected {
  overflow: visible;
  z-index: 1;
}

.c-s12-game__inner::before {
  content: "";
  position: absolute;
  inset: 0;
  z-index: -1;
  opacity: 0;
  background-image: linear-gradient(rgba(13, 120, 242, 0.2), rgba(13, 120, 242, 0.25));
  border: 0.1rem solid #82a5d0;
  border-radius: 0.5rem;
  box-shadow: inset 0 0 0.2rem 0.1rem rgba(255, 255, 255, 0.7);
  transition: opacity 0.2s;
}

.c-s12-game:hover .c-s12-game__inner::before {
  opacity: 0.5;
}

.c-s12-game.c-s12-game--selected .c-s12-game__inner::before {
  opacity: 1;
}

.c-s12-game__img {
  height: var(--icon-size);
  margin: var(--icon-margin);
}

.c-s12-game__text {
  overflow: hidden;
  width: 100%;
  text-align: center;
  font-family: "Segoe UI", Typewriter;
  font-size: var(--icon-font-size);
  font-weight: normal;
  line-height: var(--icon-line-height);
  color: black;
}
</style>