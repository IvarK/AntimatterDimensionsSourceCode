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
    people() { return people; },
    roles() { return roles; },
    creditStyles() {
      return {
        bottom: `${this.scroll}rem`,
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
      this.rolling = GameEnd.endState > 4.5;
      this.scroll = (GameEnd.endState - 4.5) * 48;
      if (this.audio) this.audio.volume = Math.clamp((GameEnd.endState - 4.5), 0, 0.3);
    },
    animName(x, duration = 10, type = "ease-in-out") {
      return `a-${x}-credits ${duration}s ${type} infinite`;
    },
    relevantPeople(role) {
      return people
        .filter(x => (typeof x.roles === "number" ? x.roles === role : x.roles.includes(role)))
        .sort((a, b) => a.name.toUpperCase() > b.name.toUpperCase());
    }
  }
};

// Must be placed in the order it is desired they appear in the credits
const roles = {
  1: "Creator",
  2: "Technical Architect",
  3: "Lead Developer",
  4: "Android Developer",
  5: "Library Developer",
  6: "Developer",
  7: "Lead Design Consultant",
  8: "Design Consultant",
  9: "Modal Maker, Lady Taker, Pie Baker",
  10: "Lurker Tester",
  11: "Web Tester",
  12: "Android Tester"
};

roles.count = Object.keys(roles).length;

