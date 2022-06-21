<script>
import CreditsDisplay from "@/components/CreditsDisplay";

export default {
  name: "CreditsContainer",
  components: {
    CreditsDisplay
  },
  data() {
    return {
      rolling: false,
      scroll: 0,
      audio: null
    };
  },
  computed: {
    creditStyles() {
      return {
        bottom: `${this.scroll}rem`,
        display: this.rolling ? "block" : "none"
      };
    },
    celestialDisplays() {
      return {
        teresa: Teresa.symbol,
        effarig: Effarig.symbol,
        enslaved: Enslaved.symbol,
        v: V.symbol,
        ra: Ra.symbol,
        laitela: Laitela.symbol,
        pelle: Pelle.symbol
      };
    }
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
      this.rolling = GameEnd.endState > 4.5;
      this.scroll = (GameEnd.endState - 4.5) * 48;
      if (this.audio) this.audio.volume = Math.clamp((GameEnd.endState - 4.5), 0, 0.3);
    }
  }
};
</script>

<template>
  <div
    class="c-credits-container"
    :style="creditStyles"
  >
    <div
      v-for="(celSymbol, celIndex) in celestialDisplays"
      :key="celIndex + '-end-credit-symbol-disp'"
      class="c-credits-cel-symbol"
      :class="`c-${celIndex}-credits`"
      v-html="celSymbol"
    />
    <CreditsDisplay />
  </div>
</template>

<style scoped>
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
  0% {
    opacity: 0.8;
    text-shadow: 0 0 3rem;
  }

  50% {
    opacity: 1;
    text-shadow: 0 0 4rem, 0 0 4rem;
  }

  100% {
    opacity: 0.8;
    text-shadow: 0 0 3rem;
  }
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
  0% {
    opacity: 0.3;
    transform: translateX(-50%) scale(0.2);
  }

  50% {
    opacity: 0.7;
    transform: translateX(-50%) scale(0.9);
  }

  100% {
    opacity: 0.3;
    transform: translateX(-50%) scale(0.2);
  }
}

@keyframes a-ra-credits--dark {
  0% {
    opacity: 0.1;
    transform: translateX(-50%) scale(0.2);
  }

  50% {
    opacity: 0.4;
    transform: translateX(-50%) scale(0.9);
  }

  100% {
    opacity: 0.1;
    transform: translateX(-50%) scale(0.2);
  }
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

.c-credits-container {
  width: 100%;
  height: 100%;
  position: absolute;
  left: 0;
  z-index: 9;
  transform: translateY(100%);
  pointer-events: none;
}

.c-credits-cel-symbol {
  display: flex;
  width: 14rem;
  height: 14rem;
  position: absolute;
  justify-content: center;
  align-items: center;
  font-size: 14rem;
  text-shadow: 0 0 3rem;
  transform: translateX(-50%);
}

.c-teresa-credits {
  top: 130rem;
  left: 65%;
  color: var(--color-teresa--base);
  animation: a-teresa-credits 10s ease-in-out infinite;
}

.c-effarig-credits {
  top: 50rem;
  left: 80%;
  color: #ff4400;
  animation: a-effarig-credits 4s ease-in-out infinite;
}

.c-enslaved-credits {
  top: 220rem;
  left: 52%;
  color: var(--color-enslaved--base);
  animation: a-enslaved-credits 10s linear infinite;
}

.c-v-credits {
  top: 170rem;
  left: 20%;
  color: var(--color-v--base);
  animation: a-v-credits 15s ease-in-out infinite;
}

.c-ra-credits {
  top: 300rem;
  left: 44%;
  color: var(--color-ra--base);
  animation: a-ra-credits 10s ease-in-out infinite;
}

.s-base--dark .c-ra-credits {
  animation: a-ra-credits--dark 10s ease-in-out infinite;
}

.c-laitela-credits {
  top: 90rem;
  left: 13%;
  color: #ffffff;
  animation: a-laitela-credits 5s ease-in-out infinite;
}

.c-pelle-credits {
  top: 8rem;
  left: 30%;
  color: var(--color-pelle--base);
  animation: a-pelle-credits 5s linear infinite;
}
</style>
