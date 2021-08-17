"use strict";

Vue.component("modal-away-progress", {
  components: {
    "away-progress-helper": {
      props: {
        item: Object,
        playerBefore: Object,
        playerAfter: Object,
      },
      computed: {
        before() {
          return this.item.navigateTo(this.playerBefore);
        },
        after() {
          return this.item.navigateTo(this.playerAfter);
        },
        classObject() {
          return this.item.classObject;
        },
        name() {
          return this.item.formatName;
        },
        increased() {
          // Both Decimals and numbers may be passed in. This code handles both.
          const before = this.before;
          const after = this.after;

          return after instanceof Decimal
            ? after.gt(before)
            : after > before;
        },
        show() {
          const show = this.increased && this.item.option && this.item.isUnlocked();
          // For the achievement and display, we need to emit if something happened to the parent
          if (show) this.$emit("something-happened");
          return show;
        },
        // If its a Black Hole we need different formatting, so find that
        isBlackHole() {
          return this.item.isBlackHole;
        },
        formatBlackHoleActivations() {
          const activations = this.after - this.before;
          return `${formatInt(activations)} ${pluralize("time", activations)}`;
        }
      },
      methods: {
        // We want different formatting above and below 1e9 to improve readability
        formatPseudo(number) {
          if (Decimal.lt(number, 1e9)) return formatInt(number);
          return format(number, 2, 2);
        },
      },
      template: `
        <div v-if="show" :class="classObject" class="c-modal-away-progress__resources">
          <span v-if="isBlackHole">Your <b>{{ name }}</b> activated {{ formatBlackHoleActivations }}</span>
          <span v-else><b>{{ name }}</b> increased from {{ formatPseudo(before) }} to {{ formatPseudo(after) }}</span>
        </div>`
    },
  },
  props: {
    modalConfig: Object
  },
  data() {
    return {
      somethingHappened: false,
    };
  },
  computed: {
    nothingHappened() {
      return Theme.current().name === "S9";
    },
    before() {
      return this.modalConfig.playerBefore;
    },
    after() {
      return this.modalConfig.playerAfter;
    },
    offlineStats() {
      return AwayProgressTypes.all;
    },
    headerText() {
      const timeDisplay = TimeSpan.fromSeconds(this.modalConfig.seconds).toString();
      if (this.nothingHappened || !this.somethingHappened) {
        return `While you were away for ${timeDisplay}... Nothing happened.`;
      }
      return `While you were away for ${timeDisplay}: `;
    },
  },
  mounted() {
    this.$nextTick(() => {
      // After all the children have been loaded, check if somethingHappened - if not, give them the achievement!
      if (this.nothingHappened || !this.somethingHappened) SecretAchievement(36).unlock();
    });
  },
  template: `
    <div class="c-modal-away-progress">
      <modal-close-button @click="emitClose" />
      <div class="c-modal-away-progress__header">{{ headerText }}</div>
      <div v-if="!nothingHappened" class="c-modal-away-progress__resources">
        <away-progress-helper
          v-for="(stat, index) of offlineStats"
          :key="index"
          :item="stat"
          :playerBefore="before"
          :playerAfter="after"
          v-on:something-happened="somethingHappened = true"
        />
      </div>
    </div>`
});
