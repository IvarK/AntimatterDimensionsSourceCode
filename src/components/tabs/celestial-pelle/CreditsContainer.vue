<script>
export default {
  name: "CreditsContainer",
  data() {
    return {
      rolling: false,
      scroll: 0,
      audio: null
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
  computed: {
    creditStyles() {
      return {
        top: `${100 - this.scroll}vh`,
        display: this.rolling ? "block" : "none"
      };
    },
    celestialDisplays() {
      return {
        teresa: {
          symbol: Teresa.symbol,
          style: {
            left: "65%",
            top: "112rem",
            color: "var(--color-teresa--base)",
            animation: this.animName("teresa")
          }
        },
        effarig: {
          symbol: Effarig.symbol,
          style: {
            left: "80%",
            top: "40rem",
            color: "#f40",
            animation: this.animName("effarig", 4)
          }
        },
        enslaved: {
          symbol: Enslaved.symbol,
          style: {
            left: "52%",
            top: "200rem",
            color: "var(--color-enslaved-base)",
            animation: this.animName("enslaved", 10, "linear")
          }
        },
        v: {
          symbol: V.symbol,
          style: {
            left: "20%",
            top: "143rem",
            color: "var(--color-v--base)",
            animation: this.animName("v", 15)
          }
        },
        ra: {
          symbol: Ra.symbol,
          style: {
            left: "44%",
            top: "300rem",
            color: "var(--color-ra-base)",
            animation: this.animName("ra")
          }
        },
        laitela: {
          symbol: Laitela.symbol,
          style: {
            left: "13%",
            top: "60rem",
            color: "#ffffff",
            animation: this.animName("laitela", 5)
          }
        },
        pelle: {
          symbol: Pelle.symbol,
          style: {
            left: "30%",
            top: "8rem",
            color: "var(--color-pelle--base)",
            animation: this.animName("pelle", 5, "linear")
          }
        }
      };
    }
  },
  methods: {
    update() {
      // Original code:
      // if (!Pelle.endState > 1) return;
      // this.rolling = Pelle.endState > 4.5;
      // this.scroll = (Pelle.endState - 4.5) / 2 * 100;
      // if (this.audio) this.audio.volume = Math.clamp((Pelle.endState - 4.5), 0, 0.3);

      this.rolling = player.records.thisReality.realTime > 1.5e4;
      this.scroll = (player.records.thisReality.realTime - 1.5e4) / 250;
      if (this.audio) this.audio.volume = Math.clamp((player.records.thisReality.realTime - 1.5e4), 0, 0.3);
    },
    animName(x, duration = 10, type = "ease-in-out") {
      return `a-${x}-credits ${duration}s ${type} infinite`;
    }
  }
};
</script>

<template>
  <div
    v-if="rolling"
    class="c-credits-container"
    :style="creditStyles"
  >
    <div
      v-for="(cel, celIndex) in celestialDisplays"
      :key="celIndex + '-end-credit-symbol-disp'"
      class="c-credits-cel-symbol"
      :style="cel.style"
      v-html="cel.symbol"
    />
    <h1>Antimatter Dimensions</h1>

    <h2>Created by</h2>
    <p>Hevipelle (Ivar Kerajärvi)</p>

    <h2>Technical Architect</h2>
    <p>Razenpok (Andrei Andreev)</p>

    <h2>Lead Developers</h2>
    <p>Omsi</p>
    <p>SpectralFlame (Christopher Yip)</p>

    <h2>Developers</h2>
    <p>Dan</p>
    <p>earth</p>
    <p>Hira</p>
    <p>IkerStream</p>
    <p>L4R5 (Lars Wolf)</p>
    <p>Patashu</p>

    <h2>Design Consoltant</h2>
    <p>Pichusuperlover</p>
    <p>slabdrill</p>
    <p>Sparticle999</p>
    <p>WaitingIdly</p>

    <h2>Modal Maker, Lady Taker, Pie Baker</h2>
    <p>earth</p>

    <h2>Android Developer</h2>
    <p>kajfik (Jakub Kajfosz)</p>

    <h2>Library Developer</h2>
    <p>Patashu</p>

    <h2>Lead Design Consoltants</h2>
    <p>realrapidjazz</p>

    <h2>Design Consoltants</h2>
    <p>Pichusuperlover</p>
    <p>Acamaeda</p>

    <h2>Web Testers</h2>
    <div class="l-double-credits-container">
      <p>Acamaeda</p>
      <p>Aesis</p>
      <p>AFYINEE (Gabriel HADDAG)</p>
      <p>Alexitato</p>
      <p>Anno</p>
      <p>Archa (Myresa)</p>
      <p>Birb (Kelsey Black)</p>
      <p>Boo (Jean-Christophe Bourgault)</p>
      <p>CaptainGalaxy (Ovidijus Točelis)</p>
      <p>ChaoticHans</p>
      <p>cubic frog</p>
      <p>Dan</p>
      <p>dankesehr</p>
      <p>Davixx (Davide Fedele)</p>
      <p>earth</p>
      <p>Empireus</p>
      <p>GirixK (Nikola Jelinčić)</p>
      <p>GoldenTritium</p>
      <p>Hira</p>
      <p>IkerStream (Iker de Aguirre)</p>
      <p>Kael</p>
      <p>L4R5 (Lars Wolf)</p>
      <p>Lynn</p>
      <p>Merp</p>
      <p>Patashu</p>
      <p>philipebreaker (Philipe)</p>
      <p>Phillip Marshall</p>
      <p>Phoenix</p>
      <p>Pichusuperlover</p>
      <p>Reda Kotob</p>
      <p>Saturnus</p>
      <p>Scarlet</p>
      <p>sirusi (Vinícius Oliveira Martins)</p>
      <p>Spanosa (Jared K)</p>
      <p>SpicyCrusader13</p>
      <p>Storm</p>
      <p>SzyszakS</p>
      <p>Tacitus</p>
      <p>Typh</p>
      <p>Vnge (Ben Parrish)</p>
      <p>WaitingIdly</p>
      <p>Xemadus (Jonathan Gibson)</p>
      <p>Young Woo Joo</p>
      <p>Zipi</p>
    </div>

    <h2>Lurker Tester</h2>
    <p>Dravitar (Alex Henderson)</p>

    <h2>Android Testers</h2>
    <div class="l-double-credits-container">
      <p>about:blank</p>
      <p>Archa (Myresa)</p>
      <p>Anjinho01</p>
      <p>Auti (Alice Tolle)</p>
      <p>Buck</p>
      <p>Barrin84</p>
      <p>ChaoticHans</p>
      <p>Circle</p>
      <p>DarthDie (Briar Bowser)</p>
      <p>Epsilon (Coolguystorm)</p>
      <p>Firecracker</p>
      <p>Gaunter</p>
      <p>GirixK (Nikola Jelinčić)</p>
      <p>GoldenTritium</p>
      <p>HarrisL2</p>
      <p>Hellbach (Asher Günther)</p>
      <p>Hira</p>
      <p>hen-ben (Henry Ellenberg)</p>
      <p>ImpossibleSalsa</p>
      <p>Johanniklas (Jan-Niklas Petersen)</p>
      <p>kaislash (Lily)</p>
      <p>Kirku (Fabian Makowski)</p>
      <p>Kirin Nijinski (Arthur)</p>
      <p>L4R5 (Lars Wolf)</p>
      <p>Monoma (ARoman Ruiz)</p>
      <p>Nani</p>
      <p>opdollar (Zane Coole)</p>
      <p>Pavlxiiv</p>
      <p>Porygon-Z</p>
      <p>PotatoTIAB</p>
      <p>Razor</p>
      <p>Razvan Cercel</p>
      <p>Rukimix</p>
      <p>Scarlet</p>
      <p>Skunky (Lukas)</p>
      <p>Socks (Hannah Pocks)</p>
      <p>SpicyCrusader13</p>
      <p>Tim Wong</p>
      <p>tragedt (Ethan Manninen)</p>
      <p>Valentine Clarissa Alanis Star Z</p>
      <p>vanadium_void</p>
      <p>Vnge (Ben Parrish)</p>
      <p>WaitingIdly</p>
      <p>ZylaKat (Katherine Goforth-Harbin)</p>
    </div>

    <br><br><br><br><br><br><br><br><br>
    <h1>Thank you so much for playing!</h1>
  </div>
</template>

<style scoped>
.c-credits-container {
  position: absolute;
  left: 0;
  height: 100%;
  width: 100%;
  z-index: 9;
  color: rgb(185, 185, 185);
  pointer-events: none;
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

.l-double-credits-container p {
  width: 50%;
  display: inline-block;
}

p {
  margin-top: 1rem;
}


.c-credits-cel-symbol {
  position: absolute;
  font-size: 14rem;
  text-shadow: 0 0 3rem;
  transform: translateX(-50%);
  height: 14rem;
  width: 14rem;
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>

<style>
@keyframes a-teresa-credits {
  0% { transform: rotate(61deg); }
  10% { transform: rotate(322deg); }
  20% { transform: rotate(235deg); }
  30% { transform: rotate(222deg); }
  40% { transform: rotate(105deg); }
  50% { transform: rotate(33deg); }
  60% { transform: rotate(103deg); }
  70% { transform: rotate(158deg); }
  80% { transform: rotate(41deg); }
  90% { transform: rotate(73deg); }
  100% { transform: rotate(61deg); }
}
@keyframes a-effarig-credits {
  0% { opacity: 0.8; text-shadow: 0 0 3rem; }
  50% { opacity: 1; text-shadow: 0 0 4rem, 0 0 4rem; }
  100% { opacity: 0.8; text-shadow: 0 0 3rem; }
}
@keyframes a-enslaved-credits {
  0% { transform: translateX(-50%) rotate(0); }
  100% { transform: translateX(-50%) rotate(360deg); }
}
/* We unfortunately have to do it this way, because due to how the benzene unicode symbol works, 0 and 120deg aren't
perfectly the same. */
@keyframes a-v-credits {
  0% { transform: translateX(-50%) rotate(0) scale(0.8); }
  16.67% { transform: translateX(-50%) rotate(60deg) scale(1.2); }
  33.33% { transform: translateX(-50%) rotate(120deg) scale(0.8); }
  50% { transform: translateX(-50%) rotate(180deg) scale(1.2); }
  66.67% { transform: translateX(-50%) rotate(240deg) scale(0.8); }
  83.33% { transform: translateX(-50%) rotate(300deg) scale(1.2); }
  100% { transform: translateX(-50%) rotate(360deg) scale(0.8); }
}
@keyframes a-ra-credits {
  0% { opacity: 0.1; transform: translateX(-50%) scale(0.2); }
  50% { opacity: 0.4; transform: translateX(-50%) scale(0.9); }
  100% { opacity: 0.1; transform: translateX(-50%) scale(0.2); }
}
@keyframes a-laitela-credits {
  0% { transform: translate(-50%, 30%); }
  25% { transform: translate(-50%, -20%); }
  50% { transform: translate(-50%, 30%); }
  75% { transform: translate(0%, 30%); }
  100% { transform: translate(-50%, 30%); }
}
@keyframes a-pelle-credits {
  0% { transform: translateX(-50%) rotate3d(0, 1, 0, 0) scaleY(1); }
  25% { transform: translateX(-50%) rotate3d(0, 1, 0, 90deg) scaleY(1.3); }
  50% { transform: translateX(-50%) rotate3d(0, 1, 0, 180deg) scaleY(1); }
  75% { transform: translateX(-50%) rotate3d(0, 1, 0, 270deg) scaleY(1.3); }
  100% { transform: translateX(-50%) rotate3d(0, 1, 0, 360deg) scaleY(1); }
}
</style>