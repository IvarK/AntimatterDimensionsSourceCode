<script>
export default {
  data() {
    return {
      rolling: false,
      scroll: 0,
      audio: null,
    };
  },
  methods: {
    update() {
      if (!Pelle.isDoomed) return;
      this.rolling = Pelle.endState > 4.5;
      this.scroll = (Pelle.endState - 4.5) / 2 * 100;
      if (this.audio) this.audio.volume = Math.min((Pelle.endState - 4.5), 0.3);
    }
  },
  watch: {
    rolling(newVal, oldVal) {
      console.log({ oldVal, newVal });
      if (!oldVal && newVal && this.audio === null) {
        this.audio = new Audio(`audio/credits.mp3`);
        this.audio.play();
      }
    }
  }
};
</script>

<template>
  <div
    class="credits-container"
    :style="{
      top: `${100 - scroll}vh`,
      display: rolling ? 'block' : 'none'
    }"
  >
    <h1>Antimatter Dimensions</h1>
    <h2>These credits and the song are a WIP</h2>
    <h2>Created by</h2>
    <p>Ivar "Hevipelle" Kerajärvi</p>
    <h2>Co-Developers</h2>
    <p>Omsi</p>
    <p>Christopher "SpectralFlame" Yip</p>
    <p>Andrei "Razenpok" Andreev</p>
    <p>Dan "02C00000"</p>
    <h2>Android version created by</h2>
    <p>Jakub "kajfik" Kajfosz</p>
    <h2>Contributors</h2>
    <p>earth</p>
    <p>Iker "IkerStream" de Aguirre</p>
    <p>Patashu</p>
    <p>Pichusuperlover</p>
    <p>WaitingIdly</p>
    <h2>Game Designers</h2>
    <p>realrapidjazz</p>
    <p>Game Designer here</p>
    <p>Game Designer here</p>
    <h2>Discord Moderators</h2>
    <p>Discord mod here</p>
    <p>Discord mod here</p>
    <p>Discord mod here</p>
    <p>Discord mod here</p>
    <p>Discord mod here</p>
    <h2>Testers</h2>
    <p>tester here</p>
    <p>tester here</p>
    <p>tester here</p>
    <p>tester here</p>
    <p>tester here</p>
    <p>tester here</p>
    <p>tester here</p>
    <p>tester here</p>
    <p>tester here</p>
    <h2>Mobile Testers</h2>
    <p>tester here</p>
    <p>tester here</p>
    <p>tester here</p>
    <p>tester here</p>
    <p>tester here</p>
    <p>tester here</p>
    <p>tester here</p>
    <p>tester here</p>
    <h2></h2>
    <h1>Thank you so much for playing!</h1>
  </div>
</template>

<style scoped>
  .credits-container {
    position: absolute;
    left: 0;
    height: 100%;
    width: 100%;
    z-index: 7;
    color: rgb(185, 185, 185);
  }

  h1 {
    color: yellow;
  }

  h2 {
    margin-top: 20rem;
    margin-bottom: 2rem;
    color: white;
    text-shadow: 1px 1px 2px turquoise;
  }

  p {
    margin-top: 1rem;
  }
</style>