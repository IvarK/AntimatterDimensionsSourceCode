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
  computed: {
    people() { return GameDatabase.credits.people; },
    roles() { return GameDatabase.credits.roles; },
    creditStyles() {
      return {
        bottom: `${this.scroll}rem`,
        display: this.rolling ? "block" : "none"
      };
    },
    celestialDisplays() {
      return {
        teresa: {
          symbol: Teresa.symbol
        },
        effarig: {
          symbol: Effarig.symbol
        },
        enslaved: {
          symbol: Enslaved.symbol
        },
        v: {
          symbol: V.symbol
        },
        ra: {
          symbol: Ra.symbol
        },
        laitela: {
          symbol: Laitela.symbol
        },
        pelle: {
          symbol: Pelle.symbol
        }
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
    },
    animName(x, duration = 10, type = "ease-in-out") {
      return `a-${x}-credits ${duration}s ${type} infinite`;
    },
    relevantPeople(role) {
      return this.people
        .filter(x => (typeof x.roles === "number" ? x.roles === role : x.roles.includes(role)))
        .sort((a, b) => a.name.toUpperCase() > b.name.toUpperCase());
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
      :class="`c-${celIndex}-credits`"
      v-html="cel.symbol"
    />
    <h1 class="c-credits-header">
      Antimatter Dimensions
    </h1>

    <div
      v-for="role in roles.count"
      :key="role"
    >
      <h2 class="c-credits-section">
        {{ pluralize(roles[role], relevantPeople(role).length) }}
      </h2>
      <div :class="{ 'l-credits--bulk': relevantPeople(role).length > 10}">
        <div
          v-for="person in relevantPeople(role)"
          :key="person.name"
          class="c-credit-entry"
        >
          {{ person.name }}
          <span v-if="person.name2">
            ({{ person.name2 }})
          </span>
        </div>
      </div>
    </div>

    <br><br><br><br><br><br><br><br><br>
    <h1 class="c-credits-header">
      Thank you so much for playing!
    </h1>
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
  transform: translateY(100%);
}

.c-credits-header {
  color: yellow;
}

.c-credits-section {
  margin-top: 10rem;
  margin-bottom: 2rem;
  color: white;
  text-shadow: 1px 1px 2px turquoise;
}

.l-credits--bulk {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  position: relative;
  width: 76%;
  left: 12%;
}

.c-credit-entry {
  margin-top: 1rem;
  font-size: 1.3rem;
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

.c-teresa-credits {
  left: 65%;
  top: 130rem;
  color: var(--color-teresa--base);
  animation: a-teresa-credits 10s ease-in-out infinite;
}

.c-effarig-credits {
  left: 80%;
  top: 50rem;
  color: #f40;
  animation: a-effarig-credits 4s ease-in-out infinite;
}

.c-enslaved-credits {
  left: 52%;
  top: 220rem;
  color: var(--color-enslaved-base);
  animation: a-enslaved-credits 10s linear infinite;
}

.c-v-credits {
  left: 20%;
  top: 170rem;
  color: var(--color-v--base);
  animation: a-v-credits 15s ease-in-out infinite;
}

.c-ra-credits {
  left: 44%;
  top: 300rem;
  color: var(--color-ra-base);
  animation: a-ra-credits 10s ease-in-out infinite;
}

.c-laitela-credits {
  left: 13%;
  top: 90rem;
  color: #ffffff;
  animation: a-laitela-credits 5s ease-in-out infinite;
}

.c-pelle-credits {
  left: 30%;
  top: 8rem;
  color: var(--color-pelle--base);
  animation: a-pelle-credits 5s linear infinite;
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
