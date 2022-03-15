<script>
export default {
  name: "NewGame",
  data() {
    return {
      plusRecord: 0,
      minusRecord: 0,
      opacity: 0,
      visible: false,
    };
  },
  computed: {
    ngRange() {
      return [...Array(3 + this.plusRecord - this.minusRecord).keys()]
        .map(x => x - 1 + this.minusRecord)
        .filter(Boolean);
    },
    style() {
      return {
        opacity: this.opacity,
        visibility: this.visible ? "visible" : "hidden"
      };
    }
  },
  methods: {
    update() {
      this.plusRecord = NG.plusRecord;
      this.minusRecord = NG.minusRecord;
      this.visible = GameEnd.endState > 13.75 && !GameEnd.removeAdditionalEnd;
      this.opacity = (GameEnd.endState - 13.75) * 2;
    },
    ngString(i) {
      if (!i) return "";
      return `NewGame${i > 0 ? "+" : "-"}${Math.abs(i) > 1 ? Math.abs(i) : ""}`;
    },
    startNewGame(i) {
      NG.startNewGame(i);
    }
  }
};
</script>

<template>
  <div
    class="c-new-game-container"
    :style="style"
  >
    <h1>Wanna start over?</h1>
    Highest NG+: {{ plusRecord }}<br>
    Highest NG-: {{ minusRecord }}<br>
    <div class="c-new-game-button-container">
      <button
        v-for="i in ngRange"
        :key="i"
        class="c-new-game-button"
        @click="startNewGame(i)"
      >
        Start a {{ ngString(i) }}
      </button>
    </div>
  </div>
</template>

<style scoped>
  .c-new-game-container {
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    z-index: 9;
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    background-color: black;
    box-shadow: 0 0 20px 1px black;
  }
  .c-new-game-button-container {
    display: flex;
    align-items: stretch;
    flex-direction: column;
  }

  button {
    margin-top: 1rem;
    padding: 1rem;
    font-family: Typewriter;
    background: grey;
    border: black;
    border-radius: 5px;
    cursor: pointer;
  }
</style>
