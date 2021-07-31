"use strict";

Vue.component("modal-away-progress", {
  components: {
    "away-progress-helper": {
      props: {
        config: Object,
      },
      computed: {
        after() {
          return this.config.after;
        },
        before() {
          return this.config.before;
        },
        classObject() {
          return this.config.classObject;
        },
        name() {
          return this.config.name;
        },
        showOption() {
          return this.config.awayProgress;
        },
        increased() {
          // Both Decimals and numbers may be passed in. This code handles both.
          const after = this.after;
          const before = this.before;

          return after instanceof Decimal
            ? after.gte(before)
            : after >= before;
        },
        show() {
          return this.showOption && this.increased;
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
          <b>{{ name }}</b> increased from {{ formatBefore }} to {{ formatAfter }}
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
      const statObject = { };

      for (const awayProgress of AwayProgressTypes.all) {
        Object.assign(statObject, this.getObjectForAway(awayProgress));
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
    getObjectForAway(item) {
      const objectName = item.name;
      const name = item.formatName;
      const before = item.navigateTo(this.before);
      const after = item.navigateTo(this.after);
      const awayProgress = item.option;
      const classObject = item.classObject;
      return {
        [`${objectName}`]: {
          name,
          before,
          after,
          awayProgress,
          classObject,
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
          :config="stat"
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
