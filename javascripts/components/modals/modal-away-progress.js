"use strict";

Vue.component("modal-away-progress", {
  components: {
    "away-progress-helper": {
      props: {
        config: Object,
        playerBefore: Object,
        playerAfter: Object,
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
            ? after.gt(before)
            : after > before;
        },
        show() {
          const show = this.showOption && this.increased;
          if (show) this.$emit("something-happened");
          return show;
        },
        formatBefore() {
          return this.formatPseudo(this.before);
        },
        formatAfter() {
          return this.formatPseudo(this.after);
        },
        isBlackHole() {
          return this.config.isBlackHole;
        },
        formatBlackHoleActivations() {
          const activations = this.after - this.before;
          return `${formatInt(activations)} ${pluralize("time", activations)}`;
        }
      },
      methods: {
        formatPseudo(number) {
          if (Decimal.lt(number, 1e9)) return formatInt(number);
          return format(number, 2, 2);
        },
      },
      template: `
        <div v-if="show" :class="classObject" class="c-modal-away-progress__resources">
          <span v-if="isBlackHole">Your <b>{{ name }}</b> activated {{ formatBlackHoleActivations }}</span>
          <span v-else><b>{{ name }}</b> increased from {{ formatBefore }} to {{ formatAfter }}</span>
        </div>`
    },
  },
  props: {
    modalConfig: Object
  },
  data() {
    return {
      somethingHappened: true,
    };
  },
  computed: {
    nothingAway() {
      return Theme.current().name === "S9" || !this.somethingHappened;
    },
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
    getObjectForAway(item) {
      const objectName = item.name;
      const name = item.formatName;
      const before = item.navigateTo(this.before);
      const after = item.navigateTo(this.after);
      const awayProgress = item.option;
      const classObject = item.classObject;
      const isBlackHole = item.isBlackHole;
      return {
        [`${objectName}`]: {
          name,
          before,
          after,
          awayProgress,
          classObject,
          isBlackHole,
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
          v-on:something-happened="somethingHappened = true"
        />
      </div>
    </div>`
});
