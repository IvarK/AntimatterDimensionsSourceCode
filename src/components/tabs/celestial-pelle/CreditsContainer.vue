<script>
export default {
  name: "CreditsContainer",
  data() {
    return {
      rolling: false,
      scroll: 0,
      audio: null,
    };
  },
  watch: {
    rolling(newVal, oldVal) {
      if (!oldVal && newVal && this.audio === null) {
        this.audio = new Audio(`audio/credits.mp3`);
        this.audio.play();
      }
    }
  },
  methods: {
    update() {
      if (!Pelle.endState > 1) return;
      this.rolling = Pelle.endState > 4.5;
      this.scroll = (Pelle.endState - 4.5) / 2 * 100;
      if (this.audio) this.audio.volume = Math.clamp((Pelle.endState - 4.5), 0, 0.3);
    }
  }
};
</script>

<template>
  <div
    v-if="rolling"
    class="credits-container"
    :style="{
      top: `${100 - scroll}vh`,
      display: rolling ? 'block' : 'none'
    }"
  >
    <h1>Antimatter Dimensions</h1>

    <h2>Created by</h2>
    <p>Hevipelle (Ivar Kerajärvi)</p>

    <h2>Technical Architect</h2>
    <p>Razenpok (Andrei Andreev)</p>

    <h2>Lead Developers</h2>
    <p>SpectralFlame (Christopher Yip)</p>
    <p>Omsi</p>

    <h2>Developers</h2>
    <p>Dan</p>
    <p>realrapidjazz</p>
    <p>earth</p>
    <p>IkerStream</p>
    <p>Pichusuperlover</p>
    <p>Patashu</p>
    <p>L4R5 (Lars Wolf)</p>
    <p>Hira</p>
    <p>Sparticle999</p>

    <h2>Modal Maker, Lady Taker, Pie Baker</h2>
    <p>earth</p>

    <h2>Android Developer</h2>
    <p>kajfik (Jakub Kajfosz)</p>

    <h2>Library Developer</h2>
    <p>Patashu</p>

    <h2>Design Consoltants</h2>
    <p>Pichusuperlover</p>
    <p>Acamaeda</p>

    <!-- If we end up with an uneven amount of name, I'll throw myself on the list too -->
    <h2>Web Testers</h2>
    <div class="l-credits--left">
      <p>Aesis</p>
      <p>Alexitato</p>
      <p>Birb (Kelsey Black)</p>
      <p>CaptainGalaxy (Ovidijus Točelis)</p>
      <p>cubic frog</p>
      <p>dankesehr</p>
      <p>earth</p>
      <p>Hira</p>
      <p>Kael</p>
      <p>Merp</p>
      <p>Phoenix</p>
      <p>Phillip Marshall</p>
      <p>Reda Kotob</p>
      <p>Scarlet</p>
      <p>Spanosa (Jared K)</p>
      <p>Storm</p>
      <p>Tacitus</p>
      <p>Vnge (Ben Parrish)</p>
      <p>Young Woo Joo</p>
    </div>
    <div class="l-credits--right">
      <p>Acamaeda</p>
      <p>AFYINEE (Gabriel HADDAG)</p>
      <p>Archa (Myresa)</p>
      <p>Boo (Jean-Christophe Bourgault)</p>
      <p>ChaoticHans</p>
      <p>Dan</p>
      <p>Davixx (Davide Fedele)</p>
      <p>Empireus</p>
      <p>IkerStream (Iker de Aguirre)</p>
      <p>Lynn</p>
      <p>Patashu</p>
      <p>philipebreaker (Philipe)</p>
      <p>Pichusuperlover</p>
      <p>Saturnus</p>
      <p>sirusi (Vinícius Oliveira Martins)</p>
      <p>SpicyCrusader13</p>
      <p>SzyszakS</p>
      <p>Typh</p>
      <p>Xemadus (Jonathan Gibson)</p>
      <p>Zipi</p>
    </div>

    <h2>Android Testers:</h2>
    <div class="l-credits--left">
      <p>about:blank</p>
      <p>Anjinho01</p>
      <p>Buck</p>
      <p>Circle</p>
      <p>Epsilon (Coolguystorm)</p>
      <p>Gaunter</p>
      <p>Hellbach (Asher Günther)</p>
      <p>hen-ben (Henry Ellenberg)</p>
      <p>Johanniklas (Jan-Niklas Petersen)</p>
      <p>Kirku (Fabian Makowski)</p>
      <p>Monoma (ARoman Ruiz)</p>
      <p>opdollar (Zane Coole)</p>
      <p>Porygon-Z</p>
      <p>Razor</p>
      <p>Rukimix</p>
      <p>Skunky (Lukas)</p>
      <p>Socks (Hannah Pocks)</p>
      <p>tragedt (Ethan Manninen)</p>
      <p>vanadium_void</p>
      <p>ZylaKat (Katherine Goforth-Harbin)</p>
    </div>
    <div class="l-credits--right">
      <p>Archa (Myresa)</p>
      <p>Barrin84</p>
      <p>ChaoticHans</p>
      <p>DarthDie (Briar Bowser)</p>
      <p>Firecracker</p>
      <p>HarrisL2</p>
      <p>Hira</p>
      <p>ImpossibleSalsa</p>
      <p>kaislash (Lily)</p>
      <p>Kirin Nijinski (Arthur)</p>
      <p>Nani</p>
      <p>Pavlxiiv</p>
      <p>PotatoTIAB</p>
      <p>Razvan Cercel</p>
      <p>Scarlet</p>
      <p>SpicyCrusader13</p>
      <p>Tim Wong</p>
      <p>Valentine Clarissa Alanis Star Z</p>
      <p>Vnge (Ben Parrish)</p>
    </div>

    <br><br><br>
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
    margin-top: 10rem;
    margin-bottom: 2rem;
    color: white;
    text-shadow: 1px 1px 2px turquoise;
  }

  .l-credits--left {
    width: 50%;
    float: left;
  }

  .l-credits--right {
    width: 50%;
    overflow: hidden;
  }

  p {
    margin-top: 1rem;
  }
</style>
