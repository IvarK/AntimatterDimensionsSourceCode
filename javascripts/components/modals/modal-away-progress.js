"use strict";

Vue.component("modal-away-progress", {
  components: {
    "away-progress-helper": {
      props: {
        name: String,
        playerBefore: Object,
        playerAfter: Object,
        override: Object,
      },
      computed: {
        before() {
          const overrideBefore = this.override.before;
          return overrideBefore === undefined ? this.playerBefore[this.name] : overrideBefore;
        },
        after() {
          const overrideAfter = this.override.after;
          return overrideAfter === undefined ? this.playerAfter[this.name] : overrideAfter;
        },
        increased() {
          const after = this.after;
          const before = this.before;

          return after instanceof Decimal
            ? after.gt(before)
            : after > before;
        },
        showOption() {
          const overrideAway = this.override.awayProgress;
          return overrideAway === undefined ? player.options.awayProgress[this.name] : overrideAway;
        },
        classObject() {
          const overrideClassObj = this.override.classObject;
          const formattedName = this.name.replace(/[A-Z]/gu, match => `-${match.toLowerCase()}`);
          return overrideClassObj === undefined ? `c-modal-away-progress__${formattedName}` : overrideClassObj;
        },
        show() {
          return this.showOption && this.increased;
        },
        formatName() {
          const overrideName = this.override.name;
          const formattedName = this.name
            .replace(/[A-Z]/gu, match => ` ${match}`)
            .replace(/^\w/u, c => c.toUpperCase());
          return overrideName === undefined ? formattedName : overrideName;
        },
        formatBefore() {
          return this.formatPseudo(this.before);
        },
        formatAfter() {
          return this.formatPseudo(this.after);
        },
      },
      methods: {
        formatPseudo(number) {
          if (Decimal.lt(number, 1e9)) return formatInt(number);
          return format(number, 2, 2);
        },
      },
      template: `
        <span v-if="show" :class="classObject">
          <b>{{ formatName }}</b> increased from {{ formatBefore }} to {{ formatAfter }}
        </span>`
    },
    "away-progress-black-hole": {
      props: {
        blackHole: Number,
        playerBefore: Object,
        playerAfter: Object,
      },
      computed: {
        before() {
          return this.playerBefore.blackHole[this.blackHole];
        },
        after() {
          return this.playerAfter.blackHole[this.blackHole];
        },
        increased() {
          return this.after.activations > this.before.activations;
        },
        show() {
          return player.options.awayProgress.blackHole && this.increased;
        },
        activationTimes() {
          return this.after.activations - this.before.activations;
        },
        name() {
          if (this.blackHole === 0) return "First";
          if (this.blackHole === 1) return "Second";
          throw new NotImplementedError();
        },
        displayName() {
          // If we have the second black hole unlocked, specify which black hole activated.
          return this.playerBefore.blackHole[1].unlocked;
        }
      },
      template: `
        <span v-if="show">
          Your
          <b class="c-modal-away-progress__black-hole">
            <span v-if="displayName">{{ name }}</span> Black Hole
          </b>
          activated {{ formatInt(activationTimes) }} {{ "time" | pluralize(activationTimes) }}
        </span>`
    }
  },
  props: {
    modalConfig: Object
  },
  data() {
    return {
      nothingAway: false,
    };
  },
  computed: {
    before() {
      return this.modalConfig.playerBefore;
    },
    after() {
      return this.modalConfig.playerAfter;
    },
    offlineStats() {
      const b = this.before;
      const a = this.after;

      const statObject = {
        antimatter: {},
        infinityPoints: {},
        eternityPoints: {},
        realityMachines: {
          before: b.reality.realityMachines,
          after: a.reality.realityMachines,
        },
        dilatedTime: {
          before: b.dilation.dilatedTime,
          after: a.dilation.dilatedTime,
        },
        infinities: {},
        eternities: {},
        realities: {},
        singularities: {
          before: b.celestials.laitela.singularities,
          after: a.celestials.laitela.singularities,
        },
        darkMatter: {
          before: b.celestials.laitela.darkMatter,
          after: a.celestials.laitela.darkMatter,
        },
        replicanti: {
          before: b.replicanti.amount,
          after: a.replicanti.amount,
        },
        replicantiGalaxies: {
          before: b.replicanti.galaxies,
          after: a.replicanti.galaxies,
        },
      };

      const allPets = Ra.pets.all.map(x => x.name.toLowerCase());
      for (const pet of allPets) {
        Object.assign(statObject, this.getPet(pet));
      }

      return statObject;
    },
    headerText() {
      const timeDisplay = TimeSpan.fromSeconds(this.modalConfig.seconds).toString();
      if (this.nothingAway) {
        SecretAchievement(36).unlock();
        return `While you were away for ${timeDisplay}... Nothing happened.`;
      }
      return `While you were away for ${timeDisplay}: `;
    },
  },
  methods: {
    update() {
      this.nothingAway = Theme.current().name === "S7";
    },
    getPet(pet) {
      const before = this.before.celestials.ra.pets;
      const after = this.after.celestials.ra.pets;
      const show = player.options.awayProgress.celestialMemories &&
        this.before.celestials.ra.pets[pet].level < Ra.levelCap;
      return {
        [`${pet}Memories`]: {
          name: `${pet.capitalize()}'s Memories`,
          before: before[pet].memories,
          after: after[pet].memories,
          awayProgress: show,
        }
      };
    },
  },
  template: `
    <div class="c-modal-away-progress">
      <modal-close-button @click="emitClose" />
      <div class="c-modal-away-progress__header">{{ headerText }}</div>

      <div class="c-modal-away-progress__resources" v-if="!nothingAway">

        <div v-for="(stat, name) in offlineStats" :key="name">
          <away-progress-helper
            :name="name"
            :playerBefore="before"
            :playerAfter="after"
            :override="stat"
          />
          <br>
        </div>

        <div v-for="blackHole in [0, 1]" :key="blackHole">
          <away-progress-black-hole
            :blackHole="blackHole"
            :playerBefore="before"
            :playerAfter="after"
          />
          <br>
        </div>

      </div>
    </div>`
});
