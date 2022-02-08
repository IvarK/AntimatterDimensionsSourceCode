<script>
export default {
  name: "NewGame",
  data() {
    return {
      plusRecord: 0,
      minusRecord: 0,
      visible: false
    };
  },
  computed: {
    ngRange() {
      return [...Array(3 + this.plusRecord - this.minusRecord).keys()]
        .map(x => x - 1 + this.minusRecord)
        .filter(Boolean);
    },
  },
  methods: {
    update() {
      this.plusRecord = NG.plusRecord;
      this.minusRecord = NG.minusRecord;
      this.visible = Pelle.endState > 13;
    },
    ngString(i) {
      if (!i) return "";
      return `NewGame${i > 0 ? "+" : "-"}${Math.abs(i) > 1 ? Math.abs(i - 1) : ""}`;
    },
    startNewGame(i) {
      NG.startNewGame(i);
    }
  }
};
</script>

<template>
  <div
    class="new-game-container"
    :style="{ display: visible ? 'flex' : 'none' }"
  >
    <h1>Wanna start over?</h1>
    Highest NG+: {{ plusRecord }}<br>
    Highest NG-: {{ minusRecord }}<br>
    <button
      v-for="i in ngRange"
      :key="i"
      class="new-game-button"
      @click="startNewGame(i)"
    >
      Start a {{ ngString(i) }}
    </button>
  </div>
</template>

<style scoped>
  .new-game-container {
    position: absolute;
    left: 0;
    top: 0;
    height: 100%;
    width: 100%;
    z-index: 7;
    display: flex;
    justify-content: center;
    align-items: center;
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
