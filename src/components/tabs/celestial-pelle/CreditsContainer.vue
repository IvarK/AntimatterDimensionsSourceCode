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
          symbol: "Ϟ",
          style: {
            left: "65%",
            top: "97rem",
            color: "var(--color-teresa--base)",
            animation: this.animName("teresa")
          }
        },
        effarig: {
          symbol: "Ϙ",
          style: {
            left: "80%",
            top: "35rem",
            color: "#f40",
            animation: this.animName("effarig", 4)
          }
        },
        enslaved: {
          symbol: "<i class='fas fa-link'></i>",
          style: {
            left: "52%",
            top: "170rem",
            color: "var(--color-enslaved-base)",
            animation: this.animName("enslaved", 10, "linear")
          }
        },
        v: {
          symbol: "⌬",
          style: {
            left: "20%",
            top: "128rem",
            color: "var(--color-v--base)",
            animation: this.animName("v", 5)
          }
        },
        ra: {
          symbol: "<i class='fas fa-sun'></i>",
          style: {
            left: "44%",
            top: "240rem",
            color: "var(--color-ra-base)",
            animation: this.animName("ra")
          }
        },
        laitela: {
          symbol: "ᛝ",
          style: {
            left: "13%",
            top: "60rem",
            color: "#ffffff",
            animation: this.animName("laitela", 5)
          }
        },
        pelle: {
          symbol: "♅",
          style: {
            left: "30%",
            top: "5rem",
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
    class="credits-container"
    :style="creditStyles"
  >
    <div
      v-for="cel in celestialDisplays"
      :key="cel.symbol + '-end-credit-symbol-disp'"
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
    <p>realrapidjazz</p>
    <p>Patashu</p>
    <p>Pichusuperlover</p>
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

    <!-- If we end up with an uneven amount of name, I'll throw myself (Lars) on the list -->
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

    <h2>Android Testers</h2>
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
      <p>Auti (Alice Tolle)</p>)
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


  .c-credits-cel-symbol {
    position: absolute;
    font-size: 14rem;
    text-shadow: 0 0 3rem;
    transform: translateX(-50%);
  }
</style>

<style>
@keyframes a-teresa-credits {
  0% {transform: rotate(61deg);}
  10% {transform: rotate(322deg);}
  20% {transform: rotate(235deg);}
  30% {transform: rotate(222deg);}
  40% {transform: rotate(105deg);}
  50% {transform: rotate(33deg);}
  60% {transform: rotate(103deg);}
  70% {transform: rotate(158deg);}
  80% {transform: rotate(41deg);}
  90% {transform: rotate(73deg);}
  100% {transform: rotate(61deg);}
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
@keyframes a-v-credits {
  0% { transform: translateX(-50%) rotate(0) scale(0.8); }
  50% { transform: translateX(-50%) rotate(60deg) scale(1.2); }
  100% { transform: translateX(-50%) rotate(0) scale(0.8); }
}
@keyframes a-ra-credits {
  0% { opacity: 0.1; transform: translateX(-50%) scale(0.2); }
  50% { opacity: 0.4; transform: translateX(-50%) scale(0.9); }
  100% { opacity: 0.1; transform: translateX(-50%) scale(0.2); }
}
@keyframes a-laitela-credits {
  0% { transform: translate(-50%, -20%); }
  50% { transform: translate(-50%, 20%); }
  100% { transform: translate(-50%, -20%); }
}
@keyframes a-pelle-credits {
  0% { transform: translateX(-50%) rotate3d(0, 1, 0, 0) scaleY(1); }
  25% { transform: translateX(-50%) rotate3d(0, 1, 0, 90deg) scaleY(1.3); }
  50% { transform: translateX(-50%) rotate3d(0, 1, 0, 180deg) scaleY(1); }
  75% { transform: translateX(-50%) rotate3d(0, 1, 0, 270deg) scaleY(1.3); }
  100% { transform: translateX(-50%) rotate3d(0, 1, 0, 360deg) scaleY(1); }
}
</style>