"use strict";

Vue.component("modal-away-progress", {
  components: {
    "away-progress-helper": {
      props: {
        name: String,
        playerBefore: Object,
        playerAfter: Object,
        // For most values, simply plugging in the name will be enough. However, in some cases an override
        // is needed. Only pass in overrides in those cases.
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
          // Both Decimals and numbers may be passed in. This code handles both.
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
          // Format the camelCase name to kebab-case
          const formattedName = this.name.replace(/[A-Z]/gu, match => `-${match.toLowerCase()}`);
          return overrideClassObj === undefined ? `c-modal-away-progress__${formattedName}` : overrideClassObj;
        },
        show() {
          return this.showOption && this.increased;
        },
        formatName() {
          const overrideName = this.override.name;
          // Format the camelCase name to Title Case, with spaces added before the capital letters
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
        <div v-if="show" :class="classObject" class="c-modal-away-progress__resources">
          <b>{{ formatName }}</b> increased from {{ formatBefore }} to {{ formatAfter }}
        </div>`
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
          // If its 0 its the first black hole, if its 1 its the second. if its not one of those two, something has gone
          // wrong, and an error should be thrown.
          // TODO: Standardize Black Hole handling and naming, this shouldnt be done locally
          if (this.blackHole === 0) return "First";
          if (this.blackHole === 1) return "Second";
          throw new Error("Unknown Black Hole ID in modal-away-progress.js");
        },
        displayName() {
          // If we have the second black hole unlocked, specify which black hole activated.
          return this.playerBefore.blackHole[1].unlocked;
        }
      },
      template: `
        <div v-if="show">
          Your
          <b class="c-modal-away-progress__black-hole">
            <span v-if="displayName">{{ name }} </span>Black Hole
          </b>
          activated {{ formatInt(activationTimes) }} {{ "time" | pluralize(activationTimes) }}
        </div>`
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

      // This code grabs all the pets and appends them, formatted correctly, to the object.
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
      // We only show pet memory gain if you haven't capped the pet level, so check that.
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
      <div v-if="!nothingAway" class="c-modal-away-progress__resources">
        <away-progress-helper
          v-for="(stat, name) in offlineStats"
          :key="name"
          :name="name"
          :playerBefore="before"
          :playerAfter="after"
          :override="stat"
        />
        <away-progress-black-hole
          v-for="blackHole in [0, 1]"
          :key="blackHole"
          :blackHole="blackHole"
          :playerBefore="before"
          :playerAfter="after"
        />
      </div>
    </div>`
});