// Each person must have a name and at least one role (the index of the desired role in roles). They can also have a
// second name, which will appear in parentheses besides their first.
const people = [
  {
    name: "Hevipelle",
    name2: "Ivar Kerajärvi",
    roles: 1
  }, {
    name: "Razenpok",
    name2: "Andrei Andreev",
    roles: 2
  }, {
    name: "Omsi",
    roles: 3
  }, {
    name: "SpectralFlame",
    name2: "Christopher Yip",
    roles: 3
  }, {
    name: "WaitingIdly",
    roles: [3, 6, 8, 11, 12]
  }, {
    name: "kajfik",
    name2: "Jakub Kajfosz",
    roles: 4
  }, {
    name: "Patashu",
    roles: [5, 6, 11]
  }, {
    name: "Dan",
    roles: [6, 11]
  }, {
    name: "earth",
    roles: [6, 9, 11]
  }, {
    name: "Hira",
    roles: [6, 11, 12]
  }, {
    name: "IkerStream",
    name2: "Iker de Aguirre",
    roles: [6, 11]
  }, {
    name: "L4R5",
    name2: "Lars Wolf",
    roles: [6, 11, 12]
  }, {
    name: "Pichusuperlover",
    roles: [6, 8, 11]
  }, {
    name: "realrapidjazz",
    roles: [6, 7]
  }, {
    name: "slabdrill",
    roles: 6
  }, {
    name: "Acamaeda",
    roles: [8, 11]
  }, {
    name: "Dravitar",
    name2: "Alex Henderson",
    roles: 10
  }, {
    name: "Aesis",
    roles: 11
  }, {
    name: "AFYINEE",
    name2: "Gabriel HADDAG",
    roles: 11
  }, {
    name: "Alexitato",
    roles: 11
  }, {
    name: "Anno",
    roles: 11
  }, {
    name: "Archa",
    name2: "Myresa",
    roles: [11, 12]
  }, {
    name: "ArrowBounce",
    name2: "Timothy Su",
    roles: 11
  }, {
    name: "Birb",
    name2: "Kelsey Black",
    roles: 11
  }, {
    name: "Boo",
    name2: "Jean-Christophe Bourgault",
    roles: 11
  }, {
    name: "CaptainGalaxy",
    name2: "Ovidijus Točelis",
    roles: 11
  }, {
    name: "ChaoticHans",
    roles: [11, 12]
  }, {
    name: "cubic frog",
    roles: 11
  }, {
    name: "dankesehr",
    roles: 11
  }, {
    name: "Davixx",
    name2: "Davide Fedele",
    roles: 11
  }, {
    name: "Empireus",
    roles: 11
  }, {
    name: "GirixK",
    name2: "Nikola Jelinčić",
    roles: [11, 12]
  }, {
    name: "GoldenTritium",
    roles: [11, 12]
  }, {
    name: "Kael",
    roles: 11
  }, {
    name: "Lynn",
    roles: 11
  }, {
    name: "Merp",
    roles: 11
  }, {
    name: "philipebreaker",
    name2: "Philipe",
    roles: 11
  }, {
    name: "Phillip Marshall",
    roles: 11
  }, {
    name: "Phoenix",
    roles: 11
  }, {
    name: "Reda Kotob",
    roles: 11
  }, {
    name: "Saturnus",
    roles: 11
  }, {
    name: "Scarlet",
    roles: [11, 12]
  }, {
    name: "sirusi",
    name2: "Vinícius Oliveira Martins",
    roles: 11
  }, {
    name: "Spanosa",
    name2: "Jared K",
    roles: 11
  }, {
    name: "Sparticle999",
    roles: 11
  }, {
    name: "SpicyCrusader13",
    roles: [11, 12]
  }, {
    name: "Storm",
    roles: 11
  }, {
    name: "SzyszakS",
    roles: 11
  }, {
    name: "Tacitus",
    roles: 11
  }, {
    name: "Typh",
    roles: 11
  }, {
    name: "Vnge",
    name2: "Ben Parrish",
    roles: [11, 12]
  }, {
    name: "Xemadus",
    name2: "Jonathan Gibson",
    roles: 11
  }, {
    name: "Young Woo Joo",
    roles: 11
  }, {
    name: "Zipi",
    roles: 11
  }, {
    name: "about:blank",
    roles: 12
  }, {
    name: "Anjinho01",
    roles: 12
  }, {
    name: "Auti",
    name2: "Alice Tolle",
    roles: 12
  }, {
    name: "Buck",
    roles: 12
  }, {
    name: "Barrin84",
    roles: 12
  }, {
    name: "Circle",
    roles: 12
  }, {
    name: "DarthDie",
    name2: "Briar Bowser",
    roles: 12
  }, {
    name: "Epsilon",
    name2: "Coolguystorm",
    roles: 12
  }, {
    name: "Firecracker",
    roles: 12
  }, {
    name: "Gaunter",
    roles: 12
  }, {
    name: "HarrisL2",
    roles: 12
  }, {
    name: "Hellbach",
    name2: "Asher Günther",
    roles: 12
  }, {
    name: "hen-ben",
    name2: "Henry Ellenberg",
    roles: 12
  }, {
    name: "ImpossibleSalsa",
    roles: 12
  }, {
    name: "Johanniklas",
    name2: "Jan-Niklas Petersen",
    roles: 12
  }, {
    name: "kaislash",
    name2: "Lily",
    roles: 12
  }, {
    name: "Kirku",
    name2: "Fabian Makowski",
    roles: 12
  }, {
    name: "Kirin",
    name2: "Arthur",
    roles: 12
  }, {
    name: "Monoma",
    name2: "ARoman Ruiz",
    roles: 12
  }, {
    name: "Nani",
    roles: 12
  }, {
    name: "opdollar",
    name2: "Zane Coole",
    roles: 12
  }, {
    name: "Pavlxiiv",
    roles: 12
  }, {
    name: "Porygon-Z",
    roles: 12
  }, {
    name: "PotatoTIAB",
    roles: 12
  }, {
    name: "Razor",
    roles: 12
  }, {
    name: "Razvan Cercel",
    roles: 12
  }, {
    name: "Rukimix",
    roles: 12
  }, {
    name: "Skunky",
    name2: "Lukas",
    roles: 12
  }, {
    name: "Socks",
    name2: "Hannah Pocks",
    roles: 12
  }, {
    name: "Tim Wong",
    roles: 12
  }, {
    name: "tragedt",
    name2: "Ethan Manninen",
    roles: 12
  }, {
    name: "Valentine Clarissa Alanis Star Z",
    roles: 12
  }, {
    name: "vanadium_void",
    roles: 12
  }, {
    name: "ZylaKat",
    name2: "Katherine Goforth-Harbin",
    roles: 12
  }
];
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

    <div
      v-for="role in roles.count"
      :key="role"
    >
      <h2>
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
  transform: translateY(100%);
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

.l-credits--bulk {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
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
